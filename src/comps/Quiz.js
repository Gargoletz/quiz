import React from 'react';
import "../css/Quiz.css";
import "../css/Quiz-anims.css";
import AppContext from '../AppContext';
import QuizTip from './quiz/QuizTip';
import QuizInput from './quiz/QuizInput';
import QuizCard from './quiz/QuizCard';
import QuizProgress from './quiz/QuizProgress';
import Tip from './generic/Tip';

export function getGenderStyleClass(answer) {
    let words = answer.trim().split(" ");
    let determiner = words[0].trim().toLowerCase();
    if (determiner) {
        if (determiner == "el" || determiner == "los")
            return "--masculine";
        if (determiner == "la" || determiner == "las")
            return "--feminine";
    }
    return "";
}

export default class Quiz extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }
    render() {
        return this.context?.word ? (
            <div id="quiz-wrapper">
                <div className="quiz-content">
                    <QuizProgress getProgress={() => 0.5} />
                    <QuizCard />
                    <QuizInput />
                    <QuizTip />
                </div>
            </div>
        ) : <div style={{}} className="flex-centered">
                <Tip style={{ margin: "0 10%" }} value="Brak słow w słowniku, dodaj jakieś by móc zacząć ćwiczyć słownictwo!" />
            </div>
    }
}