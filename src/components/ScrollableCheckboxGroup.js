import React from "react";
import Color from "../Color"

import './ScrollableCheckboxGroup.css';

class ScrollableCheckboxGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {  
      selected: this.props.options.slice().map(item => item.id)
    }
    console.log('fuck constructor is run')
  }

  onSelect = ( id ) => {
    console.log(id)
    if(this.state.selected.includes(id))
      this.setState({selected: this.state.selected.filter( item => item != id )})
    else
      this.setState({selected: this.state.selected.concat( id )})
  }

  render() {
    console.log('ScrollableCheckboxGroup rendering')
    console.log(this.state.selected)
    return (
      <div style={{padding:8, display:'inline-block', minWidth: 300, color: '#4d4d59'}}>
        <div onClick={()=>this.props.setA2Z(this.props.topic, true, true)}
          className={this.props.sort_by==this.props.topic&&this.props.A2Z?'light-blue-hover active':'light-blue-hover'} 
          style={{padding:'6px 12px'}}>{'Sort A-Z'}</div>
        <div onClick={()=>this.props.setA2Z(this.props.topic, false, true)}
          className={this.props.sort_by==this.props.topic&&!this.props.A2Z?'light-blue-hover active':'light-blue-hover'} 
          style={{padding:'6px 12px'}}>{'Sort Z-A'}</div>
        <div style={{borderBottom: '1px solid #e0e0e0', margin:'2px 0'}}></div>
        <div className='light-blue-hover'
          onClick={()=>{
            if(this.state.selected.length == this.props.options.length)
              this.setState({selected: []})
            else
              this.setState({selected: this.props.options.slice().map(item => item.id)})
          }}
          style={{padding:'6px 12px', cursor:'pointer'}}>
          {this.state.selected.length == this.props.options.length?'Deselect all':'Select all'}
        </div>
        <div style={{maxHeight:360, overflow: 'auto'}}>
        { this.props.options.map(item => <div>
            <div style={{display: 'flex', padding:'6px 8px'}}>
              <div onClick={()=>this.onSelect(item.id)} 
                style={{width:18, height:18, background: this.state.selected.includes(item.id)?Color.themeBlue:'white', 
                  cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
                <i className="tick-x" style={{display: this.state.selected.includes(item.id)?null:'none', 
                  marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
              </div>
              <div style={{marginLeft:15}}>
                {item.name}
              </div>
            </div>
          </div>
        )}    
        </div>
        <div style={{padding: '6px 8px'}}><span style={{color:'#f36f31'}}>*</span>{'At least one option must be selected'}</div>
        <div style={{display:'flex', justifyContent:'space-between', padding:'0 8px'}}>
          <div className="button-div" style={{width:143}}>
          {'Go'}
          </div>
          <div className="button-div">
          {'Cancel'}
          </div>          
        </div>
      </div>
    );
  }
}

export default ScrollableCheckboxGroup