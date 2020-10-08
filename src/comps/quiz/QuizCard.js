import React from 'react';

import { getDeterminer } from '../../App';

export default function QuizCard(props) {
    return props.word ? <div className={"quiz-box-enlarger " + ((props.isEnlarged) ? "enlarged" : "")}>
        <div id="quiz-box-wrapper" className={((props.isFlipped) ? "flipped" : "")}>
            <div id="quiz-box" className="card">
                <p className={"paragraph-definition"}>{props.word?.pl}</p>
            </div>
            <div id="quiz-box-back" className="card">
                <p className={"paragraph-definition " + (getDeterminer(props.word) ? `--${props.word.gender}` : "")}>
                    {(props.word?.es instanceof Array) ? props.word.es.map((e, i) => {
                        return (i < props.word.es.length - 1) ? e + "/" : e
                    }) : `${((getDeterminer(props.word)) ? getDeterminer(props.word) + " " : "")}${props.word?.es}`}
                </p>
            </div>
        </div>
    </div> : null;
} 