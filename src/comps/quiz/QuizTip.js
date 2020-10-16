import React, { useContext } from 'react';
import ICONS from '../../gfx/icons';
import AppContext from '../../AppContext';

export default function QuizTip(props) {
    const { word } = useContext(AppContext);

    return word?.description ?
        <div id="quiz-tip" >
            <img src={ICONS.lightBulb_gray}></img>
            <p>{word.description}</p>
        </div>
        : '';
}