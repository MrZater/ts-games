import { Square } from "./Square";
import { GameStatus, IGameViewer, MoveDirection } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { TetrisRule } from "./TetrisRule";
import { createTetris } from "./tetris";

/**
 * 游戏类，游戏控制
 */
export class Game {
    constructor(
        private _viewer: IGameViewer
    ) {
        // 初始化下落时间
        this._duration = GameConfig.levels[0].duration
        // 初始化_nextTetris,解决报错，无意义
        this._nextTetris = createTetris({ x: 0, y: 0 })
        // 生成下一个方块
        this.createNext()
        // 初始化游戏视图
        this._viewer.init(this)
        // 分数显示
        this._viewer.showScore(this._score)
    }
    // 游戏状态
    private _gameStatus: GameStatus = GameStatus.init
    public get gameStatus() {
        return this._gameStatus
    }
    // 当前玩家操作的方块
    private _curTetris?: SquareGroup
    // 下一个方块
    private _nextTetris: SquareGroup
    // 游戏分数
    private _score: number = 0
    private set score(val: number) {
        this._score = val
        // 分数改变，修改分数视图
        this._viewer.showScore(val)
        // 获取到当前分数所对应的游戏难度等级
        const level = GameConfig.levels.filter(level => level.score <= val).pop()!
        // 判断游戏等级是否需要改变
        if (this._duration === level.duration) {
            return
        }
        // 修改游戏难度等级，下落速度
        this._duration = level.duration
        if (this._timer) {
            // 清空计时器
            // 重新自动下落
            clearInterval(this._timer)
            this._timer = undefined
            this.autoDrop()
        }
    }
    private get score() {
        return this._score
    }
    // 已落下且未消除的小方块集合
    private _exists: Square[] = []
    /**
     * 创建下一个方块
     */
    private createNext() {
        this._nextTetris = createTetris({ x: 0, y: 0 })
        // 重制下一个的方块位置
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris)
        // 调用显示者中的显示下一个方块的方法
        this._viewer.showNext(this._nextTetris)
    }
    /**
     * 游戏重新开始时的初始化
     */
    private init() {
        // 分数重置
        this.score = 0
        // 小方块全部消除
        this._exists.forEach(sq => {
            sq.viewer?.remove()
        })
        // 小方块数组清空
        this._exists = []
        // 重新创建下一个方块
        this.createNext()
        this._curTetris = undefined
    }
    /**
     * 游戏开始
     */
    start() {
        // 游戏状态改变
        if (this._gameStatus === GameStatus.playing) {
            return
        }
        // 从游戏结束到开始
        if (this._gameStatus === GameStatus.over) {
            // 初始化操作
            this.init()
        }
        // 修改状态
        this._gameStatus = GameStatus.playing
        // 若当前方块为空，将下一个方块切换为当前方块
        if (!this._curTetris) {
            this.switchTetris()
        }
        // 自动下落
        this.autoDrop()
        this._viewer.onGameStart()
    }
    /**
     * 游戏暂停
     */
    pause() {
        // 若游戏正在进行中
        if (this._gameStatus === GameStatus.playing) {
            // 修改状态
            this._gameStatus = GameStatus.pause
            // 清除计时器
            clearInterval(this._timer)
            this._timer = undefined
            this._viewer.onGamePause()
        }
    }
    /**
     * 向左操作
     */
    controlLeft() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRule.move(this._curTetris, MoveDirection.left, this._exists)
        }
    }
    /**
     * 向右操作
     */
    controlRight() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRule.move(this._curTetris, MoveDirection.right, this._exists)
        }
    }
    /**
     * 向下操作
     */
    controlDown() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRule.moveDirectly(this._curTetris, MoveDirection.down, this._exists)
            this.hitBottom()
        }
    }
    /**
     * 旋转操作
     */
    controlRotate() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRule.rotate(this._curTetris, this._exists)
        }
    }
    // 计时器
    private _timer?: number
    // 下落间隔
    private _duration: number
    // 自动下落
    private autoDrop() {
        if (this._timer || this._gameStatus !== GameStatus.playing) {
            return
        }
        this._timer = setInterval(() => {
            if (this._curTetris) {
                if (!TetrisRule.move(this._curTetris, MoveDirection.down, this._exists)) {
                    // 触底
                    this.hitBottom()
                }
            }
        }, this._duration);
    }
    /**
     * 将下一个方块转化成当前方块，并生成新的下一个方块
     */
    switchTetris() {
        // 切换当前方块
        this._curTetris = this._nextTetris
        this._curTetris.squares.forEach(item => {
            item.viewer?.remove()
        })
        // 位置自适应
        // 面板
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTetris)
        if (!TetrisRule.canIMove(this._curTetris.shape, this._curTetris.centerPoint, this._exists)) {
            this._gameStatus = GameStatus.over
            clearInterval(this._timer)
            this._timer = undefined
            this._viewer.onGameOver()
            return
        }
        this.createNext()
        // 显示者切换
        this._viewer.switch(this._curTetris)
    }
    /**
     * 设置中心点坐标，以达到让方块出现在区域的中上方
     * @param width 
     * @param height 
     */
    private resetCenterPoint(width: number, tetris: SquareGroup) {
        const x = Math.ceil(width / 2) - 1
        const y = 0
        tetris.centerPoint = { x, y }
        while (tetris.squares.some(it => it.point.y < 0)) {
            tetris.centerPoint = {
                x: tetris.centerPoint.x,
                y: tetris.centerPoint.y + 1
            }
        }
    }
    hitBottom() {
        this._exists = this._exists.concat(this._curTetris!.squares)
        const num = TetrisRule.deleteSquares(this._exists)
        this.addScore(num)
        this.switchTetris()
    }
    private addScore(lineNum: number) {
        if (lineNum > 0) {
            // 移除过
            if (lineNum === 4) {
                this.score += 80
            } else if (lineNum === 3) {
                this.score += 50
            } else if (lineNum === 2) {
                this.score += 30
            } else {
                this.score += 10
            }
        }
    }

}