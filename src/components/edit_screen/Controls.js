import React, { Component } from 'react'
import { Rnd } from 'react-rnd';

export class Controls extends Component {
    render() {
        const { controls } = this.props;
        console.log('controls', controls)


        return (
            <div>
                {
                    controls.map((control) => {
                        return (<Rnd
                            size={{ width: control.width, height: control.height }}
                            position={{ x: control.x, y: control.y }}
                            onDragStop={(e, d) => { console.log('d.y', d.y); this.props.updateState({ key: control.key, x: d.x, y: d.y }) }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                this.props.updateState({
                                    key: control.key,
                                    width: ref.style.width,
                                    height: ref.style.height,
                                    ...position,
                                });
                            }}
                        //bounds="parent"
                        >
                            {(control.type === "container") &&
                                <div style={control}>
                                </div>
                            }
                            {(control.type === "button") &&
                                <button style={control} >
                                {control.text}
                                </button>
                            }
                            {(control.type === "label") &&
                                <div style={control}>
                            {control.text}

                                </div>
                            }
                            {(control.type === "text") &&
                                <input value={control.text} style={control} />

                            }
                        </Rnd>)
                    })
                }
            </div >
        )
    }
}

export default Controls



