import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { getFirestore } from 'redux-firestore';
import {Row, Col} from "react-materialize";
import { firestoreConnect } from 'react-redux-firebase';

class WireframeLinks extends React.Component {
    render() {
        const wireframes = this.props.wireframes
        if (wireframes) {
            for (var i = 0; i < wireframes.length; i++) {
                if (this.props.auth.uid !== wireframes[i].user && wireframes[i].user != null)
                    wireframes.splice(i, 1, wireframes[i])
            }
        }

        return (
            <div className="wireframes section">
            <Row>


                {wireframes && wireframes.map(wireframe => (
                    <Row>
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>

                    <button id="delete" onClick={() =>this.deleteWireframe(wireframe.id)} style={{ color: "red", fontWeight: "bold" }}>X</button>
                    </Row>

                    
                ))}
            </Row>    
            </div>
        );
    }

    deleteWireframe = (id) => {
                console.log('id', id)
                if(id){
                    const firestore = getFirestore()
                    console.log("ID", id)
                    firestore.collection("wireFramers").doc(id).delete()
            }
            }
}



const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps)
)(WireframeLinks);