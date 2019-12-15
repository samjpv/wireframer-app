import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { getFirestore } from 'redux-firestore';

class WireframeLinks extends React.Component {
    render() {
        const wireframes = this.props.wireframes
        const firestore = getFirestore()
        const auth = this.props.auth

        if(wireframes !== undefined) {
            for(var i=0; i<wireframes.length; i++){
                if(wireframes[i].timeAccessed == null) {
                    firestore.collection("wireFramers").doc(wireframes[i].id).update({
                        timeAccessed : Date.now()
                    })
                }
            }
        }

        // sorting wireframes by timestamp
        if(wireframes !== undefined){
            wireframes.sort((a,b) => (a.timeAccessed < b.timeAccessed) ? 1 :
                                    (a.timeAccessed > b.timeAccessed) ? -1 :
                                    0)
        }

        // filtering 
        if(wireframes !== undefined){
            for(var i=0; i<wireframes.length; i++){
                if(wireframes[i].user != auth.uid && wireframes[i].user != null)
                    wireframes.splice(i, 1)
            }
            console.log("WIREFRAMES")
            console.log(wireframes)
            console.log(auth.uid)
        }

        return (
            <div className="wireframes section">
                {wireframes && wireframes.map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireFramers,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);