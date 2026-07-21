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
import { toStringNoSeconds } from '~/utilities/time';

interface IFormInput {
    notes: string
    shift: string
}

export default function ShiftHandoverLogH2S({ report }: { report: IGenericReport | undefined }) {
    const { project, user } = useOpsWebContext();

    const [readOnly, setReadOnly] = useState<boolean>(report !== undefined);
    const [notes, setNotes] = useState<string>(report?.detail?.["notes"] || "");
    const [shift, setShift] = useState<string>(report?.detail?.["shift"] || "");
    const [shiftEnd, setShiftEnd] = useState<string>(report?.detail?.["shiftEnd"] || "");
    const [acs, setAcs] = useState<string>(report?.detail?.["acs"] || "");
    const [thm, setThm] = useState<string>(report?.detail?.["thm"] || "");
    const [cpps, setCpps] = useState<string>(report?.detail?.["cpps"] || "");
    const [bdh, setBdh] = useState<string>(report?.detail?.["bdh"] || "");
    const [epps, setEpps] = useState<string>(report?.detail?.["epps"] || "");
    const [cry, setCry] = useState<string>(report?.detail?.["cry"] || "");
    const [pwr, setPwr] = useState<string>(report?.detail?.["pwr"] || "");
    const [ttr, setTtr] = useState<string>(report?.detail?.["ttr"] || "");
    const [wt, setWt] = useState<string>(report?.detail?.["wt"] || "");
    const [mil, setMil] = useState<string>(report?.detail?.["mil"] || "");
    const [ssu, setSsu] = useState<string>(report?.detail?.["ssu"] || "");
    const [gcuBackup, setGcuBackup] = useState<string>(report?.detail?.["gcuBackup"] || "");
    const [gcuPrime, setGcuPrime] = useState<string>(report?.detail?.["gcuPrime"] || "");
    const [geoDailyCheck, setGeoDailyCheck] = useState<boolean>(report?.detail?.["geoDailyCheck"] || false);
    const [geccosCheck, setGeccosCheck] = useState<boolean>(report?.detail?.["geccosCheck"] || false);
    const [comments, setComments] = useState<string>(report?.detail?.["comments"] || "");
    const [moonSunInterference, setMoonSunInterference] = useState<string>(report?.detail?.["moonSunInterference"] || "");
    const [uhd, setUhd] = useState<boolean>(report?.detail?.["uhd"] || false);
    const [connectionTest, setConnectionTest] = useState<boolean>(report?.detail?.["connectionTest"] || false);
    const [icinga, setIcinga] = useState<boolean>(report?.detail?.["icinga"] || false);
    const [secureChat, setSecureChat] = useState<boolean>(report?.detail?.["secureChat"] || false);
    const [timeCorrelation, setTimeCorrelation] = useState<boolean>(report?.detail?.["timeCorrelation"] || false);
    const [rangingData, setRangingData] = useState<boolean>(report?.detail?.["rangingData"] || false);
    const [pintaOnWeb, setPintaOnWeb] = useState<boolean>(report?.detail?.["pintaOnWeb"] || false);
    const [l1ArcValue, setL1ArcValue] = useState<string>(report?.detail?.["l1ArcValue"] || "");
    const [antennaPrime, setAntennaPrime] = useState<string>(report?.detail?.["antennaPrime"] || "");
    const [antennaBackup, setAntennaBackup] = useState<string>(report?.detail?.["antennaBackup"] || "");
    const [cortexPrime, setCortexPrime] = useState<string>(report?.detail?.["cortexPrime"] || "");
    const [cortexBackup, setCortexBackup] = useState<string>(report?.detail?.["cortexBackup"] || "");
    const [chainPrime, setChainPrime] = useState<string>(report?.detail?.["chainPrime"] || "");
    const [chainBackup, setChainBackup] = useState<string>(report?.detail?.["chainBackup"] || "");
    const [vcId, setVcId] = useState<string>(report?.detail?.["vcId"] || "");
    const [mapId, setMapId] = useState<string>(report?.detail?.["mapId"] || "");
    const [spacecraftMode, setSpacecraftMode] = useState<string>(report?.detail?.["spacecraftMode"] || "");
    const [aocsMode, setAocsMode] = useState<string>(report?.detail?.["aocsMode"] || "");
    const [toDo, setToDo] = useState<string>(report?.detail?.["toDo"] || "");
    const [outOfOrder, setOutOfOrder] = useState<string>(report?.detail?.["outOfOrder"] || "");
    const [general, setGeneral] = useState<string>(report?.detail?.["general"] || "");
    const [eclipse, setEclipse] = useState<boolean>(report?.detail?.["eclipse"] || false);
    const [handoverTo, setHandoverTo] = useState<any>(report?.detail?.["handoverTo"] || "");

    const [operators, setOperators] = useState<any[]>([]);

    let navigate = useNavigate();

    useEffect(() => {
        // check for valid access token, if not present redirect to login
        fetchOperators();
    }, []);

    async function fetchOperators() {
        let apolloClient = getClient();
        const { data } = await apolloClient.query({
            query: USERS_IN_ROLE,
            variables: {
                projectId: project,
                roleName: "ShiftOperator"
            }
        });

        console.log(data);

        if (!data?.project?.roles || data?.project?.roles.length === 0)
            return [];

        const role = data.project.roles[0];

        let users = role.users.map(u => u);
        users.sort((a, b) => a.name.localeCompare(b.name));

        setOperators(users);
    }

    async function handlePrefill() {

        // fetch the existing shift handover log with the highest number
        let apolloClient = getClient();
        const { data } = await apolloClient.query({
            query: SELECT_GENERIC_REPORTS,
            variables: {
                projectId: project,
                input: {
                    type: "SHL",
                    paging: {
                        skip: 0,
                        take: 1
                    },
                }
            }
        });

        if (data?.project.genericReports.total === 0) {
            return;
        }

        const latestReport = data?.project.genericReports.reports[0];

        try {
            const detail = JSON.parse(latestReport.detail);

            // S/C Status
            setAcs(detail.acs || "");
            setThm(detail.thm || "");
            setCpps(detail.cpps || "");
            setBdh(detail.bdh || "");
            setEpps(detail.epps || "");
            setCry(detail.cry || "");
            setPwr(detail.pwr || "");
            setTtr(detail.ttr || "");

            // payload status
            setWt(detail.wt || "");
            setMil(detail.mil || "");

            // SSU/GCU status
            setSsu(detail.ssu || "");
            setGcuBackup(detail.gcuBackup || "");
            setGcuPrime(detail.gcuPrime || "");
            setL1ArcValue(detail.l1ArcValue || "");

            // Ground status
            setAntennaPrime(detail.antennaPrime || "");
            setAntennaBackup(detail.antennaBackup || "");
            setCortexPrime(detail.cortexPrime || "");
            setCortexBackup(detail.cortexBackup || "");
            setChainPrime(detail.chainPrime || "");
            setChainBackup(detail.chainBackup || "");
            setVcId(detail.vcId || "");
            setMapId(detail.mapId || "");
            setSpacecraftMode(detail.spacecraftMode || "");
            setAocsMode(detail.aocsMode || "");

            setHandoverTo(detail?.handoverTo || undefined);
        }
        catch (error) { }
    }

    function handleImport() {
        alert("Not implemented yet");
    }

    async function submit(formData: FormData) {
        if (!shift) {
            alert("Please select a shift.");
            return;
        }

        let report: any = {
            acs, epps, shift, shiftEnd, thm, cpps, bdh, cry, pwr, ttr, wt, mil, ssu, gcuBackup, gcuPrime,
            l1ArcValue, antennaPrime, antennaBackup, cortexPrime, cortexBackup, vcId, mapId, spacecraftMode,
            aocsMode, chainPrime, chainBackup,
            uhd, connectionTest, icinga, secureChat, timeCorrelation, rangingData, pintaOnWeb,
            eclipse,
            geoDailyCheck, geccosCheck, moonSunInterference, comments, notes, outOfOrder, toDo, general,

        };

        report.handoverTo = handoverTo;
        let apolloClient = getClient();
        const { data } = await apolloClient.mutate({
            mutation: CREATE_GENERIC_REPORT,
            variables: {
                input: {
                    projectId: project,
                    type: "SHL",
                    detail: JSON.stringify(report),
                }
            }
        });

        navigate(`../shift-handover-logs`);
    }

    const titleClasses = project + "-secondary items-left align-middle px-2 text-base";
    const grayClasses = "items-left align-middle px-2 text-base bg-gray-200";
    const checkClasses = "group block size-4 rounded border bg-white data-checked:bg-blue-500";
    const textareaClasses = "resize-none px-1 text-sm min-w-full min-h-full border-none focus:outline-none focus:ring-0 focus:border-0";
    const inputClasses = "px-2 text-base font-medium leading-6 text-black bg-white border border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-700 min-w-full min-h-full";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";
    const listboxClasses = "group flex gap-2 bg-white data-focus:bg-blue-100 w-48 px-2";
    const listboxButtonClasses = "relative block w-full bg-white/5 pr-8 pl-3 py-1 text-left text-black border border-gray-400"

    // let operatorListItems = operators.map(o => <ListboxOption className={listboxClasses} key={o.id} value={o}>{o.name}</ListboxOption>);

    return (
        <form action={submit}>
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
                    <Listbox value={shift} onChange={setShift} disabled={readOnly} invalid={!shift}>
                        <ListboxButton className={`${listboxButtonClasses} data-invalid:ring-1 data-invalid:ring-red-500`}>
                            {shift || "Select shift"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom">
                            <ListboxOption className={listboxClasses} key="Morning" value="Morning">Morning</ListboxOption>
                            <ListboxOption className={listboxClasses} key="Evening" value="Evening">Evening</ListboxOption>
                            <ListboxOption className={listboxClasses} key="Night" value="Night">Night</ListboxOption>
                            <ListboxOption className={listboxClasses} key="Additional" value="Additional">Additional</ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={`col-3 col-span-2 row-2 ${grayClasses}`}>
                </div>
                <div className={`col-4 col-span-2 row-2 row-span-5 h-full border-r`}>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={textareaClasses} name="notes" disabled={readOnly} />
                </div>
                <div className={`col-1 row-3 align-end border-l text-right ${grayClasses}`}>
                    Shift end
                </div>
                <div className={`col-2 row-3 flex`}>
                    <Input type="text" className="px-2 text-base font-medium leading-6 text-black bg-white border border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-700 min-h-full" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} name="shiftEnd" required disabled={readOnly} />
                    <Button className={`${project}-primary items-center justify-center px-2 py-1 text-sm text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`}
                        onClick={() => setShiftEnd(toStringNoSeconds(new Date()))} title="Set shift end to the current time" >
                        &lt;- Now
                    </Button>
                </div>
                <div className={`col-3 col-span-2 row-3 ${grayClasses}`}>
                </div>
                <div className={`col-1 col-span-4 row-4 border-l ${grayClasses}`}>
                    &nbsp;
                </div>
                <div className={`col-1 col-span-4 row-5 border-l ${grayClasses} flex gap-20 justify-center`}>
                    <Button className={buttonClasses} onClick={handlePrefill} disabled={readOnly}
                            title="Pre-fill fields with values from last log">
                        Prefill
                    </Button>
                    <Button type='submit' className={buttonClasses} disabled={readOnly}>
                        Submit
                    </Button>
                    <Button className={buttonClasses} onClick={handleImport} disabled={readOnly}>
                        Import

                    </Button>
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
                <div className="bg-gray-200">
                    <StatusColorSelector name="acs" value={acs} onChange={(value) => setAcs(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    THM
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="thm" value={thm} onChange={(value) => setThm(value)} required disabled={readOnly} />
                </div>
                <div className={`col-span-2 row-span-4 h-full border-r`}>
                    <Textarea value={outOfOrder} onChange={(e) => setOutOfOrder(e.target.value)} className={textareaClasses} name="outOfOrder" disabled={readOnly} />
                </div>
                <div className={`col-1 border-l text-right ${grayClasses}`}>
                    CPPS
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="cpps" value={cpps} onChange={setCpps} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    BDH
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="bdh" value={bdh} onChange={(value) => setBdh(value)} required disabled={readOnly} />
                </div>
                <div className={`col-1 border-l text-right ${grayClasses}`}>
                    EPPS
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="epps" value={epps} onChange={(value) => setEpps(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    CRY
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="cry" value={cry} onChange={(value) => setCry(value)} required disabled={readOnly} />
                </div>
                <div className={`col-1 border-l text-right ${grayClasses}`}>
                    PWR
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="pwr" value={pwr} onChange={(value) => setPwr(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    TTR
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="ttr" value={ttr} onChange={(value) => setTtr(value)} required disabled={readOnly} />
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
                <div className="bg-gray-200">
                    <StatusColorSelector name="wt" value={wt} onChange={(value) => setWt(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    MIL
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="mil" value={mil} onChange={(value) => setMil(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    RIs
                </div>
                <div className="bg-gray-200 border-r">
                    <Input type="text" defaultValue={""} className={inputClasses} disabled={readOnly} />
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
                <div className="bg-gray-200">
                    <StatusColorSelector name="ssu" value={ssu} onChange={(value) => setSsu(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    GCU Backup
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="gcuBackup" value={gcuBackup} onChange={(value) => setGcuBackup(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    RIs
                </div>
                <div className="bg-gray-200 border-r">
                    <Input type="text" defaultValue={""} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    GCU Prime
                </div>
                <div className="bg-gray-200">
                    <StatusColorSelector name="gcuPrime" value={gcuPrime} onChange={(value) => setGcuPrime(value)} required disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                </div>
                <div className={`col-span-3 row-span-2 border-r ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    L1 Arc Value
                </div>
                <div className={``}>
                    <Input type="text" value={l1ArcValue} onChange={(e) => setL1ArcValue(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
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
                    <Input type="text" value={antennaPrime} onChange={(e) => setAntennaPrime(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={``}>
                    <Input type="text" value={antennaBackup} onChange={(e) => setAntennaBackup(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`${grayClasses}`}>
                </div>
                <div className={`col-span-2 row-span-7 h-full border-r`}>
                    <Textarea value={toDo} onChange={(e) => setToDo(e.target.value)} className={textareaClasses} name="toDo" disabled={readOnly} />
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Cortex
                </div>
                <div className={``}>
                    <Input type="text" value={cortexPrime} onChange={(e) => setCortexPrime(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={``}>
                    <Input type="text" value={cortexBackup} onChange={(e) => setCortexBackup(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Chain
                </div>
                <div className={``}>
                    <Input type="text" value={chainPrime} onChange={(e) => setChainPrime(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={``}>
                    <Input type="text" value={chainBackup} onChange={(e) => setChainBackup(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    MAP-ID
                </div>
                <div className={``}>
                    <Input type="text" value={mapId} onChange={(e) => setMapId(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`col-span-2 ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    VC-ID
                </div>
                <div className={``}>
                    <Input type="text" value={vcId} onChange={(e) => setVcId(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`col-span-2 ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    AOCS Mode
                </div>
                <div className={``}>
                    <Input type="text" value={aocsMode} onChange={(e) => setAocsMode(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`col-span-2 ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Spacecraft Mode
                </div>
                <div className={``}>
                    <Input type="text" value={spacecraftMode} onChange={(e) => setSpacecraftMode(e.target.value)} className={inputClasses} disabled={readOnly} />
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
                    <Checkbox className={checkClasses} name="geoDailyCheck" checked={geoDailyCheck} onChange={setGeoDailyCheck} disabled={readOnly}></Checkbox>
                </div>
                <div className={`text-right ${grayClasses}`}>
                    GECCOS Check all Chains
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} name="geccosCheck" checked={geccosCheck} onChange={setGeccosCheck} disabled={readOnly}></Checkbox>
                </div>
                <div className={`row-span-6 col-span-2 border-r ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    UHD
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={uhd} onChange={setUhd} disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    Connection Test (Ping)
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={connectionTest} onChange={setConnectionTest} disabled={readOnly} />
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    ICINGA
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={icinga} onChange={setIcinga} disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    Secure Chat and Mail
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={secureChat} onChange={setSecureChat} disabled={readOnly} />
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Time Correlation
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={timeCorrelation} onChange={setTimeCorrelation} disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    Ranging Data
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={rangingData} onChange={setRangingData} disabled={readOnly} />
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    PintaOnWeb
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={pintaOnWeb} onChange={setPintaOnWeb} disabled={readOnly} />
                </div>
                <div className={`col-span-2 ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Comments
                </div>
                <div className={'col-span-3 w-full'}>
                    <Input type="text" value={comments} onChange={(e) => setComments(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={'col-span-6 border-l border-r ' + titleClasses}>
                    Upcoming Events
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    Eclipse
                </div>
                <div className={`flex justify-center items-center p-1 ${grayClasses}`}>
                    <Checkbox className={checkClasses} checked={eclipse} onChange={setEclipse} disabled={readOnly} />
                </div>
                <div className={`text-right ${grayClasses}`}>
                    Moon/Sun Interference
                </div>
                <div className={'w-full'}>
                    <Input type="text" value={moonSunInterference} onChange={(e) => setMoonSunInterference(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`col-span-2 border-r ${grayClasses}`}>
                </div>
                <div className={`border-l text-right ${grayClasses}`}>
                    General
                </div>
                <div className={'col-span-3 w-full'}>
                    <Input type="text" value={general} onChange={(e) => setGeneral(e.target.value)} className={inputClasses} disabled={readOnly} />
                </div>
                <div className={`col-span-2 border-r ${grayClasses}`}>
                </div>
                <div className={'col-span-6 border-l border-r ' + titleClasses}>
                    Handover
                </div>
                <div className={`border-l border-b text-right ${grayClasses}`}>
                    Handover to
                </div>
                <div className={'w-full border-b'}>
                    <Listbox value={handoverTo} onChange={setHandoverTo} disabled={readOnly}>
                        <ListboxButton className={listboxButtonClasses}>
                            {handoverTo?.name || "Select handover operator"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-1 right-2.5 size-4 fill-black/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className={"w-52"}>
                            {operators.map((o) => (<ListboxOption className={listboxClasses} key={o.id} value={o}>{o.name}</ListboxOption>))}
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div className={`col-span-4 border-r border-b ${grayClasses}`}>
                </div>
            </div>
        </form>
    );
}
