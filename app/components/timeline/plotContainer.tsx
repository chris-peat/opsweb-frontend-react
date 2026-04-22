import { useEffect, useRef, useState, type ReactNode } from "react";

function getXFromTime(time: number, width: number, startTime: Date, duration: number): number {
    const startTimeMs = startTime.getTime();
    return ((time - startTimeMs) / duration) * width;
}

export default function PlotContainer
    ({ width, startTime, duration, children }: { width: number; startTime: Date; duration: number; children: React.ReactNode[] },) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [time, setTime] = useState(new Date())

    // height is derived from children
    let height = 0;
    for (let child of children) {
        let childElement = child as React.ReactElement;
        if (childElement && childElement.props && (childElement.props as any).height) {
            height += (childElement.props as any).height;
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;

        const cursorTime = getXFromTime(time.getTime(), width, startTime, duration);
        ctx.beginPath();
        ctx.moveTo(cursorTime, 0);
        ctx.lineTo(cursorTime, height);
        ctx.stroke();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => { setTime(new Date()) }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [])

    return (
        <div className="relative">
            {children}
            <canvas width={width} height={height} className="border absolute top-0 left-0" ref={canvasRef} />
        </div>
    );
}
