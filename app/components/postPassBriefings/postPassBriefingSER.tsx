import { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Textarea, Listbox, ListboxButton, ListboxOptions, ListboxOption, Select } from '@headlessui/react';
import { useOpsWebContext } from '~/routes/layout';
import { getClient } from '~/apollo';
import { CREATE_GENERIC_REPORT, SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER, SELECT_GENERIC_REPORTS, UPDATE_GENERIC_REPORT, USERS_IN_ROLE } from '~/graphQLQueries';
import { useNavigate } from 'react-router';
import type { IUser } from '~/models/user';
import StringSelector from '../stringSelector';


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
    const [lsc1, setLsc1] = useState<string>();
    const [lsc2, setLsc2] = useState<string>();
    const [ris, setRis] = useState<string>();
    const [stdFiles, setStdFiles] = useState<string>();
    const [dmb2, setDmb2] = useState<string>();
    const [otherFiles, setOtherFiles] = useState<string>();
    const [spare, setSpare] = useState<string>();
    const [warnings, setWarnings] = useState<string>();
    const [alarms, setAlarms] = useState<string>();
    const [conCheck, setConCheck] = useState<string>();
    const [comments, setComments] = useState<string>();
    const [obeh, setObeh] = useState<string>();
    const [ssEnabled, setSsEnabled] = useState<string>();
    const [mtlSched, setMtlSched] = useState<string>();
    const [bgsObUntil, setBgsObUntil] = useState<string>();
    const [lastDlData, setLastDlData] = useState<string>();
    const [dumpIntegrity, setDumpIntegrity] = useState<string>();
    const [authentication, setAuthentication] = useState<string>();
    const [hsc1, setHsc1] = useState<string>();
    const [hsc2, setHsc2] = useState<string>();
    const [plStatus, setPlStatus] = useState<string>();
    const [pdhu1, setPdhu1] = useState<string>();
    const [pdhu2, setPdhu2] = useState<string>();
    const [pdhu3, setPdhu3] = useState<string>();
    const [sAtHome, setSAtHome] = useState<string>();
    const [afd, setAfd] = useState<string>();
    const [protos, setProtos] = useState<string>();
    const [mops, setMops] = useState<string>();
    const [kmf, setKmf] = useState<string>();
    const [sgo, setSgo] = useState<string>();
    const [mps, setMps] = useState<string>();
    const [fds, setFds] = useState<string>();
    const [odBasedOn, setOdBasedOn] = useState<string>();
    const [aocsCont, setAocsCont] = useState<string>();
    const [aocsComment, setAocsComment] = useState<string>();
    const [aocsAct1, setAocsAct1] = useState<string>();
    const [aocsAct2, setAocsAct2] = useState<string>();
    const [tmtcCont, setTmtcCont] = useState<string>();
    const [tmtcComment, setTmtcComment] = useState<string>();
    const [tmtcAct1, setTmtcAct1] = useState<string>();
    const [tmtcAct2, setTmtcAct2] = useState<string>();
    const [ptsCont, setPtsCont] = useState<string>();
    const [ptsComment, setPtsComment] = useState<string>();
    const [ptsAct1, setPtsAct1] = useState<string>();
    const [ptsAct2, setPtsAct2] = useState<string>();
    const [grdCont, setGrdCont] = useState<string>();
    const [grdComment, setGrdComment] = useState<string>();
    const [grdAct1, setGrdAct1] = useState<string>();
    const [grdAct2, setGrdAct2] = useState<string>();

    let navigate = useNavigate();

    const inputWidth = "w-50";

    const satModes = ['SM', 'SBM', 'OPM', 'OMM'];
    const aocsModes = ['SM', 'SBM', 'OPM', 'OMM', 'IOC SM_TRANS', 'IOC SM_NOM',
        'IOC SBM_TRANS', 'IOC SBM_NOM', 'IOC OPM_TRANS', 'IOC OPM_NOM',
        'IOC OMM_TRANS', 'IOC OMM_NOM'];
    const dmbValues = ['Master', 'Backup', 'Off'];
    const okNokValues = ['OK', 'NOK'];
    const onOffNokValues = ['On', 'Off', 'NOK'];
    const offChecked = ['Off', 'Checked Out'];
    const hkRateValues = ['High', 'Low'];
    const odValues = ['GPS', 'Tracking data'];
    const greenRed = ['Green', 'Red'];
    const obtModes = ['Autonomous', 'Synchronized'];
    const propModes = ['Off', 'Safe', 'Standby', 'Thermal Cond.', 'Thrust', 'Commissioning'];
    const enabledDisabled = ['Enabled', 'Disabled'];

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
                setReportDetails(detail);
            })
            .catch((error) => console.error(error));
    }, [project, number]);

    async function submit(formData: FormData) {
        let details: any = {
            scsw,
            satMode,
            acsMode,
            gps1Mode,
            gps2Mode,
            obtMode,
            dmb1,
            geccos,
            opsWeb,
            satmon,
            hkRate,
            overallStatus,
            soc,
            busV,
            str1,
            str2,
            suns1,
            suns2,
            suns3,
            mgm1,
            mgm2,
            gyr1,
            gyr2,
            rwh1,
            rwh2,
            rwh3,
            rwh4,
            mtq1,
            mtq2,
            propMode,
            tankTemp,
            firing,
            prop1,
            prop2,
            bootCnt,
            lsc1,
            lsc2,
            ris,
            stdFiles,
            dmb2,
            otherFiles,
            spare,
            warnings,
            alarms,
            conCheck,
            comments,
            obeh,
            ssEnabled,
            mtlSched,
            bgsObUntil,
            lastDlData,
            dumpIntegrity,
            authentication,
            hsc1,
            hsc2,
            plStatus,
            pdhu1,
            pdhu2,
            pdhu3,
            sAtHome,
            afd,
            protos,
            mops,
            kmf,
            sgo,
            mps,
            fds,
            odBasedOn,
            aocsCont,
            aocsComment,
            aocsAct1,
            aocsAct2,
            tmtcCont,
            tmtcComment,
            tmtcAct1,
            tmtcAct2,
            ptsCont,
            ptsComment,
            ptsAct1,
            ptsAct2,
            grdCont,
            grdComment,
            grdAct1,
            grdAct2,
        };

        let apolloClient = getClient();

        if (isNew) {
            const { data } = await apolloClient.mutate({
                mutation: CREATE_GENERIC_REPORT,
                variables: {
                    input: {
                        projectId: project,
                        type: "PPB",
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
                        type: "PPB",
                        number: number,
                        detail: JSON.stringify(details),
                    }
                }
            });
        }

        navigate(`../post-pass-briefings`);
    }

    function setReportDetails(detail: any) {
        setScsw(detail.scsw);
        setSatMode(detail.satMode);
        setAcsMode(detail.acsMode);
        setGps1Mode(detail.gps1Mode);
        setGps2Mode(detail.gps2Mode);
        setObtMode(detail.obtMode);
        setDmb1(detail.dmb1);
        setGeccos(detail.geccos);
        setOpsWeb(detail.opsWeb);
        setSatmon(detail.satmon);
        setHkRate(detail.hkRate);
        setOverallStatus(detail.overallStatus);
        setSoc(detail.soc);
        setBusV(detail.busV);
        setStr1(detail.str1);
        setStr2(detail.str2);
        setSuns1(detail.suns1);
        setSuns2(detail.suns2);
        setSuns3(detail.suns3);
        setMgm1(detail.mgm1);
        setMgm2(detail.mgm2);
        setGyr1(detail.gyr1);
        setGyr2(detail.gyr2);
        setRwh1(detail.rwh1);
        setRwh2(detail.rwh2);
        setRwh3(detail.rwh3);
        setRwh4(detail.rwh4);
        setMtq1(detail.mtq1);
        setMtq2(detail.mtq2);
        setPropMode(detail.propMode);
        setTankTemp(detail.tankTemp);
        setFiring(detail.firing);
        setProp1(detail.prop1);
        setProp2(detail.prop2);
        setBootCnt(detail.bootCnt);
        setLsc1(detail.lsc1);
        setLsc2(detail.lsc2);
        setRis(detail.ris);
        setStdFiles(detail.stdFiles);
        setDmb2(detail.dmb2);
        setOtherFiles(detail.otherFiles);
        setSpare(detail.spare);
        setWarnings(detail.warnings);
        setAlarms(detail.alarms);
        setConCheck(detail.conCheck);
        setComments(detail.comments);
        setObeh(detail.obeh);
        setSsEnabled(detail.ssEnabled);
        setMtlSched(detail.mtlSched);
        setBgsObUntil(detail.bgsObUntil);
        setLastDlData(detail.lastDlData);
        setDumpIntegrity(detail.dumpIntegrity);
        setAuthentication(detail.authentication);
        setHsc1(detail.hsc1);
        setHsc2(detail.hsc2);
        setPlStatus(detail.plStatus);
        setPdhu1(detail.pdhu1);
        setPdhu2(detail.pdhu2);
        setPdhu3(detail.pdhu3);
        setSAtHome(detail.sAtHome);
        setAfd(detail.afd);
        setProtos(detail.protos);
        setMops(detail.mops);
        setKmf(detail.kmf);
        setSgo(detail.sgo);
        setMps(detail.mps);
        setFds(detail.fds);
        setOdBasedOn(detail.odBasedOn);
        setAocsCont(detail.aocsCont);
        setAocsComment(detail.aocsComment);
        setAocsAct1(detail.aocsAct1);
        setAocsAct2(detail.aocsAct2);
        setTmtcCont(detail.tmtcCont);
        setTmtcComment(detail.tmtcComment);
        setTmtcAct1(detail.tmtcAct1);
        setTmtcAct2(detail.tmtcAct2);
        setPtsCont(detail.ptsCont);
        setPtsComment(detail.ptsComment);
        setPtsAct1(detail.ptsAct1);
        setPtsAct2(detail.ptsAct2);
        setGrdCont(detail.grdCont);
        setGrdComment(detail.grdComment);
        setGrdAct1(detail.grdAct1);
        setGrdAct2(detail.grdAct2);
    }

    async function handlePrefill() {

        // fetch the existing shift handover log with the highest number
        let apolloClient = getClient();
        const { data } = await apolloClient.query({
            query: SELECT_GENERIC_REPORTS,
            variables: {
                projectId: project,
                input: {
                    type: "PPB",
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
            setReportDetails(detail);
        }
        catch (error) { }
    }

    const titleClasses = project + "-primary text-center align-middle border-l border-t border-black px-2 text-xl";
    const labelClasses = "items-center align-middle px-2 text-base bg-gray-200 border-l border-t";
    const containerClasses = "border-l border-t border-black";
    const textareaClasses = "resize-none bg-white px-1 text-sm min-w-full min-h-full focus:outline-none focus:ring-0 focus:border-0";
    const inputClasses = "px-2 text-base font-medium leading-6 text-black bg-white focus:outline-none focus:ring-0 focus:border-blue-700 min-h-full " + inputWidth;
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

    const title = isNew ? "New Post Pass Briefing" : "Post Pass Briefing";

    return (
        <form action={submit}>
            <div className="text-2xl mb-4">{title}</div>
            <div className="grid grid-flow-col grid-rows-[repeat(33,auto)] grid-cols-[repeat(8,auto)] justify-start" >
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
                <div className={`col-span-2 ` + labelClasses}>
                    CONTINGENCY
                </div>
                <div className={'col-span-2 ' + containerClasses}>
                    <Textarea value={aocsCont} onChange={(e) => setAocsCont(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'grid row-span-2 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>Next Planned<br />Activities</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    COMMENT
                </div>
                <div className={'col-span-2 border-b h-15 ' + containerClasses}>
                    <Textarea value={aocsComment} onChange={(e) => setAocsComment(e.target.value)} className={textareaClasses} />
                </div>

                <div className={'py-4 col-span-8 justify-center flex gap-20 justify-center'}>
                    {
                        (isNew) ?
                            <Button className={buttonClasses} onClick={handlePrefill}
                                title="Pre-fill fields with values from last briefing">
                                Prefill
                            </Button>
                            : ""
                    }
                    <Button type='submit' className={buttonClasses}>
                        {isNew ? "Submit" : "Update"}
                    </Button>
                </div>

                {/* Column 2 */}
                <div className={`col-start-[2] border-r ${containerClasses} ${inputWidth}`}>
                    <StringSelector options={satModes} value={satMode} onChange={setSatMode} required={true} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={hkRateValues} value={hkRate} onChange={setHkRate} required={true} />
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
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={aocsAct1} onChange={(e) => setAocsAct1(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={aocsAct2} onChange={(e) => setAocsAct2(e.target.value)} className={textareaClasses} />
                </div>


                {/* Column 3 */}
                <div className={'col-start-[3] col-span-2 row-span-2'}>
                    &nbsp;
                </div>
                <div className={`col-span-2  ${titleClasses}`}>
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
                <div className={'col-span-2 ' + labelClasses}>
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
                <div className={`col-span-2 ` + labelClasses}>
                    CONTINGENCY
                </div>
                <div className={'col-span-2 ' + containerClasses}>
                    <Textarea value={tmtcCont} onChange={(e) => setTmtcCont(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'grid row-span-2 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>Next Planned<br />Activities</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    COMMENT
                </div>
                <div className={'col-span-2 border-b h-15 ' + containerClasses}>
                    <Textarea value={tmtcComment} onChange={(e) => setTmtcComment(e.target.value)} className={textareaClasses} />
                </div>

                {/* Column 4 */}
                <div className={`col-start-[4] row-4 ${containerClasses} ${inputWidth}`}>
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
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={lsc1} onChange={(e) => setLsc1(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={lsc2} onChange={(e) => setLsc2(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={mtlSched} onChange={(e) => setMtlSched(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={enabledDisabled} value={ssEnabled} onChange={setSsEnabled} required={false} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={bgsObUntil} onChange={(e) => setBgsObUntil(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={lastDlData} onChange={(e) => setLastDlData(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={dumpIntegrity} onChange={(e) => setDumpIntegrity(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={authentication} onChange={(e) => setAuthentication(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={hsc1} onChange={(e) => setHsc1(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={hsc2} onChange={(e) => setHsc2(e.target.value)} />
                </div>
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={tmtcAct1} onChange={(e) => setTmtcAct1(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={tmtcAct2} onChange={(e) => setTmtcAct2(e.target.value)} className={textareaClasses} />
                </div>

                {/* Column 5 */}
                <div className={'col-start-[5] col-span-2 row-span-2'}>
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
                <div className={`col-span-2 row-span-2 ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={`col-span-2 ` + titleClasses}>
                    P/L
                </div>
                <div className={'row-span-3 ' + labelClasses}>
                    Status
                </div>
                <div className={'row-span-3 grid ' + labelClasses}>
                    <div className='col-1 row-1 row-span-3'>PDHU</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                    <div className='col-2 row-3 text-right'>3</div>
                </div>
                <div className={`col-span-2 row-span-11 ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={`col-span-2 ` + labelClasses}>
                    CONTINGENCY
                </div>
                <div className={'col-span-2 ' + containerClasses}>
                    <Textarea value={ptsCont} onChange={(e) => setPtsCont(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'grid row-span-2 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>Next Planned<br />Activities</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2 ' + labelClasses}>
                    COMMENT
                </div>
                <div className={'col-span-2 border-b h-15 ' + containerClasses}>
                    <Textarea value={ptsComment} onChange={(e) => setPtsComment(e.target.value)} className={textareaClasses} />
                </div>

                {/* Column 6 */}
                <div className={`col-start-[6] row-4 ${containerClasses} ${inputWidth}`}>
                    <StringSelector options={greenRed} value={overallStatus} onChange={setOverallStatus} required={true} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={soc} onChange={(e) => setSoc(e.target.value)} />
                </div>
                <div className={containerClasses}>
                    <Input type="text" className={inputClasses} value={busV} onChange={(e) => setBusV(e.target.value)} />
                </div>
                <div className={'row-span-3 ' + containerClasses}>
                    <Textarea value={plStatus} onChange={(e) => setPlStatus(e.target.value)} className={textareaClasses} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={onOffNokValues} value={pdhu1} onChange={setPdhu1} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={onOffNokValues} value={pdhu2} onChange={setPdhu2} required={false} />
                </div>
                <div className={containerClasses}>
                    <StringSelector options={onOffNokValues} value={pdhu3} onChange={setPdhu3} required={false} />
                </div>
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={ptsAct1} onChange={(e) => setPtsAct1(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'h-15 ' + containerClasses}>
                    <Textarea value={ptsAct2} onChange={(e) => setPtsAct2(e.target.value)} className={textareaClasses} />
                </div>


                {/* Column 7 */}
                <div className={'col-start-[7] col-span-2 row-span-2'}>
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
                <div className={labelClasses}>
                    S@Home
                </div>
                <div className={labelClasses}>
                    AFD
                </div>
                <div className={labelClasses}>
                    ProToS
                </div>
                <div className={labelClasses}>
                    MOPS
                </div>
                <div className={`col-span-2 border-r ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    KMF
                </div>
                <div className={`col-span-2 border-r ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    SGO
                </div>
                <div className={`col-span-2 border-r ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    MPS
                </div>
                <div className={`col-span-2 border-r ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={labelClasses}>
                    FDS
                </div>
                <div className={labelClasses}>
                    OD based on
                </div>
                <div className={`col-span-2 row-span-7 border-r ` + labelClasses}>
                    &nbsp;
                </div>
                <div className={'col-span-2 border-r ' + labelClasses}>
                    CONTINGENCY
                </div>
                <div className={'col-span-2 border-r ' + containerClasses}>
                    <Textarea value={grdCont} onChange={(e) => setGrdCont(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'grid row-span-2 ' + labelClasses}>
                    <div className='col-1 row-1 row-span-2'>Next Planned<br />Activities</div>
                    <div className='col-2 row-1 text-right'>1</div>
                    <div className='col-2 row-2 text-right'>2</div>
                </div>
                <div className={'col-span-2 border-r ' + labelClasses}>
                    COMMENT
                </div>
                <div className={'col-span-2 border-b border-r h-15 ' + containerClasses}>
                    <Textarea value={grdComment} onChange={(e) => setGrdComment(e.target.value)} className={textareaClasses} />
                </div>

                {/* Column 8 */}
                <div className={`border-r ${containerClasses} ${inputWidth}`}>
                    <StringSelector options={okNokValues} value={geccos} onChange={setGeccos} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={opsWeb} onChange={setOpsWeb} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={satmon} onChange={setSatmon} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={sAtHome} onChange={setSAtHome} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={afd} onChange={setAfd} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={protos} onChange={setProtos} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={mops} onChange={setMops} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={kmf} onChange={setKmf} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={sgo} onChange={setSgo} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={mps} onChange={setMps} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={okNokValues} value={fds} onChange={setFds} required={false} />
                </div>
                <div className={'border-r ' + containerClasses}>
                    <StringSelector options={odValues} value={odBasedOn} onChange={setOdBasedOn} required={false} />
                </div>
                <div className={'h-15 border-r ' + containerClasses}>
                    <Textarea value={grdAct1} onChange={(e) => setGrdAct1(e.target.value)} className={textareaClasses} />
                </div>
                <div className={'h-15 border-r ' + containerClasses}>
                    <Textarea value={grdAct2} onChange={(e) => setGrdAct2(e.target.value)} className={textareaClasses} />
                </div>





            </div>
        </form>
    );
}
