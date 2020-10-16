import React, { useContext } from 'react';

import AppContext from '../../AppContext';

export function NavigationButton(props) {
    let { screen, changeScreen } = useContext(AppContext);

    return (
        <div className={"nav-button " + (screen === props.value ? "--active" : "")}
            onClick={() => { changeScreen(props.value); }}>
            <img src={props.icon} alt="" />
            {/* <p>{props.title}</p> */}
        </div>
    );
}