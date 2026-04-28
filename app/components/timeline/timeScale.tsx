import { useEffect, useRef, useContext } from "react";
import { getXFromTime } from "./timelineFunctions";
import { TimelineContext } from './timelineFunctions';

export default function TimeScale({ bgdColor }: { bgdColor: string; },) {
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
        ctx.fillRect(0, 0, width, ctx.canvas.height)

        ctx.fillStyle = 'black';
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        let tickSpacing = 3600000;
        if (duration <= 10000) {
            tickSpacing = 1000;
        }
        else if (duration <= 30000) {
            tickSpacing = 5000;
        }
        else if (duration <= 120000) {
            tickSpacing = 10000;
        }
        else if (duration <= 300000) {
            tickSpacing = 30000;
        }
        else if (duration <= 900000) {
            tickSpacing = 60000;
        }
        else if (duration <= 1800000) {
            tickSpacing = 120000;
        }
        else if (duration <= 3600000 * 12) {
            tickSpacing = 3600000;
        }
        else if (duration <= 86400000 * 27) {
            tickSpacing = 86400000;
        }
        else if (duration <= 86400000 * 200) {
            tickSpacing = 86400000 * 30;
        }
        
        const firstTickTime = Math.ceil(startTime.getTime() / tickSpacing) * tickSpacing;
        for (let tick = firstTickTime; tick < startTime.getTime() + duration; tick += tickSpacing) {
            let x = getXFromTime(tick, width, startTime, duration);
            let text = new Date(tick).getUTCHours() + ':' + new Date(tick).getUTCMinutes().toString().padStart(2, '0');
            ctx.fillText(text, x, height);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 5);
            ctx.stroke();
        }
    }, [startTime, duration, windowWidth])
    
    return (
        <div className="w-full h-full" ref={divRef}>
            <canvas ref={canvasRef} />
        </div>  
    );
}
