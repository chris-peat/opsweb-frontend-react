import { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Textarea, Listbox, ListboxButton, ListboxOptions, ListboxOption, Select } from '@headlessui/react';
import { useOpsWebContext } from '~/routes/layout';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import StatusColorSelector from '../statusColorSelector';
import type { IGenericReport } from '~/models/genericReport';
import { useForm, type SubmitHandler } from "react-hook-form";
import { getClient } from '~/apollo';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { CREATE_GENERIC_REPORT, SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER, SELECT_GENERIC_REPORTS, USERS_IN_ROLE } from '~/graphQLQueries';
import { useNavigate } from 'react-router';
import type { IUser } from '~/models/user';

interface IFormInput {
    notes: string
    shift: string
}

export default function PassLogSER({ number }: { number: number | undefined }) {
    const { project, user } = useOpsWebContext();

    const readOnly = (number !== undefined && number > 0);
    const [passNumber, setPassNumber] = useState<number>(7);
    const [station, setStation] = useState<string>("WHM");
    const [aos, setAos] = useState<string>("2026-07-19 12:34");
    const [los, setLos] = useState<string>("2026-07-19 12:44");
    const [scsw, setScsw] = useState<string>("246");
    const [satMode, setSatMode] = useState<string>("SM");
    const [acsMode, setAcsMode] = useState<string>("IM-TST");
    const [dmb1, setDmb1] = useState<string>("Master");
    const [ris, setRis] = useState<string>("");
    const [stdFiles, setStdFiles] = useState<string>("");
    const [dmb2, setDmb2] = useState<string>("Backup");
    const [otherFiles, setOtherFiles] = useState<string>("");
    const [spare, setSpare] = useState<string>("");
    const [warnings, setWarnings] = useState<string>("");
    const [alarms, setAlarms] = useState<string>("");
    const [conCheck, setConCheck] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [obeh, setObeh] = useState<string>("");

    let navigate = useNavigate();

    async function submit(formData: FormData) {
        let report: any = {
            passNumber, station, aos, los, scsw, satMode, acsMode, dmb1, dmb2,
            ris, stdFiles, otherFiles, spare, warnings, alarms, conCheck, comments, obeh
        };

        let apolloClient = getClient();
        const { data } = await apolloClient.mutate({
            mutation: CREATE_GENERIC_REPORT,
            variables: {
                input: {
                    projectId: project,
                    type: "PL",
                    detail: JSON.stringify(report),
                }
            }
        });

        //navigate(`../shift-handover-logs`);
    }

    const titleClasses = "bg-gray-200 items-left align-middle px-2 pt-4 text-base";
    const grayClasses = "items-left align-middle px-2 text-base bg-gray-200";
    const textareaClasses = "resize-none bg-white px-1 border border-gray-400 text-sm min-w-full min-h-full focus:outline-none focus:ring-0 focus:border-0";
    const inputClasses = "px-2 text-base font-medium leading-6 text-black bg-white border border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-700 min-w-full min-h-full";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";
    const listboxClasses = "group flex gap-2 bg-white data-focus:bg-blue-100 w-48 px-2";
    const listboxButtonClasses = "relative block w-full bg-white pr-8 pl-3 text-left text-sm/6 text-black"

    // let operatorListItems = operators.map(o => <ListboxOption className={listboxClasses} key={o.id} value={o}>{o.name}</ListboxOption>);

    return (
        <form action={submit}>
            <div className="grid justify-start" >
                <div className={'col-span-2 border-t border-l ' + titleClasses}>
                    Operator:
                </div>
                <div className={'col-3 border-t ' + titleClasses}>
                    Pass #:
                </div>
                <div className={'col-4 border-t border-r ' + titleClasses}>
                    Station:
                </div>
                <div className='col-1 border-l px-1 bg-gray-200'>
                    <Input type="text" className={inputClasses} value={user} disabled={true} />
                </div>
                <div className={grayClasses}>
                </div>
                <div className="col-3 px-1 bg-gray-200">
                    <Input type="text" className={inputClasses} value={passNumber} onChange={(e) => setPassNumber(parseInt(e.target.value))} required disabled={readOnly} />
                </div>
                <div className="col-4 border-r px-1 bg-gray-200">
                    <Input type="text" className={inputClasses} value={station} onChange={(e) => setStation(e.target.value)} required disabled={readOnly} />
                </div>
                <div className={'col-1 border-l  ' + titleClasses}>
                    AOS:
                </div>
                <div className={'col-2 col-span-2 ' + titleClasses}>
                    LOS:
                </div>
                <div className={`col-4 border-r ` + titleClasses}>
                    SCSW Boot Counter:
                </div>
                <div className={`col-1 border-l px-1 bg-gray-200`}>
                    <Input type="text" className={inputClasses} value={aos} onChange={(e) => setAos(e.target.value)} required disabled={readOnly} />
                </div>
                <div className={`col-2 px-1 bg-gray-200`}>
                    <Input type="text" className={inputClasses} value={los} onChange={(e) => setLos(e.target.value)} required disabled={readOnly} />
                </div>
                <div className={'col-3 ' + grayClasses}>
                </div>
                <div className={`col-4 border-r px-1 bg-gray-200`}>
                    <Input type="text" className={inputClasses} value={scsw} onChange={(e) => setScsw(e.target.value)} required disabled={readOnly} />
                </div>
                <div className={'col-1 border-l ' + titleClasses}>
                    Satellite Mode:
                </div>
                <div className={'col-2 ' + titleClasses}>
                    AOCS Mode:
                </div>
                <div className={'col-3 ' + titleClasses}>
                    DMB-1:
                </div>
                <div className={'col-4 border-r ' + titleClasses}>
                    DMB-2:
                </div>
                <div className={'col-1 w-full border-l px-1 bg-gray-200'}>
                    <Listbox value={satMode} onChange={setSatMode} disabled={readOnly}>
                        <ListboxButton className={listboxButtonClasses}>
                            {satMode || "Select Satellite Mode"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className={"w-52"}>
                            <ListboxOption className={listboxClasses} key={1} value={"SM"}>SM</ListboxOption>
                            <ListboxOption className={listboxClasses} key={2} value={"SBM"}>SBM</ListboxOption>
                            <ListboxOption className={listboxClasses} key={3} value={"OPM"}>OPM</ListboxOption>
                            <ListboxOption className={listboxClasses} key={4} value={"OMM"}>OMM</ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={'col-2 w-full px-1 bg-gray-200'}>
                    <Listbox value={acsMode} onChange={setAcsMode} disabled={readOnly}>
                        <ListboxButton className={listboxButtonClasses}>
                            {acsMode || "Select AOCS Mode"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className={"w-52"}>
                            <ListboxOption className={listboxClasses} key={1} value={"IM-TXT"}>IM-TST</ListboxOption>
                            <ListboxOption className={listboxClasses} key={2} value={"IM-INI"}>IM-INI</ListboxOption>
                            <ListboxOption className={listboxClasses} key={3} value={"SM-SS"}>SM-SS</ListboxOption>
                            <ListboxOption className={listboxClasses} key={4} value={"CPM-SP"}>CPM-SP</ListboxOption>
                            <ListboxOption className={listboxClasses} key={5} value={"CPM-EP"}>CPM-EP</ListboxOption>
                            <ListboxOption className={listboxClasses} key={6} value={"CPM-TR"}>CPM-TR</ListboxOption>
                            <ListboxOption className={listboxClasses} key={7} value={"FPM-EP"}>FPM-EP</ListboxOption>
                            <ListboxOption className={listboxClasses} key={8} value={"FPM-IP"}>FPM-IP</ListboxOption>
                            <ListboxOption className={listboxClasses} key={9} value={"FPM-TR"}>FPM-TR</ListboxOption>
                            <ListboxOption className={listboxClasses} key={10} value={"FPM-LD"}>FPM-LD</ListboxOption>
                            <ListboxOption className={listboxClasses} key={11} value={"OCM-VP"}>OCM-VP</ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={'col-3 w-full px-1 bg-gray-200'}>
                    <Listbox value={dmb1} onChange={setDmb1} disabled={readOnly}>
                        <ListboxButton className={listboxButtonClasses}>
                            {dmb1 || "Select DMB-1 State"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className={"w-52"}>
                            <ListboxOption className={listboxClasses} key={1} value={"Master"}>Master</ListboxOption>
                            <ListboxOption className={listboxClasses} key={2} value={"Backup"}>Backup</ListboxOption>
                            <ListboxOption className={listboxClasses} key={3} value={"Off"}>Off</ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={'col-4 w-full border-r px-1 bg-gray-200'}>
                    <Listbox value={dmb2} onChange={setDmb2} disabled={readOnly}>
                        <ListboxButton className={listboxButtonClasses}>
                            {dmb2 || "Select DMB-2 State"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className={"w-52"}>
                            <ListboxOption className={listboxClasses} key={1} value={"Master"}>Master</ListboxOption>
                            <ListboxOption className={listboxClasses} key={2} value={"Backup"}>Backup</ListboxOption>
                            <ListboxOption className={listboxClasses} key={3} value={"Off"}>Off</ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={'col-1 col-span-2 border-l ' + titleClasses}>
                    Recommendations:
                </div>
                <div className={'col-3 col-span-2 border-r ' + titleClasses}>
                    STD-Files / MPS / FD:
                </div>
                <div className={'col-1 col-span-2 h-20 border-l px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={ris} onChange={(e) => setRis(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setRis("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-3 col-span-2 h-20 border-r px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={stdFiles} onChange={(e) => setStdFiles(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setStdFiles("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-1 col-span-2 border-l ' + titleClasses}>
                    Other Files:
                </div>
                <div className={'col-3 col-span-2 border-r ' + titleClasses}>
                    Spare:
                </div>
                <div className={'col-1 col-span-2 h-20 border-l px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={otherFiles} onChange={(e) => setOtherFiles(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                </div>
                <div className={'col-3 col-span-2 h-20 border-r px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={spare} onChange={(e) => setSpare(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                </div>
                <div className={'col-1 col-span-2 border-l ' + titleClasses}>
                    Warnings:
                </div>
                <div className={'col-3 col-span-2 border-r ' + titleClasses}>
                    Alarms:
                </div>
                <div className={'col-1 col-span-2 h-20 border-l px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={warnings} onChange={(e) => setWarnings(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setWarnings("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-3 col-span-2 h-20 border-r px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={alarms} onChange={(e) => setAlarms(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setAlarms("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-1 col-span-2 border-l ' + titleClasses}>
                    Concheck Failures:
                </div>
                <div className={'col-3 col-span-2 border-r ' + titleClasses}>
                    Comments / Remarks:
                </div>
                <div className={'col-1 col-span-2 h-20 border-l px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={conCheck} onChange={(e) => setConCheck(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setConCheck("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-3 col-span-2 h-20 border-r px-1 bg-gray-200 flex items-center'}>
                    <div className="w-3/4 h-full">
                        <Textarea value={comments} onChange={(e) => setComments(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                </div>
                <div className={'col-1 col-span-4 border-l border-r ' + titleClasses}>
                    OBEH Contents:
                </div>
                <div className={'col-1 col-span-4 h-20 border-l border-r px-1 bg-gray-200 flex items-center'}>
                    <div className="w-7/8 h-full">
                        <Textarea value={obeh} onChange={(e) => setObeh(e.target.value)} className={textareaClasses} disabled={readOnly} />
                    </div>
                    <Button className={`mx-2 ` + buttonClasses} onClick={() => setObeh("None")} disabled={readOnly}>
                        &lt;- None
                    </Button>
                </div>
                <div className={'col-1 py-4 col-span-4 justify-center flex border-l border-r border-b ' + titleClasses}>
                    <Button type='submit' className={buttonClasses} disabled={readOnly}>
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
}
