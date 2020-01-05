import React from 'react';
import './css/Lesson.css';

class Lesson extends React.Component {
    state = {}
    render() {
        console.log(this.props.words);
        return (
            <div className="lesson-wrapper">
                <div className="lesson-upper" onClick={(e) => { this.props.setScreen(1); }}>
                    <div className="lesson-content">
                        <div className="lesson-title">{this.props.title}</div>
                        <div className="lesson-words">{}</div>
                    </div>
                    {/* <div id="lesson-progress-icon">{1}</div> */}
                </div>
                <div className="lesson-progress">
                    <div className="quiz-progress-bar"><div style={{ width: "80%" }}></div></div>
                </div>
            </div>
        );
    }
}

export default Lesson;