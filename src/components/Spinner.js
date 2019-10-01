import React from "react";


class Spinner extends React.Component {
  render() {
    return (
      this.props.loading?<div style={{position: this.props.local?'absolute':'fixed', left:0, right:0, top:0, bottom:0, 
        zIndex:200, background:'white', opacity:0.5, textAlign:'center'}}>
        <div style={{
          position:'absolute', top:'40%', display:'inline-block', width:50, height:50, transform: 'translateX(-50%)'}}>
          <img src={require('../img/loading.gif')} />
        </div>
        <div style={{
          position:'absolute', top:'40%', display:'inline-block', width:50, height:50, marginTop:3, transform: 'translateX(-50%)'}}>
          <img src={require('../img/zuzu-loading.gif')} />
        </div>        
      </div>:null
    );
  }
}

export default Spinner