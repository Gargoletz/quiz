import React from 'react';

import ICONS from '../../gfx/icons';
import IconButton from '../generic/IconButton';

export default function DictionaryYesNoButtons(props) {
    return (
        <div id="dictionary-search-buttons">
            <IconButton
                style={{ flex: 1 }}
                color="#b2d582"
                title={props?.titleAccept || "aceotar"}
                img={props?.iconAccept || ICONS.accept_green}
                isDisabled={props?.disableAccept}
                onClick={() => { if (props.onAccept) props.onAccept() }} />
            <IconButton
                style={{ flex: 1 }}
                color="#e55e57"
                title={props?.titleDecline || "cancelar"}
                img={props?.iconDecline || ICONS.decline_red}
                isDisabled={props?.disableDecline}
                onClick={() => { if (props.onDecline) props.onDecline() }} />
        </div>
    );
}
