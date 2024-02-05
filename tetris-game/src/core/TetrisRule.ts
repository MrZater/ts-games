import { Square } from "./Square";
import { IPoint, MoveDirection, Shape } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
/**
 * 该函数中提供一系列的函数，根据游戏规则判断各种情况
 */
export class TetrisRule {
    static canIMove(shape: Shape, targetPoint: IPoint, exists: Square[]): boolean {
        // 假设方块已经移动到目标位置
        // 算出目标位置的坐标集合
        // 若只要有一个超出边界就不允许移动
        const targetSquarePoints: IPoint[] = shape.map(s => {
            return {
                x: s.x + targetPoint.x,
                y: s.y + targetPoint.y
            }
        })
        // 判断所有的点中有没有任何一个超出边界
        let result = targetSquarePoints.some(p => {
            return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1
        })
        if (result) {
            return false
        }
        // 判断是否与已有方块重叠
        result = targetSquarePoints.some(p => exists.some(sq => sq.point.x === p.x && sq.point.y === p.y))
        if (result) {
            return false
        }
        return true
    }
    /**
     * IPoint的类型保护函数，返回是否是IPoint类型
     * @param obj 
     * @returns 
     */
    static isPoint(obj: any): obj is IPoint {
        if (typeof obj.x === 'undefined') {
            return false
        }
        return true
    }
    // 函数重载
    /**
     * 
     * @param tetris 
     * @param targetPoint 目标位置
     */
    static move(tetris: SquareGroup, targetPoint: IPoint, exists: Square[]): boolean
    /**
     * 
     * @param tetris 
     * @param direction 移动方向
     */
    static move(tetris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean
    /**
     * 通过判断第二个参数的类型进行小方块移动判断和移动
     * @param tetris 方块集合实例
     * @param targetPointOrDirection 方向 或 目标位置
     * @returns 
     */
    static move(tetris: SquareGroup, targetPointOrDirection: IPoint | MoveDirection, exists: Square[]): boolean {
        // 判断第二个参数类型
        if (this.isPoint(targetPointOrDirection)) {
            // 作用一： 通过canIMove判断是否可以移动并返回boolean
            if (TetrisRule.canIMove(tetris.shape, targetPointOrDirection, exists)) {
                tetris.centerPoint = targetPointOrDirection
                return true
            } else {
                return false
            }
        } else {
            // 作用二：通过移动方向，得到移动目标位置，调用作用二
            const direction = targetPointOrDirection
            let targetPoint
            // 向下
            if (direction === MoveDirection.down) {
                targetPoint = {
                    x: tetris.centerPoint.x,
                    y: tetris.centerPoint.y + 1
                }
            } else if (direction === MoveDirection.left) {
                // 向左
                targetPoint = {
                    x: tetris.centerPoint.x - 1,
                    y: tetris.centerPoint.y
                }
            } else if (direction === MoveDirection.right) {
                // 向右
                targetPoint = {
                    x: tetris.centerPoint.x + 1,
                    y: tetris.centerPoint.y
                }
            } else {
                // 其他情况保持不变
                targetPoint = tetris.centerPoint
            }
            return this.move(tetris, targetPoint, exists)
        }
    }
    /**
     * 持续移动直到到达边界的方法
     * @param tetris 小方块集合实例
     * @param direction 移动方向
     */
    static moveDirectly(tetris: SquareGroup, direction: MoveDirection, exists: Square[]) {
        while (this.move(tetris, direction, exists)) { }
    }
    /**
     * 判断旋转是否允许方法
     * @param tetris 
     * @returns 
     */
    static rotate(tetris: SquareGroup, exists: Square[]): boolean {
        const newShape = tetris.afterRotateShape()
        if (this.canIMove(newShape, tetris.centerPoint, exists)) {
            tetris.rotate()
            return true
        } else {
            return false
        }
    }
    /**
 * 消除满行的小方块
 * @param exists 当前游戏中的所有小方块
 */
    static deleteSquares(exists: Square[],): number {
        // 得到y坐标数组
        const ys = exists.map(item => item.point.y)
        // 得到最大值最小值的y坐标
        const maxY = Math.max(...ys)
        const minY = Math.min(...ys)
        // 循环判断每一行是否需要消除
        let num = 0
        for (let y = minY; y <= maxY; y++) {
            if (this.deleteLine(exists, y)) {
                num++
            }
        }
        return num
    }

    /**
     * 消除指定行
     * @param exists 
     * @param y 
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter(item => item.point.y === y)
        if (squares.length === GameConfig.panelSize.width) {
            // 该行可消除
            squares.forEach(sq => {
                // 1. 从界面移除
                sq.viewer?.remove()
                const index = exists.indexOf(sq)
                exists.splice(index,1)
            })
             // 2. 剩下的比当前的y小的方块纵坐标+1
                exists.filter(item => item.point.y < y).forEach(sq => {
                    sq.point = {
                        x: sq.point.x,
                        y: sq.point.y + 1
                    }
                })
            return true
        }
        return false
    }

}