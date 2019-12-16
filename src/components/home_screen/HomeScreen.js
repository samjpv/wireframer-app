import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import WireframeLinks from './WireframeLinks';

class HomeScreen extends Component {

    render() {

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks wireframes={this.props.wireframes} />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            Wireframer Tool<br />
                        </div>

                        <div className="home_new_list_container">
                            <button className="home_new_list_button" onClick={this.handleNewWireframe}>
                                Create a Wireframe
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleNewWireframe = (e) => {
        const firestore = getFirestore()
        const prop = this.props;

        // add new wireframe
        firestore.collection("wireFramers").add({
            selectedControl: 0,
            name: "unnamed",
            owner: "UNKNOWN",
            user: this.props.auth.uid,
            height: 500, width: 500, newWidth: 500, newHeight: 500,
            controls: [{
                key: 0,
                type: "container",
                backgroundColor: "white",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                borderColor: "black",
                borderRadius: "5px",
                borderStyle: "solid",
                fontsize: 20,
                text: "control0",
                timeAccessed: 0
            }]
        }).then(function (DocumentReference) {
            prop.history.push("wireframe/" + DocumentReference.id);
        })
    }
}

// create a new wireframe 

const mapStateToProps = (state) => {
    console.log('state.firestore.ordered.wireFramers', state.firestore.ordered.wireFramers)
    return {
        auth: state.firebase.auth,
        wireframes: state.firestore.ordered.wireFramers
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props =>
        props.auth.uid ?
            [
                {
                    collection: 'wireFramers',
                    where: [['user', '==', props.auth.uid]],
                }
            ] : []
    ),
)(HomeScreen);