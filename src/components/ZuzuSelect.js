import React from "react";

import './ZuzuSelect.css'

class ZuzuSelect extends React.Component {
  state = {
    happy: false,
    value: '',
  }

  filter = ( options ) => {
    return options.filter( item => item.label.toLowerCase().includes(this.state.value.toLowerCase()) )
  }

  onChange = e => this.setState({value:e.target.value})

  onSelect = ( value, label ) => {
    this.setState({ value: label })
    this.props.onSelect(value)
  }

  render() {
    return (
      <div className={'zuzu-select-container ' + this.props.className}>
        <input className='zuzu-select-input' value={this.state.value} onChange={this.onChange}></input>
        <div className='zuzu-select-options-body'>
          { this.filter(this.props.options).map( item => 
            <div className='clickable zuzu-select-option' 
              onClick={()=>this.onSelect(item.value, item.label)}>
              {item.label}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ZuzuSelect