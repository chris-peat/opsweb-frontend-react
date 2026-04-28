import PlotOverlay from "./plotOverlay";

export default function PlotContainer
    ({ width, startTime, duration, children }: { width: number; startTime: Date; duration: number; children: React.ReactNode[] },) {

    // height is derived from children
    let height = 0;
    for (let child of children) {
        let childElement = child as React.ReactElement;
        if (childElement && childElement.props && (childElement.props as any).height) {
            height += (childElement.props as any).height;
        }
    }

    return (
        <div className="relative">
            {children}
        </div>
    );
}
