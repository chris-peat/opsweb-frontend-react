import { useEffect, useRef, useState } from "react";
import { getXFromTime } from "./timelineFunctions";

export default function PlotOverlay ({ width, height, startTime, duration }: { width: number; height: number; startTime: Date; duration: number; }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [time, setTime] = useState(new Date())
   
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;

        const cursorTime = getXFromTime(time.getTime(), width, startTime, duration);
        ctx.beginPath();
        ctx.moveTo(cursorTime, 0);
        ctx.lineTo(cursorTime, height);
        ctx.stroke();
    }, [time])

    useEffect(() => {
        const intervalId = setInterval(() => { setTime(new Date()) }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [])

    return (
            <canvas width={width} height={height} className="border absolute top-0 left-0" ref={canvasRef} />
    );
}
