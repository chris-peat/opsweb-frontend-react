import { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Field, Input, Label, Radio, RadioGroup, Textarea } from '@headlessui/react';
import { ProjectContext } from '~/routes/layout';

// GPS epoch in UTC ticks

const headerClasses = "bg-blue-500"

export default function ShiftHandoverLogH2S() {
    const { project, user } = useContext(ProjectContext);

    function handlePrefill() {
    }

    function handleSubmit() {
    }

    function handleImport() {
    }

    const titleClasses = project + "-secondary items-left align-middle px-2 text-base";
    const grayClasses = "items-left align-middle px-2 text-base bg-gray-300";
    const checkClasses = "group block size-4 rounded border bg-white data-checked:bg-blue-500";
    const inputClasses = "px-2 py-1 text-base font-medium leading-6 text-black bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    return (
        <div className="grid justify-start" >
            <div className={'col-1 col-span-4 row-1 border-t border-l ' + titleClasses}>
                Shift Handover Log
            </div>
            <div className={'col-5  col-span-2 row-1 border-t border-r ' + titleClasses}>
                Notes
            </div>
            <div className={`col-1 row-2 align-end text-right border-l ${grayClasses}`}>
                Shift
            </div>
            <div className={`col-2 row-2`}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-3 col-span-2 row-2 ${grayClasses}`}>
            </div>
            <div className={`col-4 col-span-2 row-2 row-span-5 h-full border-r`}>
                <Textarea value={""} className={inputClasses + ' h-full'} name="notes" />
            </div>
            <div className={`col-1 row-3 align-end border-l text-right ${grayClasses}`}>
                Shift end
            </div>
            <div className={`col-2 row-3`}>
                <Input type="text" value={""} className={inputClasses} name="shiftEnd" />
            </div>
            <div className={`col-3 col-span-2 row-3 ${grayClasses}`}>
            </div>
            <div className={`col-1 col-span-4 row-4 border-l ${grayClasses}`}>
                &nbsp;
            </div>
            <div className={`col-1 col-span-4 row-5 border-l ${grayClasses} flex gap-10`}>
                <Button className={buttonClasses} onClick={handlePrefill}>Prefill</Button>
                <Button className={buttonClasses} onClick={handleSubmit}>Submit</Button>
                <Button className={buttonClasses} onClick={handleImport}>Import</Button>
            </div>
            <div className={`col-1 col-span-4 row-6 border-l ${grayClasses}`}>
                &nbsp;
            </div>
            <div className={'col-1  col-span-4 row-7 border-l ' + titleClasses}>
                S/C Status
            </div>
            <div className={'col-5  col-span-2 row-7 border-r ' + titleClasses}>
                Out of Order
            </div>
            <div className={`col-1 border-l text-right ${grayClasses}`}>
                ACS
            </div>
            <div className={`col-2`}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                THM
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-span-2 row-span-4 h-full border-r`}>
                <Textarea value={""} className={inputClasses + ' h-full'} name="outOfOrder" />
            </div>
            <div className={`col-1 border-l text-right ${grayClasses}`}>
                CPPS
            </div>
            <div className={`col-2`}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                BDH
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-1 border-l text-right ${grayClasses}`}>
                EPPS
            </div>
            <div className={`col-2`}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                CRY
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-1 border-l text-right ${grayClasses}`}>
                PWR
            </div>
            <div className={`col-2`}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                TTR
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={'col-span-4 border-l ' + titleClasses}>
                Payload
            </div>
            <div className={'col-span-2 border-r ' + titleClasses}>
                Executed Recommendations
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                W/T
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                MIL
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                RIs
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={'col-span-4 border-l ' + titleClasses}>
                SSU/GCU
            </div>
            <div className={'col-span-2 border-r ' + titleClasses}>
                Upcoming Recommendations
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                SSU
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                GCU Backup
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
                RIs
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                GCU Prime
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-span-2 row-span-2 border-r ${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                L1 Arc Value
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`text-right ${grayClasses}`}>
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={'border-l ' + titleClasses}>
                Ground Status
            </div>
            <div className={titleClasses}>
                Prime
            </div>
            <div className={'col-span-2 ' + titleClasses}>
                Backup
            </div>
            <div className={'col-span-2 border-r ' + titleClasses}>
                To Do
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Antenna
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`${grayClasses}`}>
            </div>
            <div className={`col-span-2 row-span-5 h-full border-r`}>
                <Textarea value={""} className={inputClasses + ' h-full w-full'} name="toDo" />
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Cortex
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                VC-ID
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-span-2 ${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                MAP-ID
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-span-2 ${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Mission Mode (OOC, etc.)
            </div>
            <div className={``}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={`col-span-2 ${grayClasses}`}>
            </div>
            <div className={'col-span-6 border-l border-r ' + titleClasses}>
                Standard Checks
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                GEO Daily Check
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`text-right ${grayClasses}`}>
                GECCOS Check all Chains
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`row-span-6 col-span-2 border-r ${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Project Calendar Check
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`text-right ${grayClasses}`}>
                Connection Test (Ping)
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                ICINGA
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`text-right ${grayClasses}`}>
                Secure Chat and Mail
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Time Correlation
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`text-right ${grayClasses}`}>
                Ranging Data
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                PintaOnWeb
            </div>
            <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                <Checkbox className={checkClasses}></Checkbox>
            </div>
            <div className={`col-span-2 ${grayClasses}`}>
            </div>
            <div className={`border-l text-right ${grayClasses}`}>
                Comments
            </div>
            <div className={'col-span-3 w-full'}>
                <Input type="text" value={""} className={inputClasses} />
            </div>
            <div className={'col-span-6 border-l border-r ' + titleClasses}>
                Upcoming Events
            </div>

        </div>
    );
}
