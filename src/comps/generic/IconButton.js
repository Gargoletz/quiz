import React, { useEffect, useState } from 'react';

export default function IconButton(props) {
    let [active, setActive] = useState(false);

    useEffect(() => {
        document.addEventListener("mouseup", () => setActive(false));
        document.addEventListener("touchend", () => setActive(false));
    });

    return (
        <div className={"button " + (props.isDisabled ? "button--disabled" : props?.className)}
            style={active ? { color: "white", backgroundColor: props.color || "", borderColor: props.color || '', ...props.style } : { borderColor: props.color || '', color: props.color || '', ...props.style }}
            onMouseDown={() => setActive(true && !props?.isDisabled)}
            onTouchStart={() => setActive(true && !props?.isDisabled)}
            onClick={() => { if (!props.isDisabled) props.onClick() }}>
            <p>{props.title}</p>
            <img src={props.img} />
        </div>
    );
}
