import React from "react";

const positionOffsetMapping = {
	'top-right': ['top','right'],
	'top-left': ['top','left'],
	'bottom-left': ['bottom','left'],
	'bottom-right': ['bottom','right'],
}

const IconWithHover = ( props ) => 
	<div className={'dropdown-container ' + props.className} 
	style={{cursor:'pointer', marginLeft:3, lineHeight:'14px', ...props.style}}>
		<img src={require('../img/i-icon.svg')} style={{}} />
		<div className="dropdown-content" 
		  style={{top:-20, left:'100%', padding:12, marginLeft: 12, boxShadow: '0 2px 7px 0 #bbb', width:280, zIndex:1,textAlign:'left',
		  boxSizing:'content-box', background:'white', borderRadius:4,  fontSize:12, lineHeight:1.4121}}>
		  <div style={{transform:'rotate(45deg)', boxShadow: '-2px 2px 7px -2px #aaa', background:'white',
		    width:16, height:16, position:'absolute', left:-8, top:20}}></div>
		  {props.explanation}
		</div>          
	</div>    

export default IconWithHover