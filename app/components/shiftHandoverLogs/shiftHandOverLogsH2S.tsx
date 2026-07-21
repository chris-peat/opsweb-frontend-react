import { useEffect, useState } from 'react'
import { useOpsWebContext } from '~/routes/layout';
import type { IGenericReport } from '~/models/genericReport';
import { getClient } from '~/apollo';
import { NavLink, useNavigate } from 'react-router';
import { SELECT_GENERIC_REPORTS } from '~/graphQLQueries';
import { Button } from '@headlessui/react';
import { Pagination } from '../pagination';
import StatusColorSelector from '../statusColorSelector';


export default function ShiftHandoverLogsH2S() {
    const { project, user } = useOpsWebContext();
    const [reports, setReports] = useState<IGenericReport[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / pageSize);

    const titleClasses = project + "-secondary items-left align-middle px-2 text-base";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 my-2 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none";

    useEffect(() => {
        let apolloClient = getClient();
        apolloClient.query({
            query: SELECT_GENERIC_REPORTS,
            variables: {
                projectId: project,
                input: {
                    type: "SHL",
                    paging: {
                        skip: (page - 1) * pageSize,
                        take: pageSize
                    },
                }
            }
        })
            .then((data) => {
                if (!data.data?.project?.genericReports || data.data.project.genericReports.total === 0) {
                    setTotalItems(0);
                    setReports([]);
                    return;
                }

                let reports = data.data.project.genericReports.reports.map((report: any) => {
                    let detail: any = null;
                    try {
                        detail = JSON.parse(report.detail);
                    } catch (error) {
                        //console.error("Error parsing report detail:", error);
                    }
                    return {
                        id: report.id,
                        number: report.number,
                        type: report.type,
                        detail,
                        creationDate: report.creationDate,
                        creator: {
                            id: report.creator.id,
                            name: report.creator.name,
                        }
                    }
                }) as IGenericReport[];

                setTotalItems(data.data.project.genericReports.total);
                setReports(reports);
            })
            .catch((error) => console.error(error));
    }, [pageSize, page]);

    let navigate = useNavigate();

    function onCreateNew() {
        navigate(`../shift-handover-logs/:0`);
    }

    function getColor(...stati: string[]) {
        if (stati.findIndex((s) => s == "red") >= 0)
            return "red";
        if (stati.findIndex((s) => s == "yellow") >= 0)
            return "yellow";
        return "green"
    }

    function getSCColor(detail: any) {
        if (!detail) return "gray";
        return getColor(detail.acs, detail.thm, detail.cpps, detail.bdh, detail.epps, detail.cry, detail.pwr, detail.ttr);
    }
    
    function getPayloadColor(detail: any) {
        if (!detail) return "gray";
        return getColor(detail.wt, detail.mil);
    }

    function getSsuColor(detail: any) {
        if (!detail) return "gray";
        return getColor(detail.ssu, detail.gcuPrime, detail.gcuBackup);
    }

    return (
        <div>
            <Button className={buttonClasses} onClick={onCreateNew}>
                Create new Shift Handover Log
            </Button>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1); // reset to page 1 when page size changes
                }}
            />
            <table className="table-auto border">
                <thead>
                    <tr className={titleClasses}>
                        <th className="border px-1">Created</th>
                        <th className="border px-1">Shift</th>
                        <th className="border px-1">Operator</th>
                        <th className="border px-1">Spacecraft</th>
                        <th className="border px-1">Payload</th>
                        <th className="border px-1">SSU / GCU</th>
                        <th className="border px-1">Notes</th>
                    </tr>
                </thead>
                <tbody className="">
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td className="border text-left px-1"><NavLink to={`../shift-handover-logs/:${report.number}`}>{report.creationDate ? formatDateTime(new Date(report.creationDate)) : ""}</NavLink></td>
                            <td className="border text-left px-1">{report.detail?.shift}</td>
                            <td className="border text-left px-1">{report.creator.name}</td>
                            <td className={`border py-0 px-0 bg-${getSCColor(report.detail)}-300`}></td>
                            <td className={`border py-0 px-0 bg-${getPayloadColor(report.detail)}-300`}></td>
                            <td className={`border py-0 px-0 bg-${getSsuColor(report.detail)}-300`}></td>
                            <td className="border text-left px-1">{report.detail?.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function formatDateTime(dt: Date): string {
    let s = dt.toISOString();
    s = s.replace("T", " ");
    s = s.replace("Z", "");
    return s.substring(0, 16);
}
