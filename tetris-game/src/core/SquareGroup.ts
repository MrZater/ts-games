import { Square } from "./Square";
import { IPoint, Shape } from "./types";

/**
 * 方块组合类
 */
export class SquareGroup {
    // 方块数组
    private _squares: readonly Square[]
    public get squares() {
        return this._squares
    }
    public get shape() {
        return this._shape
    }
    /**
     * 
     * @param _shape 形状
     * @param _centerPoint 中心点坐标
     * @param _color 颜色
     */
    constructor(private _shape: Shape, private _centerPoint: IPoint, private _color: string) {
        // 以中心点为起始坐标，获取所有方块的坐标
        const arr: Square[] = []
        this._shape.forEach(s => {
            const sq = new Square()
            sq.color = this._color
            arr.push(sq)
        })
        this._squares = arr
        this.setSquarePoints()
    }
    public get centerPoint(): IPoint {
        return this._centerPoint
    }
    public set centerPoint(val: IPoint) {
        this._centerPoint = val
        // 设置中心点时，需要重新设置每个方块的坐标
        this.setSquarePoints()
    }
    /**
     * 设置每个小方块的坐标
     */
    private setSquarePoints() {
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }
    /**
     * 旋转方向
     */
    protected isClock = false
    /**
     * 旋转小方块集合
     * @returns 新的旋转
     */
    public afterRotateShape(): Shape {
        let newShape = []
        if (this.isClock) {
            newShape = this._shape.map(item => {
                return {
                    x: -item.y,
                    y: item.x
                }
            })
        } else {
            newShape = this._shape.map(item => {
                return {
                    x: item.y,
                    y: -item.x
                }
            })
        }
        return newShape
    }
    /**
     * 方块旋转
     */
    rotate() {
        const newShape = this.afterRotateShape()
        this._shape = newShape
        this.setSquarePoints()
    }
}