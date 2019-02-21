import React from "react"

import Table3Column from './Table3Column'
import FloatMonthInDisplay from './FloatMonthInDisplay'

import PercentageToggle from '../../components/PercentageToggle'

import './Table3.css'
import RulesEngineApi from '../../api/RulesEngineApi'
import Color from '../../Color'

const t = str => str

const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const formatDate = (dateObject, placeholder, seperator) => {
  if(dateObject)
    return (seperator?seperator:'') + dateObject.getDate().toString().padStart(2,0) + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
  else
    return placeholder || ''
}

class Table3 extends React.Component {
  constructor(props) {
    super();
    this.state = {
      show_popup: false,
      show_revenue_management_rules: true,

      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      last_request_year: new Date().getFullYear(),
      last_request_month: new Date().getMonth(),
      month_in_display: '2019-02',
      loading: false,

      room_types: this.flatRoomTypes([
        { room_type_name: 'room type 1', 
          room_type_id: 1,
          rate_plans:[
            {rate_plan_name: 'rate plan 1.1 and some super long breakfast'}, 
            {rate_plan_name: 'rate plan 1.2'}, 
            {rate_plan_name: 'rate plan 1.3'}, 
            {rate_plan_name: 'rate plan 1.4'}
          ],
          children: [
            { room_type_name: 'room type 3', 
              room_type_id: 3,
              rate_plans:[
                {rate_plan_name: 'rate plan 3.1 super duper long breakfast'}, 
                {rate_plan_name: 'rate plan 3.2'}, 
                {rate_plan_name: 'rate plan 3.3'}
              ]
            },
            { room_type_name: 'room type 4', 
              room_type_id: 4,
              rate_plans:[
                {rate_plan_name: 'rate plan 4.1'}, 
                {rate_plan_name: 'rate plan 4.2'}, 
              ]
            },           
          ]
        },
        { room_type_name: 'room type 2', 
          room_type_id: 2,
          rate_plans:[
            {rate_plan_name: 'rate plan 2.1'}, 
            {rate_plan_name: 'rate plan 2.2'}, 
            {rate_plan_name: 'rate plan 2.3'}
          ]
        },      
      ], [], 0),

      table3_data: [],

      occupancy_type: 'raw_occupancy',

      visibleRTIndex: -1,
      visibleDayIndex: -1,
      visibleRateIndex: -1,

      taxRate: 7,
    }
  }  

  loading = false
  calendar_scroll_distance = 0

  componentDidMount = () => { 
    this.getTable3FakeData()
    //this.getTable3Data()
  }

  getTable3FakeData = () => {
    if(this.loading)
      return
    this.loading = true
    this.setState({loading:true})
    RulesEngineApi.getRecommendedPrices({year: this.state.last_request_year, month: this.state.last_request_month + 1})
    .then(response => {
      console.log(response)
      if(response.success){
        this.setState({
          last_request_month: this.state.last_request_month + 1,
          loading: false,
          table3_data: this.state.table3_data.concat(response.table3_data),
        }, ()=>this.loading = false )  
      } else {
        this.setState({loading:false})  
        console.log(response)     
      }
    })
    .catch( error => {
      this.loading = false
      this.setState({loading:false})
      console.log(error)
    })    
  } 

  getTable3Data = () => {
    if(this.loading)
      return
    this.loading = true
    this.setState({loading:true})
    RulesEngineApi.getRulesEngineData({year: this.state.last_request_year, month: this.state.last_request_month + 1})
    .then(response => {
      console.log(response)
      if(response.success){
        this.setState({
          last_request_month: this.state.last_request_month + 1,
          loading: false,
          loaded: true, 
          vtr: response.vtr,
          table3_data: this.state.table3_data.concat(response.monthly_table3_data),
        }, ()=>this.loading = false )  
      } else {
        this.setState({loading:false})  
        //ToastStore.error(t('There is some error'), 5000, 'update-error') 
        console.log(response)     
      }
    })
    .catch( error => {
      this.loading = false
      this.setState({loading:false})
      console.log(error)
      //ToastStore.error(t('There is some error'), 5000, 'update-error')
    })    
  } 

  whichMonthToDisplay = ( ) => {
    const day_count = this.calendar_scroll_distance/78;
    const current_mon = new Date().getMonth()
    if(this.state.month_in_display != this.state.table3_data[Math.ceil(day_count)].date.slice(0,7))
      this.setState( {month_in_display: this.state.table3_data[Math.ceil(day_count)].date.slice(0,7)} )
  }

