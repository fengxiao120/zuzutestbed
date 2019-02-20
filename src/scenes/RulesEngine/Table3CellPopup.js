import React from "react";
import Color from '../../Color'

import Triangle1 from '../../components/Triangle1'

const t = str => str

class Table3CellPopup extends React.Component {
  state = {  
    price_wi_tax: this.props.price,
    price_wo_tax: parseInt(this.props.price/(1 + this.props.taxRate/100)),
    update_derived: false,
    update_derived_prev_manual: false,
  }

  // componentWillReceiveProps = (nextProps) => {
  //   if(this.props.adjustment != nextProps.adjustment)
  //     this.setState({ adjustment: nextProps.adjustment.replace('%',''), use_percentage: nextProps.adjustment.includes('%') })
  // }

  changeWithTax = ( e ) => {
    const price = parseInt(e.target.value)
    if(e.target.value=='')
      this.setState({price_wi_tax:'', price_wo_tax:''})
    else if( price > 0)
      this.setState({ price_wi_tax: price, price_wo_tax: Math.round(price/(1 + this.props.taxRate/100)) })
  }

  changeWithoutTax = ( e ) => {
    const price = parseInt(e.target.value)
    if(e.target.value=='')
      this.setState({price_wi_tax:'', price_wo_tax:''})
    else if( price > 0)
      this.setState({ price_wo_tax: price, price_wi_tax: Math.round(price*(1 + this.props.taxRate/100)) })
  }  

  validate = ( ) => {
    if( this.state.price_wi_tax > 0 ) 
        return true
    else{
      alert('Please enter an valid range')
      return false
    }
  }

  confirm = () => {
    if( this.state.price_wi_tax > 0 )
      this.props.onConfirm( this.state.price_wi_tax, this.state.update_derived, this.state.update_derived_prev_manual)
    else
      alert('Please enter an valid range')
  }

  cancel = () => {
    this.setState({ 
      price_wi_tax: this.props.price,
      price_wo_tax: parseInt(this.props.price/(1 + this.props.taxRate/100)),
      update_derived: false,
      update_derived_prev_manual: false
    })
    this.props.onCancel()
  }

  render() {
    console.log('Table3CellPopup rendering')
    return (
      <div onClick={(e)=>e.stopPropagation()} 
        style={{background:'white', position: 'absolute', zIndex:2, left: -74, top: 36, 
        minWidth:80, boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', borderRadius:4, ...this.props.style}}>
        <Triangle1 
          length={8}
          direction='top'
          style={{left:'46%', top: -4}}
        />       
        <div style={{padding:'12px 16px 8px',  fontSize: 10, textAlign:'left', color: '#888'}}>
          <div style={{display:'flex', textAlign:'left', lineHeight:'18px'}}>
            <div style={{width: 110}}>
            {t('Sell')}
            </div>
            <div>
            {t('Sell including tax')}
            </div>
          </div>
          <div style={{display:'flex', height:32, lineHeight:'32px', justifyContent:'center', alignItems:'center', marginBottom:3}}>
            <input className={'type1'}
              style={{padding:'0 10px', borderRadius:4, width:78, height:29, boxSizing:'content-box',
              fontSize: 14, border:'1px solid #ebebeb', textAlign:'right'}}
              value={this.state.price_wo_tax} 
              onChange={(e)=>this.changeWithoutTax(e)}
              />  
            <input className={'type1'}
              style={{padding:'0 10px', borderRadius:4, width:78, height:29, boxSizing:'content-box',marginLeft:8,
              fontSize: 14, border:'1px solid #ebebeb', textAlign:'right'}}
              value={this.state.price_wi_tax} 
              onChange={(e)=>this.changeWithTax(e)}
              />              
          </div>
          <div style={{lineHeight:1.2, width:100, textAlign:'right'}}>
            {t('Tax') + ': ' + (this.state.price_wi_tax - this.state.price_wo_tax)}
          </div>
          <div style={{display:'flex', alignItems:'center'}}>
            <div onClick={ () => {
              this.setState({update_derived: !this.state.update_derived})
            }} 
              style={{width:18, height:18, background: this.state.update_derived?Color.themeBlue:'white', lineHeight:'18px',
                cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
              <i className="tick-x" style={{display: this.state.update_derived?null:'none', 
                marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
            </div>                  
            <span style={{marginLeft:10}}>{t('Update derived?')}</span>
          </div>

          <div style={{display:'flex', alignItems:'center'}}>
            <div onClick={ () => {
              this.setState({update_derived_prev_manual: !this.state.update_derived_prev_manual})
            }} 
              style={{width:18, height:18, background: this.state.update_derived_prev_manual?Color.themeBlue:'white', lineHeight:'18px',
                cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
              <i className="tick-x" style={{display: this.state.update_derived_prev_manual?null:'none', 
                marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
            </div>                  
            <span style={{marginLeft:10, lineHeight:'12px'}}>{t('Update derived previously manually edited?')}</span>
          </div>

        </div>
        <div style={{background: Color.themeBlueLight, display:'flex', justifyContent:'space-between', color: Color.black1, 
          lineHeight:'14px', padding: '6px 16px', borderRadius:4,}}>
          <div onClick={this.cancel} className='clickable' style={{color: Color.themeBlue}}>
          {t('Cancel')}
          </div>
          <div onClick={this.confirm}
            className='clickable'
            style={{color: Color.themeBlue}}>
          {t('Submit')}
          </div>
        </div>
      </div>
    );
  }
}

export default Table3CellPopup