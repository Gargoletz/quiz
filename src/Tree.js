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
                        {groups.groups.map((e, i) => {
                            return <Lesson key={i} setScreen={this.props.setScreen} title={e.name}></Lesson>
                    })}
                </div>
            </div>
            </div >
        );
    }
}

export default Tree;