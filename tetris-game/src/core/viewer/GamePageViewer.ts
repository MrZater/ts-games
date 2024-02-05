import { GameStatus, IGameViewer } from "../types";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PagerConfig from "./PagerConfig";
import { SquareGroup } from "../SquareGroup";
import { SquarePagerViewer } from "./SquarePageViewer";
import $ from 'jquery'
export class GamePageViewer implements IGameViewer {
    onGamePause(): void {
        this.msgDom.css({
            display: 'flex'
        })
        this.msgDom.find('p').html('游戏暂停！')
    }
    onGameStart(): void {
        this.msgDom.hide()
    }
    onGameOver(): void {
        this.msgDom.css({
            display: 'flex'
        })
        this.msgDom.find('p').html('游戏结束！')
    }
    private panelDom = $('#panel')
    private nextDom = $('#next')
    private scoreDom = $('#score')
    private msgDom = $('#msg')
    // 显示者显示下一个方块
    showNext(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer = new SquarePagerViewer(sq, this.nextDom)
        })
    }
    // 显示者切换下一个方块至当前方块
    switch(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer?.remove()
            sq.viewer = new SquarePagerViewer(sq, this.panelDom)
        })
    }
    init(game: Game): void {
        // 设置区域宽高
        this.panelDom.css({
            width: GameConfig.panelSize.width * PagerConfig.SquareSize.width,
            height: GameConfig.panelSize.height * PagerConfig.SquareSize.height
        })
        this.nextDom.css({
            width: GameConfig.nextSize.width * PagerConfig.SquareSize.width,
            height: GameConfig.nextSize.height * PagerConfig.SquareSize.height
        })
        // 注册键盘事件
        $(document).keydown((e) => {
            if (e.keyCode === 37) {
                game.controlLeft()
            }
            else if (e.keyCode === 38) {
                game.controlRotate()
            }
            else if (e.keyCode === 39) {
                game.controlRight()
            }
            else if (e.keyCode === 40) {
                game.controlDown()
            } else if (e.keyCode === 32) {
                if (game.gameStatus === GameStatus.playing) {
                    game.pause()
                } else {
                    game.start()
                }
            }
        })
    }
    showScore(score: number) {
        this.scoreDom.html(score.toString())
    }
}