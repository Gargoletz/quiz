import React, { useContext } from 'react';
import AppContext from '../AppContext';
import { logout } from '../logic/Firebase';
import IconButton from './generic/IconButton';
import Screen from './generic/Screen'

import "../css/Settings.css";

export default function Settings() {
    const { user } = useContext(AppContext);
    return (
        <Screen>
            <p><b>uid:</b> {user}</p>
            <IconButton title="Wyloguj" style={{ minWidth: "150px" }} color="red" onClick={() => logout()} />
        </Screen>
    );
}
