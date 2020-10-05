import React, { useDebugValue } from 'react';
import "./css/App.css";
import "./css/Quiz.css";
import "./css/Dictionary.css";
import { getDeterminer } from './App';
import { getGenderStyleClass } from './Quiz';
import DictionaryWord from './DictionaryWord';
import icons from './gfx/icons';
import ICONS from './gfx/icons';

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
            elements.push(<DictionaryWord
                word={word}
                isSelected={this.state.edited == word}
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
            ></DictionaryWord>);
        }
        return elements;
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
                    {(true) ? <div id="dictionary-search-buttons">
                        <div className={"button " + (((this.state.editMode == 2 && this.state.selected.length == 0) || (this.state.editMode == 1 && (!this.state.added.es || !this.state.added.pl))) ? "button--disabled" : "button--green")}
                            style={{ backgroundColor: (this.state.editMode == 2 && this.state.selected.length == 0) ? "" : "" }}
                            onClick={() => {
                                if (this.state.editMode == 0) {
                                    // if (this.state.added == undefined)
                                    this.setState({ added: { pl: "", es: "" } });
                                    this.setState({ editMode: 1, })
                                }
                                else if (this.state.editMode == 1) {
                                    if (this.state.added.es && this.state.added.pl) {
                                        this.props.addWord(this.state.added);
                                        this.setState({ editMode: 0 }, () => {
                                            this.search();
                                        });
                                    }
                                }
                                else if (this.state.editMode == 2) {
                                    if (this.props.removeWords) {
                                        this.props.removeWords(this.state.selected);
                                        this.setState({ selected: [], editMode: 0 }, () => {
                                            this.search();
                                        });
                                    }
                                }
                            }}>
                            <p>{(this.state.editMode == 0) ? "añadir" : "acteptar"}</p>
                            <img src={(this.state.editMode == 0) ? icons.add_green : icons.accept_green} />
                        </div>
                        <div className="button button--red"
                            style={{ backgroundColor: "" }}
                            onClick={() => {
                                if (this.state.editMode == 0) {
                                    this.state.endEdit();
                                    this.setState({ editMode: 2 });
                                }
                                else if (this.state.editMode == 1)
                                    this.setState({ editMode: 0, added: undefined });
                                else
                                    this.setState({ editMode: 0, selected: [] });
                            }}>
                            <p>{(this.state.editMode == 0) ? "eliminar" : "cancelar"}</p>
                            <img style={{ width: (this.state.editMode == 1) ? "14px" : "" }} src={(this.state.editMode == 0) ? icons.trash_red : icons.decline_red} />
                        </div>
                    </div> : ""}
                    {(this.state.editMode == 1 && this.state.added) ? <div style={{ display: "flex", padding: "0 0px", justifyContent: "center", alignItems: "center" }}>
                        <DictionaryWord
                            word={this.state.added}
                            isSelected={true}
                            onChange={(value) => { this.props.onChange(this.state.added, value, true); }}
                        ></DictionaryWord>

                    </div> : ""}
                    <div id="dictionary-search-bar">
                        <input type="text" value={this.state.search} onChange={(e) => { this.setState({ search: e.target.value.toLowerCase() }, () => { this.search(); }) }}></input>
                        <img src={ICONS.search} />
                    </div>
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