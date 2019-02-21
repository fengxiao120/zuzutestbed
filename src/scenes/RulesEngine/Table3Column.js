import React from "react";
import Color from '../../Color'

import Table3Cell from './Table3Cell'

const t = str => str

const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CellTypeColorMapping = {
  available: '#9bd0fe',
  manually_edited: '#ffa377',
  derived_no_link: '#ffdfd0',
  broken_link: '#e3c6d7',
}

class Table3Column extends React.Component {
  state = {  
    visibleRTIndex: -1,
    visibleRateIndex: -1,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state != nextState || this.props.day != nextProps.day || this.props.occupancyType != nextProps.occupancyType || 
      this.props.tableCollapsed != nextProps.tableCollapsed )
      return true
    else
      return false
  }

  editCell = (price, update_derived, update_derived_prev_manual, room_type_index, rate_index) => {
    this.props.editCell(price, update_derived, update_derived_prev_manual, room_type_index, rate_index, this.props.dayIndex)
    this.collapsePopup()
  }

  render() {
    // console.log('Table3Column rendering')
    const { day, dayIndex, occupancyType, tableCollapsed, roomTypes, taxRate } = this.props
    return (
      <div style={{minWidth:78}}>
        <div style={{height:66, display:'flex', flexDirection:'column-reverse'}}>
          <div style={{position:'relative', background:day.disabled?'#e6e6e6':null, 
            overflow:'hidden', height:42, display:'flex', flexDirection:'column-reverse'}}>
            <div onClick={()=>this.props.toggleColumn(dayIndex, false)} 
              className='table3-header-bottom-left'
              style={{ display: day.disabled?'block':'none'}}>
            </div>                                                  
            <div style={{textAlign:'right', paddingRight:12, fontSize:15, fontWeight:600,
              color:'#4d4d59',borderRight:'1px solid #ebebeb', }}>
              {day.date.slice(8,10)}
            </div>
            <div style={{justifyContent:'flex-end', paddingRight:12, fontSize:12, color:'#4d4d59', display:'flex',
            alignItems:'flex-end', 
            borderRight: '1px solid white', position:'relative', height: 21,  overflow:'hidden'}}>
              <div onClick={()=>this.props.toggleColumn(dayIndex, true)}
                className='table3-header-top-right'
                style={{ display: day.disabled?'none':'block' }}>                    
              </div>     
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
          {day.occupancy[occupancyType]}            
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
              <Table3Cell 
                key={rate_index}
                rate={rate}
                rate_index={rate_index}
                room_type_index={room_type_index}
                dayIndex={dayIndex}
                day_disabled={day.disabled}
                collapsed={tableCollapsed || roomTypes[room_type_index].collapsed}
                disableCell={this.props.disableCell}
              />
            )}
          </div> )
        }                                                                                                                                         
      </div> 
    );
  }
}

export default Table3Column