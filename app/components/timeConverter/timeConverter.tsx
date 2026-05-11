import { useEffect, useState } from 'react'
import TimeInput from './timeInput';
import { Button, Field, Label, Radio, RadioGroup } from '@headlessui/react';

// GPS epoch in UTC ticks
const taiEpoch = new Date('1958-01-01T00:00:00Z');
const gpsEpoch = new Date('1980-01-06T00:00:00Z');
const utcEpoch = new Date('1970-01-01T00:00:00Z');
const GPS0 = 694656019;  // GPS epoch in TAI seconds
const UTC0 = 378691209;  // UTC epoch in TAI milliseconds (1/1/1970 UTC)

export default function TimeConverter({ missionStart, leapSeconds }: { missionStart?: string, leapSeconds: Date[] }) {
    const [tai, setTai] = useState(utc_to_tai(Date.now() / 1000));
    const [keepTicking, setKeepTicking] = useState(false);
    const [timeFormat, setTimeFormat] = useState<'date' | 'doy' | 'seconds'>('date');

    // LeapSeconds converted to Tai-Time
    const leapSecsTai: number[] = [];
    let taiOffset = 10; // Initial TAI offset from UTC in seconds
    for (const leapSecond of leapSeconds) {
        const taiTime = leapSecond.getTime() / 1000 + taiOffset;
        leapSecsTai.push(taiTime);
        taiOffset += 1;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (keepTicking)
                setTai(utc_to_tai(Date.now() / 1000))
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [keepTicking])

    function tai_to_gps(taiSeconds: number) {
        return taiSeconds - GPS0;
    }

    // converts a UTC time to TAI time, both given in seconds since Unix epoch
    function utc_to_tai(utc: number) {
        // the leap seconds are defined in terms of UTC, not TAI

        for (var i = 0; i < leapSeconds.length; i++) {
            if (utc < leapSeconds[i].getTime() / 1000)
                return utc + i + UTC0;
        }

        // add all leap seconds to the current date
        return utc + leapSeconds.length + UTC0;
    }

    // converts a TAI time to UTC time
    function tai_to_utc(tai: number) {

        for (var i = 0; i < leapSecsTai.length; i++) {
            if (tai < leapSecsTai[i])
                return tai - i - UTC0;
        }

        // subtract all leap seconds to the current date
        return tai - leapSecsTai.length - UTC0;
    }

    function setTimeToNow() {
        setTai(utc_to_tai(Date.now() / 1000));
    }

    function toggleTicking() {
        setKeepTicking(!keepTicking);
    }

    function onUserChangedTai(secs: number): void {
        setTai(secs);
    }
    function onUserChangedGps(secs: number): void {
        setTai(secs + GPS0);
    }
    function onUserChangedUtc(secs: number): void {
        setTai(utc_to_tai(secs));
    }

    const buttonClasses = "items-center justify-center px-2 py-1 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const radioClasses = "group flex size-4 rounded-full border inset-ring-2 ring-black bg-white data-checked:bg-blue-400";

    return (
        <div className="grid gap-2 justify-start" >
            <div className='col-1 row-1'>
                <label>UTC:</label>
            </div>
            <div className='col-2 row-1'>
                <TimeInput seconds={tai_to_utc(tai)} t0={utcEpoch} enabled={true} missionStart={missionStart} format={timeFormat} onChange={onUserChangedUtc} />
            </div>
            <div className='col-1 row-2'>
                <label>GPS:</label>
            </div>
            <div className='col-2 row-2'>
                <TimeInput seconds={tai_to_gps(tai)} t0={gpsEpoch} enabled={true} missionStart={missionStart} format={timeFormat} onChange={onUserChangedGps} />
            </div>
            <div className='col-1 row-3'>
                <label>TAI:</label>
            </div>
            <div className='col-2 row-3'>
                <TimeInput seconds={tai} t0={taiEpoch} enabled={true} missionStart={missionStart} format={timeFormat} onChange={onUserChangedTai} />
            </div>
            <div className='col-1 row-4 gap-4 items-center'>
                <label>Time format:</label>
            </div>
            <div className='col-2 row-4 gap-4 items-center'>
                <RadioGroup value={timeFormat} onChange={setTimeFormat}>
                    <Field key={1} className="flex items-center gap-2">
                        <Radio value="date" className={radioClasses} />
                        <Label>Date</Label>
                    </Field>
                    <Field key={2} className="flex items-center gap-2">
                        <Radio value="doy" className={radioClasses}></Radio>
                        <Label>DOY</Label>
                    </Field>
                    <Field key={3} className="flex items-center gap-2">
                        <Radio value="seconds" className={radioClasses}></Radio>
                        <Label>Seconds since epoch</Label>
                    </Field>
                </RadioGroup>
            </div>
            <div className="col-1 row-5 col-span-2 flex gap-4 justify-center">
                <Button className={buttonClasses} onClick={toggleTicking}>{keepTicking ? 'Stop ticking' : 'Start ticking'}</Button>
                <Button className={buttonClasses} onClick={setTimeToNow}>Now</Button>
            </div>
        </div>
    );
}
