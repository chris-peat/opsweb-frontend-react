import { useEffect, useState } from 'react'

export default function Clock({ missionStart }: { missionStart?: string }) {
    const [time, setTime] = useState(new Date())
    const [isUtc, setIsUtc] = useState(true)

    useEffect(() => {
        setInterval(() => { setTime(new Date()) }, 1000);
    }, [])

    function handleClick() {
        setIsUtc(!isUtc);
    }

    let timeString = '';
    const showUtc = isUtc || !missionStart;
    if (showUtc) {
        const y = time.getUTCFullYear();
        const M = time.getUTCMonth() + 1;
        const d = time.getUTCDate();
        const h = time.getUTCHours();
        const m = time.getUTCMinutes();
        const s = time.getUTCSeconds();
        const doy = Math.floor((time.getTime() - Date.UTC(y, 0, 0)) / (1000 * 86400));
        timeString = `${y}-${M.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')} ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} (DOY ${doy.toString().padStart(3, '0')})`;
    }
    else {
        let met = time.getTime() - Date.parse(missionStart);
        const sign = met >= 0 ? '+' : '-';
        met = Math.floor(Math.abs(met) / 1000); // round to seconds
        const d = Math.floor(met / (86400));
        const h = Math.floor((met % (86400)) / (3600)).toString().padStart(2, '0');
        const m = Math.floor((met % (3600)) / (60)).toString().padStart(2, '0');
        const s = Math.floor((met % (60))).toString().padStart(2, '0');
        timeString = `${sign}${d} / ${h}:${m}:${s}`
    }
    return <div onClick={handleClick}>{showUtc ? 'UTC' : 'MET'} {timeString}</div>
}
