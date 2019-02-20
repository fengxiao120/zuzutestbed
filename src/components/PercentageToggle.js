import React from "react"
import Color from '../Color'

export default class PercentageToggle extends React.Component {
  render(){
    return (
      <div style={{display:'flex',  borderRadius: 16, height: 24, width:74, border: '1px solid #c0c0c0',
        background: 'white', position:'relative', ...this.props.style}}>
        <div onClick={ ()=>this.props.onPercentageClick(true) }
          className={this.props.percentageBased?'toggle-box-item in-focus':'toggle-box-item'}
          style={{ left:10 }}>
          %
        </div>
        <div onClick={ ()=>this.props.onPercentageClick(false) }
          className={this.props.percentageBased?'toggle-box-item':'toggle-box-item in-focus'}
          style={{ right:13 }}>
          #
        </div>      
        <div className={this.props.percentageBased?'toggle-box':'toggle-box in-right'}
          style={{background:Color.themeBlue, height:32, width:36, position:'absolute', top:-4, borderRadius:16}}></div>    
      </div>
    )
  }
}