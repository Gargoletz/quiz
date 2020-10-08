import React from 'react';

export default function QuizProgress(props) {
    return (
        <div className="quiz-progress">
            <div className="quiz-progress-bar">
                <div style={{ width: `${props.getProgress() * 100}%`, borderRadius: "4px" }}>
                </div>
            </div>
            {/* <div id="quiz-progress-icon" style={{ backgroundColor: "#aaa", color: "#555" }}>{this.props.getWordsLeft()}</div> */}
        </div>
    );
}
