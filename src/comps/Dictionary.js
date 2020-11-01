import React, { useContext } from 'react';
import "../css/App.css";
import "../css/Quiz.css";
import "../css/Dictionary.css";
import { getDeterminer } from '../App';
import Word from './dictionary/DictionaryWord';
import DictionaryToolbar from './dictionary/DictionaryToolbar';
import DictionarySearchbar from './dictionary/DictionarySearchbar';
import AppContext from '../AppContext';
import Tip from './generic/Tip';
import DictionaryList from './dictionary/DictionaryList';
import Screen from './generic/Screen'

export const DictionaryContext = React.createContext();

class Dictionary extends React.Component {
    static contextType = AppContext;

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
                    this.context.onEditDone(this.state.edited);
                this.setState({ edited: undefined })
            },
            modifyState: this.modifyState
        }
    }

    componentDidMount() {
        window.addEventListener("mousedown", (e) => {
            this.clearSelection(e.target)
        })
    }

    search = () => {
        if (this.state.search) {
            this.setState({
                found: this.context.dictionary.filter((e) => {
                    return (((getDeterminer(e)) ? `${getDeterminer(e)} ${e.es}` : e.es).includes(this.state.search)) || e.pl.includes(this.state.search);
                }).sort((a, b) => {
                    return (a.es.trim() < b.es.trim()) ? -1 : 1;
                })
            })
        }
    }

    modifyState = (obj, callback) => {
        this.setState(obj, callback);
    }

    clearSelection = (e) => {
        if (["container", "dictionary-content"].includes(e.id)
            || e.classList.contains("dictionary-divider")) {
            this.state.endEdit();
        }
    }

    render() {
        return (
            <DictionaryContext.Provider value={this.state}>
                <Screen>
                    <DictionaryTip />
                    <div id="dictionary-search">
                        <DictionaryToolbar mode={this.state.editMode} added={this.state.added} selected={this.state.selected} search={this.search} onEditDone={this.state.endEdit} modifyState={this.modifyState} />
                        <DictionarySearchbar search={this.search} searchValue={this.state.search} modifyState={this.modifyState} />
                    </div>
                    <div id="dictionary-content">
                        <AddedWord />
                        {<DictionaryList elements={(this.state.search) ? this.state.found : this.context.dictionary} />}
                    </div>
                </Screen>
            </DictionaryContext.Provider>
        );
    }
}

const AddedWord = (props) => {
    const { onChange } = useContext(AppContext);
    const { editMode, added } = useContext(DictionaryContext);

    return (editMode == 1 && added) ? <div className="flex-centered">
        <Word
            word={added}
            isSelected={true}
            onChange={(value) => { onChange(added, value, true); }}
        ></Word>
    </div> : null;
}

const DictionaryTip = (props) => {
    const { dictionary } = useContext(AppContext);
    const { editMode, added } = useContext(DictionaryContext);

    let tip = "Trochę tu pustawo, dodaj coś!";
    if (editMode != 0) {
        if (added?.es.length == 0 || added?.pl.length == 0)
            tip = "Wypełnij oba wymagane pola";
        else
            tip = "Wciśnij dodaj i gotowe!";
    }

    return dictionary.length == 0 ? <Tip style={{ margin: "12px 0" }}
        value={tip} /> : null
}

export default Dictionary;