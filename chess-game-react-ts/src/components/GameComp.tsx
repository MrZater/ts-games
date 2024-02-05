import React from "react";
import { ChessType, GameStatus } from "../types/enums";
import { BoardComp } from "./BoardComp";
import { GameStatusComp } from "./GameStatusComp";

interface IState {
    chesses: Array<ChessType>;
    isGameOver: GameStatus;
    nextChess: ChessType.red | ChessType.black;
}

export class GameComp extends React.Component<{}, IState> {
    state: Readonly<IState> = {
        chesses: [],
        isGameOver: GameStatus.gaming,
        nextChess: ChessType.black
    }
    /**
     * 初始化游戏
     */
    init() {
        const arr: ChessType[] = []
        for (let i = 0; i < 9; i++) {
            arr.push(ChessType.none)
        }
        this.setState({
            chesses: arr,
            isGameOver: GameStatus.gaming,
            nextChess: ChessType.black
        })
    }
    /**
     * 棋子被点击
     * @param i 棋子索引
     */
    handleChessClick(i: number) {
        const chesses: ChessType[] = [...this.state.chesses]
        chesses[i] = this.state.nextChess
        this.setState({
            chesses,
            nextChess: this.state.nextChess === ChessType.black ? ChessType.red : ChessType.black,
            isGameOver: this.getStatus(chesses, i)
        })
    }
    /**
     * 判断游戏状态
     * @param chesses 棋盘布局数组
     * @param i 棋子索引
     * @returns 
     */
    getStatus(chesses: ChessType[], i: number): GameStatus {
        // 1. 判断游戏是否有一方胜利
        const horMin = Math.floor(i / 3) * 3
        const verMin = i % 3
        if (
            // 横向
            chesses[horMin] === chesses[horMin + 1] && chesses[horMin] === chesses[horMin + 2]
            ||
            // 纵向
            chesses[verMin] === chesses[verMin + 3] && chesses[verMin] === chesses[verMin + 6]
            ||
            // 斜线
            (chesses[0] === chesses[4] && chesses[0] === chesses[8] && chesses[4] !== ChessType.none)
            ||
            (chesses[2] === chesses[4] && chesses[2] === chesses[6] && chesses[4] !== ChessType.none)
        ) {
            return this.state.nextChess === ChessType.black ? GameStatus.blackWin : GameStatus.redWin;
        }

        // 2.判断是否平局
        // 3.游戏继续
        const isEqual = chesses.findIndex(item => item === ChessType.none)
        return isEqual === -1 ? GameStatus.equal : GameStatus.gaming

    }
    componentDidMount(): void {
        this.init()
    }
    render(): React.ReactNode {
        return (
            <div style={{ textAlign: 'center' }}>
                <GameStatusComp status={this.state.isGameOver} nextChess={this.state.nextChess} />
                <BoardComp chesses={this.state.chesses} isGameOver={this.state.isGameOver !== GameStatus.gaming} onClick={(i) => {
                    this.handleChessClick(i)
                }} />
                <button onClick={() => {
                    this.init()
                }}>重新开始</button>
            </div>
        )
    }
}