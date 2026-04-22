import PlotOverlay from "./plotOverlay";

export default function LegendContainer
    ({ width, children }: { width: number; children: React.ReactNode[] },) {
 
    return (
        <div className="relative">
            {children}
        </div>
    );
}
