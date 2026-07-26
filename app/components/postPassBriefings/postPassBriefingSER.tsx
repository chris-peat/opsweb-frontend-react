import { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Textarea, Listbox, ListboxButton, ListboxOptions, ListboxOption, Select } from '@headlessui/react';
import { useOpsWebContext } from '~/routes/layout';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import StatusColorSelector from '../statusColorSelector';
import type { IGenericReport } from '~/models/genericReport';
import { useForm, type SubmitHandler } from "react-hook-form";
import { getClient } from '~/apollo';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { CREATE_GENERIC_REPORT, SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER, SELECT_GENERIC_REPORTS, UPDATE_GENERIC_REPORT, USERS_IN_ROLE } from '~/graphQLQueries';
import { useNavigate } from 'react-router';
import type { IUser } from '~/models/user';
import { toStringNoSeconds } from '~/utilities/time';
import StringSelector from '../stringSelector';

interface IFormInput {
    notes: string
    shift: string
}

export default function PostPassBriefingSER({ number }: { number: number | undefined }) {
    const { project, user } = useOpsWebContext();

    const isNew = !(number !== undefined && number > 0);
    const [scsw, setScsw] = useState<string>();
    const [satMode, setSatMode] = useState<string>();
    const [acsMode, setAcsMode] = useState<string>();
    const [gps1Mode, setGps1Mode] = useState<string>();
    const [gps2Mode, setGps2Mode] = useState<string>();
    const [obtMode, setObtMode] = useState<string>();
    const [dmb1, setDmb1] = useState<string>();
    const [geccos, setGeccos] = useState<string>();
    const [opsWeb, setOpsWeb] = useState<string>();
    const [satmon, setSatmon] = useState<string>();
    const [hkRate, setHkRate] = useState<string>();
    const [overallStatus, setOverallStatus] = useState<string>();
    const [soc, setSoc] = useState<string>();
    const [busV, setBusV] = useState<string>();
    const [str1, setStr1] = useState<string>();
    const [str2, setStr2] = useState<string>();
    const [suns1, setSuns1] = useState<string>();
    const [suns2, setSuns2] = useState<string>();
    const [suns3, setSuns3] = useState<string>();
    const [mgm1, setMgm1] = useState<string>();
    const [mgm2, setMgm2] = useState<string>();
    const [gyr1, setGyr1] = useState<string>();
    const [gyr2, setGyr2] = useState<string>();
    const [rwh1, setRwh1] = useState<string>();
    const [rwh2, setRwh2] = useState<string>();
    const [rwh3, setRwh3] = useState<string>();
    const [rwh4, setRwh4] = useState<string>();
    const [mtq1, setMtq1] = useState<string>();
    const [mtq2, setMtq2] = useState<string>();
    const [propMode, setPropMode] = useState<string>();
    const [tankTemp, setTankTemp] = useState<string>();
    const [firing, setFiring] = useState<string>();
    const [prop1, setProp1] = useState<string>();
    const [prop2, setProp2] = useState<string>();
    const [bootCnt, setBootCnt] = useState<string>();

    const [ris, setRis] = useState<string>("");
    const [stdFiles, setStdFiles] = useState<string>("");
    const [dmb2, setDmb2] = useState<string>();
    const [otherFiles, setOtherFiles] = useState<string>("");
    const [spare, setSpare] = useState<string>("");
    const [warnings, setWarnings] = useState<string>("");
    const [alarms, setAlarms] = useState<string>("");
    const [conCheck, setConCheck] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [obeh, setObeh] = useState<string>("");

    let navigate = useNavigate();

    const inputWidth = "w-50";

    const satModes = ['SM', 'SBM', 'OPM', 'OMM'];
    const aocsModes = ['SM', 'SBM', 'OPM', 'OMM', 'IOC SM_TRANS', 'IOC SM_NOM',
        'IOC SBM_TRANS', 'IOC SBM_NOM', 'IOC OPM_TRANS', 'IOC OPM_NOM',
        'IOC OMM_TRANS', 'IOC OMM_NOM'];
    const dmbValues = ['Master', 'Backup', 'Off'];
    const okNokValues = ['OK', 'NOK'];
    const offChecked = ['Off', 'Checked Out'];
    const hkRateValues = ['High', 'Low'];
    const greenRed = ['Green', 'Red'];
    const obtModes = ['Autonomous', 'Synchronized'];
    const propModes = ['Off', 'Safe', 'Standby', 'Thermal Cond.', 'Thrust', 'Commissioning'];

    useEffect(() => {
        let apolloClient = getClient();
        apolloClient.query({
            query: SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER,
            variables: {
                projectId: project,
                type: "PPB",
                number: number
            }
        })
            .then((data) => {
                if (!data.data?.project?.genericReport) {
                    return;
                }

                let report = data.data.project.genericReport;
                let detail: any = null;
                try {
                    detail = JSON.parse(report.detail);
                } catch (error) {
                    //console.error("Error parsing report detail:", error);
                }
                setScsw(detail.scsw);
                setSatMode(detail.satMode);
                setAcsMode(detail.acsMode);
                setDmb1(detail.dmb1);
                setDmb2(detail.dmb2);
                setRis(detail.ris);
                setStdFiles(detail.stdFiles);
                setOtherFiles(detail.otherFiles);
                setSpare(detail.spare);
                setWarnings(detail.warnings);
                setAlarms(detail.alarms);
                setConCheck(detail.conCheck);
                setComments(detail.comments);
                setObeh(detail.obeh);
            })
            .catch((error) => console.error(error));
    }, [number]);

    async function submit(formData: FormData) {
        let details: any = {
            scsw, satMode, acsMode, dmb1, dmb2,
            ris, stdFiles, otherFiles, spare, warnings, alarms, conCheck, comments, obeh
        };

        let apolloClient = getClient();

        if (isNew) {
            const { data } = await apolloClient.mutate({
                mutation: CREATE_GENERIC_REPORT,
                variables: {
                    input: {
                        projectId: project,
                        type: "PL",
                        detail: JSON.stringify(details),
                    }
                }
            });
        }
        else {
            const { data } = await apolloClient.mutate({
                mutation: UPDATE_GENERIC_REPORT,
                variables: {
                    input: {
                        projectId: project,
                        type: "PL",
                        number: number,
                        detail: JSON.stringify(details),
                    }
                }
            });
        }

        navigate(`../pass-logs`);
    }

    const titleClasses = project + "-primary text-center align-middle border-l border-t border-black px-2 py-2 text-xl";
    const labelClasses = "items-center align-middle px-2 text-base bg-gray-200 border-l border-t";
    const containerClasses = "border-l border-t border-black";
    const textareaClasses = "resize-none bg-white px-1 border border-gray-400 text-sm min-w-full min-h-full focus:outline-none focus:ring-0 focus:border-0";
    const inputClasses = "px-2 text-base font-medium leading-6 text-black bg-white focus:outline-none focus:ring-0 focus:border-blue-700 min-h-full " + inputWidth;
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";
    const listboxClasses = "group flex gap-2 bg-white data-focus:bg-blue-100 w-48 px-2";
    const listboxButtonClasses = "relative block w-full bg-white pr-8 pl-3 text-left text-base text-black"

    const title = isNew ? "New Post Pass Briefing" : "Post Pass Briefing";

    return (
        <form action={submit}>
            <div className="text-2xl mb-4">{title}</div>
            <div className="grid grid-flow-col grid-rows-[repeat(27,auto)] grid-cols-[repeat(8,auto)] justify-start" >
                <div className={labelClasses}>
                    Sat. Mode
                </div>
                <div className={labelClasses}>
                    Global HK Rate
                </div>
                <div className={'col-span-2  ' + titleClasses}>
                    AOCS
                </div>
                <div className={labelClasses}>
                    MODE
                </div>
                <div className={'grid row-span-2  ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>GPS</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'grid row-span-2 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>STR</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'grid row-span-3 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-3'>SUNS</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                    <div className='col-2 row-3 text-right'>3</div>
                </div>
                <div className={`grid row-span-2 ` + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>MGM</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={`grid row-span-2 ` + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>GYR</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={`grid row-span-4 ` + labelClasses}>
                    <div className='col-1 row-1 row-span-4'>RWH</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                    <div className='col-2 row-3 text-right'>3</div>
                    <div className='col-2 row-4 text-right'>4</div>
                </div>
                <div className={`grid row-span-2 ` + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>MTQ</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={labelClasses}>
                    Prop. Mode
                </div>
                <div className={labelClasses}>
                    Tank Temp. [°C]
                </div>
                <div className={labelClasses}>
                    Firing [min]
                </div>
                <div className={`grid row-span-2 ` + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>PROP</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'py-4 col-span-8 justify-center flex'}>
                    <Button type='submit' className={buttonClasses}>
                        {isNew ? "Submit" : "Update"}
                    </Button>
                </div>

                {/* Column 2 */}
                <div className={`col-start-[2] border-r ${containerClasses} ${inputWidth}`}>
                    <StringSelector options={satModes} value={satMode} onChange={setSatMode} required={true} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={hkRateValues} value={hkRate} onChange={setHkRate} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={aocsModes} value={acsMode} onChange={setAcsMode} required={true} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={gps1Mode} onChange={setGps1Mode} required={true} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={gps2Mode} onChange={setGps2Mode} required={true} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={str1} onChange={setStr1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={str2} onChange={setStr2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={suns1} onChange={setSuns1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={suns2} onChange={setSuns2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={suns3} onChange={setSuns3} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={mgm1} onChange={setMgm1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={mgm2} onChange={setMgm2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={gyr1} onChange={setGyr1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={gyr2} onChange={setGyr2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={rwh1} onChange={setRwh1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={rwh2} onChange={setRwh2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={rwh3} onChange={setRwh3} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={rwh4} onChange={setRwh4} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={mtq1} onChange={setMtq1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={mtq2} onChange={setMtq2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={propModes} value={propMode} onChange={setPropMode} required={false} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={tankTemp} onChange={(e) => setTankTemp(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={firing} onChange={(e) => setFiring(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={prop1} onChange={setProp1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={offChecked} value={prop2} onChange={setProp2} required={false} />
                </div>


                {/* Column 3 */}
                <div className={`col-start-[3] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={'col-span-2 ' + titleClasses}>
                    TMTC
                </div>
                <div className={'row-span-2 grid ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>DMB</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={labelClasses}>
                    OBT Mode
                </div>
                <div className={labelClasses}>
                    SC_SW Boot Cnt.
                </div>
                <div className={'row-span-2 grid ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>LSC</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2' + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    MTL Schedule
                </div>
                <div className={labelClasses}>
                    SS Enabled
                </div>
                <div className={labelClasses}>
                    BGS O/B until
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    Last D/L Data
                </div>
                <div className={labelClasses}>
                    Dump Integrity
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    Authentication
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    &nbsp;
                </div>
                <div className={'row-span-2 grid ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>HSC</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2 row-span-5 ' + labelClasses}>
                    &nbsp;
                </div>

                {/* Column 4 */}
                <div className={`col-start-[4] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={containerClasses}>
                    <StringSelector options={dmbValues} value={dmb1} onChange={setDmb1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={dmbValues} value={dmb2} onChange={setDmb2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={obtModes} value={obtMode} onChange={setObtMode} required={true} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={bootCnt} onChange={(e) => setBootCnt(e.target.value)} />
                </div>


                {/* Column 5 */}
                <div className={`col-start-[5] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={`col-span-2 ` + titleClasses}>
                    PTS
                </div>
                <div className={labelClasses}>
                    Overall status
                </div>
                <div className={labelClasses}>
                    Battery SoC [%]
                </div>
                <div className={labelClasses}>
                    Bus Voltage [V]
                </div>


                {/* Column 6 */}
                <div className={`col-start-[6] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={`${containerClasses} ${inputWidth}`}>
                    <StringSelector options={greenRed} value={overallStatus} onChange={setOverallStatus} required={true} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={soc} onChange={(e) => setSoc(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={busV} onChange={(e) => setBusV(e.target.value)} />
                </div>

                {/* Column 7 */}
                <div className={`col-start-[7] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={'col-span-2 border-r ' + titleClasses}>
                    Ground
                </div>
                <div className={labelClasses}>
                    GECCOS
                </div>
                <div className={labelClasses}>
                    OpsWeb
                </div>
                <div className={labelClasses}>
                    Satmon
                </div>

                {/* Column 8 */}
                <div className={`col-start-[8] col-span-2 row-span-2 ${inputWidth}`}>
                    &nbsp;
                </div>
                <div className={`border-r ${containerClasses} ${inputWidth}`}>
                    <StringSelector options={okNokValues} value={geccos} onChange={setGeccos} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={opsWeb} onChange={setOpsWeb} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={satmon} onChange={setSatmon} required={false} />
                </div>


            </div>
        </form>
    );
}