  scrollLeft = () => {
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(), 16)
  }

  scrollLeftDirtyWork = () => {
    document.getElementById('calendar-view-container3').scrollBy(-16,0)
    this.calendar_scroll_distance = document.getElementById('calendar-view-container3').scrollLeft
    this.whichMonthToDisplay()
  }

  scrollRight = () => {
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(), 16)
  }

  scrollRightDirtyWork = () => {
    document.getElementById('calendar-view-container3').scrollBy(16,0)
    this.calendar_scroll_distance = document.getElementById('calendar-view-container3').scrollLeft
    this.whichMonthToDisplay()
    if( !this.loading && 
      document.getElementById('calendar-view3').clientWidth - this.calendar_scroll_distance < 78*5 + document.getElementById('calendar-view-container3').clientWidth){
      this.getTable3FakeData()
    }
  }

  onMouseOutLeft = () => {
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    clearInterval(this.setRightInterval)
  }

  editCell = (price, update_derived, update_derived_prev_manual, room_type_index, rate_index, day_index) => {
    const new_table3_data = this.state.table3_data.slice()
    new_table3_data[day_index] = { ...new_table3_data[day_index] }
    new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index].type = 'manually_edited'
    new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index].value = price
    new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index].update_derived = update_derived
    new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index].update_derived_prev_manual = update_derived_prev_manual
    this.setState({table3_data: new_table3_data})
  }

  toggleColumn = (day_index, disable) => {
    const new_table3_data = this.state.table3_data.slice()
    new_table3_data[day_index] = { ...new_table3_data[day_index], disabled:  disable}
    this.setState({table3_data: new_table3_data})
  }

  disableCell = (day_index, room_type_index, rate_index, disable) => {
    const new_table3_data = this.state.table3_data.slice()
    new_table3_data[day_index] = { ...new_table3_data[day_index]}
    new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index] 
      = { ...new_table3_data[day_index].rates[room_type_index].rp_rates[rate_index], disabled:  disable}
    this.setState({table3_data: new_table3_data})    
  } 

  flatRoomTypes = ( room_types, flat_room_types, layer ) => {
    room_types.forEach( room_type => {
      flat_room_types.push({ 
        name: room_type.room_type_name, 
        id: room_type.room_type_id, 
        layer: layer,
        rate_plans: room_type.rate_plans,
        collapsed: false,
      })
      if(room_type.children)
        this.flatRoomTypes(room_type.children, flat_room_types, layer + 1)
    })
    return flat_room_types
  }

  toggleRoomType = (room_type_id) => {
    const new_room_types = this.state.room_types
    const index = new_room_types.findIndex( item => item.id == room_type_id)
    new_room_types[index].collapsed = !new_room_types[index].collapsed
    this.setState({room_types: new_room_types})
  }

  onCellClicked = () => this.setState({visibleDayIndex: -1, visibleRTIndex: -1, visibleRateIndex: -1})

  render() {
    console.log('table3 rendering')
    return (
      <div style={{display:'flex', overflow: 'visible', position:'relative', flexWrap:'wrap'}}>
        <div className='table3-note' style={{textAlign:'right', display:'flex', width:'100%'}}>
          {t('Change shown vs. ') + this.props.promotion + t(' sell rates')}:
          <PercentageToggle 
            style={{marginLeft: 16}}
            onPercentageClick={ (value)=> this.setState({change_percentage_based: value }) }
            percentageBased={ this.state.change_percentage_based }
          />
        </div>
        <FloatMonthInDisplay 
          monthInDisplay={this.state.month_in_display}
        />

        <div style={{width:240}}>
          <div style={{background:Color.background, textAlign:'right', height:24}}>
            <div onMouseOver={()=>this.scrollLeft(1)} onMouseOut={()=>this.onMouseOutLeft(1)}
              style={{height:14, width:14, display:'inline-block', marginRight:14, 
              marginTop:6, cursor:'pointer'}}>
              <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>           
          </div>
          <div style={{height:22, width:240, }}></div>
          <div style={{height:20, width:239, borderRight:'1px solid #eee'}}></div>
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
          <div style={{height:33, textAlign:'left', marginLeft: 20, paddingLeft:14, borderBottom:'1px solid #ebebeb', lineHeight:'33px'}}>
            <span style={{cursor:'pointer', color:'#4e4c5b'}}
              onClick={()=>this.setState({table_collapsed: !this.state.table_collapsed})}>
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

        <div id='calendar-view-container3' className='calendar-view-container'
          style={{width: 'calc( 100% - 264px )', overflow:'hidden', display:'flex',
          marginBottom: -180, paddingBottom:180}}>
          <div id='calendar-view3' className='calendar-view' style={{display:'flex', flexGrow:1}} >
          { this.state.table3_data.map( (day, day_index) => 
            <Table3Column 
              key={day_index}
              dayIndex={day_index}
              day={day}
              occupancyType={this.state.occupancy_type}
              tableCollapsed={this.state.table_collapsed}
              roomTypes={this.state.room_types}
              taxRate={this.state.taxRate}
              toggleColumn={this.toggleColumn}
              editCell={this.editCell}
              disableCell={this.disableCell}
            />
          )}
          </div>    
        </div>

        <div style={{minWidth:14, paddingRight:10, height:24, background: Color.background}}>
          <div style={{background:Color.background, textAlign:'right', height:24}}>
            <div onMouseOver={()=>this.scrollRight(1)} onMouseOut={()=>this.onMouseOutRight(1)}
              style={{height:14, width:14, display:'inline-block', 
              marginTop:6, cursor:'pointer'}}>
              <i className="arrow right" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>           
          </div>
        </div>

        <div style={{width:'100%', display:'flex', lineHeight:'86px'}}>
          { [{content:'Available to sell', color:'#9bd0fe'}, {content:'Manually edited', color:'#ffa377'}, 
            {content:'Derived rate no longer linked to masrter rate', color:'#ffdfd0'}, 
            {content:'Broken relationship to master rate', color:'#e3c6d7'}].map( item => 
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

export default Table3;