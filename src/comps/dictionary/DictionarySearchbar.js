import React, { useContext } from 'react';

import ICONS from '../../gfx/icons';
import AppContext from '../../AppContext';

export default function DictionarySearchbar(props) {
    const { dictionary } = useContext(AppContext);

    return dictionary.length > 0 ? (
        <div id="dictionary-search-bar">
            <input type="text" value={props.searchValue}
                onChange={(e) => {
                    props.modifyState({ search: e.target.value.toLowerCase() }, () => { props.search(); })
                }}></input>
            <img src={ICONS.search} />
        </div>
    ) : null;
}
