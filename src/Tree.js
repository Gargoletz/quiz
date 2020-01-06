import React from 'react';
import "./css/Tree.css";
import Lesson from './Lesson';
import groups from './data/words';

class Tree extends React.Component {
    state = {}
    render() {
        return (
            <div id="tree-wrapper">
                <div id="tree-content">
                    <div>
                        {(this.props.groups) ? this.props.groups.map((e, i) => {
                            return <Lesson key={i} group={this.props.groups[i]} setScreen={this.props.setScreen}></Lesson>
                        }) : ""}
                    </div>
                </div>
            </div >
        );
    }
}

export default Tree;