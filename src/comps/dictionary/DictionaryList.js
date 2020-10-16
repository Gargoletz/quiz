import React, { useContext } from 'react';
import AppContext from '../../AppContext';
import { DictionaryContext } from '../Dictionary';

import Word from '../dictionary/DictionaryWord';

function useFormating(array) {
    const appContext = useContext(AppContext);
    const context = useContext(DictionaryContext);

    let elements = [];
    let letter = undefined;
    for (let i = 0; i < array.length; i++) {
        let word = array[i];
        if (word && word.es && word.pl) {
            let es = word?.es.trim();
            if (context.edited == undefined || context.edited.es.trim().toLowerCase() != es.toLowerCase() || context.edited.pl.trim().toLowerCase() != word?.pl.trim().toLowerCase()) {
                if (es.charAt(0) != letter) {
                    letter = word?.es.trim().charAt(0);
                    elements.push(<Divider key={i*20} value={letter.toUpperCase()} />)
                }
            }
            elements.push(<Word
                word={word}
                isSelected={context.edited == word}
                key={i}
                select={(word) => {
                    if (context.editMode != 2) {
                        if (context.edited != undefined)
                            appContext.onEditDone(context.edited);
                        context.modifyState({ edited: word }, () => {
                            appContext.onEditEnter(context.edited);
                        })
                    }
                }}
                check={(word) => {
                    if (!context.selected.includes(word))
                        context.modifyState({ selected: [...context.selected, word] })
                    else
                        context.modifyState({ selected: context.selected.filter((e) => e != word) });
                }}
                enableDelete={(context.editMode == 2)}
                isChecked={context.selected.includes(word)}
                onChange={(value) => { appContext.onChange(context.edited, value); }}
            ></Word>);
        }
    }
    return elements;
}

const Divider = (props) => <div className={"dictionary-divider"}><p>{props.value}</p></div>

export default function DictionaryList(props) {
    return (
        <div id="dictionary-list">
            {useFormating(props?.elements)}
        </div>
    );
}
