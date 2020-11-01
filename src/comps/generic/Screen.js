import React, { Component } from 'react';
import "../../css/style.css"

class Screen extends Component {
    render() {
        return (
            <div {...this.props} style={{ ...this.props?.style, placeContent: (this.props?.centered) ? "center" : "" }} className="screen-container">
                {this.props.children}
            </div>
        );
    }
}

export default Screen;