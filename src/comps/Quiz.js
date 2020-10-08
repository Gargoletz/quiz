import React from 'react';
import "../css/Quiz.css";
import "../css/Quiz-anims.css";

import QuizTip from './quiz/QuizTip';
import QuizInput from './quiz/QuizInput';
import QuizCard from './quiz/QuizCard';
import QuizProgress from './quiz/QuizProgress';

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
    constructor(props) {
        super(props);
    }
    render() {
        return this.props.word ? (
            <div id="quiz-wrapper">
                <div className="quiz-content">
                    <QuizProgress getProgress={this.props.getProgress} />
                    <QuizCard word={this.props.word} isFlipped={this.props.isFlipped} isEnlarged={this.props.isEnlarged} />
                    <QuizInput isFlipped={this.props.isFlipped} onAnswer={this.props.onAnswer} />
                    <QuizTip tip={this.props?.word?.description} />
                </div>
            </div>
        ) : null;
    }
}