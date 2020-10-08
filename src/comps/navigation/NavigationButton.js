import React from 'react';

export function NavigationButton(props) {
    return (
        <div className={"nav-button " + (props.active ? "--active" : "")}
            onClick={() => { props.change(props.value); }}>
            <img src={props.icon} alt="" />
            <p>{props.title}</p>
        </div>
    );
}