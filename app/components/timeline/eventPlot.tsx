import { c } from "@apollo/client/react/internal/compiler-runtime";
import { useState, useEffect, useRef, useContext } from "react";
import type { IEvent } from "~/models/event";
import { TimelineContext, getXFromTime } from './timelineFunctions';

export default function EventPlot({ bgdColor, eventColor, events, eventFilter }: { bgdColor: string; eventColor: string; events: IEvent[]; eventFilter?: (event: IEvent) => boolean },) {
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

        events.forEach((event) => {
            if (eventFilter && !eventFilter(event)) return;
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
    }, [startTime, duration, windowWidth])

    return (
        <div className="w-full h-full" ref={divRef}>
            <canvas className="overflow:hidden" ref={canvasRef} />
        </div>
    );
}
