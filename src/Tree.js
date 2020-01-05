import React from 'react';
import "./css/Tree.css";
import Lesson from './Lesson';
import lessons_names from "./data/lessons.js";
import words_names from "./data/words.js";

class Tree extends React.Component {
    state = {}
    render() {
        // console.log(lessons_names);

        return (
            <div id="tree-wrapper">
                <div id="tree-content">
                    <div>
                        {/* <Lesson title="Introduction"></Lesson> */}
                        {
                            lessons_names.map((e) => {
                                return <Lesson title={e} words={words_names[e]} setScreen={this.props.setScreen} ></Lesson>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Tree;