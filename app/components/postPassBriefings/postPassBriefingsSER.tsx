import { useEffect, useState } from 'react'
import { useOpsWebContext } from '~/routes/layout';
import type { IGenericReport } from '~/models/genericReport';
import { getClient } from '~/apollo';
import { NavLink, useNavigate } from 'react-router';
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

    const titleClasses = project + "-secondary items-left align-middle px-2 text-base";
    const buttonClasses = project + "-primary items-center justify-center px-2 py-1 my-2 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:cursor-pointer hover:brightness-90 focus:outline-none";

    useEffect(() => {
        let apolloClient = getClient();
        apolloClient.query({
            query: SELECT_GENERIC_REPORTS,
            variables: {
                projectId: project,
                input: {
                    type: "PPB",
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
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
            <table className="table-auto border">
                <thead>
                    <tr className={titleClasses}>
                        <th className="border px-1">Creation Date</th>
                        <th className="border px-1">Created by</th>
                    </tr>
                </thead>
                <tbody className="">
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td className="border text-left px-1"><NavLink to={`../post-pass-briefings/:${report.number}`}>{report.creationDate ? formatDateTime(new Date(report.creationDate)) : ""}</NavLink></td>
                            <td className="border text-left px-1">{report.creator.name}</td>
                                    {/* <td className="border text-left px-1">{report.detail?.comments}</td> */}
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
