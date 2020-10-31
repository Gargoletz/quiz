import React, { Component } from 'react'
import Checkbox from './Checkbox';

export default class SelectableList extends Component {

    constructor(props) {
        super(props);

        this.state = { selected: [] };
    }

    select = (e) => {
        if (this.state.selected.includes(e))
            this.setState({ selected: this.state.selected.filter((f) => f != e) });
        else
            this.setState({ selected: [...this.state.selected, e] });
    }

    render() {
        return (
            <div id="dictionary-list">
                {this.props.children.map((e) => {
                    if (this.props.inEditMode && this.props?.filter != e.type)
                        return <div className="list-element" onClick={() => this.select(e)}>
                            <div style={{ flex: 1 }}>{e}</div>
                            <Checkbox value={this.state.selected.includes(e)} />
                        </div>
                    else
                        return e;

                })}
            </div>
        )
    }
}
