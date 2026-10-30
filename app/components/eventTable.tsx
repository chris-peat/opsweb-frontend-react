import { useState, useEffect, useContext } from "react";
import type { IEvent } from "~/models/event";
import { TimelineContext } from "./timeline/timelineFunctions";

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hoursString = hours > 0 ? `${hours}:`.padStart(2, '0') : '';
  return `${hoursString}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatStartUtc(time: Date): string {
  const y = time.getUTCFullYear();
  const h = time.getUTCHours();
  const m = time.getUTCMinutes();
  const s = time.getUTCSeconds();
  const doy = Math.floor((time.getTime() - Date.UTC(y, 0, 0)) / (1000 * 86400));
  return `${doy.toString().padStart(3, '0')} ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function EventTable({ rowCount, pastEventCount, imminentEventThreshhold, events, getRowColor }: {
  rowCount: number,
  pastEventCount: number,
  imminentEventThreshhold: number,
  events: IEvent[],
  getRowColor: (event: IEvent) => string
},) {
  const [time, setTime] = useState(new Date())
  const { duration, startTime } = useContext(TimelineContext);

  useEffect(() => {
    const intervalId = setInterval(() => { setTime(new Date()) }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // get visible events
  const nowTicks = time.getTime();
  let visibleEvents: any[] = [];
  for (let i = 0; i < events.length; i++) {
    const eventEndTicks = events[i].startTime.getTime() + events[i].properties["Duration"];
    if (eventEndTicks > nowTicks) {
      // include pastEventCount events that have already ended
      const startIndex = Math.max(0, i - pastEventCount);
      visibleEvents = events.slice(startIndex, startIndex + rowCount);
      break;
    }
  }

  const evenSecond = time.getSeconds() % 2 === 0;

  for (let visibleEvent of visibleEvents) {
    const eventStartTicks = visibleEvent.startTime.getTime();
    const eventEndTicks = eventStartTicks + visibleEvent.properties["Duration"];
    visibleEvent.countdown = formatDuration(visibleEvent.startTime.getTime() - time.getTime());
    let remainingDuration = visibleEvent.properties["Duration"];
    if (nowTicks > eventStartTicks) {
      remainingDuration = Math.max(0, eventEndTicks - nowTicks);
    }
    if (nowTicks > eventEndTicks) 
      visibleEvent.remainingDuration = "";
    else
      visibleEvent.remainingDuration = formatDuration(remainingDuration);
    
    const endThreshold = eventEndTicks - imminentEventThreshhold * 1000;
    const startThreshold = eventStartTicks - imminentEventThreshhold * 1000;

    // if the event is close to starting or ending, invert colors on even seconds to alert user
    if (((nowTicks > startThreshold && nowTicks < eventStartTicks) ||
      (nowTicks > endThreshold && nowTicks < eventEndTicks)) && evenSecond) {
      visibleEvent.future = true;
      visibleEvent.color = "black";
      visibleEvent.foreColor = "white";
    }
    else {
      visibleEvent.color = getRowColor ? getRowColor(visibleEvent) : "white";
      visibleEvent.foreColor = "black";
    }

    if (eventStartTicks <= nowTicks && eventEndTicks > nowTicks)
      visibleEvent.countdown = "In progress";

    if (eventEndTicks <= nowTicks) {
      visibleEvent.countdown = "Finished";
      visibleEvent.color = "white";
      visibleEvent.foreColor = "black";
    }

  }

  return (
    <table className="table-auto border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-1">Countdown</th>
          <th className="border px-1">Station</th>
          <th className="border px-1">Description</th>
          <th className="border px-1">Max. elev.</th>
          <th className="border px-1">Start UTC</th>
          <th className="border px-1">Duration</th>
        </tr>
      </thead>
      <tbody className="border">
        {visibleEvents.map((event) => (
          <tr style={{ backgroundColor: event.color, color: event.foreColor }} key={event.id}>
            <td className="border text-right px-1">{event.countdown}</td>
            <td className="border px-1">{event.properties["Station"]}</td>
            <td className="border px-1">{event.properties["Description"]}</td>
            <td className="border px-1">{event.properties["MaxElev"] ? event.properties["MaxElev"].toFixed(1) : "?"}</td>
            <td className="border px-1">{formatStartUtc(event.startTime)}</td>
            <td className="border text-right px-1">{event.remainingDuration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
