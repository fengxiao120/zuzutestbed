import React from "react";
import Color from '../../Color'
import { withNamespaces } from 'react-i18next'


class SurchargeEditor extends React.Component {
  state = {  
    surcharge: parseInt(this.props.surcharge.replace('%','')),
    use_percentage: this.props.surcharge.includes('%'),
    overwrite_day_surcharge: this.props.overwriteDaySurcharge,
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.surcharge != nextProps.surcharge)
      this.setState({ surcharge: nextProps.surcharge.replace('%',''), use_percentage: nextProps.surcharge.includes('%') })
  }

  adjust = (e) => {
    if(e.target.value=='' || e.target.value=='-')
      this.setState({surcharge: e.target.value})
    else if( this.state.use_percentage && parseInt(e.target.value) > -100 )
      this.setState({ surcharge: parseInt(e.target.value) || '0' })
    else if( !this.state.use_percentage && parseInt(e.target.value) > -100000000)
      this.setState({ surcharge: parseInt(e.target.value) || '0' })
  }

  monitorEnter = ( e ) => {
    if(e.key=='Enter'){
      this.confirmAdjustment()
    }
  }

  validate = ( ) => {
    const { t } = this.props
    if( (this.state.use_percentage && parseInt(this.state.surcharge) > -100) || 
        (!this.state.use_percentage && parseInt(this.state.surcharge) > -100000000) )
        return true
    else{
      alert(t('Please enter an valid value'))
      return false
    }
  }

  confirmAdjustment = () => {
    if(this.validate())
      this.props.onConfirm( {amount: this.state.surcharge + (this.state.use_percentage?'%':''), overwrite_day: this.state.overwrite_day_surcharge}, this.props.index)
  }

  cancelAdjustment = () => {
    this.setState({ surcharge: this.props.surcharge.replace('%',''), use_percentage: this.props.surcharge.includes('%') })
    this.props.onCancel()
  }

  render() {
    const { t } = this.props
    return (
      <div onClick={(e)=>e.stopPropagation()} 
        style={{background:Color.themeBlueLight, position: 'absolute', zIndex:2, minWidth:80, padding:8,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', borderRadius:2, ...this.props.style}}>
        <div style={{display:'flex', height:32, lineHeight:'32px', justifyContent:'center', alignItems:'center', marginBottom:3}}>
          <input style={{padding:0, borderRadius:4, width:56, height:27, boxSizing:'content-box',
            fontSize: 14, border:'1px solid #ebebeb', textAlign:'center', color:'#333'}}
            value={this.state.surcharge}
            onKeyPress={this.monitorEnter}
            onChange={(e)=>this.adjust(e, 'low')}
            />
          <div style={{display:'flex',  borderRadius: 16, height: 24, width:74, border: '1px solid #c0c0c0',
            background: 'white', position:'relative', marginLeft:10}}>
            <div onClick={()=>this.setState({use_percentage: true})}
              className={this.state.use_percentage?'toggle-box-item in-focus':'toggle-box-item'}
              style={{ left:10 }}>
              %
            </div>
            <div onClick={()=>this.setState({use_percentage: false})}
              className={this.state.use_percentage?'toggle-box-item':'toggle-box-item in-focus'}
              style={{ right:13 }}>
              #
            </div>      
            <div className={this.state.use_percentage?'toggle-box1':'toggle-box1 in-right'}
              style={{height:30, width:36, position:'absolute', top:-3, borderRadius:16}}></div>    
          </div>          
        </div>

        <div style={{display: this.props.isWeekDaySurcharge?'flex':'none', alignItems:'center', width: 144, marginBottom: 5}}>
          <div onClick={ () => {
            this.setState({overwrite_day_surcharge: !this.state.overwrite_day_surcharge})
          }} 
            style={{minWidth:18, height:18, background: this.state.overwrite_day_surcharge?Color.themeBlue:'white', lineHeight:'18px',
              cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
            <i className="tick-x" style={{display: this.state.overwrite_day_surcharge?null:'none', 
              marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
          </div>                  
          <span style={{marginLeft:6, lineHeight:'12px', color: '#65646d'}}>
            {t('Overwrite stay-date specific surcharges')}
          </span>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', color: Color.black1, lineHeight:'12px',
          padding: '5px 6px 0', borderTop:'1px solid #dedede'}}>
          <div onClick={this.cancelAdjustment} className='clickable' >
          {t('Cancel')}
          </div>
          <div onClick={this.confirmAdjustment}
            className='clickable'
            style={{color: Color.themeBlue}}>
          {t('Ok')}
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces('translation')(SurchargeEditor);