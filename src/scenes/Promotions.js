import React, { Component } from 'react';
import Navigation from '../components/Navigation'
import moment from 'moment';
import DayPicker from 'react-day-picker';
import ReactTable from 'react-table'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import ReactSelect, { components } from 'react-select';
import { DateRangePicker, DateRange } from 'react-date-range';

import AvailabilityLogApi from '../api/AvailabilityLogApi'

import "react-table/react-table.css";
import 'react-day-picker/lib/style.css';
import './Promotions.css';

const t = str => str

const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const reason_list = ['New booking', 'Booking modification', 'Booking cancellation', 'New room created', 'Room deactivated', 
      'Room reactivated', "'Room count' changed on 'Rooms'", "'Room closed' on 'Rooms'",  "'Stop sell' applied on 'Calendar view'", 
      "'Stop sell' removed on 'Calendar view'", "Bulk edit on 'Calendar view'", "Single day edit on 'Calendar view'"]

const formatDate = (dateObject) => {
  if(dateObject)
    return dateObject.getDate() + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
  else
    return ''
}

const formatRequestDate = (dateObject) => {
  if(dateObject)
    return dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1) + '-'  + dateObject.getDate()
  else
    return ''
}

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const reactSelectCustomStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 27,
    maxHeight: 27,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    display: 'none',
  }),  
  indicatorSeparator: (base, state) => ({
    ...base,
    display:'none',
  }),
}

