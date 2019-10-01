import React from "react";

const Checkbox = ( props ) => 
	<div onClick={ props.onClick } 
        style={{width:18, height:18, background: props.checked?'#337ab7':'white', 
        	cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
        <i className="tick-x" style={{display: props.checked?null:'none', 
            marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
    </div>

export default Checkbox