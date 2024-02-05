import { ChessType } from "../types/enums";
import './chess.css'
interface IProps {
    type: ChessType,
    onclick?: () => void
}
export function ChessComp({ type, onclick }: IProps) {
    let chess = null
    if (type === ChessType.red) { 
        chess = (<div className="red chess-item"></div>)
     }else if(type === ChessType.black){
        chess = (<div className="black chess-item"></div>)
     }
    return (
        <div className="chess" onClick={()=> {
            if(type === ChessType.none && onclick){
                onclick()
            }
        }}>
            {chess}
        </div>
    )
}