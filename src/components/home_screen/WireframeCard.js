import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFirestore } from 'redux-firestore';

class WireframeCard extends React.Component {

    render() {
        const wireframe = this.props
        return (
            <div className="card z-depth-0 todo-list-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{this.props.wireframe.name}</span>
                </div>
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

export default compose(connect(mapStateToProps))(WireframeCard);