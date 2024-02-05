import { IPoint, Shape } from "./types";
import { SquareGroup } from "./SquareGroup";
import { getRandom } from "./util";

// 俄罗斯方块形状
// 相对于中心点的坐标数组
// T
export class TShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
            _centerPoint,
            _color
            )
    }
}
// L
export class LShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }],
            _centerPoint,
            _color
            )
    }
}
// L
export class LMirrorShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }],
            _centerPoint,
            _color
            )
    }
}
// S
export class SShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            _centerPoint,
            _color
            )
    }
    rotate(): void {
        super.rotate()
        this.isClock = !this.isClock
    }
}

// S
export class SMirrorShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
            _centerPoint,
            _color
            )
    }
    rotate(): void {
        super.rotate()
        this.isClock = !this.isClock
    }
}

// 田
export class SquareShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            _centerPoint,
            _color
            )
    }
    afterRotateShape () {
        return this.shape
    }
}

// 一
export class LineShape extends SquareGroup {
    constructor(_centerPoint: IPoint, _color: string) {
        super(
            [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
            _centerPoint,
            _color
            )
    }
    rotate(): void {
        super.rotate()
        this.isClock = !this.isClock
    }
}

// 俄罗斯方块形状数组
export const shapes:(typeof TShape)[] = [
    TShape, LShape, LMirrorShape, SShape, SMirrorShape, SquareShape, LineShape
]
// 俄罗斯方块颜色数组
export const colors: string[] = ['red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple']

/**
 * 随机生成一个俄罗斯方块（形状随机，颜色随机）
 * @param centerPoint 
 */
export function createTetris(centerPoint: IPoint) {
    // 随机颜色，随机形状
    let index = getRandom(0, shapes.length)
    const shape = shapes[index]
    index = getRandom(0, shapes.length)
    const color = colors[index]
    return new shape(centerPoint, color)

}