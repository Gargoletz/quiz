import React from 'react';
import ICONS from '../../gfx/icons';

export default function QuizTip(props) {
    return props?.tip ?
        <div id="quiz-tip" >
            <img src={ICONS.lightBulb_gray}></img>
            <p>{props.tip}</p>
        </div>
        : '';
}