class Promotion extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      data: [],
      page: 0,
      total: 0,
      active_rows: [0],
      pageSize: 25,
      room_type_list: ['Type A', 'Type B', 'Fake', 'Another Fake', 'Business room', 'Business room(Breakfast)'],
      users: ['Admin1', 'Jack', 'Mark', 'Bill', 'Steve','Olivia', 'Oliver', 'Ben', 'Bell', 'Karen', 'Pheobe', 'Amelia', 
        'Harry', 'Isla', 'Jack', 'Emily', 'George', 'Ava', 'Noah', 'Lily', 'Ross', 'Chandler', 'Monica', 'Arin', 'Charlie', 
        'Mia', 'Jacob', 'Sophia', 'Alfie', 'Isabella', 'Freddie', 'Grace', 'Oscar', 'Zac', 'Joe', 'Rachel'].sort(),
      date_from_filter: {
        startDate: null,
        endDate: null,
        key: 'selection',
      },
      date_to_filter: {
        startDate: null,
        endDate: null,
        key: 'selection',
      },
      time_stamp_filter:  {
        startDate: null,
        endDate: null,
        key: 'selection',
      },
      time_from_filter: '',
      time_to_filter: '',

      roomTypeDropdownActive: false,
      userDropdownActive: false,
      reasonDropdownActive: false,
      reasonDetailDropdownActive: false,
      dateFromDropdownActive: false,
      dateFromCalendarDropdownActive: false,
      dateToCalendarDropdownActive: false,
      dateToDropdownActive: false,
      timeStampDropdownActive: false,
      timeStampCalendarDropdownActive: false,

      sort_by: 'time_stamp',
      a_z: false,
    };
    this.toggle = {
      date_from_filter: true,
      date_to_filter: true,
      time_stamp_filter: true
    }
  }

  componentDidMount = () => {
    window.addEventListener('click', this.collapseHeaderDropdown) 
    this.fetchData()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseHeaderDropdown) 
  }

  collapseHeaderDropdown = ( dropdown ) => {
    this.setState({
      roomTypeDropdownActive: false,
      userDropdownActive: false,
      reasonDropdownActive: false,
      reasonDetailDropdownActive: false,
      dateFromDropdownActive: false,
      dateFromCalendarDropdownActive: false,
      dateToCalendarDropdownActive: false,
      dateToDropdownActive: false,
      timeStampDropdownActive: false,
      timeStampCalendarDropdownActive: false,  
      [dropdown]: !this.state[dropdown]    
    })
  }

  formatRange = (range) => {
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if(range.startDate && range.endDate)
      return range.startDate.getDate() + ' ' + mon[range.startDate.getMonth()] + ' ' + range.startDate.getFullYear() + ' - ' +
      range.endDate.getDate() + ' ' + mon[range.endDate.getMonth()] + ' ' + range.endDate.getFullYear()
    else
      return 'All'
  }

  handleRangeChange = (payload, calendar) => {
    console.log(payload)
    this.toggle[calendar] = !this.toggle[calendar]
    this.setState({
      [calendar]: {
        ...payload.selection,
      },
      time_from_filter: calendar=='time_stamp_filter' && this.toggle[calendar] ? '00:00:00': this.state.time_from_filter,
      time_to_filter: calendar=='time_stamp_filter' && this.toggle[calendar] ? '23:59:59': this.state.time_to_filter,
    })
  }

  monitorEnter = ( e ) => {
    if(e.key=='Enter')
      alert('Fetching data')
  }

  dictateTimeInput = (e, time_stamp ) => {
    const formatted = e.target.value.length < this.state[time_stamp].length?e.target.value :this.validateTimeFormat(e.target.value)
    if(formatted || formatted===''){
      this.setState({[time_stamp]: formatted})
    }
  }

  validateTimeFormat = ( timestamp ) => {
    const regex = [/^[0-9]{1,2}$/, /^[0-9]{2}:$/, /^[0-9]{2}:[0-9]{1,2}$/, /^[0-9]{2}:[0-9]{2}:$/, /^[0-9]{2}:[0-9]{2}:[0-9]{1,2}$/]
    if( regex.some(pattern=>pattern.test(timestamp)) ){
      if(timestamp.length==1 && parseInt(timestamp)>=0 && parseInt(timestamp)<3)
        return timestamp
      else if(timestamp.length==2 && parseInt(timestamp)>=0 && parseInt(timestamp)<24)
        return timestamp + ':'
      else if(timestamp.length==4 && parseInt(timestamp.substr(3,1))>=0 && parseInt(timestamp.substr(3,1))<6)
        return timestamp
      else if(timestamp.length==5 && parseInt(timestamp.substr(3,2))>=0 && parseInt(timestamp.substr(3,2))<60)
        return timestamp + ':'
      else if(timestamp.length==7 && parseInt(timestamp.substr(6,1))>=0 && parseInt(timestamp.substr(6,1))<6)
        return timestamp
      else if(timestamp.length==8 && parseInt(timestamp.substr(6,2))>=0 && parseInt(timestamp.substr(6,2))<60)
        return timestamp
      else if(timestamp.length==3 || timestamp.length==6)
        return timestamp
    }
    return false
  }

  submitTimeStampFilter = () => {
    const pattern = /^\d{2}:\d{2}:\d{2}$/
    if(pattern.test(this.state.time_from_filter) && pattern.test(this.state.time_to_filter) 
      && this.state.time_stamp_filter.startDate && this.state.time_stamp_filter.endDate){
      this.collapseHeaderDropdown()
      this.fetchData()      
    }
    else
      alert('Please choose valid time and date')
  }

  onOrderChange = (sort_by, a_z) => {
    this.setState({sort_by: sort_by, a_z: a_z}, this.fetchData)
  }


  fetchData = () => {
    console.log(this.state.a_z)
    this.setState({loading: true})
    AvailabilityLogApi.getList({
      page: this.state.page,
      pageSize: parseInt(this.state.pageSize),
      room_type: this.state.room_type_filter,
      user: this.state.user_filter,
      reason: this.state.reason_filter,
      reason_detail: this.state.reason_detail_filter,
      stay_date_from_start: formatRequestDate(this.state.date_from_filter.startDate),
      stay_date_from_end: formatRequestDate(this.state.date_from_filter.endDate),
      stay_date_to_start: formatRequestDate(this.state.date_to_filter.startDate),
      stay_date_to_end: formatRequestDate(this.state.date_to_filter.endDate),
      date_stamp_start: formatRequestDate(this.state.time_stamp_filter.startDate),
      date_stamp_end: formatRequestDate(this.state.time_stamp_filter.endDate),
      time_stamp_start: this.state.time_from_filter,
      time_stamp_end: this.state.time_to_filter,
      sort_by: this.state.sort_by,
      a_z: this.state.a_z,      
      sort_by: this.state.sort_by,
      a_z: this.state.a_z
    })
    .then(response => {
      console.log(response.total)
      this.setState({
        data: response.data,
        total: response.total,
        loading: false
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  onPageChange = ( page ) => {
    this.setState({page: page, active_rows:[]}, this.fetchData)
  }

  onPageSizeChange = ( pageSize ) => {
    this.setState({
      pageSize: pageSize, 
      page: 0, //Reset page number when changing page size
      active_rows: [],
    }, this.fetchData)
  }

  render() {
    return (   
    <div>
      <Navigation
        width={this.props.width}
        history={this.props.history}
        toggleWidth={this.props.toggleWidth}
        root='Revenue management'
        path={'/revenue-management/promotions'}
      />
      <div style={{width: 'calc(100% - ' + (this.props.width + 60) + 'px )', display:'inline-block', verticalAlign:'top', }}> 
      <div style={{marginTop:100, background:'#fff'}}>

      <div className="App availability-log" >
        <div class="page-top-header" style={{padding: '0 30px'}}>
          <h1 class="page-title" id="page-title">Availability log</h1>
          <div class="btn-container hidden-print" style={{lineHeight:'39px'}}>
          </div>          
        </div>

        <div className='availability-log-table' style={{minWidth:1250, borderBottom:'1px solid #ddd', overflowX:'auto', padding:'0 30px'}}>
          <div className='availability-log-table-header' style={{display:'flex', justifyContent:'flex-start', minWidth:1250}}>
            
            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='room_type_header')
                  this.collapseHeaderDropdown('roomTypeDropdownActive')
              }}
              name='room_type_header'
              className={'table-header' + (this.state.roomTypeDropdownActive?' active':'')} style={{width:90, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <select style={{margin:'0 8px 10px'}}>
                  <option value='All'>All</option>
                  {this.state.room_type_list.map(item=><option value={item}>{item}</option>)}
                </select>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('room_type', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('room_type', false)}>Sort Z-A</div>
              </div>
              {t('Room type')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>

            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='user_header')
                  this.collapseHeaderDropdown('userDropdownActive')
              }}
              name='user_header'  
              className={'table-header' + (this.state.userDropdownActive?' active':'')} style={{width:110, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <div style={{marginBottom:4}}> 
                  <ReactSelect
                    styles={reactSelectCustomStyles}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={'User name'}
                    options={this.state.users.map(item => { return {value:item, label:item}})}
                    onChange={(item)=>this.setState({user_filter:item})}
                  />
                </div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('user', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('user', false)}>Sort Z-A</div>
              </div>            
              {t('User')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>
            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='reason_header')
                  this.collapseHeaderDropdown('reasonDropdownActive')
              }}            
              name='reason_header'  
              className={'table-header' + (this.state.reasonDropdownActive?' active':'')} style={{width:205, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <select style={{margin:'0 8px 10px'}}>
                  <option value='All'>All</option>
                  {reason_list.map(item=><option value={item}>{item}</option>)}
                </select>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('reason', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('reason', false)}>Sort Z-A</div>
              </div>
              {t('Reason')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>

            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='reason_detail_header')
                  this.collapseHeaderDropdown('reasonDetailDropdownActive')
              }}             
              name='reason_detail_header'  
              className={'table-header' + (this.state.reasonDetailDropdownActive?' active':'')} style={{width:112, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <div style={{marginBottom:4, height:21, lineHeight:'21px', padding:'2px 8px', 
                  border:'1px solid #ccc', borderRadius:4}} onKeyPress={this.monitorEnter}> 
                  <input type="number" placeholder='Enter the ZUZU confirmation number'/>
                </div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('reason_detail', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('reason_detail', false)}>Sort Z-A</div>
              </div>              
              {t('Reason detail')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>

            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='date_from_header')
                  this.collapseHeaderDropdown('dateFromDropdownActive')
              }}             
              name='date_from_header'  
              className={'table-header' + (this.state.dateFromDropdownActive?' active':'')} style={{width:80, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <div class="dropdown-container" style={{marginBottom:4, height:21, lineHeight:'21px', padding:'2px 8px', 
                  border:'1px solid #ccc', borderRadius:4}}>
                  <input type='text' disabled style={{width:136, border:'none', lineHeight:'21px', padding:'0'}}
                    value={this.formatRange(this.state.date_from_filter)} 
                  />
                  <div className='availability-log-dropdown'>
                    <DateRangePicker
                      rangeColors={['#f36e33']}
                      onChange={(payload)=>this.handleRangeChange(payload, 'date_from_filter')}
                      showDateDisplay={false}
                      showMonthAndYearPickers ={false}
                      moveRangeOnFirstSelection={false}
                      ranges={[this.state.date_from_filter]}
                    />
                  </div>
                </div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('date_from', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('date_from', false)}>Sort Z-A</div>
              </div>  
              {t('Date from')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>

            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='date_to_header')
                  this.collapseHeaderDropdown('dateToDropdownActive')
              }}             
              name='date_to_header'  
              className={'table-header' + (this.state.dateToDropdownActive?' active':'')} style={{width:80, padding:5}}>
              <div className='availability-log-table-dropdown'>
                <div class="dropdown-container" style={{marginBottom:4, height:21, lineHeight:'21px', padding:'2px 8px', 
                  border:'1px solid #ccc', borderRadius:4}}>
                  <input type='text' disabled style={{width:136, border:'none', lineHeight:'21px', padding:'0'}}
                    value={this.formatRange(this.state.date_to_filter)} 
                  />
                  <div className='availability-log-dropdown'>
                    <DateRangePicker
                      rangeColors={['#f36e33']}
                      onChange={(payload)=>this.handleRangeChange(payload, 'date_to_filter')}
                      showDateDisplay={false}
                      showMonthAndYearPickers ={false}
                      moveRangeOnFirstSelection={false}
                      ranges={[this.state.date_to_filter]}
                    />
                  </div>
                </div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('date_to', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('date_to', false)}>Sort Z-A</div>
              </div>            
              {t('Date to')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>
            <div style={{display:'flex'}}>
              <div style={{width:46}}>&nbsp;</div>
              <div style={{width:50, padding:5, justifyContent: 'flex-end', textAlign:'right', display:'flex', alignItems:'flex-end'}}>{t('Room count')}</div>
              <div style={{width:50, padding:5, justifyContent: 'flex-end', display:'flex', alignItems:'flex-end'}}>{t('Sold')}</div>
              <div style={{width:50, padding:5, justifyContent: 'flex-end', display:'flex', alignItems:'flex-end'}}>{t('Closed')}</div>
              <div style={{width:50, padding:5, justifyContent: 'flex-end', textAlign:'right', display:'flex', alignItems:'flex-end'}}>{t('Not available')}</div>
              <div style={{width:50, padding:5, justifyContent: 'flex-end', display:'flex', alignItems:'flex-end'}}>{t('Available')}</div>
            </div>

            <div onClick={(e)=>
              {
                e.stopPropagation()
                if(e.target.getAttribute('name')=='time_stamp_header')
                  this.collapseHeaderDropdown('timeStampDropdownActive')
              }}               
              name='time_stamp_header'
              className={'table-header' + (this.state.timeStampDropdownActive?' active':'')} style={{width:120, padding:'5px 0 5px 10px'}}>
              <div className='availability-log-table-dropdown'>
                <div 
                  class={"dropdown-container" + (this.state.timeStampCalendarDropdownActive?' active':'')} 
                  name='time_stamp_calendar'
                    onClick={(e)=>{
                      if(e.target.getAttribute('name')=='time_stamp_calendar')
                        this.setState({timeStampCalendarDropdownActive:!this.state.timeStampCalendarDropdownActive})
                    }}
                    style={{ marginBottom:4, height:21, lineHeight:'21px', padding:'2px 8px', border:'1px solid #ccc', 
                      borderRadius:4, width:136, cursor:'pointer'}}>
                    {this.formatRange(this.state.time_stamp_filter)} 
                  <div className='availability-log-dropdown right-aligned'>
                    <DateRangePicker
                      rangeColors={['#f36e33']}
                      onChange={(payload)=>this.handleRangeChange(payload, 'time_stamp_filter')}
                      showSelectionPreview={false}
                      showDateDisplay={false}
                      months={2}
                      showMonthAndYearPickers ={false}
                      moveRangeOnFirstSelection={false}
                      ranges={[this.state.time_stamp_filter]}
                      direction="horizontal"
                    />
                    <div style={{padding:10, display:'flex',}}>
                      <span style={{width:'49.9%', display:'flex', justifyContent:'space-around', position:'relative' }}>
                      <label style={{lineHeight:'29px'}}>{t('From')}</label>
                      <input type='text' placeholder='hh:mm:ss' disabled class='time-stamp'
                        value={formatDate(this.state.time_stamp_filter.startDate)} />
                      <input type='text' class='time-stamp' style={{fontFamily:'Courier', background:'transparent'}}
                        value={this.state.time_from_filter}
                        onChange={(e)=>this.dictateTimeInput(e, 'time_from_filter')}
                        />
                      <div style={{position:'absolute', right:63, top:5, fontSize:12, fontFamily:'Courier', zIndex:-1, color:'#aaa'}}>
                        {'        '.substr(0,this.state.time_from_filter.length) + 'hh:mm:ss'.substr(this.state.time_from_filter.length,8)}
                      </div>                        
                      </span>
                      <span style={{width:'49.9%', display:'flex', justifyContent:'space-around', position:'relative' }}>
                      <label style={{lineHeight:'29px'}}>{t('To')}</label>
                      <input type='text' placeholder='YYYY/MM/DD' disabled class='time-stamp'
                        value={formatDate(this.state.time_stamp_filter.endDate)} />
                      <input type='text' class='time-stamp' style={{fontFamily:'Courier', background:'transparent'}}
                        value={this.state.time_to_filter}
                        onChange={(e)=>this.dictateTimeInput(e, 'time_to_filter')}
                        />
                      <div style={{position:'absolute', right:67, top:5, fontSize:12, fontFamily:'Courier', zIndex:-1, color:'#aaa'}}>
                        {'        '.substr(0,this.state.time_to_filter.length) + 'hh:mm:ss'.substr(this.state.time_to_filter.length,8)}
                      </div>
                      </span>
                    </div>                    
                    <div>
                      <button autoFocus class='button-div' 
                        style={{float:'right'}} 
                        onClick={(e)=>{
                          this.submitTimeStampFilter()
                          e.stopPropagation()
                        }}>
                        Done
                      </button>
                      <button class='button-div' 
                        style={{margin:'0 12px 0 0', float:'right', }}
                        onClick={(e)=>{
                          this.setState({timeStampCalendarDropdownActive:false})
                          e.stopPropagation()
                        }}>
                        Cancel
                      </button>                      
                    </div>
                  </div>
                </div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('time_stamp', true)}>Sort A-Z</div>
                <div class='availability-log-table-dropdown-text' onClick={()=>this.onOrderChange('time_stamp', false)}>Sort Z-A</div>
              </div>             
              {t('Time stamp')}<i class='arrow down' style={{marginBottom:8, marginLeft:8}}></i>
            </div>
          </div>

{/*********************************************** ENd OF HEADER AND FILTERS ***********************************************/}
          { this.state.data.map((row, index) => <div 
              className='availability-log-row'
              onClick={()=>{
                if(this.state.active_rows.includes(index))
                  this.setState({active_rows:this.state.active_rows.filter(item=>item!=index)})
                else
                  this.setState({active_rows:this.state.active_rows.concat([index])})
              }}
              style={{borderBottom:'1px solid #eee', display:'flex', overflow:'hidden', minWidth:1250,
                height:this.state.active_rows.includes(index)?'auto':46,  position:'relative'
              }}>
              <div style={{width:90, padding:5, color:'#4A90E2'}}>{row.room_type_name}</div>
              <div style={{width:110, padding:5, color:'#4A90E2'}}>{row.user_name}</div>
              <div style={{width:205, padding:5, display:'flex'}}>
                <div style={{width:20, height:'100%', display:'inline-block'}}>
                <span style={{background:'#c92d28', display:'inline-block', verticalAlign:'middle',
                height:14, width:14, borderRadius:7, marginRight:6,marginBottom:2}}></span>
                </div>
                {row.reason}
              </div>
              <div style={{width:112, padding:5,}}>
                {row.reason_details}
              </div>
              <div style={{display:'flex',}}>
                <div style={{width:90}}>
                  <div style={ this.state.active_rows.includes(index)?
                    {padding:'5px 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                    {padding:'5px 5px 10px 5px'}}>
                  {row.stay_date_from}
                  </div>
                  { row.available.From.toString().split(',').map((item, index) => 
                      <div style={{padding: '5px 5px 0 5px', height:39}}>
                          { formatDate(addDays(row.stay_date_from, index)) }
                      </div>
                    )
                  }
                </div>
                <div style={{width:90}}>
                  <div style={ this.state.active_rows.includes(index)?
                    {padding:'5px 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                    {padding:'5px 5px 10px 5px'}}>
                  {row.stay_date_to}
                  </div>
                </div>                
                <div style={{width:46, padding:'5px 0', textAlign:'right'}}>
                  <div style={{}}>
                    <div style={ this.state.active_rows.includes(index)?
                      {paddingBottom: 9, borderBottom:'1px dashed #ddd'}:
                      {paddingBottom: 10,}
                    }>
                      {t('Change')}
                    </div>
                    { row.available.From.toString().split(',').map((item, index)=>
                        <div style={{marginTop:5}}>
                          <div style={{}}>{t('From')}</div>
                          <div style={{padding:'5px 0 0 0'}}>{t('To')}</div>                         
                        </div>)
                    }
                  </div>                
                </div>
                <div style={{width:60, padding:'5px 0', textAlign:'right'}}>
                  <div>
                    <div style={this.state.active_rows.includes(index)?
                      {padding: '0 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                      {padding: '0 5px 10px 5px'}}>
                      { row.room_count.Change}
                    </div>
                    { row.room_count.From.toString().split(',').map((item, index)=>
                        <div style={{padding: '5px 5px 0 5px',}}>
                          <div>{item}</div>
                          <div style={{padding:'5px 0 0 0'}}>{row.room_count.To.toString().split(',')[index]}</div>
                        </div>)
                    }
                  </div>
                </div>       
                <div style={{width:60, padding:'5px 0', textAlign:'right'}}>
                  <div>
                    <div style={this.state.active_rows.includes(index)?
                      {padding: '0 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                      {padding: '0 5px 10px 5px'}
                    }>
                      { row.sold.Change}
                    </div>
                    { row.sold.From.toString().split(',').map((item, index)=>
                        <div style={{padding: '5px 5px 0 5px'}}>
                          <div>{item}</div>
                          <div style={{padding:'5px 0 0 0'}}>{row.sold.To.toString().split(',')[index]}</div>
                        </div>)
                    }
                  </div>
                </div> 
                <div style={{width:60, padding:'5px 0', textAlign:'right'}}>
                  <div>
                    <div style={this.state.active_rows.includes(index)?
                      {padding: '0 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                      {padding: '0 5px 10px 5px'}
                    }>
                      { row.closed.Change}
                    </div>
                    { row.closed.From.toString().split(',').map((item, index)=>
                        <div style={{padding: '5px 5px 0 5px'}}>
                          <div>{item}</div>
                          <div style={{padding:'5px 0 0 0'}}>{row.closed.To.toString().split(',')[index]}</div>
                        </div>)
                    }
                  </div>
                </div> 
                <div style={{width:60, padding:'5px 0', textAlign:'right'}}>
                  <div>
                    <div style={this.state.active_rows.includes(index)?
                      {padding: '0 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                      {padding: '0 5px 10px 5px'}
                    }>
                      { row.not_available.Change}
                    </div>
                    { row.not_available.From.toString().split(',').map((item, index)=>
                        <div style={{padding: '5px 5px 0 5px'}}>
                          <div>{item}</div>
                          <div style={{padding:'5px 0 0 0'}}>{row.room_count.To.toString().split(',')[index]}</div>
                        </div>)
                    }
                  </div>
                </div>                                                          
                <div style={{width:60, padding:'5px 0', textAlign:'right'}}>
                  <div>
                    <div style={this.state.active_rows.includes(index)?
                      {padding: '0 5px 9px 5px', borderBottom:'1px dashed #ddd'}:
                      {padding: '0 5px 10px 5px'}
                    }>
                      <i className={"fa fa-stop-circle" + (row.available.Change=='$'?' red':'') + (row.available.Change=='#'?' grey':'')}></i>
                      { row.available.Change!='$' && row.available.Change!='#' && row.available.Change}
                    </div>
                    { row.available.From.toString().includes(',') && 
                      row.available.From.split(',').map((item, index)=>
                        <div style={{padding: '5px 5px 0 5px'}}>
                          <div>{item}</div>
                          <div style={{padding:'5px 0 0 0'}}>{row.available.To.split(',')[index]}</div>
                        </div>)
                    }
                  </div>
                  { !row.available.From.toString().includes(',') && 
                    <div style={{padding:5}}>
                      <i className={"fa fa-stop-circle" + (row.available.Change=='#'?' grey':'')}></i>
                      { row.available.Change!='#'&&row.available.From}
                    </div>
                  }                  
                  { !row.available.From.toString().includes(',') && 
                    <div style={{padding:'0 5px'}}>
                      <i className={"fa fa-stop-circle" + (row.available.Change=='$'?' red':'')}></i>
                      { row.available.Change!='$'&&row.available.To}
                    </div>
                  }
                </div>
              </div>
              <div style={{width:120, padding:'5px 0 5px 10px',}}>{row.time_stamp}</div>
              { !this.state.active_rows.includes(index) && <div class='gradient-blocker'></div> }
            </div>)
          }
          <Pagination
           pageSize={this.state.pageSize}
           page={this.state.page}
           total={this.state.total}
           onPageChange={this.onPageChange}
           onPageSizeChange={this.onPageSizeChange}
          />
        </div>

        <Spinner spinning={this.state.loading} />
      </div>
      </div>
      </div>
    </div>      
    );
  }
}

export default Promotion;