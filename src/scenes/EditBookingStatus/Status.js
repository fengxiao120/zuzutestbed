import React from "react"
import { withNamespaces } from 'react-i18next'

class Status extends React.Component {
  state = {
    status_dropdown: false,
    acknowledgement_dropdown: false,
    acknowledgement_action_dropdown: false,
  }

  componentDidMount = () => { 
    window.addEventListener('click', this.collapseDropdown)
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = (event) => {
    if( !event.target.matches('.status-info-dropdown') )
      this.setState({ status_dropdown: false })
    if( !event.target.matches('.acknowledgement') )
      this.setState({ acknowledgement_dropdown: false })    
    if( !event.target.matches('.acknowledgement-status-container *') )
      this.setState({ acknowledgement_action_dropdown: false })      
  }

  render() {
    const { t, statusHistory, acknowledgementHistory } = this.props
    return (    
      <div className='status-and-acknowledgement'>
        <div className={'center-wrapper clickable-dropdown-container ' + (this.state.status_dropdown&&'active')}>
          <div className='clickable status-info-dropdown' style={{color:'#337ab7', fontSize:11}}
            onClick={()=>this.setState({status_dropdown: !this.state.status_dropdown})}>
            {t('Status')}
          </div>
          <div className={'status ' + this.props.status}>
            {t(this.props.status)}
          </div>
          <div className='status-dropdown dropdown-content'>
            <div className='status-label'>{t('STATUS')}</div>
            { statusHistory.map( item => 
              <div className='flex-wrap-wrapper'>
                <div className='left-wrapper'>
                  <div className='status-header'>{t('From')}</div>
                  <div>{t(item.from)}</div>
                </div>
                <div className='left-wrapper'>
                  <div className='status-header'>{t('To')}</div>
                  <div>{t(item.to)}</div>
                </div>
                <div className='left-wrapper'>
                  <div className='status-header'>{t('User')}</div>
                  <div>{ item.user }</div>
                </div>
                <div className='left-wrapper'>
                  <div className='status-header'>{t('Changed date')}</div>
                  <div>{ item.date }</div>
                </div>
              </div>
            )}
            { !statusHistory.length && 
              <div className='none-spacer'>{t('None')}</div>
            }                       
          </div>
        </div>

        <div className='center-wrapper'>
          <div className={'clickable acknowledgement clickable-dropdown-container ' + (this.state.acknowledgement_dropdown&&'active') }
            style={{color:'#337ab7', fontSize:11}}
            onClick={()=>this.setState({acknowledgement_dropdown: !this.state.acknowledgement_dropdown})}>
            {t('Hotel acknowledgement')}
            <div className='acknowledgement-dropdown dropdown-content'>
              <div className='status-label'>{t('HOTEL ACKOWLEGEMENT')}</div>
              { acknowledgementHistory.map( item => 
                <div className='flex-wrap-wrapper'>
                  <div className='left-wrapper'>
                    <div className='status-header'>{t('Booking status')}</div>
                    <div>{t(item.booking_status)}</div>
                  </div>
                  <div className='left-wrapper'>
                    <div className='status-header'>{t('Hotel acknowledged')}</div>
                    <div>{t(item.is_acknowledged)}</div>
                  </div>
                  <div className='left-wrapper'>
                    <div className='status-header'>{t('User')}</div>
                    <div>{ item.user }</div>
                  </div>
                  <div className='left-wrapper'>
                    <div className='status-header'>{t('Changed date')}</div>
                    <div>{ item.date }</div>
                  </div>
                </div>
              )}
              { !acknowledgementHistory.length && 
                <div className='none-spacer'>{t('None')}</div>
              }           
            </div>            
          </div>
          <div className={'clickable clickable-dropdown-container acknowledgement-status-container ' + this.props.acknowledgementStatus
            + (this.state.acknowledgement_action_dropdown?' active':'')}
            onClick={()=>this.setState({ acknowledgement_action_dropdown: !this.state.acknowledgement_action_dropdown })}>
            <div className='acknowledgement-status'>{t(this.props.acknowledgementStatus)}</div>
            <span className='dropdown-triangle'>▼</span>

            <div className='acknowledgement-button-dropdown dropdown-content'>
              <div>{t(this.props.acknowledgementStatus + '-action')}</div>
            </div>
          </div>          
        </div>        
      </div>
    );
  }
}

export default withNamespaces('translation')(Status);