import React, { Component } from 'react';
import './DeletePopup.css'

const t = str => str

class DeletePopup extends React.Component {
  render() {
    // const { t } = this.props 

    return (
      <div onClick={this.props.cancel} className='popup'>
        <div onClick={(e)=>{e.stopPropagation()}} className='popup_inner'>
          <div class="modal-header">
            <button type="button" class="close" onClick={this.props.cancel}>×</button>
            <h4 class="modal-title">{t('Deletion confirmation')}</h4>
          </div>                 
          <div style={{padding:15}}>        
            <span style={{fontSize:14, color:'#454B4D', lineHeight:'26px'}}>{this.props.text}</span>          
          </div>
          <div style={{borderTop:'1px solid #e5e5e5', padding:15}}>
            <div style={{height:35, display:'inline-block'}}> </div>
            <button autoFocus class='button-div' 
              style={{float:'right'}} 
              onClick={this.props.cancel}>
              Cancel
            </button>
            <button class='button-div' 
              style={{margin:'0 12px 0 0', float:'right', }}
              onClick={this.props.confirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>      
    );
  }
}

export default DeletePopup;