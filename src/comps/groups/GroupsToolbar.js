import React, { useContext } from 'react';

import ICONS from '../../gfx/icons';
import IconButton from '../generic/IconButton';
import AppContext from '../../AppContext';
import DictionaryYesNoButtons from '../dictionary/DictionaryYesNoButtons';

export default function GroupsToolbar(props) {
  const context = useContext(AppContext);

  let render = [];
  switch (props?.mode) {
    case 0:
      render = [
        <IconButton
          style={{ flex: 1 }}
          title="añadir"
          img={ICONS.add_green}
          className="button--green"
          onClick={() => {
            props.modifyState({ edited: undefined, added: { title: "" }, editMode: 1 });
          }} />,
        <IconButton
          style={{ flex: 1 }}
          title="eliminar"
          img={ICONS.trash_red}
          className="button--red"
          onClick={() => {
            // props.modifyState({ editMode: 2 });
            // props.onEditDone();
            props.modifyState({ edited: undefined, editMode: 2 })
          }} />
      ]
      break;
    case 1:
      render = [
        <IconButton
          style={{ flex: 1 }}
          title="aceptar"
          img={ICONS.accept_green}
          className="button--green"
          isDisabled={!props?.added?.title}
          onClick={() => {
            // context.addWord(props.added, () => {
            //   props.modifyState({ editMode: 0 }, () => {
            //     props.search();
            //   })
            // });
            context.addGroup(props.added, () => {
              props.modifyState({ editMode: 0 });
            });
          }} />,
        <IconButton
          style={{ flex: 1 }}
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
          style={{ flex: 1 }}
          title="aceptar"
          img={ICONS.accept_green}
          className="button--green"
          isDisabled={props?.selected.length == 0}
          onClick={() => {
            // context.removeWords(props.selected);
            // props.modifyState({ selected: [], editMode: 0 }, () => {
            //   props.search();
            // });
            context.removeGroups(props.selected);
            props.modifyState({ selected: [], editMode: 0 })
          }} />,
        <IconButton
          style={{ flex: 1 }}
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
