import { Link, NavLink } from 'react-router'

/** A hyperlink to an OpsWeb report */
export default function ReportNavLink({ projectId, type, number, numDigits = 5 }: { projectId: string, type: string, number: number, numDigits?: number }) {
    const paddedNumber = number.toString().padStart(numDigits, '0');
    const anchorText = `${type}-${paddedNumber}`;
    const classes = "text-blue-700 hover:underline";
    switch (type) {
        case "SHL":
            return <Link to={`/project/:${projectId}/shift-handover-logs/:${number}`} className={classes}>{anchorText}</Link>
        // case "PL":
        //     return <NavLink to={"https://opsweb.gsoc.dlr.de/PassLog_Show.aspx?prj=" + projectId + "&nid=" + number}>{anchorText}</NavLink>
        case "RI":
             return <Link to={`https://opsweb.gsoc.dlr.de/Recommendations_Show.aspx?prj=${projectId}&nid=${number}`} className={classes}>{anchorText}</Link>
        case "OL":
             return <Link to={`https://opsweb.gsoc.dlr.de/OpsLog_Show.aspx?prj=${projectId}&nid=${number}`} className={classes}>{anchorText}</Link>
        default:
            return <span>Unknown report type: {type}</span>
    }
}
