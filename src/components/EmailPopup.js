import React, { Component } from 'react';

import './EmailPopup.css'

const t = (str) => str

class EmailPopup extends React.Component {
  state = {
    showMessage: false,
    emails: this.props.emails.slice(),
    manual_emails: [],
    message: '',
  }

  markFinished = ( e ) => {
    if(!e.target.matches('.email-popup-email.manual, .email-popup-email.manual *')){
      let manual_emails = this.state.manual_emails.slice()
      for(let i = 0; i < manual_emails.length; i++)
        if(manual_emails[i].address.trim()){
          manual_emails[i].finished = true
        }      
      this.setState({manual_emails: manual_emails})
    }
    e.stopPropagation()
  }

  validateEmail = ()=>{
    const regex_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const selected_emails = this.state.emails.filter( item => item.checked ).map(item => item.email)

    const non_empty_manual_emails = this.state.manual_emails.filter( item => item.address.trim() ).map(item => item.address)

    const manual_emails = this.state.manual_emails.slice()

    if( !non_empty_manual_emails.length && !selected_emails.length ){
      this.setState({message: 'You did not select any email', showMessage:true})
      const that = this
      setTimeout(()=>that.setState({showMessage:false}), 3200)
      return        
    } else if( non_empty_manual_emails.length ){
      for (let email of manual_emails) {
        if( email.address.trim() && !regex_pattern.test(email.address)){
          email.invalid = true
          this.setState({manual_emails: manual_emails})
          return     
        }
      }      
    }

    this.props.confirm(selected_emails.concat(non_empty_manual_emails).join(','))
    this.props.cancel()
  }

  tickEmail = ( index ) => {
    const new_emails = this.state.emails.slice()
    new_emails[index] = {...new_emails[index], checked: !new_emails[index].checked }
    this.setState({emails: new_emails})
  }

  addOneMoreManualEmail = ( e ) => {
    this.setState({manual_emails: this.state.manual_emails.concat({address:'', finished:false, invalid: false}) })
    e.stopPropagation()
  }

  onInputFocus = ( e, index ) => {
    let manual_emails = this.state.manual_emails.slice()
    for(let i = 0; i < manual_emails.length; i++ ){
      if(manual_emails[i].address.trim())
        manual_emails[i].finished = true
    }
    manual_emails[index].finished = false
    manual_emails[index].invalid = false
    this.setState({manual_emails: manual_emails})
  }

  changeManualEmail = ( e, index ) => {
    let manual_emails = this.state.manual_emails.slice()
    manual_emails[index].address = e.target.value
    manual_emails[index].finished = false
    
    this.setState({manual_emails: manual_emails})
  }

  deleteEmail = ( e, index ) => {
    let manual_emails = this.state.manual_emails.slice()
    manual_emails.splice(index, 1)
    this.setState({manual_emails: manual_emails})
  }

  monitorEnter = ( e, index ) => {
    if(e.key=='Enter'){
      let manual_emails = this.state.manual_emails.slice()
      if(manual_emails[index].address.trim()){
        manual_emails[index].finished = true
        this.setState({manual_emails: manual_emails})
      }
    }
  }

  render() {
    return (
      <div onClick={this.props.cancel} className='email-popup'>
        <div className='popup-inner-wrapper' style={{maxWidth: this.props.emails.length>1?855:580}} >


          <div className='email-cancel clickable' onClick={this.props.cancel}>
            &times;
          </div>          

        <div className='popup-inner' 
          onClick={this.markFinished}>

          <div className='email-popup-message'>
          {this.state.showMessage && t(this.state.message)}
          </div>

          <div class="email-popup-header">
            {t('Confirm email address')}
          </div>     

          <div class="email-popup-text1">
            {t('Email will be sent to')}
          </div>       

          <div className='email-popup-emails' style={{borderBottom:'1px dotted #d9d9d9'}}>  
            { this.state.emails.map( (email, index) =>
              <div key={index}
                className={'email-popup-email ' + (email.checked && 'checked')}>
                <div className='email-checkbox'
                  onClick={()=>this.tickEmail(index)}
                  >
                  { email.checked && <i className='tick-x' style={{marginLeft:6}}/> }
                </div>
                <div className='email-wrapper'>
                  <div className='email-type'>
                    {email.type}
                  </div>
                  <div className='actual-email' title={email.email}>
                    {email.email}
                  </div>
                </div>
              </div>
            )}       
          </div>  
          <div className='email-popup-emails'>  
            { this.state.manual_emails.map( (email, index) => 
              <div className={'email-popup-email manual ' + (email.finished && 'checked ') + (email.invalid && ' invalid')}>
                { email.finished? <div style={{width:38}}>&nbsp;</div> :         
                  <div className='blue-circle clickable' onClick={(e) => this.deleteEmail(e, index)}>
                    <div className='vertical-line'></div>
                  </div>
                }
                <input autoFocus
                  placeholder={t('Additional recipient')}
                  value={email.address} 
                  onChange={(e)=>this.changeManualEmail(e, index)}
                  onKeyPress={(e)=>this.monitorEnter(e, index)}
                  onFocus={(e)=>this.onInputFocus(e, index)}
                />
                <div className='text-below'>{t('Please enter a valid email address')}</div>
              </div> 
            )}
            <div className={!this.state.manual_emails || this.state.manual_emails.filter( email => !email.finished ).length?'hidden':'add-one-more'}>
              <div onClick={this.addOneMoreManualEmail}
                className='add-one-more-button'>
              +
              </div>
              <span>{t('Add one more')}</span>
            </div>            
          </div>

          <div className='confirm-cancel'>
            <div onClick={this.validateEmail} className='email-popup-confirm clickable'>
                {t('Confirm')}
            </div>
            <div onClick={this.props.cancel}  className='email-popup-cancel clickable'>
                {t('Cancel')}
            </div>
          </div>

        </div>
        </div>
      </div>
    );
  }
}

export default EmailPopup;