import React from 'react';
import "../../css/Quiz.css";
import "../../css/Dictionary.css";
import { getDeterminer } from '../../App';
import { getGenderStyleClass } from '../Quiz';
import ICONS from '../../gfx/icons';

const arrow_img = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c3ZnanM9Imh0dHA6Ly9zdmdqcy5jb20vc3ZnanMiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDAsMCkiPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTUwNi4xMzQsMjQxLjg0M2MtMC4wMDYtMC4wMDYtMC4wMTEtMC4wMTMtMC4wMTgtMC4wMTlsLTEwNC41MDQtMTA0Yy03LjgyOS03Ljc5MS0yMC40OTItNy43NjItMjguMjg1LDAuMDY4ICAgIGMtNy43OTIsNy44MjktNy43NjIsMjAuNDkyLDAuMDY3LDI4LjI4NEw0NDMuNTU4LDIzNkgyMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBjMCwxMS4wNDYsOC45NTQsMjAsMjAsMjBoNDIzLjU1NyAgICBsLTcwLjE2Miw2OS44MjRjLTcuODI5LDcuNzkyLTcuODU5LDIwLjQ1NS0wLjA2NywyOC4yODRjNy43OTMsNy44MzEsMjAuNDU3LDcuODU4LDI4LjI4NSwwLjA2OGwxMDQuNTA0LTEwNCAgICBjMC4wMDYtMC4wMDYsMC4wMTEtMC4wMTMsMC4wMTgtMC4wMTlDNTEzLjk2OCwyNjIuMzM5LDUxMy45NDMsMjQ5LjYzNSw1MDYuMTM0LDI0MS44NDN6IiBmaWxsPSIjZGJkYmRiIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIi8+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPgo=";

class DictionaryWord extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            (this.props.isSelected) ?
                <div className={"dictionary-word"} style={{ flexDirection: "column", margin: "10px 0px" }}>
                    <div className={"dictionary-word-upper"}>
                        <div className={"dictionary-word-inputfield"}>
                            <input
                                placeholder="en español"
                                onChange={(e) => { if (this.props.onChange) this.props.onChange({ es: e.target.value }); }}
                                value={(this.props.word.es)}>
                            </input>
                        </div>
                        <img src={arrow_img} />
                        <div className={"dictionary-word-inputfield"} >
                            <input placeholder="po polsku"
                                onChange={(e) => { if (this.props.onChange) this.props.onChange({ pl: e.target.value }); }}
                                value={this.props.word.pl}>
                            </input>
                        </div>
                    </div>
                    <div className={"dictionary-word-lower"}>
                        <div className={"dictionary-word-inputfield"}>
                            <input 
                                placeholder="wskazówka (opcjonalnie)"
                                onChange={(e) => { if (this.props.onChange) this.props.onChange({ description: e.target.value }); }}
                                value={this.props.word.description}>
                            </input>
                        </div>
                    </div>
                </div > :
                <div className={"dictionary-word " + ((this.props.word.gender) ? getGenderStyleClass(getDeterminer(this.props.word)) : "")} onClick={(e) => { this.props.select(this.props.word); }}>
                    <p style={(this.props.word.es) ? {} : { fontWeight: "initial", fontStyle: "italic", color: "#555" }}>{((getDeterminer(this.props.word)) ? `${getDeterminer(this.props.word)} ` : "") + (this.props.word.es)}</p>
                    <img src={arrow_img} />
                    <p>{this.props.word.pl}</p>
                    {(this.props.enableDelete) ?
                        <div
                            className={"dictionary-word-delete " + ((this.props.isChecked) ? "dictionary-word-delete--checked" : "")}
                            onMouseDown={() => { this.props.check(this.props.word) }}>
                            {(this.props.isChecked) ? <img src={ICONS.accept}></img> : ""}
                        </div> : ""}
                </div>

        );
    }
}

export default DictionaryWord;