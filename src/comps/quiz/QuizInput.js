import React, { useContext, useState } from 'react';

import { getGenderStyleClass } from '../Quiz';
import AppContext from "../../AppContext";

export default function QuizInput(props) {
    const [answer, setAnswer] = useState("");
    const { isCardFlipped, onAnswer } = useContext(AppContext);

    return <input
        id="quiz-input"
        className={getGenderStyleClass(answer)}
        placeholder={"escriba aqui"}
        style={{ opacity: isCardFlipped ? "0.125" : "" }}
        value={answer}
        onChange={(e) => {
            if (!isCardFlipped)
                setAnswer(e.target.value);
        }}
        onKeyDown={(e) => {
            if (!isCardFlipped) {
                if (e.key == "Enter") {
                    onAnswer(answer);
                    setAnswer("");
                }
            }
        }}
    />
}

