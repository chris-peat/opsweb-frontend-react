import { useEffect, useRef, useState, useContext } from "react";
import { TimelineContext } from "./timelineFunctions";
import TimeScale from "./timeScale";
import PlotOverlay from "./plotOverlay";
import TimelineRow from "./timelineRow";


export default function TimelineDisplay({ duration, children }: { duration: number; children: React.ReactNode[]; },) {
//    const { duration, startTime, windowWidth } = useContext(TimelineContext);
    const [startTime, setStartTime] = useState(new Date(Date.now() - duration * 0.2));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [plotWidth, setPlotWidth] = useState(0);
    const [plotHeight, setPlotHeight] = useState(0);
    const timeScaleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (Date.now() - startTime.getTime() > duration * 0.5) {
                const newStartTime = new Date(Date.now() - duration * 0.2);
                setStartTime(newStartTime);
            }
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [startTime])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);

        const div = timeScaleRef.current!;
        setPlotWidth(div.clientWidth);

        let h=0;
        for (let child of children) {
            let childElement = child as React.ReactElement; 
            if (childElement.type === TimelineRow) {
                //let row = child as typeof TimelineRow;
                h += (childElement.props as any).height || 0;
            }
        };
        setPlotHeight(h * 4);

        return () => window.removeEventListener("resize", handleResize)
    }, [windowWidth, children]);

    return (
        <div className="grid grid-cols-2 gap-0 w-auto" style={{ gridTemplateColumns: "100px auto" }}>
            <TimelineContext value={{ duration, startTime, windowWidth: windowWidth }}>
                {children}
                <div className="col-1 border bg-gray-300 pl-1 text-xs align-middle h-5">
                    UTC
                </div>
                <div className="col-2 border-t border-r border-b h-5 relative" ref={timeScaleRef}>
                    <TimeScale bgdColor="#ccc" />
                    <div className="col-2 row-1 w-full absolute bottom-0 left-0 z-10" style={{ top: `-${plotHeight}px` }}>
                        <PlotOverlay width={plotWidth} height={plotHeight} />
                    </div>
                </div>
            </TimelineContext>
        </div>
    );
}
