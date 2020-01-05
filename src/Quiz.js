import React from 'react';
import "./css/Quiz.css";
import "./css/Quiz-anims.css";
// backgroundColor: "#74bff5", color: "#145596", borderColor: "#145596"

class Quiz extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="quiz-wrapper">
                <div id="quiz-button-exit" className="" onClick={(e)=>{ this.props.setScreen(0); }}>X</div>
                <div className="quiz-content">
                    <div className="quiz-progress">
                        <div className="quiz-progress-bar"><div style={{ width: (this.props.points / (Math.min(10, (this.props.group && this.props.group.words) ? this.props.group.length : 999))) * 100 + "%" }}></div></div>
                        <div id="quiz-progress-icon" style={{ backgroundColor: (this.props.group.color) ? `hsl(${this.props.group.color}, 100%, 70%)` : "#aaa", color: (this.props.group.color) ? `hsl(${this.props.group.color}, 100%, 35%)` : "#555" }}>{this.props.level + 1}</div>
                    </div>
                    <div id="quiz-box" style={(!this.props.isFlipped) ? {} : { backgroundColor: "#444", color: "white", borderColor: "#2f2f2f" }} onClick={(e) => { /*this.props.onClick();*/ }}>
                        <p>{(this.props.word) ? ((!this.props.isFlipped) ? this.props.word.key : (this.props.word.answer instanceof Array) ? this.props.word.answer.map((e, i) => { return (i < this.props.word.answer.length - 1) ? e + "/" : e }) : this.props.word.answer) : ""}</p>
                    </div>
                    <input id="quiz-input" placeholder={"escriba aqui"} style={(!this.props.isFlipped) ? {} : { opacity: "0.25" }} onKeyUp={(e) => {
                        if (e.keyCode == 13) {
                            if (e.target.value.trim()) {
                                this.props.answer(e.target.value.trim());
                                // e.target.value = "";
                            }
                            else if (!this.props.isFlipped) {
                                this.props.onClick();
                            }
                        }
                        else if (this.props.isFlipped) {
                            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                        }
                    }} onKeyDown={(e) => { if (e.keyCode != 13 && this.props.isFlipped) e.target.value = e.target.value.substring(0, e.target.value.length); }} />
                    <div className="quiz-popup">
                        <p className="quiz-popup-header">el conjunto nuevo!</p>
                        <p className="quiz-popup-name">{this.props.group.name}</p>
                        <p className="quiz-popup-translation">{this.props.group.translation}</p>
                    </div>
                </div>

            </div>
        );
    }
}

export default Quiz;