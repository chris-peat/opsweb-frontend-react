import { useEffect, useRef } from "react";
import { getXFromTime } from "./timelineFunctions";

export default function TimeScale({ width, height, bgdColor, startTime, duration }: { width: number; height: number; bgdColor: string; startTime: Date; duration: number; },) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;
        ctx.fillStyle = bgdColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.fillStyle = 'black';
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        let tickSpacing = 60000;
        let formatStr;
        if (tickSpacing <= 60000)
            formatStr = '%H:%M:%S';
        else if (tickSpacing < 3600000 * 12)
            formatStr = '%H:%M';
        else if (tickSpacing <= 86400000 * 27)
            formatStr = '%b-%d';
        else if (tickSpacing <= 86400000 * 200)
            formatStr = '%Y-%b';
        else
            formatStr = '%Y';

        const firstTickTime = Math.ceil(startTime.getTime() / tickSpacing) * tickSpacing;
        for (let tick = firstTickTime; tick < startTime.getTime() + duration; tick += tickSpacing) {
            let x = getXFromTime(tick, width, startTime, duration);
            let text = new Date(tick).getUTCHours() + ':' + new Date(tick).getUTCMinutes().toString().padStart(2, '0');
            ctx.fillText(text, x, height - 5);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 5);
            ctx.stroke();
        }
    }, [])

    return (
        <canvas width={width} height={height} className="border" ref={canvasRef} />
    );
}
