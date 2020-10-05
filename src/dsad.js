<div id="quiz-box" className=""
                                style={{}}
                                onClick={(e) => { /*this.props.onClick();*/ }}
                            >
                                <p className={"paragraph-definition"}>{(this.props.word) ? this.props.word.pl : ""}</p>
                                <p className={"paragraph-description"}>{(this.props.word && this.props.word.description) ? this.props.word.description : "dsad"}</p>
                            </div>
                            <div id="quiz-box-back" className="" style={{ backgroundColor: "#444", color: "white", borderColor: "#2f2f2f" }}
                                onClick={(e) => { /*this.props.onClick();*/ }}
                            >
                                <p className={(getDeterminer(this.props.word) ? `--${this.props.word.gender}` : "")}>
                                    {(this.props.word) ? (this.props.word.es instanceof Array) ? this.props.word.es.map((e, i) => {
                                        return (i < this.props.word.es.length - 1) ? e + "/" : e
                                    }) : `${((getDeterminer(this.props.word)) ? getDeterminer(this.props.word) + " " : "")}${this.props.word.es}` : ""}
                                </p>
                            </div>