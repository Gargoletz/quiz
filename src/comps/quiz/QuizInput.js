import React, { useState } from 'react';

import { getGenderStyleClass } from '../Quiz';

export default function QuizInput(props) {
    const [answer, setAnswer] = useState("");

    return <input
        id="quiz-input"
        className={getGenderStyleClass(answer)}
        placeholder={"escriba aqui"}
        style={{ opacity: props.isFlipped ? "0.125" : "" }}
        value={answer}
        onChange={(e) => {
            if (!props.isFlipped)
                setAnswer(e.target.value);
        }}
        onKeyDown={(e) => {
            if (!props.isFlipped) {
                if (e.key == "Enter") {
                    props.onAnswer(answer);
                    setAnswer("");
                }
            }
        }}
    />
}

