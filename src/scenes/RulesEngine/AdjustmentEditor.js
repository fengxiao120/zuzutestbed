import React from "react";
import Color from '../../Color'

const t = str => str

class AdjustmentEditor extends React.Component {
  state = {  
    adjustment: this.props.adjustment.replace('%',''),
    use_percentage: this.props.adjustment.includes('%'),
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.adjustment != nextProps.adjustment)
      this.setState({ adjustment: nextProps.adjustment.replace('%',''), use_percentage: nextProps.adjustment.includes('%') })
  }

  adjust = (e) => {
    if(e.target.value=='' || e.target.value=='-')
      this.setState({adjustment: e.target.value})
    else if( this.state.use_percentage && parseInt(e.target.value) > -100 )
      this.setState({ adjustment: parseInt(e.target.value) || '' })
    else if( !this.state.use_percentage && parseInt(e.target.value) > -100000000)
      this.setState({ adjustment: parseInt(e.target.value) || '' })
  }

  validate = ( ) => {
    if( (this.state.use_percentage && parseInt(this.state.adjustment) > -100) || 
        (!this.state.use_percentage && parseInt(this.state.adjustment) > -100000000) )
        return true
    else{
      alert('Please enter an valid range')
      return false
    }
  }

  confirmAdjustment = () => {
    if(this.validate())
      this.props.onConfirm(this.state.adjustment + (this.state.use_percentage?'%':''), this.props.index)
  }

  cancelAdjustment = () => {
    this.setState({ adjustment: this.props.adjustment.replace('%',''), use_percentage: this.props.adjustment.includes('%') })
    this.props.onCancel()
  }

  render() {
    console.log('AdjustmentEditor rendering')
    return (
      <div onClick={(e)=>e.stopPropagation()} 
        style={{background:Color.themeBlueLight, position: 'absolute', zIndex:2, left:-4, top:-12,  
        minWidth:80, boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', padding:8, borderRadius:2, ...this.props.style}}>
        <div style={{display:'flex', height:32, lineHeight:'32px', justifyContent:'center', alignItems:'center', marginBottom:3}}>
          <input style={{padding:0, borderRadius:4, width:56, height:27, boxSizing:'content-box',
            fontSize: 14, border:'1px solid #ebebeb', textAlign:'center'}}
            value={this.state.adjustment} 
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

export default AdjustmentEditor