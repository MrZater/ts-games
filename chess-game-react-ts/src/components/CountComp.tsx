import React from "react"

interface IProps {
    num: number,
    onChange?: (num: number) => void,
    children?: any
}

export const CountComp: React. FC<IProps> = function (props) {
    const slot = props.children ? (<div>{props.children}</div>) : undefined
    return (<div>
        {slot}
        <button onClick={() => {
            if (props.onChange) {
                props.onChange(props.num - 1)
            }
        }}>-</button>
        <span>{props.num}</span>
        <button onClick={() => {
            if (props.onChange) {
                props.onChange(props.num + 1)
            }
        }}>+</button>
    </div>)
}