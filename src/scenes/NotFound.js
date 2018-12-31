import React from "react";
import Navigation from '../components/Navigation'

class Notfound extends React.Component {
  render() {
    return (
    <div>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', 
    		display:'inline-block', verticalAlign:'top', textAlign:'center'}}> 
    		<h1>Not found</h1>
		</div>
     </div>
    );
  }
}

export default Notfound;
