import React, { useDebugValue } from 'react';
import "../css/App.css";
import "../css/Quiz.css";
import "../css/Dictionary.css";
import { getDeterminer } from '../App';
import Word from './dictionary/DictionaryWord';
import DictionaryToolbar from './dictionary/DictionaryToolbar';
import DictionarySearchbar from './dictionary/DictionarySearchbar';

class Dictionary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            added: undefined,
            edited: undefined,
            selected: [],
            search: "",
            found: [],
            editMode: 0,
            endEdit: () => {
                if (this.state.edited != undefined)
                    this.props.onEditDone(this.state.edited);
                this.setState({ edited: undefined })
            }
        }

        this.search = this.search.bind(this);
        this.formatByLetter = this.formatByLetter.bind(this);
        this.modifyState = this.modifyState.bind(this);
    }

    search() {
        if (this.state.search) {
            this.setState({
                found: this.props.dictionary.filter((e) => {
                    return (((getDeterminer(e)) ? `${getDeterminer(e)} ${e.es}` : e.es).includes(this.state.search)) || e.pl.includes(this.state.search);
                }).sort((a, b) => {
                    return (a.es.trim() < b.es.trim()) ? -1 : 1;
                })
            })
        }
    }

    formatByLetter(array) {
        let elements = [];
        let letter = undefined;
        for (let i = 0; i < array.length; i++) {
            let word = array[i];
            let es = word.es.trim();
            if (this.state.edited == undefined || this.state.edited.es.trim().toLowerCase() != es.toLowerCase() || this.state.edited.pl.trim().toLowerCase() != word.pl.trim().toLowerCase()) {
                if (es.charAt(0) != letter) {
                    letter = word.es.trim().charAt(0);
                    elements.push(<div className={"dictionary-divider"}><p>{letter.toUpperCase()}</p></div>)
                }
            }
            // else {
            //     if (es.charAt(es.indexOf(" ", 0) + 1) != letter) {
            //         letter = es.charAt(es.indexOf(" ", 0) + 1);
            //         elements.push(<div className={"dictionary-divider"}><p>{letter.toUpperCase()}</p></div>)
            //     }
            // }
            elements.push(<Word
                word={word}
                isSelected={this.state.edited == word}
                key={i}
                select={(word) => {
                    if (this.state.editMode != 2) {
                        if (this.state.edited != undefined)
                            this.props.onEditDone(this.state.edited);
                        this.setState({ edited: word }, () => {
                            this.props.onEditEnter(this.state.edited);
                        })
                    }
                }}
                check={(word) => {
                    if (!this.state.selected.includes(word))
                        this.setState({ selected: [...this.state.selected, word] })
                    else
                        this.setState({ selected: this.state.selected.filter((e) => e != word) });
                }}
                enableDelete={(this.state.editMode == 2)}
                isChecked={this.state.selected.includes(word)}
                onChange={(value) => { this.props.onChange(this.state.edited, value); }}
            ></Word>);
        }
        return elements;
    }

    modifyState(obj, callback) {
        this.setState(obj, callback);
    }

    render() {
        return (
            <div id="dictionary-wrapper"
                onMouseDown={(e) => {
                    if (e.target.id == "dictionary-wrapper" || e.target.id == "dictionary-content" || e.target.classList.contains("dictionary-divider")) {
                        this.state.endEdit();
                    }
                }}>
                <div id="dictionary-search">
                    <DictionaryToolbar mode={this.state.editMode} added={this.state.added} addWord={this.props.addWord} selected={this.state.selected} removeWords={this.props.removeWords} search={this.search} onEditDone={this.state.endEdit} modifyState={this.modifyState} />
                    {(this.state.editMode == 1 && this.state.added) ? <div style={{ display: "flex", padding: "0 0px", justifyContent: "center", alignItems: "center" }}>
                        <Word
                            word={this.state.added}
                            isSelected={true}
                            onChange={(value) => { this.props.onChange(this.state.added, value, true); }}
                        ></Word>
                    </div> : ""}
                    <DictionarySearchbar search={this.search} searchValue={this.state.search} modifyState={this.modifyState} />
                </div>
                <div id="dictionary-content" style={{}}>
                    <div>
                        {(this.state.search) ? this.formatByLetter(this.state.found) : this.formatByLetter(this.props.dictionary)}
                    </div>
                </div>
            </div >
        );
    }
}

export default Dictionary;