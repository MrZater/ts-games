import { Square } from "../Square";
import $ from "jquery";
import { IViewer } from "../types";
import PagerConfig from "./PagerConfig";
/**
 * 小方块显示类
 */
export class SquarePagerViewer implements IViewer {
    // 显示者的dom元素(JQ对象)
    private dom?: JQuery<HTMLElement>;
    // 是否已被移除
    private isRemove: boolean = false
    /**
     * 
     * @param square 小方块实例
     * @param container 容器
     */
    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) {
    }
    // 显示者出现的方法
    show(): void {
        // 若该显示者已被移除，则不执行以下代码
        if (this.isRemove) {
            return
        }
        // 若第一次显示，则创建一个新的元素，设置样式加入到容器中
        if (!this.dom) {
            this.dom = $('<div>').css({
                position: 'absolute',
                width: PagerConfig.SquareSize.width,
                height: PagerConfig.SquareSize.height,
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
            }).appendTo(this.container)
        }
        // 设置小方块的位置
        this.dom.css({
            left: this.square.point.x * PagerConfig.SquareSize.width + 'px',
            top: this.square.point.y * PagerConfig.SquareSize.height + 'px',
            background: this.square.color
        })
    }
    /**
     * 小方块显示类的移除方法
     */
    remove(): void {
        if (this.dom && !this.isRemove) {
            this.dom.remove();
            this.isRemove = true
        }
    }
}