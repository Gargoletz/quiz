import React from 'react';

export default function IconButton(props) {
    return (
        <div className={"button " + (props.isDisabled ? "button--disabled" : props?.className)}
            onClick={() => { props.onClick() }}>
            <p>{props.title}</p>
            <img src={props.img} />
        </div>
    );
}
