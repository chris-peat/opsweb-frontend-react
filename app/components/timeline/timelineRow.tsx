import { useEffect, useRef, useState } from "react";
import { getXFromTime } from "./timelineFunctions";
import TimeScale from "./timeScale";

export default function TimelineRow({ height, children }: { height: number; children: React.ReactNode[]; },) {

    return (
        <>
            <div className={"col-1 bg-gray-300 border-t border-l border-r h-" + height} >
                {children[0]}
            </div>
            <div className={"relative col-2 border-t border-r h-" + height} >
                {children[1]}
            </div>
        </>
    );
}
