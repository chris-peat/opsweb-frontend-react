import { Link, NavLink } from 'react-router'

/** A hyperlink to an OpsWeb report */
export default function ReportNavLink({ projectId, type, number, numDigits = 5 }: { projectId: string, type: string, number: number, numDigits?: number }) {
    const paddedNumber = number.toString().padStart(numDigits, '0');
    const anchorText = `${type}-${paddedNumber}`;
    const classes = "text-blue-700 hover:underline";
    switch (type) {
        case "SHL":
            return <Link to={`/project/:${projectId}/shift-handover-logs/:${number}`} className={classes}>{anchorText}</Link>
        case "RI":
             return <Link to={`${window.__APP_CONFIG__.legacyRootUrl}/Recommendations_Show.aspx?prj=${projectId}&nid=${number}`} className={classes}>{anchorText}</Link>
        case "OL":
             return <Link to={`${window.__APP_CONFIG__.legacyRootUrl}/OpsLog.aspx?prj=${projectId}&project=${projectId}&id=L-${number}`} className={classes}>{anchorText}</Link>
        default:
            return <span>Unknown report type: {type}</span>
    }
}
