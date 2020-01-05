import React from 'react';
import './css/Lesson.css';

class Lesson extends React.Component {
    state = {}
    render() {
        return (
            <div className="lesson-wrapper">
                <div className="lesson-upper" onClick={(e) => { this.props.setScreen(1, this.props.group); }}>
                    <div className="button">
                        <div className="lesson-title">{this.props.group.translation}</div>
                        <div className="lesson-title" style={{ color: "#aaa", fontStyle: "italic" }}>{this.props.group.name}</div>
                        <div className="lesson-words">{}</div>
                    </div>
                    {/* <div id="lesson-progress-icon">{1}</div> */}
                </div>
                <div className="lesson-progress">
                    <div className="quiz-progress-bar"><div style={{ width: `${Math.min(this.props.group.experience, 100)}%` }}></div></div>
                </div>
            </div>
        );
    }
}

export default Lesson;