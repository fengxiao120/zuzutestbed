import React from "react";

const positionOffsetMapping = {
	'top-right': ['top','right'],
	'top-left': ['top','left'],
	'bottom-left': ['bottom','left'],
	'bottom-right': ['bottom','right'],
}

const CornerTriangle = ( props ) => 
	<div className={props.className}
		onClick={props.onClick}
		style={{width:12, height:12, overflow:'hidden', position:'absolute', 
		[positionOffsetMapping[props.position][0]]: -1, [positionOffsetMapping[props.position][1]]: -1}}>
        <div style={{transform: 'rotate(45deg)', cursor: 'pointer', background: props.color, position: 'absolute', width: 24, height: 24,
    		[positionOffsetMapping[props.position][0]]: -15, [positionOffsetMapping[props.position][1]]: -15}}>
    	</div>
	</div>    

export default CornerTriangle