import { useState, useEffect, useRef, useContext } from "react";
import { TimelineContext, getXFromTime, getYFromValue, getTimeFromX } from '../timelineFunctions';
import type { IProfilePlotLineDef } from './profilePlotLineDef';

export default function ProfilePlot({ bgdColor, yMin, yMax, profiles }: { bgdColor: string; yMin: number; yMax: number, profiles: IProfilePlotLineDef[] },) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const { duration, startTime, windowWidth } = useContext(TimelineContext);

    useEffect(() => {
        const div = divRef.current!;
        const width = div.clientWidth;
        const height = div.clientHeight;
        const canvas = canvasRef.current;
        canvas!.width = width;
        canvas!.height = height;
        const ctx = canvas!.getContext('2d')!;

        ctx.fillStyle = bgdColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        profiles.forEach((profile) => {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = profile.lineWidth;
            let started=false;
            for (let x: number = 0; x <= width; ++x) {
                let t = getTimeFromX(x, width, startTime, duration);
                const y = getYFromValue(profile.profileFunction(t), height, yMin, yMax);
                started ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                started=true;
            }
            ctx.strokeStyle = profile.color;
            ctx.stroke();
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.fillStyle = profile.fillColor;
            //ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.restore();
        });
    }, [startTime, duration, windowWidth])

    return (
        <div className="w-full h-full" ref={divRef}>
            <canvas className="overflow:hidden" ref={canvasRef} />
        </div>
    );
}
