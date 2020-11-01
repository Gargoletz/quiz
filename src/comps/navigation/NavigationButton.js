import React, { useContext } from 'react';

import AppContext from '../../AppContext';

export function NavigationButton(props) {
    let { screen, changeScreen } = useContext(AppContext);

    return (
        <button className={(screen === props.value ? "--active" : "")}
            onClick={() => { changeScreen(props.value); }}>
            <img src={props.icon} draggable={false} alt="" />
            {/* <p>{props.title}</p> */}
        </button>
    );
}