interface IProfilePlotLineDef {
    lineColor: string;
    fillColor: string;
    profileFunction: (time: number) => number;
}