import React from "react"

const t = str => str

class Header extends React.Component {
  render() {
    return (    
      <div className='header'>
        <div className={'header-tab'}
          onClick={ ()=>this.props.onClick('one-click-check-in') }>
          {t('One-click check-in')}
          { this.props.tab == 'one-click-check-in' && 
            <div style={{width: 'calc( 100% - 12px )', position:'absolute', background:'#f36f31', height:5, bottom:0 }}></div>
          }
        </div>
        <div className={'header-tab'}>
          {t('Complete check-in')}
          { this.props.tab == 'complete-check-in' && 
            <div style={{width: 'calc( 100% - 12px )', position:'absolute', background:'#f36f31', height:5, bottom:0 }}></div>
          }           
        </div>   
        <div className={'header-tab ' + (this.props.noShowDisabled&&'disabled')}
          onClick={ this.props.noShowDisabled?null:()=>this.props.onClick('no-show') }>
          {t('No show')}
          { this.props.tab == 'no-show' && 
            <div style={{width: 'calc( 100% - 12px )', position:'absolute', background:'#f36f31', height:5, bottom:0 }}></div>
          }          
        </div>
        <div className={'header-tab ' + (this.props.cancelBookingDisable&&'disabled')}
          onClick={ ()=>this.props.onClick('cancel-booking') }>
          {t('Cancel booking')}
          { this.props.tab == 'cancel-booking' && 
            <div style={{width: 'calc( 100% - 12px )', position:'absolute', background:'#f36f31', height:5, bottom:0 }}></div>
          }          
        </div>                     
      </div>
    );
  }
}

export default Header;