import React from 'react';
import ICONS from '../../gfx/icons';

export default function Tip(props) {
    return (
        <div className="tip" style={{...props.style}} >
            <img src={ICONS.lightBulb_gray}></img>
            <p>{props.value}</p>
        </div>
    );
}
