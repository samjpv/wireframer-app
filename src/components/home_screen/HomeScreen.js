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
                        <WireframeLinks/>
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
            name : "WIREFRAME",
            owner : "UNKNOWN",
            dimensions : {"height" : 500, "width" : 500},
            items : [],
            timeAccessed : Date.now(),  
        }).then(function(DocumentReference){
            prop.history.push("wireframe/"+DocumentReference.id);
        })
    }
}

// create a new wireframe 

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireFramers' },
    ]),
)(HomeScreen);