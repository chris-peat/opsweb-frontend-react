import { Constants, Vector, GroundStation } from '@heavens-above/astrolib-ts';

/**
 * Provides helper methods to convert vectors to points on the canvas, draw circular paths on the canvas etc.
 */
export class CanvasHelpers {

    /** convert geographic vector to canvas coordinates */
    static vectorToCanvas(canvas: HTMLCanvasElement, vec: Vector): number[] {
        let lat = vec.latitude * Constants.RADTODEG;
        let lng = vec.longitude * Constants.RADTODEG;
        if (lng < -180)
            lng += 360
        if (lng > 180)
            lng -= 360

        return CanvasHelpers.geodeticToCanvas(canvas, lat, lng);
    }

    /** convert geodetic to canvas coordinates */
    static geodeticToCanvas(canvas: HTMLCanvasElement, latitude: number, longitude: number): number[] {
        const pxPerDeg = canvas.width / 360;
        const x = (180 + longitude) * pxPerDeg;
        const y = canvas.height * 0.5 - latitude * pxPerDeg;
        return [x, y];
    }

    //
    //Add the points corresponding to a circle on the Earth's surface
    //with half-angle radHalfConeAngle, centred at vecCentre
    //
    static addCircularZonePath(ctx: CanvasRenderingContext2D, vecCentre: Vector, radHalfConeAngle: number): void {

        //Form matrix to transform from LHLV coords. to geographic
        const GSCentre = new GroundStation(vecCentre.latitude * Constants.RADTODEG, vecCentre.longitude * Constants.RADTODEG, 0);
        const LVLHToGeo = GSCentre.topocentricToGeographicMatrix();

        const z = Math.cos(radHalfConeAngle);
        const sinCA = Math.sin(radHalfConeAngle);
        let oldxy: number[] | null = null;
        let w = ctx.canvas.width;

        for (let az = 0; az <= 360; az += 1) {
            let azRad = az * Constants.DEGTORAD;

            //Define vector to edge of coverage zone in LVLH coords.
            let lvlh = new Vector(sinCA * Math.sin(azRad), sinCA * Math.cos(azRad), z);

            // convert to geographic coordinates
            let geo = LVLHToGeo.multiplyVector(lvlh) as Vector;
            let xy = CanvasHelpers.vectorToCanvas(ctx.canvas, geo);

            if (oldxy)
                CanvasHelpers.addLineToPath(ctx, oldxy, xy);
            else
                ctx.moveTo(xy[0], xy[1]);

            oldxy = xy;
        }

        // Does the zone include the north pole?
        if (vecCentre.angleBetween(new Vector(0, 0, 1)) < radHalfConeAngle) {
            // north pole is inside region
            ctx.rect(-1, -1, w + 2, ctx.canvas.height + 2);
        }
    }

    /** Add the line specified by the points p1,p2 to the given path, taking account
    *  of the map edges for "flat map" projection.
   */
    static addLineToPath(ctx: CanvasRenderingContext2D, p1: number[], p2: number[]) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        if (Math.abs(p2[0] - p1[0]) > w * 0.5) {
            //Go around the rectangle to the other side
            if (p2[0] < p1[0]) {
                ctx.lineTo(p2[0] + w, p2[1]);
                ctx.lineTo(w + 5, p2[1]);
                ctx.lineTo(w + 5, h + 5);
                ctx.lineTo(-5, h + 5);
                ctx.lineTo(-5, p1[1]);
                ctx.lineTo(p1[0] - w, p1[1]);
                ctx.lineTo(p2[0], p2[1]);
            } else {
                ctx.lineTo(p2[0] - w, p2[1]);
                ctx.lineTo(-5, p2[1]);
                ctx.lineTo(-5, h + 5);
                ctx.lineTo(w + 5, h + 5);
                ctx.lineTo(w + 5, p1[1]);
                ctx.lineTo(p1[0] + w, p1[1]);
                ctx.lineTo(p2[0], p2[1]);
            }
        } else {
            ctx.lineTo(p2[0], p2[1]);
        }
    }
}