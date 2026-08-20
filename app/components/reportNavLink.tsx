import { NavLink } from 'react-router'

/** A hyperlink to an OpsWeb report */
export default function ReportNavLink({ projectId, type, number, numDigits = 5 }: { projectId: string, type: string, number: number, numDigits?: number }) {
    const paddedNumber = number.toString().padStart(numDigits, '0');
    const anchorText = `${type}-${paddedNumber}`;
    switch (type) {
        case "SHL":
            return <NavLink to={`/project/:${projectId}/shift-handover-logs/:${number}`}>{anchorText}</NavLink>
        // case "PL":
        //     return <NavLink to={"https://opsweb.gsoc.dlr.de/PassLog_Show.aspx?prj=" + projectId + "&nid=" + number}>{anchorText}</NavLink>
        case "RI":
             return <NavLink to={`https://opsweb.gsoc.dlr.de/Recommendations_Show.aspx?prj=${projectId}&nid=${number}`}>{anchorText}</NavLink>
        default:
            return <span>Unknown report type: {type}</span>
    }
}
