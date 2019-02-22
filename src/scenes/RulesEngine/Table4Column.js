import React from "react";
import Color from '../../Color'

import Table3CellPopup from './Table3CellPopup'
import CornerTriangle from '../../components/CornerTriangle'
import IconWithHover from '../../components/IconWithHover'

const t = str => str

const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CellTypeColorMapping = {
  available: '#9bd0fe',
  manually_edited: '#ffa377',
  update_derived: '#ffdfd0',
  disabled: '#f1f1f1',
}

class Table4Column extends React.Component {
  state = {  
    visibleRTIndex: -1,
    visibleRateIndex: -1,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state != nextState || this.props.day != nextProps.day || this.props.occupancyType != nextProps.occupancyType || 
      this.props.tableCollapsed != nextProps.tableCollapsed || this.props.roomTypes != nextProps.roomTypes )
      return true
    else
      return false
  }

  collapsePopup = (e) => {
    // if(!e || !e.target.matches('.table3-cell, .table3-cell span'))
      this.setState({visibleRTIndex: -1, visibleRateIndex: -1})
  }

  showCellPopup = ( e, room_type_index, rate_index ) => {
    if( e.target.matches('.table3-cell, .table3-cell span') )
      this.setState({visibleRTIndex: room_type_index, visibleRateIndex: rate_index})
  }

  editCell = (price, update_derived, update_derived_prev_manual, room_type_index, rate_index) => {
    this.props.editCell(price, update_derived, update_derived_prev_manual, room_type_index, rate_index, this.props.dayIndex)
    this.collapsePopup()
  }

  render() {
    const { day, dayIndex, occupancyType, tableCollapsed, roomTypes, taxRate } = this.props
    return (
      <div style={{minWidth:78, flexGrow:1}}>
        <div style={{height:66, display:'flex', flexDirection:'column-reverse'}}>
          <div style={{position:'relative', background:day.disabled?'#e6e6e6':'#f9f9f9', 
            overflow:'hidden', height:42, display:'flex', flexDirection:'column-reverse'}}>                                             
            <div style={{textAlign:'right', paddingRight:12, fontSize:15, fontWeight:600,
              color:'#4d4d59',borderRight:'1px solid #ebebeb', }}>
              {day.date.slice(8,10)}
            </div>
            <div style={{justifyContent:'flex-end', paddingRight:12, fontSize:12, color:'#4d4d59', display:'flex',
            alignItems:'flex-end', 
            borderRight: '1px solid white', position:'relative', height: 21,  overflow:'hidden'}}>  
              {days[new Date(day.date ).getDay()]}
            </div>                                       
          </div>
          <div style={{textAlign:'right', paddingRight:12, fontSize:12, background:'#f9f9f9',lineHeight:'24px'}}>
            {day.date.slice(8,10)=='01' && mon[new Date(day.date ).getMonth()]}&nbsp;
            {day.date.slice(8,10)=='01' && new Date(day.date).getFullYear()}
          </div>                    
        </div>
        <div style={{background: Color.themeGreen, lineHeight:'34px', textAlign:'right', fontSize:15, paddingRight:12,
          borderBottom:'2px solid #aaa', borderRight:'1px solid #eee'}}>
          {occupancyType && day.occupancy[occupancyType]}            
        </div>
        <div style={{height:33, borderBottom:'1px solid #ebebeb',}}>
          &nbsp;
        </div>
        {
          day.rates.map( (room_type, room_type_index) => <div>
            <div key={room_type_index}
              style={{ borderRight:'1px solid #ebebeb', borderBottom:'1px solid #ebebeb', borderTop: '4px solid #337AB7',
              lineHeight: '28px', textAlign: 'right', paddingRight:10 }}>
              {room_type.available}
            </div>
            { room_type.rp_rates.map( (rate, rate_index) => 
              <div key={rate_index} className={'table3-cell-wrapper'} 
                style={{ display: !tableCollapsed && (!roomTypes[room_type_index] || !roomTypes[room_type_index].collapsed)?'block':'none' }}>
              <div 
                className={'table3-cell ' + ( room_type_index == this.state.visibleRTIndex
                && rate_index == this.state.visibleRateIndex && 'active ') + ((day.disabled|| rate.disabled)&&' disabled')}
                style={{ background: CellTypeColorMapping[rate.type] }}>
                { rate.value } 
                <span style={{color:day.disabled || rate.disabled?'#b7b7b7':'red', fontSize: 9, marginLeft:5, }}>{ rate.change }</span>
                <IconWithHover 
                  style={{position: 'absolute', right: 2, top: 2, color: '#333'}}
                  className='disabled-cell-info'
                  explanation={t('Shaded cells will not be applied when submitting price changes')}
                  position='right'
                />                       
              </div> 
              </div> 
            )}
          </div> )
        }                                                                                                                                         
      </div> 
    );
  }
}

export default Table4Column