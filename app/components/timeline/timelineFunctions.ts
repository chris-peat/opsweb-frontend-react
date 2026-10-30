import { createContext } from "react";

export function getXFromTime(time: number, width: number, startTime: Date, duration: number): number {
    const startTimeMs = startTime.getTime();
    return ((time - startTimeMs) / duration) * width;
}

export function getTimeFromX(x: number, width: number, startTime: Date, duration: number): number {
    return (x  / width) * duration + startTime.getTime();
}

export function getYFromValue(value: number, height: number, yMin: number, yMax: number): number {
    return height - ((value - yMin) / (yMax - yMin)) * height;
}

export const TimelineContext = createContext({duration: 3600000, startTime: new Date(), windowWidth: 0});

