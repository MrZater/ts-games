import { ChessType } from "../types/enums";
import { ChessComp } from "./ChessComp";
import './Board.css'

interface IProps {
    chesses: Array<ChessType>;
    onClick?: (index: number) => void;
    isGameOver: boolean;
}
export const BoardComp: React.FC<IProps> = function (props) {
    const list = props.chesses.map((type, index) => (<ChessComp type={type} key={index} onclick={() => {
        if (props.onClick && !props.isGameOver) {
            props.onClick(index)
        }
    }} />))
    return (
        <div className="board">
            {list}
        </div>
    )
}
BoardComp.defaultProps = {
    isGameOver: false
}
