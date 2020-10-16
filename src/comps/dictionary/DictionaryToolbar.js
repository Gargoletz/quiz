import React, { useContext } from 'react';

import ICONS from '../../gfx/icons';
import AppContext from '../../AppContext';
import DictionaryYesNoButtons from './DictionaryYesNoButtons';

export default function DictionaryToolbar(props) {
  const context = useContext(AppContext);

  switch (props?.mode) {
    case 0:
      return <DictionaryYesNoButtons
        titleAccept="añadir"
        iconAccept={ICONS.add_green}
        onAccept={() => {
          props.modifyState({ added: { pl: "", es: "" }, editMode: 1 });
        }}
        titleDecline="eliminar"
        iconDecline={ICONS.trash_red}
        onDecline={() => {
          props.modifyState({ editMode: 2 });
          props.onEditDone();
        }}
      />
    case 1:
      return <DictionaryYesNoButtons
        disableAccept={!props.added.pl || !props.added.es}
        onAccept={() => {
          context.addWord(props.added, () => {
            props.modifyState({ editMode: 0 }, () => {
              props.search();
            })
          });
        }}
        onDecline={() => {
          props.modifyState({ editMode: 0, added: undefined });
        }} />
    case 2:
      return <DictionaryYesNoButtons
        disableAccept={props?.selected.length == 0}
        onAccept={() => {
          context.removeWords(props.selected);
          props.modifyState({ selected: [], editMode: 0 }, () => {
            props.search();
          });
        }}
        onDecline={() => {
          props.modifyState({ editMode: 0, selected: [] })
        }}
      />
  }
}
