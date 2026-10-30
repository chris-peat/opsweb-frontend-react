import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { useOpsWebContext } from '~/routes/layout';
import type { IDisplaySatellite, IDisplayStation, IGroundTrackProps } from './groundTrackProps';
import { CanvasHelpers } from './CanvasHelpers';
import { Sgp4Orbit } from '@heavens-above/astrolib-ts/dist/src/Sgp4Orbit';
import { Constants } from '@heavens-above/astrolib-ts/dist/src/Constants';
import { DrawingHelpers } from './DrawingHelpers';
import { Vector } from '@heavens-above/astrolib-ts/dist/src/Vector';
import { Earth } from '@heavens-above/astrolib-ts/dist/src/Earth';

/** draw the ground track of a single satellite */
function drawSatelliteTrack(ctx: CanvasRenderingContext2D, time: number, orbit: Sgp4Orbit) {

    if (!orbit)
        return;

    ctx.save();

    // draw ground-track
    let oldx: number | null = null, oldy: number | null = null;
    let started = false;
    let period = orbit.period;
    let dt = period / 400;
    let t = time - period / 2;
    let tEnd = time + period / 2;
    ctx.beginPath();

    // the track is drawn as a sequence of lines, corresponding to sunlit and non-sunlit portions

    while (t <= tEnd) {
        const inSunlight = orbit.isSunlit(t);

        // get satellite position in canvas coordinates    
        let pnt = getOrbitPoint(ctx.canvas, orbit, t);
        const x = pnt[0];
        const y = pnt[1];


        if (!started)
            ctx.moveTo(x, y);
        else
            CanvasHelpers.addLineToPath(ctx, [oldx!, oldy!], [x, y]);

        oldx = x;
        oldy = y;
        t += dt;
        started = true;
    }

    ctx.stroke();

    // turn off dashed line
    ctx.setLineDash([0]);

    // add arrows indicating the direction of motion
    drawDirectionArrow(ctx, time - period / 4, orbit);
    ctx.fill();
    ctx.stroke();
    drawDirectionArrow(ctx, time + period / 4, orbit);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

/** draw the satellite icon and name */
function drawSatellite(ctx: CanvasRenderingContext2D, time: number, sat: IDisplaySatellite, orbit: Sgp4Orbit) {

    let latlng = orbit.getLatLng(time);

    const pnt = CanvasHelpers.geodeticToCanvas(ctx.canvas, latlng[0], latlng[1]);

    // draw the icon, if we have one
    const w = ctx.canvas.width;
    ctx.save();
    const h = w / 2;
    if (sat.icon) {
        const x = pnt[0] - sat.icon.width / 2;
        ctx.drawImage(sat.icon, x, pnt[1] - sat.icon.height / 2);
        if (x < w / 4)
            ctx.drawImage(sat.icon, pnt[0] - sat.icon.width / 2 + w, pnt[1] - sat.icon.height / 2);
        if (x > w * 0.75)
            ctx.drawImage(sat.icon, pnt[0] - sat.icon.width / 2 - w, pnt[1] - sat.icon.height / 2);
    } else {
        // no icon, so draw a location pin
        latlng = orbit.getLatLng(time + 10000);
        const pnt2 = CanvasHelpers.geodeticToCanvas(ctx.canvas, latlng[0], latlng[1]);
        let angleFromXAxis = Math.atan2(pnt[1] - pnt2[1], pnt2[0] - pnt[0]) + Constants.HALFPI;
        if (pnt[1] > h * 0.75 && angleFromXAxis > Math.PI)
            angleFromXAxis += Math.PI;
        if (pnt[1] < h * 0.25 && angleFromXAxis < Math.PI)
            angleFromXAxis += Math.PI;
        if (pnt[1] > h * 0.125 && pnt[1] < h * 0.875) {
            if (pnt[0] < w * 0.1 && Math.cos(angleFromXAxis) < 0)
                angleFromXAxis += Math.PI;
            if (pnt[0] > w * 0.9 && Math.cos(angleFromXAxis) > 0)
                angleFromXAxis += Math.PI;
        }

        // compute pointer header radius, based on text length
        ctx.font = '14px sans-serif';
        const headReadius = ctx.measureText(sat.text).width * 0.6;
        DrawingHelpers.drawLocatorPin(ctx, pnt[0], pnt[1], headReadius, angleFromXAxis, sat.text, sat.pointerBorderColor, sat.pointerBackgroundColor, sat.textColor);

        if (pnt[0] < w / 8)
            DrawingHelpers.drawLocatorPin(ctx, pnt[0] + w, pnt[1], headReadius, angleFromXAxis, sat.text, sat.pointerBorderColor, sat.pointerBackgroundColor, sat.textColor);
        if (pnt[0] > w * 0.875)
            DrawingHelpers.drawLocatorPin(ctx, pnt[0] - w, pnt[1], headReadius, angleFromXAxis, sat.text, sat.pointerBorderColor, sat.pointerBackgroundColor, sat.textColor);

        ctx.restore();
    }
}

function renderGroundStations(ctx: CanvasRenderingContext2D, stations: IDisplayStation[], orbit: Sgp4Orbit, time: number, minElev: number) {
    renderGroundStationVisibilityCircles(ctx, stations, orbit, time, minElev);
    renderGroundStationNames(ctx, stations);
}

function renderGroundStationNames(ctx: CanvasRenderingContext2D, stations: IDisplayStation[]) {
    ctx.save();
    ctx.textBaseline = 'top';
    stations.forEach(station => {
        const stationVector = Vector.fromAzElev(station.longitude * Constants.DEGTORAD, station.latitude * Constants.DEGTORAD);
        const xyStation = CanvasHelpers.vectorToCanvas(ctx.canvas, stationVector);
        // write station name
        if (station.name) {
            ctx.fillStyle = station.textColor ?? 'white';
            ctx.font = '14px sans-serif';
            ctx.shadowBlur = 1;
            ctx.shadowColor = "#000000";
            ctx.shadowOffsetX = 0.5;
            ctx.shadowOffsetY = 0.5;
            ctx.fillText(station.id, xyStation[0], xyStation[1] + 5);
        }
    });
    ctx.restore();
}

function renderGroundStationVisibilityCircles(ctx: CanvasRenderingContext2D, stations: IDisplayStation[], orbit: Sgp4Orbit, time: number, minElev: number) {
    const w = ctx.canvas.width;
    // the radius of the coverage zone depends on the height of the primary satellite
    const satHeight = orbit.getHeight(time);
    const me = minElev * Constants.DEGTORAD;
    const coverageAngle = Constants.HALFPI - me - Math.asin(Earth.RADIUS * Math.cos(me) / (Earth.RADIUS + satHeight));

    ctx.textAlign = 'center';
    let iconSize = (0.03);
    ctx.save();
    stations.forEach(station => {
        ctx.beginPath();
        let stationVector = Vector.fromAzElev(station.longitude * Constants.DEGTORAD, station.latitude * Constants.DEGTORAD);
        CanvasHelpers.addCircularZonePath(ctx, stationVector, coverageAngle);
        ctx.strokeStyle = station.zoneBorderColor;
        ctx.fillStyle = station.zoneColor;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        let xyStation = CanvasHelpers.vectorToCanvas(ctx.canvas, stationVector);

        if (station.showIcon) {
            ctx.fillStyle = (station.iconColor ? station.iconColor : 'white');
            DrawingHelpers.drawGroundStation(ctx, xyStation[0], xyStation[1], w * iconSize);
            ctx.textBaseline = 'top';
        }
        else
            ctx.textBaseline = 'middle';
    });
    ctx.restore();
}

function drawDirectionArrow(ctx: CanvasRenderingContext2D, t: number, orbit: Sgp4Orbit) {
    // get latitude and longitude of satellite
    let latlng = orbit.getLatLng(t);

    // get satellite position in canvas coordinates    
    const canvasPos = CanvasHelpers.geodeticToCanvas(ctx.canvas, latlng[0], latlng[1]);

    // get velocity vector angle by incrementing time a small amount and getting position difference
    latlng = orbit.getLatLng(t + 5000);
    const canvasPos2 = CanvasHelpers.geodeticToCanvas(ctx.canvas, latlng[0], latlng[1]);
    const angleFromXAxis = Math.atan2(canvasPos2[1] - canvasPos[1], canvasPos2[0] - canvasPos[0]) * Constants.RADTODEG;

    ctx.beginPath();
    DrawingHelpers.drawArrow(ctx, canvasPos[0], canvasPos[1], angleFromXAxis, 15, 90, 20);
}

/** Gets the point on the canvas corresponding to the satellite position at the given time */
function getOrbitPoint(canvas: HTMLCanvasElement, orbit: Sgp4Orbit, t: number): number[] {
    let latlng = orbit.getLatLng(t);
    return CanvasHelpers.geodeticToCanvas(canvas, latlng[0], latlng[1]);
}

export default function GroundTrack({
    width = 800,
    height = 400,
    backgroundSrc,
    stations,
    satellites,
    minElev,
}: IGroundTrackProps) {
    const [bg, setBg] = useState<HTMLImageElement | null>(null);
    const [time, setTime] = useState<Date>(new Date());
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const intervalId = setInterval(() => { setTime(new Date()) }, 5000);
        return () => {
            clearInterval(intervalId);
        }
    }, [])

    useEffect(() => {
        // Images load asynchronously. Until it is ready, a plain fill is drawn instead.
        const bg = new Image();
        // Needed for remote images if you later want to read pixels (getImageData/toDataURL).
        // The server must send CORS headers; remove this line for same-origin images.
        bg.crossOrigin = "anonymous";
        bg.onload = () => {
            setBg(bg);
        };
        bg.onerror = () => {
            console.warn(`Could not load background image: ${backgroundSrc}`);
        };
        bg.src = backgroundSrc!;

    }, [backgroundSrc]);

    useEffect(() => {
        render();
    }, [width, height, bg, time]);

    function render(): void {
        // Draw the image scaled to cover the whole canvas (like CSS background-size: cover).
        const drawBackgroundCover = (img: HTMLImageElement) => {
            const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
        };

        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        if (!ctx) return;

        // set clip region if the aspect ration means the Earth map does not fill the canvas
        if (height > width / 2) {
            ctx.rect(0, (height - width / 2) / 2, width, width / 2);
            ctx.clip();
        }


        // Background: image if loaded, otherwise a plain colour
        if (bg) {
            drawBackgroundCover(bg);
        } else {
            ctx.fillStyle = "#f4f6fa";
            ctx.fillRect(0, 0, width, height);
        }

        // equator
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        const y = ctx.canvas.height * 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();

        let orbit = new Sgp4Orbit(satellites?.[0]?.tle ?? "");
        renderGroundStations(ctx, stations ?? [], orbit, time.getTime(), minElev ?? 10);
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        drawSatelliteTrack(ctx, time.getTime(), orbit);
        let sat = satellites?.[0]!;
        sat.pointerBackgroundColor = "white";
        sat.pointerBorderColor = "black";
        drawSatellite(ctx, time.getTime(), sat, orbit);
    }

    return (
        <canvas width={width || 800} height={height || 400} ref={canvasRef} />
    );
}
