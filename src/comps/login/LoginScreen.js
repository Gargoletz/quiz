import React from 'react';

import IconButton from '../generic/IconButton'

import "../../css/App.css";
import "../../css/Login.css";

import { loginGoogle } from '../../logic/Firebase';
import ICONS from '../../gfx/icons';

export default function LoginScreen(props) {
    return (
        <div id="login-container">
            <div>
                <h1>Witaj w Quiz App!</h1>
                <IconButton title="zaloguj się z google" color={"blue"} onClick={loginGoogle} />
            </div>
        </div>
    );
}
