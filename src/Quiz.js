import React from 'react';
import "./css/Quiz.css";
import "./css/Quiz-anims.css";
import ludzik from './gfx/ludzik.svg';

import { getDeterminer } from './App.js';
import ICONS from './gfx/icons';

// backgroundColor: "#74bff5", color: "#145596", borderColor: "#145596"

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

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answer: "" };
    }
    render() {
        return (
            <div id="quiz-wrapper">
                {(this.props.word) ?
                    <div className="quiz-content">
                        <div id="speech-content" style={{ display: "flex", width: "100%", height: "0px", position: "relative", boxSizing: "border-box", left: "-120%", paddingRight: "10px", justifyContent: "center", alignItems: "center" }}>
                            <img src={ludzik} width={"33%"} style={{ transform: "rotate(20deg)" }} ></img>
                            <div id="speech-bubble" style={{ width: "100%" }}>Ania Tomal es la mas hermosa del mundo!</div>
                        </div>
                        <div className="quiz-progress">
                            <div className="quiz-progress-bar"><div style={{ width: `${this.props.getProgress() * 100}%`, borderRadius: "4px" }}></div></div>
                            {/* <div id="quiz-progress-icon" style={{ backgroundColor: "#aaa", color: "#555" }}>{this.props.getWordsLeft()}</div> */}
                        </div>
                        {
                            (this.props.word && this.props.word.src) ? <div id="quiz-image">
                                <img src={this.props.word.src}></img>
                            </div> : ""
                        }

                        <div className={"quiz-box-enlarger " + ((this.props.isEnlarged) ? "enlarged" : "")}>
                            <div id="quiz-box-wrapper" className={((this.props.isFlipped) ? "flipped" : "")}>
                                <div id="quiz-box" className="card"
                                    style={{}}
                                    onClick={(e) => { /*this.props.onClick();*/ }}
                                >
                                    <p className={"paragraph-definition"}>{(this.props.word) ? this.props.word.pl : ""}</p>
                                </div>
                                <div id="quiz-box-back" className="card" style={{ backgroundColor: "#444", color: "white", borderColor: "#2f2f2f" }}
                                    onClick={(e) => { /*this.props.onClick();*/ }}
                                >
                                    <p className={"paragraph-definition " + (getDeterminer(this.props.word) ? `--${this.props.word.gender}` : "")}>
                                        {(this.props.word) ? (this.props.word.es instanceof Array) ? this.props.word.es.map((e, i) => {
                                            return (i < this.props.word.es.length - 1) ? e + "/" : e
                                        }) : `${((getDeterminer(this.props.word)) ? getDeterminer(this.props.word) + " " : "")}${this.props.word.es}` : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {(this.props.word) ?
                            <input id="quiz-input" className={getGenderStyleClass(this.state.answer)} placeholder={"escriba aqui"} style={(!this.props.isFlipped) ?
                                {} : { opacity: "0.25" }}
                                onKeyUp={(e) => {
                                    this.setState({ answer: e.target.value.toLowerCase() });
                                    if (e.keyCode == 13) {
                                        if (e.target.value.trim()) {
                                            this.props.onAnswer(e.target.value.trim());
                                            e.target.value = "";
                                        }
                                        else if (!this.props.isFlipped) {
                                            this.props.onAnswer("");
                                            e.target.value = "";
                                        }
                                        this.setState({ answer: "" });
                                    }
                                    else if (this.props.isFlipped) {
                                        e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode != 13 && this.props.isFlipped) { e.target.value = e.target.value.substring(0, e.target.value.length); }
                                }}
                            />
                            : null}
                        {(this.props.word && this.props.word.description) ? <div id="quiz-tip">
                            <img src={ICONS.lightBulb_gray}></img>
                            <p>{this.props.word.description}</p>
                        </div> : ""}
                        {/* <div className="quiz-popup">
                    <p className="quiz-popup-header">la palabra nueva!</p>
                    <p className="quiz-popup-name">{this.props.group.words[this.props.group.level + 1].key}</p>
                    <p className="quiz-popup-translation">{this.props.group.words[this.props.group.level + 1].answer}</p>
                </div> */}
                    </div>
                    :
                    ""}
            </div>
        );
    }
}

export default Quiz;