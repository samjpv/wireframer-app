import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { SketchPicker } from 'react-color';
import ReactDOM from 'react-dom';

var numControls = 0
class EditScreen extends Component {

    state = {
        x: 0.5,
        y: 0.5,
        scale: 1
    }

    handlePanAndZoom(x, y, scale) {
        this.setState({x, y, scale});
    }
 
    handlePanMove(x, y) {
        this.setState({x, y});
    }

    componentDidMount() {
        // sets a timestamp for when this was accessed
        const wireframe = this.props.wireframe;
        if (wireframe !== null) {
            const firestore = getFirestore()

            firestore.collection("wireFramers").doc(wireframe.id).update({
                timeAccessed: Date.now()
            })
        }
        if(wireframe)
            this.buildControls()
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;

        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        
        return(
            <div className="wireframe container">
                <input id="name" type="text" className="wireframe header" defaultValue={wireframe ? wireframe.name : "name"} onChange={this.updateName}></input>
                    <div className="wireframe dims">
                        Width
                        <input id="width" type="text" className="dimfield" defaultValue={wireframe ? wireframe.dimensions.width : "width"}/>
                        <br></br>
                        Height 
                        <input id="height" type="text" className="dimfield" defaultValue={wireframe ? wireframe.dimensions.height : "height"}/>
                        <br></br>
                        <button className="updateDimensions" onClick={this.submitDimensions}>Update Dimensions</button>
                    </div>


                    <div className="wireframe zoom">
                        <button className="zoomin">+</button>
                        <button className="zoomout">-</button>
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
                        <input type="text" value="Default"></input>
                    </div>
                    <div className="wireframe controlfontsize">
                        Control font size
                        <br></br>
                        <input type="text" value="Default"></input>
                    </div>
                    <div className="wireframe controlborder">
                        Thickness
                        <input type="text" value="Default"></input>
                        <br></br>
                        Radius
                        <input type="text" value="Default"></input>
                    </div>
                    <div className="wireframe controlcolor">
                        Control color
                        <SketchPicker></SketchPicker>
                    </div>
                    <div id="sandbox" className="wireframe sandbox" style={wireframe ? {paddingRight: wireframe.dimensions.width+"px", paddingBottom: wireframe.dimensions.height+"px", marginRight:"7%", marginTop:"0px", marginLeft:"450px"}:{}}>
                    </div>
            </div>
        );
    }


    buildControls = () => {
        const wireframe = this.props.wireframe
        const containers = []

        for(var i=0; i<wireframe.items.length;i++){
            const container = <div id={wireframe.items[i].id} 
            style={{backgroundColor: wireframe.items[i].color, position: "absolute", marginLeft:wireframe.items[i].position.x+"px", marginTop:wireframe.items[i].position.y+"px", height:wireframe.items[i].size.height+"px", width:wireframe.items[i].size.width+"px", 
            fontsize:wireframe.items[i].fontsize+"pt", fontcolor:wireframe.items[i].fontcolor, backgroundColor:wireframe.items[i].color, border:wireframe.items[i].border}}> {wireframe.items[i].text}
            </div>
            containers.push(container)
        }

        ReactDOM.render(
            containers,
            document.getElementById("sandbox")
        )
    }

    // changes the wireframe's name based on the name field
    updateName = (e) => {
        const firestore = getFirestore()
        let name_ = document.getElementById("name").value
        firestore.collection("wireFramers").doc(this.props.id).update({
            name : name_
        })
    }

    // creates a new container control and renders it
    newContainer = () => {
        const firestore = getFirestore()
        const wireframe = this.props.wireframe;

        // default container object
        let newcontainer = {
            id : "control"+numControls,
            position : {x : 50, y : 50},
            size : {height : 100, width : 100},
            selected : false,
            text : "",
            fontsize : 20,
            fontcolor : "black",
            color : "white",
            border : "solid"
        }
        const container = <div id={newcontainer.id} 
        style={{backgroundColor: newcontainer.color, position: "absolute", marginLeft:newcontainer.position.x+"px", marginTop:newcontainer.position.y+"px", height:newcontainer.size.height+"px", width:newcontainer.size.width+"px", 
        fontsize:newcontainer.fontsize+"pt", fontcolor:newcontainer.fontcolor, backgroundColor:newcontainer.color, border:newcontainer.border}}>{newcontainer.text}
        </div>
        numControls += 1

        // new container added to wireframe's controls list and rendered
        var clone = wireframe.items
        clone.push(newcontainer)
        firestore.collection("wireFramers").doc(this.props.id).update({
            items : clone
        })
        this.buildControls()

    }
    newLabel = () => {
        
    }
    newButton = () => {
        
    }
    newText = () => {
        
    }

    submitDimensions = (e) => {

        const firestore = getFirestore()

        let width_ = document.getElementById("width").value
        let height_ = document.getElementById("height").value

        if(width_ > 900)
            width_ = 900
        if(height_ > 900)
            height_ = 900

        firestore.collection("wireFramers").doc(this.props.id).update({
            dimensions : {"height":height_, "width":width_}
        })
    }
}


const mapStateToProps = (state, ownProps) => {
        
    const { id } = ownProps.match.params; // this list's id
    const { wireFramers } = state.firestore.data; // the collection from the store
    const wireframe = wireFramers ? wireFramers[id] : null; // the list at the 'id' index of the store

    if(wireframe) {
        wireframe.id = id
    }

    return {
        wireframe,
        id,
        wireFramers,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireFramers' },
    ]),
)(EditScreen);