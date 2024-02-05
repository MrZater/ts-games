import { IPoint, IViewer } from "./types"

/**
 * 小方块类
 */
export class Square {
    // 逻辑坐标
    private _point: IPoint = {
        x: 0,
        y: 0
    }
    // 颜色
    private _color: string = ''
    // 显示者（传人）
    // 需要使用该实例数据渲染的对象
    private _viewer?: IViewer

    // 显示者
    public get viewer(): IViewer | undefined {
        return this._viewer
    }
    public set viewer(val: IViewer | undefined) {
        if (val){
            // 若显示者有值，则调用其show方法，显示出来
            val.show()
        }
        this._viewer = val
    }
    
    // 坐标
    public get point(): IPoint {
        return this._point
    }
    public set point(val: IPoint) {
        this._point = val
        // 坐标修改后，完成显示
        if (this.viewer) {
            this.viewer.show()
        }
    }
    // 颜色
    public get color(): string {
        return this._color
    }
    public set color(val) {
        this._color = val
    }
}