export function getXFromTime(time: number, width: number, startTime: Date, duration: number): number {
    const startTimeMs = startTime.getTime();
    return ((time - startTimeMs) / duration) * width;
}
