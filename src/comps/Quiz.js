import React from 'react';
import AppContext from '../AppContext';
import QuizTip from './quiz/QuizTip';
import QuizInput from './quiz/QuizInput';
import QuizCard from './quiz/QuizCard';
import QuizProgress from './quiz/QuizProgress';
import Tip from './generic/Tip';
import Screen from './generic/Screen'

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
            <Screen centered={true}>
                <QuizProgress getProgress={() => 0.5} />
                <QuizCard />
                <QuizInput />
                <QuizTip />
            </Screen>
        ) : <Screen centered={true}>
                <Tip style={{ margin: "0 10%" }} value="Brak słow w słowniku, dodaj jakieś by móc zacząć ćwiczyć słownictwo!" />
            </Screen>
    }
}