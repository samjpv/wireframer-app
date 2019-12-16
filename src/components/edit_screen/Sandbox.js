import React, { Component } from 'react'
import Controls from "./Controls"

export class Sandbox extends Component {
    render() {
        console.log('this.props.style', this.props.style)
        return (
            <div id="sandbox" className="wireframe sandbox" style={this.props.style}>
                <Controls updateState={this.props.updateState} selectedControl={this.props.selectedControl} controls={this.props.controls} ></Controls>
            </div >
        )
    }
}

export default Sandbox
