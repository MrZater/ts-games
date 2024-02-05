import { Game } from "./Game"
import { SquareGroup } from "./SquareGroup"

// 坐标接口
export interface IPoint {
    readonly x: number  // x坐标
    readonly y: number  // y坐标
}
// 显示者接口
export interface IViewer {
    show(): void  // 显示
    remove(): void  // 移除
}
// 形状类型
export type Shape = IPoint[]  

// 移动方向枚举
export enum MoveDirection {
    left,  // 左移
    right,  // 右移
    down,  // 下移
}

// 游戏状态枚举
export enum GameStatus {
    init,
    playing,
    pause,
    over
}

export interface IGameViewer {
    /**
     * 
     * @param tetris 下一个方块对象
     */
    showNext (tetris:SquareGroup):void
    /**
     * 
     * @param tetris 下一个方块对象
     */
    switch(tetris:SquareGroup):void
    /**
     * 完成界面的初始化
     */
    init(game:Game):void
    /**
     * 显示分数
     * @param score 
     */
    showScore(score:number):void

    /**
     * 游戏暂停事件
     */
    onGamePause():void

    /**
     * 游戏开始事件
     */
    onGameStart():void

    /**
     * 游戏结束事件
     */
    onGameOver():void
}
