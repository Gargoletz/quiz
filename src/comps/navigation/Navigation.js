import React, { useContext, useState } from 'react';
import ICONS from '../../gfx/icons';
import AppContext from '../../AppContext';

import { CONNECTED } from '../../logic/Firebase';

import { NavigationButton } from './NavigationButton';

export default function Navigation(props) {
    let { conected, user, screen } = useContext(AppContext);

    return conected && user != undefined && screen != undefined ? (
        <div id="nav">
            <div>
                <NavigationButton title="QUIZ" icon={ICONS.quiz} value={0} />
                <NavigationButton title="PALABRAS" icon={ICONS.words} value={1} />
                <NavigationButton title="GROUPS" icon={ICONS.groups} value={2} />
                <NavigationButton title="SETTINGS" icon={ICONS.profile} value={3} />
            </div>
        </div>
    ) : null;
}