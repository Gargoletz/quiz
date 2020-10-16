import React, { useContext } from 'react';
import AppContext from '../AppContext';
import { logout } from '../logic/Firebase';
import IconButton from './generic/IconButton';

import "../css/Settings.css";

export default function Settings() {
    const { user } = useContext(AppContext);
    return (
        <div id="settings-wrapper">
            <p><b>uid:</b> {user}</p>
            <div>
                <IconButton title="Wyloguj" style={{minWidth: "150px"}} color="red" onClick={() => logout()} />
            </div>
        </div>
    );
}
