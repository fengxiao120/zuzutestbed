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
    const { t } = this.props
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
            <div className='flex-wrap-wrapper'>
              <div className='left-wrapper'>
                <div className='status-header'>{t('From')}</div>
                <div>{t('Confirmed')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('To')}</div>
                <div>{t('Cancelled')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('User')}</div>
                <div>{t('Front-Desk-long name')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('Change date')}</div>
                <div>{t('21 Nov 18 10:41:50')}</div>
              </div>
            </div>
            <div className='flex-wrap-wrapper'>
              <div className='left-wrapper'>
                <div className='status-header'>{t('From')}</div>
                <div>{t('None')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('To')}</div>
                <div>{t('Confirmed')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('User')}</div>
                <div>{t('Front-Desk-long name')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('Change date')}</div>
                <div>{t('20 Nov 18 08:12:33')}</div>
              </div>
            </div>            
          </div>
        </div>

        <div className={'center-wrapper clickable-dropdown-container ' + (this.state.acknowledgement_dropdown&&'active')}>
          <div className='clickable acknowledgement' style={{color:'#337ab7', fontSize:11}}
            onClick={()=>this.setState({acknowledgement_dropdown: !this.state.acknowledgement_dropdown})}>
            {t('Hotel acknowledgement')}
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
          <div className='acknowledgement-dropdown dropdown-content'>
            <div className='status-label'>{t('HOTEL ACKOWLEGEMENT')}</div>
            <div className='flex-wrap-wrapper'>
              <div className='left-wrapper'>
                <div className='status-header'>{t('From')}</div>
                <div>{t('Confirmed')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('To')}</div>
                <div>{t('Cancelled')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('User')}</div>
                <div>{t('Front-Desk-long name')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('Change date')}</div>
                <div>{t('21 Nov 18 10:41:50')}</div>
              </div>
            </div>
            <div className='flex-wrap-wrapper'>
              <div className='left-wrapper'>
                <div className='status-header'>{t('From')}</div>
                <div>{t('None')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('To')}</div>
                <div>{t('Confirmed')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('User')}</div>
                <div>{t('Front-Desk-long name')}</div>
              </div>
              <div className='left-wrapper'>
                <div className='status-header'>{t('Change date')}</div>
                <div>{t('20 Nov 18 08:12:33')}</div>
              </div>
            </div>            
          </div>          
        </div>        
      </div>
    );
  }
}

export default withNamespaces('translation')(Status);