import { useContext, useEffect, useRef, useState } from "react";
import { getXFromTime, TimelineContext } from "./timelineFunctions";

export default function PlotOverlay ({ width, height }: { width: number; height: number; }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [time, setTime] = useState(new Date())
    const { duration, startTime, windowWidth } = useContext(TimelineContext);
   
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 1;

        ctx.fillStyle = '#8800';
        ctx.fillRect(0, 0, canvas!.width, canvas!.height);

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
            <canvas width={width} height={height} className="absolute top-0 left-0 overflow-hidden" ref={canvasRef} />
    );
}
