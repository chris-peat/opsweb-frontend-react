import { Constants,Matrix,Vector } from "@heavens-above/astrolib-ts";

enum ProjectionType {
    Geographic = 0,
    Parallel = 1
}

export class DrawingHelpers {
    
    static drawCurve(ctx: CanvasRenderingContext2D, ptsa: number[], tension?: number, isClosed?: boolean, numOfSegments?: number, showPoints?: boolean) {

        showPoints = showPoints ? showPoints : false;

        ctx.beginPath();

        DrawingHelpers.drawLines(ctx, DrawingHelpers.getCurvePoints(ptsa, tension, isClosed, numOfSegments));

        if (showPoints) {
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < ptsa.length - 1; i += 2)
                ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
        }
    }

    static drawLines(ctx: CanvasRenderingContext2D, pts: number[]) {
        ctx.moveTo(pts[0], pts[1]);
        for (let i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    }

    static getCurvePoints(pts: number[], tension?: number, isClosed?: boolean, numOfSegments?: number): number[] {

        // use input value if provided, or use a default value   
        tension = (typeof tension != 'undefined') ? tension : 0.5;
        isClosed = isClosed ? isClosed : false;
        numOfSegments = numOfSegments ? numOfSegments : 16;

        let _pts = [], res = [],    // clone array
            x, y,           // our x,y coords
            t1x, t2x, t1y, t2y, // tension vectors
            c1, c2, c3, c4,     // cardinal points
            st, t, i;       // steps based on num. of segments

        // clone array so we don't change the original
        //
        _pts = pts.slice(0);

        // The algorithm require a previous and next point to the actual point array.
        // Check if we will draw closed or open curve.
        // If closed, copy end points to beginning and first points to end
        // If open, duplicate first points to befinning, end points to end
        if (isClosed) {
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.push(pts[0]);
            _pts.push(pts[1]);
        }
        else {
            _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
            _pts.unshift(pts[0]);
            _pts.push(pts[pts.length - 2]); //copy last point and append
            _pts.push(pts[pts.length - 1]);
        }

        // ok, lets start..

        // 1. loop goes through point array
        // 2. loop goes through each segment between the 2 pts + 1e point before and after
        for (i = 2; i < (_pts.length - 4); i += 2) {
            for (t = 0; t <= numOfSegments; t++) {

                // calc tension vectors
                t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
                t2x = (_pts[i + 4] - _pts[i]) * tension;

                t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
                t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

                // calc step
                st = t / numOfSegments;

                // calc cardinals
                c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
                c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
                c4 = Math.pow(st, 3) - Math.pow(st, 2);

                // calc x and y cords with common control vectors
                x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
                y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

                //store points in array
                res.push(x);
                res.push(y);

            }
        }

        return res;
    }

    /** Draws a 2-dimensional arrow
     * @param  ctx      the 2D drawing context
     * @param  pointx   the x coordinate of the arrow point
     * @param  pointy   the y coordinate of the arrow point
     * @param  angleFromXAxis   the angle of the arrow direction in degrees measured from the positive x-axis
     * @param  smallAngle   the half-angle of the arrow point in degrees
     * @param  largeAngle   the half-angle of the rear of the arrow head in degrees
     * @param  edgeLength   the length of the edge
    */
    static drawArrow(ctx: CanvasRenderingContext2D, pointx: number, pointy: number, angleFromXAxis: number, smallAngle: number, largeAngle: number, edgeLength: number) {
        ctx.moveTo(pointx, pointy);

        let rotMatrix = Matrix.fromRotationAboutAxis(2, angleFromXAxis * Constants.DEGTORAD);
        let radSmall = smallAngle * Constants.DEGTORAD;
        let radLarge = largeAngle * Constants.DEGTORAD;

        let x = -edgeLength * Math.cos(radSmall);
        let y = edgeLength * Math.sin(radSmall);
        let v = rotMatrix.multiplyVector(new Vector(x, y, 0));
        ctx.lineTo(pointx + v.x, pointy + v.y);

        let x2 = x;

        // compute x value of second point on y-axis
        if (largeAngle != 90) {
            x2 = x + y / Math.tan(radLarge);
        }

        v = rotMatrix.multiplyVector(new Vector(x2, 0, 0));
        ctx.lineTo(pointx + v.x, pointy + v.y);

        v = rotMatrix.multiplyVector(new Vector(x, -y, 0));
        ctx.lineTo(pointx + v.x, pointy + v.y);

        ctx.lineTo(pointx, pointy);
    }

    static drawGroundStation(ctx: CanvasRenderingContext2D, baseX: number, bottom: number, size: number) {

        let right = baseX + size / 4;

        // base
        ctx.beginPath();
        ctx.arc(right - size * 0.25, bottom, size * 0.25, 0, Math.PI, true);
        ctx.fill();

        // antenna dish
        ctx.beginPath();
        ctx.arc(right - size * 0.5, bottom - size * 0.5, size * 0.4, Math.PI * 1.75, Math.PI * 0.75, false);
        ctx.fill();

        // antenna feed
        ctx.beginPath();
        ctx.arc(right - size * 0.5, bottom - size * 0.5, size * 0.1, 0, Math.PI * 2, true);
        ctx.fill();

        // "radiation"
        for (let rOuter = size * 0.5; rOuter > size * 0.15; rOuter -= size / 8) {
            let rInner = rOuter - size / 16;
            ctx.beginPath();
            // ctx.moveTo(right - size / 2, bottom / 2 - size);
            ctx.arc(right - size * 0.5, bottom - size * 0.5, rOuter, Math.PI * 1.5, Math.PI, true);
            ctx.lineTo(right - size / 2 - rInner, bottom - size / 2);
            ctx.arc(right - size * 0.5, bottom - size * 0.5, rInner, Math.PI, Math.PI * 1.5, false);
            ctx.fill();
        }
    }

    static drawLocatorPin(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, angleFromXAxis: number, text: string, borderColor: string,
        fillColor: string, textColor: string) {
        let halfAngle = 0.5;
        let centrey = radius / Math.sin(halfAngle);
        let tangentx = radius * Math.cos(halfAngle);
        let tangenty = centrey - radius * Math.sin(halfAngle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 2 - angleFromXAxis);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(tangentx, - tangenty);
        ctx.arc(0, - centrey, radius, halfAngle, Math.PI - halfAngle, true);
        ctx.lineTo(0, 0);
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = borderColor;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        if (text) {
            ctx.save();
            ctx.translate(x + centrey * Math.cos(angleFromXAxis), y - centrey * Math.sin(angleFromXAxis));
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    }
}