import React from "react";


class Spinner extends React.Component {
  render() {
    return (
      this.props.spinning?<div style={{position:'fixed', left:0, right:0, top:0, bottom:0, zIndex:200,
      	background:'white', opacity:0.5, textAlign:'center'}}>
        <div style={{
        	position:'absolute', top:'40%', display:'inline-block'}}>
          <img src={require('../img/loading.gif')} />
        </div>
        <div style={{
        	position:'absolute', top:'40%', display:'inline-block', marginTop:3}}>
          <img src={require('../img/zuzu-loading.gif')} />
        </div>        
      </div>:null
    );
  }
}

export default Spinner