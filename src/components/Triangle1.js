import React from "react";

const directionTransformMapping = {
	top: 'rotate(135deg)',
	left: 'rotate(45deg)',
	bottom: 'rotate(-45deg)',
	right: 'rotate(-135deg)',
}

const Triangle1 = ( props ) => 
	<div style={{transform:directionTransformMapping[props.direction], boxShadow: '-2px 2px 7px -2px #aaa', background:'white',
        width:props.length, height:props.length, position:'absolute', ...props.style}}>
    </div> 

export default Triangle1