import React from 'react';

import ICONS from '../../gfx/icons';

export default function DictionarySearchbar(props) {
    return (
        <div id="dictionary-search-bar">
            <input type="text" value={props.searchValue}
                onChange={(e) => {
                    props.modifyState({ search: e.target.value.toLowerCase() }, () => { props.search(); })
                }}></input>
            <img src={ICONS.search} />
        </div>
    );
}
