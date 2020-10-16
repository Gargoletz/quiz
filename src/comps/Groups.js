import React, { useContext } from 'react';
import AppContext from '../AppContext';
import Checkbox from './generic/Checkbox';

import "../css/Groups.css";
import GroupsToolbar from './groups/GroupsToolbar';

function GroupElement(props) {
    let { group, edited } = props;
    const { selected, editMode } = useContext(GroupContext);

    if (group == undefined)
        return null;

    return (edited) ?
        <div class="group-element"><input placeholder="nazwa grupy" value={group.title} onChange={(e) => props.onChange(e.target.value)} /></div>
        :
        <div style={{ display: "flex", placeContent: "center", placeItems: "center" }}>
            <div onClick={() => { props.onClick() }} style={{ flex: 1 }} class="title">
                {group.title}
            </div>
            {editMode == 2 ? <Checkbox style={{ marginLeft: 10 }} value={selected.includes(group)} onClick={props.onClick} /> : null}
        </div>
}

const GroupContext = React.createContext();

export default class Groups extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            editMode: 0,
            added: undefined,
            edited: undefined,
            selected: []
        };
    }

    modifyState = (obj) => this.setState(obj);

    render() {
        const { user, groups } = this.context;
        return (
            <GroupContext.Provider value={this.state}>
                <div id="dictionary-wrapper" onClick={(e) => {
                    if (e.target.id == "dictionary-wrapper" || e.target.id == "groups-content" || e.target.id == "dictionary-search")
                        this.setState({ edited: undefined });
                }}>
                    <div id="dictionary-search">
                        <GroupsToolbar mode={this.state.editMode} added={this.state.added} selected={this.state.selected} modifyState={this.modifyState} />
                        {this.state.editMode == 1 && this.state.added != undefined ? <GroupElement group={this.state.added} edited={true} onChange={(val) => { this.state.added.title = val; this.setState({ added: this.state.added }); }} /> : null}
                    </div>
                    <div id="groups-content" style={{ flex: 1, width: "min(100%,500px)", padding: "0 10px", boxSizing: "border-box" }}>
                        {groups.map(e => <GroupElement edited={e == this.state.edited} isSelected={this.state.selected.includes(e)} group={e} onChange={(val) => {
                            this.context.onGroupChange(e, { title: val });
                        }}
                            onClick={() => {
                                if (this.state.editMode == 2) {
                                    if (!this.state.selected.includes(e))
                                        this.setState({ selected: [...this.state.selected, e] })
                                    else
                                        this.setState({ selected: this.state.selected.filter(f => f.title != e.title) });
                                }
                                else
                                    this.setState({ editMode: 0, edited: e });
                            }} />)}
                    </div>
                </div>
            </GroupContext.Provider>
        );
    }
}
