import React from 'react';

import ICONS from '../../gfx/icons';

export default function Checkbox(props) {
    return (
        <div style={{ ...props.style }}
            className={"checkbox " + ((props.value) ? "checkbox--checked" : "")}
            onMouseDown={props.onClick}>
            {(props.value) ? <img src={ICONS.accept}></img> : ""}
        </div>
    );
}
