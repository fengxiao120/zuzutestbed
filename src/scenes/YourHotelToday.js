import React from "react";
import Navigation from '../components/Navigation'

class YourHotelToday extends React.Component {
  render() {
    return (
    <div>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Reservations'
    		path={'/your-hotel-today'}
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
			<div style={{height:'100%', fontWeight:600, fontSize:36, 
				textAlign:'center', marginTop:100,
			background:'#def', fontFamily: "Raleway Webfont",}}>
			This is YourHotelToday
			</div>
		</div>
     </div>
    );
  }
}

export default YourHotelToday;
