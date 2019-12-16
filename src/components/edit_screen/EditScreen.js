import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { SketchPicker } from 'react-color';
import ReactDOM from 'react-dom';
import { Controls } from './Controls'
import Sandbox from './Sandbox';
import { Row, Col } from "react-materialize"

class EditScreen extends Component {

    state = {
        selectedControl: 0,
        height: 400,
        width: 400,
        newWidth: 400,
        newHeight: 400,
        name: "Wireframe1",
        owner: "Sam",
        controls: [
            {
                key: 0,
                type: "container",
                backgroundColor: "red",
                width: 200,
                height: 100,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "control1",
                timeAccessed: 0
            },
            {
                key: 1,
                backgroundColor: "blue",
                type: "button",
                width: 100,
                height: 100,
                x: 200,
                y: 200,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "control2",
                timeAccessed: 0
            }
        ]
    }

    handlePanAndZoom(x, y, scale) {
        this.setState({ x, y, scale });
    }

    updateState = (newState) => {
        console.log('newState.key', newState.key)
        this.setState({
            controls: this.state.controls.map(control => {
                if (control.key != newState.key)
                    return control;
                else

                    return { ...control, ...newState }

            }),
            selectedControl: newState.key
        })
    }

    handlePanMove(x, y) {
        this.setState({ x, y });
    }

    componentDidMount() {
        console.log('component mounting')
        const firestore = getFirestore();
        const { id } = this.props.match.params;
        console.log('id', id)
        firestore.collection("wireFramers").doc(id).get().then(doc => {
            console.log('doc.data()', doc.data())
            this.setState({
                controls: doc.data().controls
            })
        }
        )

    }

    updateWidth = (width) => {
        console.log('updating width to,', width)
        this.setState({ newWidth: width })
    }

    updateHeight = (height) => {
        console.log('updating width to,', height)
        this.setState({ newHeight: height })
    }

    updateDim = () => {
        this.setState({
            width: this.state.newWidth,
            height: this.state.newHeight
        })
    }



    render() {
        return (
            <div>
                <Row>
                    <Col s={12}>
                        <div className="wireframe ">
                            <div className="wireframe dims">
                                Width
                        <input id="width" type="text" className="dimfield" defaultValue={this.state.width} onChange={(e) => this.updateWidth(e.target.value)} />
                                <br></br>
                                Height
                        <input id="height" type="text" className="dimfield" defaultValue={this.state.height} onChange={(e) => this.updateHeight(e.target.value)} />
                                <br></br>
                                <button className="updateDimensions" onClick={this.updateDim}>Update Dimensions</button>
                            </div>


                            <div className="wireframe zoom">
                                <button id="zoomin" className="zoomin" onClick={() => this.setState({ width: this.state.width * 1.5, height: this.state.height * 1.5, })}>+</button>
                                <button id="zoomout" className="zoomout" onClick={() => this.setState({ width: this.state.width / 1.5, height: this.state.height / 1.5, })}>-</button>
                            </div>
                            <div className="wireframe newcontrol">
                                <button className="newcontrol" onClick={this.newContainer}>Add container</button>
                                <button className="newcontrol" onClick={this.newLabel}>Add label</button>
                                <button className="newcontrol" onClick={this.newButton}>Add text button</button>
                                <button className="newcontrol" onClick={this.newText}>Add text</button>
                            </div>
                            <div className="wireframe controltext">
                                Control text
                                <br></br>
                                <input type="text" value={this.state.controls ? this.state.controls[this.state.selectedControl].text : {}} onChange={(e) => this.updateState({ key: this.state.selectedControl, text: e.target.value })}/>
                            </div>
                            <div className="wireframe controlfontsize">
                                Control font size
                                <br></br>
                                <input type="text" value={this.state.controls ? this.state.controls[this.state.selectedControl].fontSize : {}} onChange={(e) => this.updateState({ key: this.state.selectedControl, fontSize: e.target.value })}/>
                            </div>
                            <button className="saveButton" onClick={this.saveWork}>
                                SAVE
                            </button>
                            <div className="wireframe controlborder">
                                Thickness
                            <input type="text" value={this.state.controls ? this.state.controls[this.state.selectedControl].borderStyle : {}} onChange={(e) => this.updateState({ key: this.state.selectedControl, borderStyle: e.target.value })} />
                                <br></br>
                                Radius
                            <input type="text" value={this.state.controls ? this.state.controls[this.state.selectedControl].borderRadius : {}} onChange={(e) => this.updateState({ key: this.state.selectedControl, borderRadius: e.target.value })} />
                                <br></br>
                            <div className="wireframe controlcolor">
                                    Border color
                                   <SketchPicker color={this.state.controls ? this.state.controls[this.state.selectedControl].borderColor : {}}
                                        onChangeComplete={(color) => this.updateState({ key: this.state.selectedControl, borderColor: color.hex })}
                                    ></SketchPicker>
                                    Fill color
                                    <SketchPicker color={this.state.controls ? this.state.controls[this.state.selectedControl].backgroundColor : {}}
                                        onChangeComplete={(color) => this.updateState({ key: this.state.selectedControl, backgroundColor: color.hex })}
                                    ></SketchPicker>
                                </div>
                            </div>
                        </div>

                    </Col>
                    <Sandbox updateState={this.updateState} selectedControl={this.state.selectedControl} controls={this.state.controls} style={{ width: this.state.width.toString() + 'px', height: this.state.height.toString() + 'px' }} />
                </Row>
            </div>
        );
    }
    newContainer = () => {
        this.state.controls.push(
            {
                key: this.state.controls.length,
                type: "container",
                backgroundColor: "white",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "Container",
                timeAccessed: 0
            }
        )
        this.updateDim()
    }
    newLabel = () => {
        this.state.controls.push(
            {
                key: this.state.controls.length,
                type: "label",
                backgroundColor: "gray",
                width: 80,
                height: 20,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "Label",
                timeAccessed: 0
            }
        )
        this.updateDim()
    }
    newButton = () => {
        this.state.controls.push(
            {
                key: this.state.controls.length,
                type: "button",
                backgroundColor: "white",
                width: 50,
                height: 50,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "Button",
                timeAccessed: 0
            }
        )
        this.updateDim()
    }
    newText = () => {
        this.state.controls.push(
            {
                key: this.state.controls.length,
                type: "text",
                backgroundColor: "white",
                width: 80,
                height: 20,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontSize: 20,
                text: "Text",
                timeAccessed: 0
            }
        )
        this.updateDim()
    }

    saveWork = () => {
        const firestore = getFirestore()
        var id = (window.location.pathname.toString()).replace("/wireframe/",'')
        console.log("ID",id)
        firestore.collection("wireFramers").doc(id).update({
                controls : this.state.controls
        })
    }
    
}

export default EditScreen

