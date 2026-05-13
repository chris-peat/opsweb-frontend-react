import { Button, Input } from '@headlessui/react';
import { useEffect, useState } from 'react'
import { useOpsWebContext } from '~/routes/layout';

function formatDate(seconds: number, t0: Date) {
    return new Date(t0.getTime() + seconds * 1000).toISOString().slice(0, 19).replace('T', ' ');
}

function formatDOY(seconds: number, t0: Date) {
    const date = new Date(t0.getTime() + seconds * 1000);
    const year = date.getUTCFullYear();
    const doy = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${year} ${doy} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
}

function formatSeconds(seconds: number, t0: Date) {
    return Intl.NumberFormat("en-US", { useGrouping: true }).format(Math.floor(seconds));
}

export default function TimeInput({ seconds, t0, enabled, missionStart, format, onChange }:
    {
        seconds: number,
        t0: Date,
        enabled: boolean,
        missionStart?: string,
        format: 'date' | 'doy' | 'seconds' | 'met',
        onChange: (secs: number) => void
    }) {
    const [formattedValue, setFormattedValue] = useState("");
    const { project, user } = useOpsWebContext();
    
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const inputClasses = "px-2 py-1 text-base font-medium leading-6 text-black bg-yellow-100 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    useEffect(() => {
        let formatFunc;

        switch (format) {
            case 'date':
                formatFunc = formatDate;
                break;
            case 'doy':
                formatFunc = formatDOY;
                break;
            case 'seconds':
                formatFunc = formatSeconds;
                break;
            case 'met':
                if (!missionStart) {
                    formatFunc = () => "Mission start time required";
                } else {
                    formatFunc = (ticks: number) => {
                        const met = ticks - Date.parse(missionStart);
                        const sign = met >= 0 ? '+' : '-';
                        const absMet = Math.abs(met);
                        const days = Math.floor(absMet / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((absMet % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                        const minutes = Math.floor((absMet % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                        const seconds = Math.floor((absMet % (1000 * 60)) / 1000).toString().padStart(2, '0');
                        return `${sign}${days} / ${hours}:${minutes}:${seconds}`;
                    }
                }
        }

        setFormattedValue(formatFunc(seconds, t0));

    }, [seconds, t0, missionStart, format]);


    function handleSetTime() {
        if (typeof onChange !== 'function')
            return;
        switch (format) {
            case 'date':
                const ms = Date.parse(formattedValue + "Z") - t0.getTime();
                onChange(ms / 1000);
                break;
            case 'doy':
                // formatFunc = formatDOY;
                break;
            case 'seconds':
                const seconds = parseInt(formattedValue.replaceAll(",", ""));
                onChange(seconds);
                break;
        }
    }

    function onUserChange(event: any) {
        setFormattedValue(event.target.value)
    }

    return (
        <div className='flex flex-row gap-4'>
            <div className='flex flex-row gap-2 items-center'>
                <div>
                    <Input type="text" value={formattedValue} className={inputClasses} maxLength={19}
                        placeholder="yyyy-mm-dd hh:mm:ss" onChange={onUserChange} />
                </div>
                <div>
                    <Button className={buttonClasses} onClick={handleSetTime}>Set</Button>
                </div>
            </div>
        </div>

    );
}
