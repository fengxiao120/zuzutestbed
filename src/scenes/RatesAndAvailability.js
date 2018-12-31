import React from "react";
import Navigation from '../components/Navigation'

class RatesAndAvailability extends React.Component {
  render() {
    return (
    <div>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Rates and availability'
    		path={'/rates-and-availability'}
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  		  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
          textAlign:'center', height:140, borderBottom:'2px solid #ddd',
          background:'#def', fontFamily: "Raleway Webfont",}}>
          This is RatesAndAvailability
  			</div>
		  </div>
     </div>
    );
  }
}

export default RatesAndAvailability;
