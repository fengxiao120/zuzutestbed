import React from "react";
import Color from '../../Color'

const t = str => str

class EditableRange extends React.Component {
  state = {  
    low: this.props.range.low,
    high: this.props.range.high,
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ low: nextProps.range.low, high: nextProps.range.high })
  }

  updateRowName = (e, high_or_low) => {
    if( high_or_low=='high' )
      this.setState({ high: parseInt(e.target.value) || '' })
    else if( high_or_low=='low')
      this.setState({ low: parseInt(e.target.value) || '' })
  }

  validate = ( ) => {
    const lowBound = isNaN(this.props.lowBound)?3:this.props.lowBound
    if( this.state.low >= lowBound && this.state.low < this.props.highBound ){
      if( !this.props.single ){
        if( this.state.high <= this.props.highBound && this.state.high > this.state.low ){
          console.log('wtf1')
          return true
        }
      }
      else{
        console.log('wtf2')
        return true
      }      
    }
      
    alert('Please enter an valid range')
    return false
  }

  confirmUpdatingRowName = () => {
    if(this.validate())
      this.props.onConfirm(this.props.index, this.state)
  }

  cancelUpdatingRowName = () => {
    this.setState({ low: this.props.range.low, high: this.props.range.high })
    this.props.onCancel()
  }

  render() {
    console.log('EditableRange rendering')
    return (
      <div onClick={(e)=>e.stopPropagation()} style={{background:Color.themeBlueLight, position: 'absolute', zIndex:2, left:-4, top:-12,  
        minWidth:80, boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', padding:6, borderRadius:2}}>
        <div style={{display:'flex', color:'#0079cc',  justifyContent:'center', padding:'2.5px 0',
          fontSize:10, lineHeight:'1', opacity: 0.75}}>
          { !this.props.header && <div style={{width:12, paddingRight:4, }}>&nbsp;</div> }
          <div style={{width:50, textAlign:'center',}}>
            { this.props.lowBound?'>' + (this.props.lowBound - 1) + '%':''}
          </div>
          { !this.props.single && <div style={{width:10, }}>&nbsp;</div> }
          { !this.props.single && <div style={{width:50, textAlign:'center',}}>{this.props.highBound!=100 &&('<' + (this.props.highBound + 1) + '%')}</div> }
        </div>
        <div style={{display:'flex', height:32, lineHeight:'32px', justifyContent:'center'}}>
          { !this.props.header && 
            <div style={{width:12, paddingRight:4 , textAlign:'right', fontSize:12, color:'#65646d'}}>{this.props.index + 1}</div> 
          }
          <input style={{width:20, padding:0, borderRadius:4, width:48, height:27, boxSizing:'content-box',
            fontSize: 18, border:'1px solid #ebebeb', textAlign:'center'}}
            disabled={!this.props.lowBound || (this.props.header && this.props.lowBound == 3) }
            value={this.state.low} 
            onChange={(e)=>this.updateRowName(e, 'low')}
            />
          { !this.props.single && <div style={{width:10, textAlign:'center', color: Color.black1}}>-</div> }
          { !this.props.single && <input style={{width:20, padding:0, borderRadius:4, width:48, height:27, boxSizing:'content-box',
            fontSize: 18, border:'1px solid #ebebeb', textAlign:'center'}}
            disabled={this.props.highBound==100}
            value={this.state.high}
            onChange={(e)=>this.updateRowName(e, 'high')}
            />}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', color: Color.black1, lineHeight:'12px',
          padding: '5px 6px 0', borderTop:'1px solid #dedede'}}>
          <div onClick={this.cancelUpdatingRowName} className='clickable' >
          {t('Cancel')}
          </div>
          <div onClick={this.confirmUpdatingRowName}
            className='clickable'
            style={{color: Color.themeBlue}}>
          {t('Ok')}
          </div>
        </div>
      </div>
    );
  }
}

export default EditableRange