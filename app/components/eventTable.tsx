import { useState, useEffect } from "react";
import type { IEvent } from "~/models/event";

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hoursString = hours > 0 ? `${hours}:`.padStart(2, '0') : '';
  return `${hoursString}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function EventTable({ rowCount, events }: { rowCount: number, events: IEvent[] },) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => { setTime(new Date()) }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <table className="table-auto border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-1">Countdown</th>
          <th className="border px-1">Station</th>
          <th className="border px-1">Description</th>
          <th className="border px-1">Start UTC</th>
          <th className="border px-1">Duration</th>
        </tr>
      </thead>
      <tbody className="border font-mono">
        {events.slice(0, rowCount).map((event) => (
          <tr className="bg-green-200">
            <td className="border text-right px-1">{formatDuration(event.startTime.getTime() - time.getTime())}</td>
            <td className="border px-1">{event.properties["Station"]}</td>
            <td className="border px-1">{event.properties["Description"]}</td>
            <td className="border px-1">{event.startTime.toISOString()}</td>
            <td className="border text-right px-1">{formatDuration(event.properties["Duration"])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
