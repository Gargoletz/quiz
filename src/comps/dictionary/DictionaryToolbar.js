import React from 'react';

import ICONS from '../../gfx/icons';
import IconButton from '../generic/IconButton';

export default function DictionaryToolbar(props) {

  let render = [];
  switch (props?.mode) {
    case 0:
      render = [
        <IconButton
          title="añadir"
          img={ICONS.add_green}
          className="button--green"
          onClick={() => {
            props.modifyState({ added: { pl: "", es: "" }, editMode: 1 });
          }} />,
        <IconButton
          title="eliminar"
          img={ICONS.trash_red}
          className="button--red"
          onClick={() => {
            props.modifyState({ editMode: 2 });
            props.onEditDone();
          }} />
      ]
      break;
    case 1:
      render = [
        <IconButton
          title="aceptar"
          img={ICONS.accept_green}
          className="button--green"
          isDisabled={!props.added.pl || !props.added.es}
          onClick={() => {
            props.addWord(props.added, () => {
              props.modifyState({ editMode: 0 }, () => {
                props.search();
              })
            });
          }} />,
        <IconButton
          title="cancelar"
          img={ICONS.decline_red}
          className="button--red"
          onClick={() => {
            props.modifyState({ editMode: 0, added: undefined });
          }} />
      ]
      break;
    case 2:
      render = [
        <IconButton
          title="aceptar"
          img={ICONS.accept_green}
          className="button--green"
          isDisabled={props?.selected.length == 0}
          onClick={() => {
            props.removeWords(props.selected);
            props.modifyState({ selected: [], editMode: 0 }, () => {
              props.search();
            });
          }} />,
        <IconButton
          title="cancelar"
          img={ICONS.decline_red}
          className="button--red"
          onClick={() => {
            props.modifyState({ editMode: 0, selected: [] })
          }} />
      ]
      break;
  }

  return (
    <div id="dictionary-search-buttons">
      {render}
    </div>
  );
}
