import React from "react"

import Table4Column from './Table4Column'

import PercentageToggle from '../../components/PercentageToggle'

import './Table3.css'
import RulesEngineApi from '../../api/RulesEngineApi'
import Color from '../../Color'

const SCROLL_STEP = 12
const SCROLL_INTERVAL = 16
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const t = str => str

class Table4 extends React.Component {
  constructor(props) {
    super();
    this.state = {
      month_in_display:  new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2,0),

      room_types: [],

      occupancy_type: 'raw_occupancy',
    }
  }  

  calendar_scroll_distance = 0

  componentWillReceiveProps = (nextProps) => {
    if(this.props.roomTypes != nextProps.roomTypes ){
      this.setState({ room_types: nextProps.roomTypes }) 
    }
  }

  whichMonthToDisplay = ( ) => {
    const day_count = this.calendar_scroll_distance/78;
    const current_mon = new Date().getMonth()
    if(this.state.month_in_display != this.props.table4Data[Math.floor(day_count)].date.slice(0,7))
      this.setState( {month_in_display: this.props.table4Data[Math.floor(day_count)].date.slice(0,7)} )
  }

  scrollLeft = () => {
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(), SCROLL_INTERVAL)
  }

  scrollLeftDirtyWork = () => {
    document.getElementById('calendar-view-container4').scrollBy(-SCROLL_STEP,0)
    this.calendar_scroll_distance = document.getElementById('calendar-view-container4').scrollLeft
    this.whichMonthToDisplay()
  }

  scrollRight = () => {
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(), SCROLL_INTERVAL)
  }

  scrollRightDirtyWork = () => {
    document.getElementById('calendar-view-container4').scrollBy(SCROLL_STEP,0)
    this.calendar_scroll_distance = document.getElementById('calendar-view-container4').scrollLeft
    this.whichMonthToDisplay()
  }

  onMouseOutLeft = () => {
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    clearInterval(this.setRightInterval)
  }

  toggleRoomType = (room_type_id) => {
    const new_room_types = this.state.room_types.slice()
    const index = new_room_types.findIndex( item => item.id == room_type_id)
    new_room_types[index].collapsed = !new_room_types[index].collapsed
    this.setState({room_types: new_room_types, table_collapsed: !new_room_types[index].collapsed? false: this.state.table_collapsed })
  }

  collapseAll = () => {
    const new_collapsed = !this.state.table_collapsed
    const new_room_types = this.state.room_types.map( item => { 
      item.collapsed = new_collapsed
      return item
    })
    this.setState({ room_types: new_room_types, table_collapsed: new_collapsed })
  }

  render() {
    console.log('table4 rendering')
    return (
      <div style={{display:'flex', overflow: 'visible', position:'relative', flexWrap:'wrap'}}>

        <div className='table-4-header' style={{background:'#f9f9f9', padding:'16px 20px', fontSize:18, width:'100%', height:56,
          boxSizing:'border-box'}}>
          {t('Required BAR to deliver recommended sell rates')}
        </div>

        <div className='table3-note' style={{textAlign:'right', display:'flex', width:'100%'}}>
          {t('Changes shown vs. current ‘calendar view’ BAR rates as <%/#>')}:
          <PercentageToggle 
            style={{marginLeft: 16}}
            onPercentageClick={ (value)=> this.setState({change_percentage_based: value }) }
            percentageBased={ this.state.change_percentage_based }
          />
        </div>

        <div style={{position:'absolute', left:234, top:102, textAlign:'right', background: Color.background,
          width:72, fontSize:12,  zIndex:1, display: this.props.table4Data.length?'block':'none'}}>
          { mon[new Date( this.state.month_in_display + '-01' ).getMonth()]} {new Date( this.state.month_in_display + '-01' ).getFullYear()}
        </div>

        <div class='table3-left-panel' style={{width:240}} >
          <div style={{background:Color.background, textAlign:'right', height:24}}>
            <div onMouseOver={()=>this.scrollLeft(1)} onMouseOut={()=>this.onMouseOutLeft(1)}
              style={{height:14, width:14, display:'inline-block', marginRight:14, 
              marginTop:6, cursor:'pointer'}}>
              <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>           
          </div>
          <div style={{height:22, width:240, background:'#f9f9f9'}}></div>
          <div style={{height:20, width:239, background:'#f9f9f9', borderRight:'1px solid #eee'}}></div>
          <div style={{background: Color.themeGreen, lineHeight:'32px', height: 34, borderBottom:'2px solid #aaa', paddingLeft:30, borderRight:'1px solid #eee'}}>
            <span className={'clickable-dropdown-container' + (this.state.occupancy_dropdown_active?' active':'')}
              style={{cursor:'pointer', color:'#4e4c5b', fontWeight:500}}
              onClick={()=>this.setState({occupancy_dropdown_active: !this.state.occupancy_dropdown_active})}>
              { t(this.state.occupancy_type) }
              <span style={{fontSize:8, display:'inline-block', width:16, textAlign:'right',
                transform:this.state.occupancy_dropdown_active?'scale(1, 1.6) translateY(-1.5px)': 'scale(1.8, 1) translateY(-1.5px)' }}>
                {this.state.occupancy_dropdown_active?String.fromCharCode(9658):String.fromCharCode(9660)}
              </span> 
              <div className='dropdown-content'
                style={{background:'white', zIndex:2, left: -10, top:16, boxSizing:'border-box', padding:'6px 0',
                textAlign:'left', boxShadow:'0 1px 5px 0 rgba(0, 0, 0, 0.5)', border:'1px solid #337ab7'}}>
                { ['raw_occupancy', 'adjusted_occupancy', 'estimated_occupancy', 'adjusted_estimated_occupancy'].map( item => 
                  <div onClick={()=>this.setState({occupancy_type: item, occupancy_dropdown_active: false})}
                    class={this.state.occupancy_type==item?"light-blue-hover active":"light-blue-hover"}
                    style={{lineHeight:'24px', padding:'2px 22px', display:'block', whiteSpace: 'nowrap'}}>
                    { item || 'None' }
                  </div> 
                ) } 
              </div>
            </span>
          </div>

          <div style={{lineHeight:'33px', paddingLeft:10, marginLeft: 20, borderBottom:'1px solid #ebebeb', borderRight: '1px solid #ebebeb'}}>
          {t('Hotel available to sell')}
          </div>

          <div style={{height:33, textAlign:'left', marginLeft: 20, paddingLeft:14, borderBottom:'1px solid #ebebeb', lineHeight:'33px'}}>
            <span style={{cursor:'pointer', color:'#4e4c5b'}}
              onClick={this.collapseAll}>
              <span style={{fontSize:8, display:'inline-block', width:16,
                transform:this.state.table_collapsed?'scale(1, 1.6) translateY(-0.5px)': 'scale(1.8, 1) translateY(-1.5px)' }}>
                {this.state.table_collapsed?String.fromCharCode(9658):String.fromCharCode(9660)}
              </span>           
              { t('All rates') }
            </span>              
          </div>           
          { this.state.room_types.map( ( room_type, index ) => 
            <div key={index} style={{marginLeft: 20, lineHeight:'16px', textAlign: 'left',}}>
              <div
                style={{padding:'7px 5px 7px ' + (14 + 20*room_type.layer) + 'px', borderBottom:'1px solid #ebebeb', borderRight:'1px solid #c0c0c0'}}>
                <span style={{cursor:'pointer', color:'#4e4c5b', fontWeight:500}}
                  onClick={()=>this.toggleRoomType(room_type.id)}>
                  <span style={{fontSize:8, display:'inline-block', width:16,
                    transform:room_type.collapsed?'scale(1, 1.6) translateY(-0.5px)': 'scale(1.8, 1) translateY(-1.5px)' }}>
                    {room_type.collapsed?String.fromCharCode(9658):String.fromCharCode(9660)}
                  </span>           
                  {room_type.name}
                </span>
              </div>
              { (!this.state.table_collapsed && !room_type.collapsed) && room_type.rate_plans.map( ( rate_plan, index ) => 
                <div key={index} 
                  style={{padding:'8px 20px 8px ' + (30 + 20*room_type.layer) + 'px', height:16, borderBottom:'1px solid #ebebeb', 
                  borderRight:'1px solid #c0c0c0', whiteSpace:'nowrap', overflow:'hidden', textOverflow: 'ellipsis'}}>
                  {rate_plan.rate_plan_name}
                </div>
                )
              }           
            </div>                
          )}                      
        </div>

        <div id='calendar-view-container4' className='calendar-view-container'
          style={{width: 'calc( 100% - 264px )', overflow:'hidden', display:'flex',
          marginBottom: -180, paddingBottom:180}}>
          <div id='calendar-view4' className='calendar-view' style={{display:'flex', flexGrow:1}} >
          { !this.props.table4Data.length && <div style={{flexGrow: 1}}>
              <div style={{height: 66, background: '#f9f9f9'}}>&nbsp;</div>
              <div style={{background: '#b9eab9', height: 34, borderBottom: '2px solid #aaaaaa'}}>&nbsp;</div>
              <div style={{height: 33, borderBottom: '1px solid #ebebeb'}}>&nbsp;</div>
            </div>
          }          
          { this.props.table4Data.map( (day, day_index) => 
            <Table4Column 
              key={day_index}
              dayIndex={day_index}
              day={day}
              occupancyType={this.state.occupancy_type}
              tableCollapsed={this.state.table_collapsed}
              roomTypes={this.state.room_types}
            />
          )}
          </div>    
        </div>

        <div style={{minWidth:24,  height:100, borderBottom: '2px solid #aaa'}}>
          <div style={{background: '#f9f9f9', paddingRight:10, textAlign:'right', height:66}}>
            <div onMouseOver={()=>this.scrollRight(1)} onMouseOut={()=>this.onMouseOutRight(1)}
              style={{height:14, width:14, display:'inline-block', 
              marginTop:6, cursor:'pointer'}}>
              <i className="arrow right" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>           
          </div>
          <div style={{background:'#b9eab9', height:34}}>
          </div>
        </div>

        <div style={{width:'100%', display:'flex', lineHeight:'86px'}}>
          { [{content:'Manually edited', color:'#ffdfd0'}, {content:'Derived rate no longer linked to masrter rate', color:'#9bd0fe'}, 
            {content:'Rate change deactivated', color:'#d8d8d8'}].map( item => 
            <div>
              <div style={{display:'inline-block', 'background': item.color, width:19, height:13, borderRadius:2, 
                verticalAlign:'middle', margin:'0 8px 0 40px', border:'1px solid #979797'}}></div>
              {t(item.content)}
            </div>
          )}
        </div>
      </div> 
    )
  }
}

export default Table4