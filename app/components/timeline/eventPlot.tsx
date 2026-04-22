import { c } from "@apollo/client/react/internal/compiler-runtime";
import { useState, useEffect, useRef } from "react";
import type { IEvent } from "~/models/event";

function getXFromTime(time: number, width: number, startTime: Date, duration: number): number {
    const startTimeMs = startTime.getTime();
    return  ((time - startTimeMs) / duration) * width;
}

export default function EventPlot({ width, height, bgdColor, eventColor, startTime, duration, events }: { width: number; height: number; bgdColor: string; eventColor: string; startTime: Date; duration: number; events: IEvent[] },) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;
        ctx.fillStyle = bgdColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        events.forEach((event) => {
            const x = getXFromTime(event.startTime.getTime(), width, startTime, duration);
            const w = Math.max(getXFromTime(event.startTime.getTime() + event.properties["Duration"], width, startTime, duration) - x, 1);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x, 10, w, 20);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(x, 10, w, 20);
            // ctx.fillStyle = '#000';
            // ctx.font = '12px monospace';
            // ctx.fillText(event.properties["Description"], x + 2, height / 2);
        });
    }, [])

    return (
        <canvas width={width} height={height} ref={canvasRef} />
    );
}
