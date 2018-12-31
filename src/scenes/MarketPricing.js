import React from "react";
import Navigation from '../components/Navigation'

class MarketPricing extends React.Component {
  render() {
    return (
    <div>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Revenue management'
    		path='/revenue-management/market-pricing'
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  			<div style={{fontWeight:600, fontSize:36, height:140,borderBottom:'2px solid #ccc',
          textAlign:'center', verticalAlign:'bottom', lineHeight:'140px',
          background:'#def', fontFamily: "Raleway Webfont",}}>
  			 This is MarketPricing
  			</div>
		  </div>
     </div>
    );
  }
}

export default MarketPricing;
