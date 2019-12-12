import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class EditScreen extends Component {
    componentDidMount() {
        // sets a timestamp for when this was accessed
        const wireframe = this.props.wireframe;
        if (wireframe !== null) {
            const firestore = getFirestore()

            firestore.collection("wireFramers").doc(wireframe.id).update({
                timeAccessed: Date.now()
            })
        }
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
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
        
    const { id } = ownProps.match.params; // this list's id
    const { wireFramers } = state.firestore.data; // the collection from the store
    const wireframe = wireFramers ? wireFramers[id] : null; // the list at the 'id' index of the store

    // wireframe.id = id;

    // console.log("WIREFRAME")
    // console.log(id)

    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireFramers' },
    ]),
)(EditScreen);