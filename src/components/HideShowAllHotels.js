import React from "react";

const t = str => str

const HideShowAllHotels = ( props ) => 
	<span style={{cursor:'pointer', color:'#4e4c5b'}}
		onClick={props.toggle}>
		<span style={{fontSize:8, display:'inline-block', width:16,
		  transform:props.collapsed?'scale(1, 1.6) translateY(-1.5px)': 'scale(1.8, 1) translateY(-1.5px)' }}>
		  {props.collapsed?String.fromCharCode(9658):String.fromCharCode(9660)}
		</span>           
		{ props.collapsed?t('Show all hotels'):
	  	t('Hide all hotels')}
	</span> 

export default HideShowAllHotels