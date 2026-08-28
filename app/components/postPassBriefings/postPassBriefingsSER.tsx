import { useEffect, useRef, useState } from 'react'
import { useOpsWebContext } from '~/routes/layout';
import type { IGenericReport } from '~/models/genericReport';
import { getClient } from '~/apollo';
import { useNavigate } from 'react-router';
import { SELECT_GENERIC_REPORTS } from '~/graphQLQueries';
import { Button } from '@headlessui/react';
import { Pagination } from '../pagination';


export default function PostPassBriefingsSER() {
    const { project, user } = useOpsWebContext();
    const [reports, setReports] = useState<IGenericReport[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / pageSize);
    const initializedRef = useRef(false);

    const titleClasses = project + "-secondary items-left align-middle px-2 text-base";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 my-2 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none";

    useEffect(() => {
        let apolloClient = getClient();

        const remainder = totalItems % pageSize;
        const skip = page === 1
            ? 0
            : (remainder === 0 ? (page - 1) * pageSize : remainder + (page - 2) * pageSize);
        const take = page === 1
            ? (remainder === 0 ? pageSize : remainder)
            : pageSize;

        apolloClient.query({
            query: SELECT_GENERIC_REPORTS,
            variables: {
                projectId: project,
                input: {
                    type: "PPB",
                    paging: {
                        skip,
                        take
                    },
                    sorting: {
                        fieldName: "number",
                        order: "ASC"
                    }
                }
            }
        })
            .then((data) => {
                if (!data.data?.project?.genericReports || data.data.project.genericReports.total === 0) {
                    initializedRef.current = true;
                    setTotalItems(0);
                    setReports([]);
                    return;
                }

                const total = data.data.project.genericReports.total;
                const lastPage = Math.max(1, Math.ceil(total / pageSize));

                if (!initializedRef.current && page !== lastPage) {
                    initializedRef.current = true;
                    setTotalItems(total);
                    setPage(lastPage);
                    return;
                }
                initializedRef.current = true;

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

                setTotalItems(total);
                setReports(reports);
            })
            .catch((error) => console.error(error));
    }, [pageSize, page]);

    let navigate = useNavigate();

    function onCreateNew() {
        navigate(`../post-pass-briefings/:0`);
    }

    return (
        <div>
            <Button className={buttonClasses} onClick={onCreateNew}>
                Create new Post Pass Briefing
            </Button>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                pageSize={pageSize}
                pagingAnchor="end"
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    const newTotalPages = totalItems > 0 ? Math.ceil(totalItems / size) : 0;
                    setPage(newTotalPages > 0 && page > newTotalPages ? newTotalPages : page);
                }}
            />
            <table className="table-auto border">
                <thead>
                    <tr className={titleClasses}>
                        <th className="border px-1">#</th>
                        <th className="border px-1">Briefing time</th>
                        <th className="border px-1">Briefed by</th>
                        <th className="border px-1">Pass AOS</th>
                        <th className="border px-1">Pass LOS</th>
                        <th className="border px-1">Station</th>
                    </tr>
                </thead>
                <tbody className="">
                    {reports.map((report) => (
                        <tr
                            key={report.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate(`../post-pass-briefings/:${report.number}`)}
                        >
                            <td className="border text-right px-1">{report.number}</td>
                            <td className="border text-left px-1">{report.detail?.briefingTime ?? "???"}</td>
                            <td className="border text-left px-1">{report.detail?.briefedBy}</td>
                            <td className="border text-left px-1">{report.detail?.aos}</td>
                            <td className="border text-left px-1">{report.detail?.los}</td>
                            <td className="border text-left px-1">{report.detail?.station}</td>
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
