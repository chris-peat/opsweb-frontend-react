import { createContext } from "react";

export function getXFromTime(time: number, width: number, startTime: Date, duration: number): number {
    const startTimeMs = startTime.getTime();
    return ((time - startTimeMs) / duration) * width;
}

export const TimelineContext = createContext({duration: 3600000, startTime: new Date(), windowWidth: 0});

