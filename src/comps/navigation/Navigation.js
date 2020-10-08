import React, { useState } from 'react';
import ICONS from '../../gfx/icons';

import { NavigationButton } from './NavigationButton';

export function Navigation(props) {
    return (
        <div id="nav">
            <div>
                <NavigationButton title="QUIZ" icon={ICONS.quiz} value={0} change={props.change} />
                <NavigationButton title="PALABRAS" icon={ICONS.words} value={1} change={props.change} />
            </div>
        </div>
    );
}