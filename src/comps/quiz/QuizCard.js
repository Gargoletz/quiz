import React, { useContext } from 'react';

import { getDeterminer } from '../../App';
import AppContext from '../../AppContext';

export default function QuizCard(props) {
    const { word, isEnlarged, isCardFlipped } = useContext(AppContext);

    return word ? <div className={"quiz-box-enlarger " + ((isEnlarged) ? "enlarged" : "")}>
        <div id="quiz-box-wrapper" className={((isCardFlipped) ? "flipped" : "")}>
            <div id="quiz-box" className="card">
                <p className={"paragraph-definition"}>{word?.pl}</p>
            </div>
            <div id="quiz-box-back" className="card">
                <p className={"paragraph-definition " + (getDeterminer(word) ? `--${word.gender}` : "")}>
                    {(word?.es instanceof Array) ? word.es.map((e, i) => {
                        return (i < word.es.length - 1) ? e + "/" : e
                    }) : `${((getDeterminer(word)) ? getDeterminer(word) + " " : "")}${word?.es}`}
                </p>
            </div>
        </div>
    </div> : null;
} 