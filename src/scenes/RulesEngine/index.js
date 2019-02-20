import React from "react"

import Navigation from '../../components/Navigation'
import DeletePopup from '../../components/DeletePopup'
import ZuzuDateRangePicker from '../../components/DateRangePicker'

import './RulesEngine.css'
import RulesEngineApi from '../../api/RulesEngineApi'
import Color from '../../Color'

import EditableRange from './EditableRange'
import AdjustmentEditor from './AdjustmentEditor'

import Table3 from './Table3'

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

class RulesEngine extends React.Component {
  state = {
    show_popup: false,
    show_revenue_management_rules: true,

    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    last_request_year: new Date().getFullYear(),
    last_request_month: new Date().getMonth(),
    month_in_display1: new Date().getMonth(),
    month_in_display2: new Date().getMonth(),
    month_in_display3: new Date().getMonth(),
    month_in_display4: new Date().getMonth(),
    month_in_display5: new Date().getMonth(),
    table_collapsed1: true,
    table_collapsed2: true,
    table_collapsed3: true,
    table_collapsed4: true,
    loading: false,
    all_room_types: true,
    all_rate_plans: true,
    price_not_market_price: false,
    percentage_not_number: false,
    on: true,
    rowNamesEdit: false,
    newRowBeingClicked: false,
    visibleRowNameIndex: -1,
    visibleHeaderIndex: -1,

    headers: ['Same day bookings', 'Last-minute (1-2 days)', 
    {low:3, high:6},
    {low:7, high:13},
    {low:14, high:30},
    {low:31, high:60},
    {low:60}],

    rowNames: [{low: 0, high: 55},  
    {low: 56, high: 90}, 
    {low: 91, high: 94},  
    {low: 95, high: 96}, 
    {low: 97, high: 98}, 
    {low: 99, high: 100}],
    data:[
      [1,-2,3,4,5,-6,7],
      [2,-3,4,5,-6,7,8],
      [3,4,5,-6,7,8,9],
      [4,-5,6,-7,-8,9,10],
      [5,6,-7,8,9,-10,11],
      [6,7,8,9,-10,11,12],
    ],
    avg_option: 'mean',
    market_pricing_data: [],
    percentage_not_number1: true,
    percentage_not_number2: true,

    master_room_type_list: ['master room type 1', 'master room type 2',  'master room type 3', 'master room type 5'],
    master_room_type: '',

    promotion_list: ['', 'promotion 1', 'promotion 2', 'promotion 3'],
    promotion: '',

    selected_range: {},
    confirmed_selected_range: {},

    deep: {list: [2, 342, 48, 299, 917]},

    competitive_hotels: [{adjustment:'0', name:'Abi Bali Resort Villas & Spa'}, {adjustment:'0', name: 'host name 2'}, 
    {adjustment:'0', name: 'host name 3'}, {adjustment:'0', name: 'host name 4'}, {adjustment:'0', name: 'host name 5'}, 
    {adjustment:'0', name: 'host name 6'}, {adjustment:'0', name: 'host name 7'}],
    table_collapsed2: false,
    visibleAdjustmentIndex: -1,
    visibleDailyAdjustmentIndex: -1,

    floor_sell_rates: [0, 0, 0, 0, 0, 0, 0],
  }

  loading = false
  calendar_lengths_list1 = []
  calendar_scroll_distance1 = 0
  calendar_scroll_distance2 = 0
  calendar_scroll_distance3 = 0
  calendar_scroll_distance4 = 0
  calendar_scroll_distance5 = 0

  componentDidMount = () => { 
    window.addEventListener('click', this.collapsePercentageSelector)
    this.getRulesEngineData()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapsePercentageSelector) 
  }

  collapsePercentageSelector = (event) => {
    if(!event || !event.target.matches('.edtiable-header, .edtiable-header *, .editable-row-names *, .mp-adjustment'))
      this.setState({visibleRowNameIndex: -1, visibleHeaderIndex: -1, visibleDailyAdjustmentIndex: -1, visibleAdjustmentIndex: -1})
  }

  whichMonthToDisplay = ( table_index) => {
    const day_count = this['calendar_scroll_distance' + table_index]/78;
    const current_mon = new Date().getMonth()

    for(let i = current_mon; i<this['calendar_lengths_list' + table_index].length + current_mon; i++){
      if( day_count < this['calendar_lengths_list' + table_index][i - current_mon] ){
        if(i!=this.state['month_in_display' + table_index])
          this.setState({['month_in_display' + table_index]: i})
        break
      }
    }
  }

  measureScrollLeft = ( table_index, cell_index, month_index ) => {
    const days_to_the_left = this['calendar_scroll_distance' + table_index]/78;
    const day_count = (month_index?this['calendar_lengths_list' + 1][month_index - 1]:0) + cell_index
    const diff = day_count - days_to_the_left
    if(diff>0.5)
      return -42
    else 
      return -diff*78
  }

  getRulesEngineData = () => {
    if(this.loading)
      return
    this.loading = true
    this.setState({loading:true})
    RulesEngineApi.getRulesEngineData({year: this.state.last_request_year, month: this.state.last_request_month + 1})
    .then(response => {
      console.log(response)
      if(response.success){
        this.calendar_lengths_list1.push( (this.calendar_lengths_list1[this.calendar_lengths_list1.length - 1] || 0 ) + response.monthly_market_pricing_data.data.length)
        this.setState({
          last_request_month: this.state.last_request_month + 1,
          loading: false,
          loaded: true, 
          vtr: response.vtr,
          market_pricing_data: this.state.market_pricing_data.concat(response.monthly_market_pricing_data),
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

  toggleOnOff = () => {
    this.setState({on:!this.state.on})
  }

  onAvgChange = ( e ) => {
    this.setState({ avg_option:e.target.getAttribute('name') })
  }

  addNewHeader = ( ) => {
    const new_headers = this.state.headers.slice()
    new_headers[new_headers.length-1].low = new_headers[new_headers.length-1].low + 1
    new_headers[new_headers.length-1].high = new_headers[new_headers.length-1].low + 1

    new_headers.push({low: new_headers[new_headers.length - 1].high})

    const new_data = this.state.data.slice().map(row=>row.concat(0))
    this.setState({ headers: new_headers, newHeaderBeingClicked: false, data: new_data })    
  }

  addNewRow = (  ) => {
    const old_label = this.state.rowNames
    let new_label = [{low:99,high:100}];
    let k = old_label.length-1;
    let h = 98;
    while((old_label[k].high - old_label[k].low)  <=2){
       let el = {low:h-1,high:h};
       h = h-2;
       k = k-1;
       new_label.unshift(el)
    }
    if(k>=0) {
      old_label[k].high = h;
    }
    while (k>=0) {
       new_label.unshift(old_label[k]);
       k = k -1;
    }
    this.setState({newRowBeingClicked: false, rowNames:new_label, data: this.state.data.concat([[0,0,0,0,0,0,0]])})
  }

  deleteRowOrColumn = () => {
    if(this.state.delete_row_name_index)
      this.deleteRow()
    else if(this.state.delete_header_index)
      this.deleteHeader()
  }

  deleteRow = () => {
    const new_row_names = this.state.rowNames.slice()
    const new_data = this.state.data.slice()
    new_data.splice(this.state.delete_row_name_index, 1)
    if(this.state.delete_row_name_index == this.state.rowNames.length - 1){
      new_row_names[this.state.delete_row_name_index - 1].high = 100
      new_row_names.pop()
    } else {
      new_row_names[this.state.delete_row_name_index - 1].high = new_row_names[this.state.delete_row_name_index].high
      new_row_names.splice(this.state.delete_row_name_index, 1)
    }
    this.setState({ rowNames: new_row_names, show_popup:false, data: new_data, delete_row_name_index: 0 })
  }

  onRowNameChange = ( index, range ) => {
    const new_row_names = this.state.rowNames.slice()
    new_row_names[index] = range
    if(index)
      new_row_names[index - 1].high = range.low - 1
    if(index < this.state.rowNames.length - 1)
      new_row_names[index + 1].low = range.high + 1
    this.setState({ rowNames: new_row_names, visibleRowNameIndex: -1 })
  }

  deleteHeader = () => {
    const delete_index = this.state.delete_header_index
    const new_headers = this.state.headers.slice()
    const new_data = this.state.data.slice().map( row => {
      row.splice(delete_index, 1)
      return row
    })

    if(delete_index == this.state.headers.length - 1){
      new_headers[delete_index - 1].high = null
      new_headers[delete_index - 1].low -= 1
      new_headers.pop()
    } else {
      new_headers[delete_index - 1].high = new_headers[delete_index].high
      new_headers.splice(delete_index, 1)
    }
    this.setState({ headers: new_headers, show_popup:false, data: new_data, delete_header_index: 0 })
  }

  onHeaderChange = ( index, range ) => {
    const new_headers = this.state.headers.slice()
    const offset1 =  index == this.state.headers.length - 1 ? 0:1
    const offset2 =  index == this.state.headers.length - 2 ? 0:1

    new_headers[index] = range
    if(index>2)
      new_headers[index - 1].high = range.low - offset1
    if(index<this.state.headers.length - 1)
      new_headers[index + 1].low = range.high + offset2
    this.setState({ headers: new_headers, visibleHeaderIndex: -1 })
  }

  updateCell = (e, row_index, col_index) => {
    if(e.target.value=='' || e.target.value=='-'){
      const new_data = this.state.data
      new_data[row_index][col_index] = e.target.value
      this.setState({data: new_data})
    }
    else if( parseInt(e.target.value)<=100 && parseInt(e.target.value)>=-100 ){
      const new_data = this.state.data
      new_data[row_index][col_index] = parseInt(e.target.value)
      this.setState({data: new_data})
    } 
  }

  updateFloorSellRate = (e, index) => { 
    const value = e.target.value=='$'?'':parseInt(e.target.value.replace('$',''))
    if( value >= 0 || value ==''){
      const new_floor_sell_rates = this.state.floor_sell_rates.slice()
      new_floor_sell_rates[index] = value
      this.setState({floor_sell_rates: new_floor_sell_rates})
    }
  }

  onFloorSellRateBlur = (index) => {
    if(this.state.floor_sell_rates[index]==''){
      const new_floor_sell_rates = this.state.floor_sell_rates.slice()
      new_floor_sell_rates[index] = 0
      this.setState({floor_sell_rates: new_floor_sell_rates})      
    }
  }

  scrollLeft = (table_index) => {
    console.log('scrollLeft is called')
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(table_index), 16)
  }

  scrollLeftDirtyWork = (table_index) => {
    console.log('scrollLeftDirtyWork is called:', document.getElementById('calendar-view-container' + table_index).scrollLeft)
    document.getElementById('calendar-view-container' + table_index).scrollBy(-16,0)
    this['calendar_scroll_distance' + table_index] = document.getElementById('calendar-view-container' + table_index).scrollLeft
    this.whichMonthToDisplay(table_index<3?1:table_index)
  }

  scrollRight = (table_index) => {
    console.log('scrollRight is called')
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(table_index), 16)
  }

  scrollRightDirtyWork = (table_index) => {
    document.getElementById('calendar-view-container' + table_index).scrollBy(16,0)
    this['calendar_scroll_distance' + table_index] = document.getElementById('calendar-view-container' + table_index).scrollLeft
    this.whichMonthToDisplay(table_index<3?1:table_index)
    if( !this.loading && 
      document.getElementById('calendar-view' + table_index).clientWidth - this['calendar_scroll_distance' + table_index] < 78*5 + document.getElementById('calendar-view-container' + table_index).clientWidth){
      this.getRulesEngineData()
    }
  }

  onMouseOutLeft = () => {
    console.log('onMouseOutLeft is called')
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    console.log('onMouseOutRight is called')
    clearInterval(this.setRightInterval)
  }

  onRangeSelected = (range) => {
    this.setState({selected_range: range})
  }

  removeRange = () => {
    this.setState({ selected_range: {} })
  }  


  changeHotelAdjustment = (adjustment, hotel_index) => {
    console.log(adjustment, hotel_index)
    const new_competitive_hotels = this.state.competitive_hotels.map( hotel_object => {return {...hotel_object}})
    new_competitive_hotels[hotel_index].adjustment = adjustment
    this.setState({competitive_hotels: new_competitive_hotels, visibleAdjustmentIndex: -1})    
  }

  cancelHotelAdjustment = () => {
    this.setState({visibleAdjustmentIndex: -1})
  }

  changeDayAdjustment = (adjustment, month_index, index) => {
    const new_market_pricing_data = this.state.market_pricing_data.slice()
    new_market_pricing_data[month_index].data[index].adjustment = adjustment
    this.setState({market_pricing_data: new_market_pricing_data, visibleDailyAdjustmentIndex: -1})    
  }

  cancelDayAdjustment = () => {
    this.setState({visibleDailyAdjustmentIndex: -1})
  }

  render() {
    console.log('rendering')
    return (
    <div style={{display:'flex'}}>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Rates and availability'
    		path={'/rates-and-availability'}
    	/>
    	<div className="App rules-engine"
        style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  		  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
          textAlign:'center', height:140, borderBottom:'2px solid #ddd',
          background:'#def', fontFamily: "Raleway Webfont",}}>
          This is R&A
  			</div>

        <div style={{display:'flex', padding:25, flexWrap:'wrap'}}>
        { this.state.deep.list.map( item => <div style={{margin:10, padding:4, background:'#eee'}}>{item}</div>)}
        <button style={{width:'100%'}}
          onClick={()=>{ 
          const new_deep =  Object.assign({}, this.state.deep) //JSON.parse(JSON.stringify(this.state.deep)) 
          new_deep.list = new_deep.list.concat([323, 54, 87])
          console.log(new_deep.list)
          this.setState({ deep: new_deep })
        }}>Expand</button>        
        </div>

        <div class="page-top-header" style={{padding:'40px 30px 10px', fontFamily:'Helvetica, sans-serif'}}>
          {t('Revenue management engine')}
        </div>           

        <div className='options1'
          style={{display:'flex', padding:'0 30px 20px', alignItems:'center'}}>

          <div className={'clickable-dropdown-container' + (this.state.promotion_dropdown_active?' active':'')} 
            style={{padding:'12px 20px', width:290, height:54, border:'1px solid #337ab7', background:Color.themeBlueLight, 
            borderRadius:5, flexDirection: 'column', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div style={{color: Color.black3}}>
              {t('Choose which promotion to use to set the delta between BAR and sell rates:')}
            </div>
            <div>
            <div 
              style={{display:'inline-block', lineHeight:'18px', background:this.state.promotion&&Color.themeBlue, padding:'0 5px 0 3px', borderRadius:2}}>
              <div style={{display:'inline-block', color: this.state.promotion?'white':'#077ac1', fontSize: 13, marginLeft:2}}>
                {this.state.promotion?this.state.promotion:t('Promotions')}
              </div>
              <div onClick={()=>this.setState({promotion_dropdown_active: !this.state.promotion_dropdown_active})}
                style={{display:'inline-block', marginLeft: 7, paddingLeft:6, cursor:'pointer'}}>
                <i className="arrow down" style={{ borderColor: this.state.promotion?'white':'#077ac1', borderWidth:'0 2px 2px 0', marginBottom:2}}/>
              </div>
              <div className='dropdown-content' 
                style={{background:'white', zIndex:2, left: -1, right:-1, top:76, boxSizing:'border-box', padding:'6px 0',
                textAlign:'left', boxShadow:'0 1px 5px 0 rgba(0, 0, 0, 0.5)', border:'1px solid #337ab7'}}>
                { this.state.promotion_list.map( item => 
                  <div onClick={()=>this.setState({promotion: item, promotion_dropdown_active: false})}
                    class={this.state.promotion==item?"light-blue-hover active":"light-blue-hover"}
                    style={{lineHeight:'24px', padding:'2px 22px'}}>{ item || 'None' }</div> ) 
                } 
              </div>
            </div>      
            { this.state.promotion &&
              <div onClick={()=>this.setState({promotion:''})} 
                style={{marginLeft: 6, cursor: 'pointer', display:'inline-block', fontSize:16, lineHeight:'18px'}}>×</div>
            }                
            </div>
          </div>

          <div className={'clickable-dropdown-container' + (this.state.daterange_dropdown_active?' active':'')} 
            style={{padding:'12px 20px', width:290, height:54,border:'1px solid #337ab7', background:Color.themeBlueLight, marginLeft:20,
            borderRadius:5, flexDirection: 'column', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div style={{color: Color.black3}}>
              {t('Pick dates to edit in revenue management engine:')}
            </div>
            <div>
            <div style={{display:'inline-block', alignItems:'center', padding: '2px 5px 0', borderRadius: 2,
              background:this.state.confirmed_selected_range.start&&'#077ac1'}}>
              <i class="fa fa-calendar-check-o" 
                style={{color:this.state.confirmed_selected_range.start?'white':'#077ac1', fontSize:16, marginBottom:2}}></i>
              <div style={{color: this.state.confirmed_selected_range.start?'white':'#077ac1', fontSize: 13, marginLeft:10, display:'inline-block'}}>
                { formatDate(this.state.confirmed_selected_range.start, t('Dates')) + formatDate(this.state.confirmed_selected_range.end, '', ' - ')}
              </div>
              <div onClick={()=>this.setState({daterange_dropdown_active: !this.state.daterange_dropdown_active})}
                style={{display:'inline-block', marginLeft: 7, paddingLeft:6, cursor:'pointer'}}>
                <i className="arrow down" style={{ borderColor: this.state.confirmed_selected_range.start?'white':'#077ac1', borderWidth:'0 2px 2px 0', marginBottom:2}}/>
              </div>

              <div className='dropdown-content' 
                style={{background:'white', zIndex:2, left: -1, right:-1, top:76, boxSizing:'border-box', 
                textAlign:'left', boxShadow:'0 1px 5px 0 rgba(0, 0, 0, 0.5)', border:'1px solid #337ab7'}}>
                <ZuzuDateRangePicker
                  year={new Date().getFullYear()}
                  month={new Date().getMonth()}
                  disabledRanges={[]}
                  twoMonth={false}
                  selectedRange={this.state.selected_range}
                  onRangeSelected={this.onRangeSelected}                
                />
                <div>
                  <button autoFocus class='button-div' 
                    style={{float:'right'}} 
                    onClick={(e)=>{
                      this.setState({confirmed_selected_range: this.state.selected_range, daterange_dropdown_active: false})
                      e.stopPropagation()
                    }}>
                    Done
                  </button>
                  <button class='button-div' 
                    style={{margin:'0 12px 0 0', float:'right', }}
                    onClick={(e)=>{
                      this.setState({selected_range:this.state.confirmed_selected_range, daterange_dropdown_active: false})
                      e.stopPropagation()
                    }}>
                    Cancel
                  </button>                      
                </div>
              </div>                
            </div>  
            { this.state.confirmed_selected_range.start &&
              <div onClick={this.removeRange} 
                style={{marginLeft: 6, cursor: 'pointer', display:'inline-block', fontSize:16, lineHeight:'18px'}}>×</div>
            }
            </div>  
          </div>

        </div>






        <div style={{background: Color.background}}>
          <div style={{color:'#333333', fontSize:18, padding:'23px 25px 17px', }}>
            {t('Market pricing')}
          </div>
          <div style={{display:'flex', flexWrap:'wrap', marginLeft:25, marginBottom:10}}>
            { [{name:'mean', text: 'Mean'}, {name:'mean_exclude', text: 'Mean excluding highest and lowest'}, 
              {name:'median', text: 'Median'}, {name:'median_exclude', text: 'Median excluding highest and lowest'}]
              .map( item => 
                <div style={{display:'flex',  alignItems:'center', marginRight:20}}>
                  <div name={item.name}
                    onClick={this.onAvgChange} style={{lineHeight:'18px'}}
                    class={this.state.avg_option===item.name?'radio active':'radio'}>
                    <div name={item.name} class='radio-inner'>
                    </div>
                  </div>
                  <span style={{lineHeight:'20px',marginLeft:8}}>
                    {t(item.text)}
                  </span>            
                </div>
            )}

          </div>          
          <div style={{background: '#d9534f', padding:'8px 30px', fontWeight:200,
            lineHeight:1.2, fontSize: 14, color:'white'}}>
            {t('Revenue management rules for this hotel are set to ignore competitive prices')}&nbsp;&nbsp; 
            <span style={{ textDecoration: 'underline'}}> {t('Review')}?</span>
          </div>
        </div>

        <div style={{display:'flex', position:'relative'}}>
          <div style={{position:'absolute', left:240, top:5, textAlign:'right', 
            width:72, background: '#f9f9f9', fontSize:12,  zIndex:100}}>
            {mon[new Date(this.state.year, this.state.month_in_display1, 1).getMonth()]} {new Date(this.state.year, this.state.month_in_display1, 1).getFullYear()}
          </div>      
          <img style={{color: '#ebebeb', position:'absolute', left:230, top: 42, display: this.state.table_collapsed1?'block':'none'}} 
            src={require('../../img/collapsed-divider.svg')} />

          <div style={{width:240,textAlign:'right',}}>
            <div style={{height:60, background:'#f9f9f9'}}>
              <div onMouseOver={()=>this.scrollLeft(1)} onMouseOut={()=>this.onMouseOutLeft(1)}
                style={{height:14, width:14, display:'inline-block', marginRight:20, 
                marginTop:24, cursor:'pointer'}}>
                <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                  borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
              </div> 
              <div style={{borderRight:'1px solid #c0c0c0', height:24, textAlign:'left', paddingLeft: 34}}>
                <span style={{cursor:'pointer', color:'#4e4c5b'}}
                  onClick={()=>this.setState({table_collapsed1: !this.state.table_collapsed1})}>
                  <span style={{fontSize:8, display:'inline-block', width:16,
                    transform:this.state.table_collapsed1?'scale(1, 1.6)': 'scale(1.8, 1) translateY(-1px)' }}>
                    {this.state.table_collapsed1?String.fromCharCode(9658):String.fromCharCode(9660)}
                  </span>           
                  { this.state.table_collapsed1?t('Show all hotels'):
                    t('Hide all hotels')}
                </span>              
              </div>           
            </div>
            {  !this.state.table_collapsed1 && ['host name 1', 'host name 2', 'host name 3', 'host name 4',
               'host name 5', 'host name 6', 'host name 7'].map( item => 
                <div style={{marginLeft: 30, lineHeight:'16px', textAlign: 'left', padding:'8px 20px',
                  borderBottom:'1px solid #ebebeb', borderRight:'1px solid #c0c0c0'}}>
                  {item}
                </div>                
               )
            }        
            {  this.state.table_collapsed1 && 
                <div style={{marginLeft: 30, lineHeight:'16px', textAlign: 'left', padding:'8px 20px',
                  borderBottom:'1px solid #ebebeb', borderRight:'1px solid white'}}>
                  &nbsp;
                </div>                
            }               
            <div style={{marginLeft: 30, height:32, lineHeight:'16px', textAlign: 'left', padding:'6px 20px',
              borderBottom:'1px solid #ebebeb', borderRight:'1px solid #c0c0c0'}}>
              {t('Mean excluding highest and lowest')}
            </div>                
          </div>

          <div id='calendar-view-container1' className='calendar-view-container'
            style={{width: 'calc( 100% - 284px )', display: 'flex', overflowX:'hidden', 
              marginBottom:-108, paddingBottom:108}}>            
            <div id='calendar-view1' className='calendar-view' style={{display:'flex'}} >            
            { this.state.market_pricing_data.map(month => month.data.map( (day, index) => 
                <div style={{minWidth:78,}}>
                  <div  style={{background:'#f9f9f9', height:60, display:'flex', flexDirection:'column-reverse'}}>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:15, fontWeight:600,
                      color:'#4d4d59',borderRight:'1px solid #ebebeb'}}>
                      {day.date}
                    </div>                  
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:'#4d4d59'}}>
                      {days[new Date(month.year, month.month - 1, day.date ).getDay()]} 
                    </div>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, display:!index?'block':'none'}}>
                      {mon[new Date(month.year, month.month - 1, day.date ).getMonth()]}&nbsp;
                      {new Date(month.year, month.month - 1, day.date).getFullYear()}
                    </div>                    
                  </div>
                  { this.state.table_collapsed1 &&  <div style={{height:33, 
                    boxSizing:'border-box', padding:'5px 8px', width:78,
                    border:'solid #ebebeb', borderWidth:'0 1px 1px 0', textAlign:'right'}}>
                    &nbsp;
                  </div> 
                  }
                  { !this.state.table_collapsed1 && day.values.map( (item, index) => 
                    <div className="dropdown-container"
                      style={{height:33, boxSizing:'border-box', padding:'5px 8px', width:78, fontSize: 13,
                      border:'solid #ebebeb', borderWidth:'0 1px 1px 0', textAlign:'right'}}>
                      {item.price}
                      <div className="dropdown-content" 
                        style={{top:-20, left:'98%', padding:'8px 18px 12px 18px', marginLeft: 12, boxShadow: '0 2px 7px 0 #bbb', width:180,
                        boxSizing:'content-box', background:'white', borderRadius:4,  fontSize:12, lineHeight:1.4121,
                        textAlign:'left', zIndex:1}}>
                        <div style={{transform:'rotate(45deg)', boxShadow: '-2px 2px 7px -2px #aaa', background:'white',
                          width:16, height:16, position:'absolute', left:-8, top:30}}></div>
                        <div className="cell-header">{t('Room type')}</div>
                        <div className="cell-content">{item.room_type || 'N/A'}</div>
                        <div className="cell-header">{t('Rate plan')}</div>
                        <div className="cell-content">{item.rate_plan || 'N/A'}</div>
                        <div className="cell-header">{t('Channel')}</div>
                        <div className="cell-content">{item.channel || 'N/A'}</div>
                        <div className="cell-header">{t('Date gathered')}</div>
                        <div className="cell-content">{item.created_at || 'N/A'}</div>
                      </div>
                    </div> 
                  )}   
                  <div style={{height:45, boxSizing:'border-box', padding:'5px 8px', width:78, display: 'flex',
                    flexDirection:'column-reverse', alignItems:'flex-end', fontSize: 13,
                    border:'solid #ebebeb', borderWidth:'0 1px 1px 0'}}>
                    {day.avg}
                  </div>                                                                                                                         
                </div>                
              ))
            }             
            </div>
          </div>
          <div style={{minWidth:14, textAlign:'center', height:60, background:'#f9f9f9', paddingRight:30}}>
            <div onMouseOver={()=>this.scrollRight(1)} onMouseOut={()=>this.onMouseOutRight(1)}
              style={{height:14, width:14, display:'inline-block', 
                marginTop:24, cursor:'pointer'}}>
              <i className="arrow right" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>
          </div>
        </div>










        <div style={{background: Color.background, marginTop: 30}}>
          <div style={{color:'#333333', fontSize:18, padding:'23px 25px 17px', }}>
            {t('Market pricing with adjustments')}
          </div>
        </div>








        <div style={{display:'flex', overflow: 'hidden', position:'relative'}}>
          <div style={{position:'absolute', left:240, top:5, textAlign:'right', 
            width:72, background: '#f9f9f9', fontSize:12,  zIndex:100}}>
            {mon[new Date(this.state.year, this.state.month_in_display2, 1).getMonth()]} {new Date(this.state.year, this.state.month_in_display2, 1).getFullYear()}
          </div>      
          <img style={{color: '#ebebeb', position:'absolute', left:230, top: 42, zIndex:2, 
              display: this.state.table_collapsed2?'block':'none'}} 
            src={require('../../img/collapsed-divider.svg')} />

          <div style={{width:240,textAlign:'right',}}>
            <div style={{height:60, background:'#f9f9f9'}}>
              <div onMouseOver={()=>this.scrollLeft(2)} onMouseOut={()=>this.onMouseOutLeft(2)}
                style={{height:14, width:14, display:'inline-block', marginRight:20, 
                marginTop:24, cursor:'pointer'}}>
                <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                  borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
              </div> 
              <div style={{borderRight:'1px solid #c0c0c0', height:24}}>
              </div>           
            </div>
            <div style={{height: 39, textAlign:'left', paddingLeft: 16, lineHeight:'39px', borderBottom:'1px solid #ebebeb', 
                borderRight:this.state.table_collapsed2?'1px solid transparent':'1px solid #c0c0c0', marginLeft: 25}}>
                <span style={{cursor:'pointer', color:'#4e4c5b'}}
                  onClick={()=>this.setState({table_collapsed2: !this.state.table_collapsed2})}>
                  <span style={{fontSize:8, display:'inline-block', width:16,
                    transform:this.state.table_collapsed2?'scale(1, 1.6) translateY(-1.5px)': 'scale(1.8, 1) translateY(-1.5px)' }}>
                    {this.state.table_collapsed2?String.fromCharCode(9658):String.fromCharCode(9660)}
                  </span>           
                  { this.state.table_collapsed2?t('Show all hotels'):
                    t('Hide all hotels')}
                </span>      
                <span onClick={()=>this.setState({mpAdjustmentEditing: !this.state.mpAdjustmentEditing})} 
                  style={{color:'#077ac1', float:'right', marginRight:16, cursor:'pointer'}}>
                  {t('Adjustments')}
                </span>            
            </div>            
            {  !this.state.table_collapsed2 && this.state.competitive_hotels.map( (item, index) => 
                <div style={{marginLeft: 30, lineHeight:'32px', textAlign: 'left', padding:'0 6px 0 3px',
                  borderBottom:'1px solid #ebebeb', borderRight:'1px solid #c0c0c0', position:'relative'}}>
                  <div  
                    onClick={ !this.state.mpAdjustmentEditing?null:()=>{
                      const new_competitive_hotels = this.state.competitive_hotels.map( hotel_object => {return {...hotel_object}})
                      new_competitive_hotels[index].disabled = !new_competitive_hotels[index].disabled
                      this.setState({competitive_hotels: new_competitive_hotels})
                    }} 
                    style={{width:16, height:16, display:'inline-block', marginRight:0, cursor:'pointer', 
                    verticalAlign:'middle', lineHeight:'16px', textAlign:'center'}}>
                    <i className={item.disabled?'tick-x disabled':(this.state.mpAdjustmentEditing?'tick-x editing':'tick-x normal')}
                      style={{ borderWidth:'0 2px 2px 0', marginBottom: 2}}/>
                  </div>
                  <span style={{ display: 'inline-block', maxWidth: 142, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', verticalAlign: 'top'}}>{item.name}</span>                  
                  <span onClick={()=>this.setState({visibleAdjustmentIndex: index})} 
                    className={this.state.mpAdjustmentEditing?'mp-adjustment editing':'mp-adjustment'}
                    style={{  float: 'right', lineHeight: '16px',  width: 32, padding: '7px 4px 7px 4px'}}>{item.adjustment}</span>
                  { this.state.visibleAdjustmentIndex==index && 
                    <AdjustmentEditor 
                      adjustment={item.adjustment}
                      index={index}
                      onConfirm={this.changeHotelAdjustment}
                      onCancel={this.cancelHotelAdjustment}
                    /> 
                  }
                </div>                
               )
            }                  
            <div style={{marginLeft: 30, height:32, lineHeight:'16px', textAlign: 'left', padding:'6px 20px',
              borderBottom:'1px solid #ebebeb', borderRight:'1px solid #c0c0c0'}}>
              {t('Mean excluding highest and lowest')}
            </div>                
          </div>

          <div id='calendar-view-container2' className='calendar-view-container'
            style={{width: 'calc( 100% - 284px )', display: 'flex', overflow:'hidden'}}>            
            <div id='calendar-view2' className='calendar-view' style={{display:'flex'}} >            
            { this.state.market_pricing_data.map((month, month_index) => month.data.map( (day, index) => 
                <div style={{minWidth:78,}}>
                  <div  style={{background:'#f9f9f9', height:60, display:'flex', flexDirection:'column-reverse'}}>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:15, fontWeight:600,
                      color:'#4d4d59',borderRight:'1px solid #ebebeb'}}>
                      {day.date}
                    </div>                  
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:'#4d4d59'}}>
                      {days[new Date(month.year, month.month - 1, day.date ).getDay()]} 
                    </div>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, display:!index?'block':'none'}}>
                      {mon[new Date(month.year, month.month - 1, day.date ).getMonth()]}&nbsp;
                      {new Date(month.year, month.month - 1, day.date).getFullYear()}
                    </div>                    
                  </div>
                  <div style={{height:40, boxSizing:'border-box', padding:'4px 1px', width:78,
                    border:'solid #ebebeb', borderWidth:'0 1px 1px 0', textAlign:'right'}}>
                    { this.state.mpAdjustmentEditing &&
                      <div onClick={()=>this.setState({visibleDailyAdjustmentIndex: 
                        (month_index?this['calendar_lengths_list' + 1][month_index - 1]:0) + index})}
                        className='mp-adjustment editing'
                        style={{height:29, width:53,lineHeight: '29px', padding:'0 10px', position:'relative'}}>
                        {day.adjustment || 0}
                        { (this.state.visibleDailyAdjustmentIndex== (month_index?this['calendar_lengths_list' + 1][month_index - 1]:0) + index )&& 
                          <AdjustmentEditor 
                            adjustment={day.adjustment || '0'}
                            index={index}
                            style={{left:this.measureScrollLeft(2, index, month_index), top: 8}}
                            onConfirm={(adjustment)=>this.changeDayAdjustment(adjustment, month_index, index)}
                            onCancel={this.cancelDayAdjustment}
                          /> 
                        }                      
                      </div>
                    }
                  </div> 
                  { !this.state.table_collapsed2 && day.values.map( (item, index) => 
                    <input value={item}
                      style={{height:33, boxSizing:'border-box', padding:'5px 8px', width:78, fontSize: 13,
                      border:'solid #ebebeb', borderWidth:'0 1px 1px 0', textAlign:'right'}}>
                    </input> 
                  )}   
                  <div style={{height:45, boxSizing:'border-box', padding:'5px 8px', width:78, display: 'flex',
                    flexDirection:'column-reverse', alignItems:'flex-end', fontSize: 13,
                    border:'solid #ebebeb', borderWidth:'0 1px 1px 0'}}>
                    {day.avg}
                  </div>                                                                                                                         
                </div>                
              ))
            }             
            </div>
          </div>
          <div style={{minWidth:14, textAlign:'center', height:60, background:'#f9f9f9', paddingRight:30}}>
            <div onMouseOver={()=>this.scrollRight(2)} onMouseOut={()=>this.onMouseOutRight(2)}
              style={{height:14, width:14, display:'inline-block', 
                marginTop:24, cursor:'pointer'}}>
              <i className="arrow right" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
            </div>
          </div>
        </div>











        <div style={{background:Color.background, padding: 25, minWidth:868}}>
          <div style={{lineHeight:'34px', position:'relative'}}>
            <div style={{fontSize:18}}>{t('Recommended sell rates')}</div>
            <div style={{position: 'absolute', left:'50%', top:0,  
              border:'1px solid', borderColor: Color.themeBlue, lineHeight:'32px',
              background: this.state.show_revenue_management_rules?Color.themeBlue:'white', 
              color: this.state.show_revenue_management_rules?'white':Color.themeBlue,
              borderRadius: this.state.show_revenue_management_rules?'4px 4px 0 0':4, 
              width:350, textAlign:'center', transform: 'translateX(-50%)', fontSize: 14}}>
              {t('Revenue management rules')}
              <div style={{width:16, height:16, display:'inline-block', lineHeight: '16px',
                verticalAlign:'middle', marginLeft:12}}
                onClick={()=>this.setState({show_revenue_management_rules: !this.state.show_revenue_management_rules})}>
              <i 
                className={this.state.show_revenue_management_rules?'arrow down-x up-x':'arrow down-x'}
                style={{}}
              />
              </div>
            </div>
          </div>
          { this.state.show_revenue_management_rules &&
            <div style={{border:'2px solid', borderColor: Color.themeBlue, borderRadius:4, background:'white'}}>
              <div style={{display:'flex', padding:'0 20px', alignItems:'center', margin:'30px 0 20px'}}>
                <div style={{display:'flex',  borderRadius: 16, height: 34, border: '1px solid #ebebeb',
                  background: Color.gray1,  padding:'0 7px', boxSizing:'border-box',minWidth:300}}>
                  <div onClick={()=>this.setState({price_not_market_price: false})}
                    className={this.state.price_not_market_price?'header-tab':'header-tab in-focus'}>
                    {t('Market average prices')}
                  </div>            
                  <div onClick={()=>this.setState({price_not_market_price: true})}
                    className={this.state.price_not_market_price?'header-tab in-focus':'header-tab'}>
                    {t('Default BAR')}
                  </div>          
                </div>
                <div style={{color:'#9b9b9b', fontSize:12, maxWidth: 590, marginLeft: 20, lineHeight:1.4121}}>
                  {t("The rules engine allows deltas to be set for different combinations of occupancy and advance purchase window.  \
                    These deltas can be set relative to the hotel's 'Default BARs' or to 'Market average prices'")}
                </div>
              </div>

              {!this.state.price_not_market_price &&
                <div style={{padding:'12px 20px',background: Color.themeBlueLight, marginBottom: 2}}>
                  <div style={{margin: '0 20px 10px', fontSize: 13, fontWeight: 'bold', color: Color.black1}}>
                  {t('Mapping market prices to our room types')}
                  </div>
                  <div style={{marginLeft: 20, display:'flex'}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <div style={{lineHeight:'20px', marginRight:8}}>{t('Map market average to:')}</div>
                      <div className={this.state.master_room_type_dropdown?'clickable-dropdown-container active'
                        :'clickable-dropdown-container'}
                        style={{height:12, border:'1px solid #c0c0c0', lineHeight:'12px', borderRadius:16, width:250, background:'white',
                         padding:'6px 16px', display:'flex', justifyContent:'space-between'}}>
                        {this.state.master_room_type}&nbsp;
                        <div 
                          onClick={()=>this.setState({master_room_type_dropdown: !this.state.master_room_type_dropdown})}
                          style={{display:'inline-block', width:12, height:12, lineHeight:1, marginBottom:1, cursor:'pointer'}}>
                          <i className='arrow down' style={{marginRight:5, padding:4, borderWidth:'0 2px 2px 0', borderColor: Color.themeBlue}}/>
                        </div>
                        <div className='dropdown-content' 
                          style={{background:'white', zIndex:2, width:'90%', left:12, top:24, boxSizing:'border-box', 
                          textAlign:'left', boxShadow:'0 1px 5px 0 rgba(0, 0, 0, 0.5)'}}>
                          { this.state.master_room_type_list.map( item => 
                            <div onClick={()=>this.setState({master_room_type: item, master_room_type_dropdown: false})}
                              class={this.state.master_room_type==item?"light-blue-hover active":"light-blue-hover"}
                              style={{lineHeight:'24px', padding:'2px 10px'}}>{item}</div> ) 
                          } 
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <div style={{lineHeight:'20px', margin:8}}>{t('For other master room types use which delta?')}</div>
                      <div style={{display:'flex',  borderRadius: 16, height: 24, width:74, border: '1px solid #c0c0c0',
                        background: 'white', position:'relative'}}>
                        <div onClick={()=>this.setState({percentage_not_number1: true})}
                          className={this.state.percentage_not_number1?'toggle-box-item in-focus':'toggle-box-item'}
                          style={{ left:10 }}>
                          %
                        </div>
                        <div onClick={()=>this.setState({percentage_not_number1: false})}
                          className={this.state.percentage_not_number1?'toggle-box-item':'toggle-box-item in-focus'}
                          style={{ right:13 }}>
                          #
                        </div>      
                        <div className={this.state.percentage_not_number1?'toggle-box':'toggle-box in-right'}
                          style={{background:Color.themeBlue, height:32, width:36, position:'absolute', top:-4, borderRadius:16}}></div>    
                      </div>                
                    </div>              
                  </div>
                </div>
              }

              <div style={{padding:'12px 20px',background: Color.background}}>
                <div style={{margin: '0 20px 10px', fontSize: 13, fontWeight: 'bold', color: Color.black1}}>
                {t('Deltas to apply to market prices based on occupancy and advanced purchase window conditions')}
                </div>

                <div style={{marginLeft: 20, display:'flex', alignItems:'center'}}>
                  <div style={{lineHeight:'20px', marginRight:8}}>
                    {t('Deltas vs. market prices as:')}
                  </div>
                  <div style={{display:'flex',  borderRadius: 16, height: 24, width:74, border: '1px solid #c0c0c0',
                    background: 'white', position:'relative'}}>
                    <div onClick={()=>this.setState({percentage_not_number2: true})}
                      className={this.state.percentage_not_number2?'toggle-box-item in-focus':'toggle-box-item'}
                      style={{ left:10 }}>
                      %
                    </div>
                    <div onClick={()=>this.setState({percentage_not_number2: false})}
                      className={this.state.percentage_not_number2?'toggle-box-item':'toggle-box-item in-focus'}
                      style={{ right:13 }}>
                      #
                    </div>      
                    <div className={this.state.percentage_not_number2?'toggle-box':'toggle-box in-right'}
                      style={{background:Color.themeBlue, height:32, width:36, position:'absolute', top:-4, borderRadius:16}}></div>    
                  </div>                
                </div>              
              </div>


              <div className='rules-table' style={{minWidth:754 + 81*(this.state.headers.length - 7)}}>
                <div className='rules-table-header'
                  style={{display:'flex', background: Color.background, padding: '3px 20px',}}>
                  <div style={{minWidth:88, display:'flex', alignItems:'center', 
                    justifyContent:'flex-end', fontSize: 12, color:'#257abc',textAlign:'right'}}>
                    <div onClick={()=>this.setState({rowNamesEdit: !this.state.rowNamesEdit})}
                      style={{width:70, textAlign:'center', cursor:'pointer'}}>
                      <i class="zuzu-icon-cog"></i> {this.state.rowNamesEdit?t('Save'):t('Edit')}
                    </div>
                  </div>
                  { this.state.headers.map( (item, index) => 
                    <div style={{width:79, marginRight:2,boxSizing:'border-box',}}>
                      <div onClick={this.state.rowNamesEdit && index > 1 ?()=>this.setState({ visibleHeaderIndex: index }):null}
                      className={this.state.rowNamesEdit && index > 1 ?'edtiable-header editing':'edtiable-header'}>
                        {index > 1 && item.low && item.high && item.low + '-' + item.high + ' days'}
                        {index > 1 && !item.high && item.low + '+ days'}
                        {index <= 1 && item}
                        { this.state.visibleHeaderIndex === index && 
                          <EditableRange
                            range={item}
                            index={index}
                            header={true}
                            single={ index == this.state.headers.length - 1 }
                            lowBound={this.state.headers[index - 1].low + (index==this.state.headers.length - 1?1:2)}
                            highBound={index==this.state.headers.length - 2?this.state.headers[index + 1].low:(this.state.headers[index + 1]?this.state.headers[index + 1].high - 2:720)}
                            onConfirm={this.onHeaderChange}
                            onCancel={this.collapsePercentageSelector}
                          />                    
                        }       
                        <div style={{width:24, height:24, background:'#ffffff', borderRadius:12, zIndex:1,
                          display: this.state.rowNamesEdit&&index>2?'block':'none',  boxSizing:'border-box',
                          position:'absolute', left:27, top:-12, padding:2}}>
                          <div onClick={(e)=>{
                              this.setState({show_popup: true, delete_header_index: index })
                              e.stopPropagation()
                            }}
                            style={{width:20, height:20, background:'#c92d28', borderRadius:10, fontWeight:200,
                            color:'white', fontSize:16, fontFamily:'sans-serif', lineHeight:'18px', textAlign:'center'}}>
                            &times;
                          </div>                        
                        </div>                             
                      </div>
                    </div>) 
                  }
                  { this.state.rowNamesEdit &&
                      <div 
                        onMouseUp={this.addNewHeader}
                        onMouseDown={()=>this.setState({newHeaderBeingClicked: true})}  
                        style={{ marginLeft:12, display:'flex', alignItems:'center'}}>
                          <div style={{background:this.state.newHeaderBeingClicked?Color.themeBlue:null,
                            color: this.state.newHeaderBeingClicked?'#ffffff':Color.themeBlue, width: 26,
                            cursor:'pointer', borderRadius:12, textAlign:'center', fontSize:16,}}>
                            +
                          </div>
                      </div>
                  }             
                </div>

                <div className='rules-table-header-black-bar'
                  style={{display:'flex', background: '#4d4d59', color:'white', lineHeight:'21px'}}>       
                  <div style={{textAlign:'right', width: 100, paddingRight:7, borderRight:'1px solid #f3f3f3'}}>{t('Occupancy')}</div>   
                  <div style={{textAlign:'center', width: 566 }}>{t('Advanced purchase window')}</div>   
                </div>         

                <div className='rules-table-body' style={{display:'flex'}}>
                  <div style={{width:108}}>
                    { this.state.rowNames.map( (item, index) => 
                      <div 
                        className='editable-row-names'
                        style={{marginLeft:20, color: '#ebebeb', width:88, position: 'relative', boxSizing:'border-box',
                        textAlign:'right', height: 33, lineHeight:'32px',borderRight:'1px solid #f3f3f3'}}>
                        {this.state.rowNamesEdit?index+1:null}
                        <div style={{display:'inline-block',height:27, width:70, marginLeft:4,
                          verticalAlign:'top', borderBottom:'1px solid #f3f3f3', padding:'3px 0 2px',}}>
                          <div 
                            className={'row-name' + (this.state.rowNamesEdit?' editing':'')}
                            onClick={ this.state.rowNamesEdit?(e)=>this.setState({ visibleRowNameIndex: index}):null } >
                            {item.low + ' - ' + item.high + '%'}
                            <div style={{width:24, height:24, background:'#ffffff', borderRadius:12, zIndex:1,
                              display: this.state.rowNamesEdit&&index?'block':'none',  boxSizing:'border-box',
                              position:'absolute', right:-16, top:1.5, padding:2}}>
                              <div onClick={(e)=>{
                                  this.setState({show_popup: true, delete_row_name_index: index })
                                  e.stopPropagation()
                                }}
                                style={{width:20, height:20, background:'#c92d28', borderRadius:10, fontWeight:200,
                                color:'white', fontSize:16, fontFamily:'sans-serif', lineHeight:'18px'}}>
                                &times;
                              </div>                        
                            </div>
                          </div>
                        </div>
                        { this.state.visibleRowNameIndex === index && 
                          <EditableRange
                            range={item}
                            index={index}
                            lowBound={index?this.state.rowNames[index - 1].low + 2:0}
                            highBound={index==this.state.rowNames.length - 1?100:this.state.rowNames[index + 1].high - 2}
                            onConfirm={this.onRowNameChange}
                            onCancel={this.collapsePercentageSelector}
                          />
                        }
                      </div>) 
                    }
                  </div>
                  <div className='rules-table-content'>
                    { this.state.data.map( (row, row_index) => 
                        <div className="rules-table-row" style={{display:'flex'}}>
                          { row.map( (cell, col_index) => 
                              <div 
                                style={{ position:'relative',width:80,borderRight: '1px solid #f3f3f3', borderBottom:'1px solid #f3f3f3'}}>
                              <input className='rules-table-cell' 
                                value={cell} 
                                onChange={(e)=>this.updateCell(e, row_index, col_index)}
                                style={{ width:78, borderWidth:0, padding:0, lineHeight:'31px', 
                                  textAlign:'center', fontSize: 13, color:'black', boxSizing:'border-box'}}/>
                              <span className='rules-table-cell-hook'></span>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                </div>  
                { this.state.rowNamesEdit &&
                  <div style={{marginLeft:48,  width: 632, borderBottom: '1px solid #f3f3f3', lineHeight:'32px'}}>
                    <div 
                      onMouseUp={this.addNewRow}
                      onMouseDown={()=>this.setState({newRowBeingClicked: true})}  
                      style={{ background:this.state.newRowBeingClicked?Color.themeBlue:null, cursor:'pointer', borderRadius:12,
                        color: this.state.newRowBeingClicked?'#ffffff':Color.themeBlue, marginLeft:22, verticalAlign:'middle',
                        fontSize:16, padding:'2px 8px', lineHeight:1, display:'inline-block'}}>+</div>
                  </div>  
                }    

                <div style={{width:675}}>
                  <div style={{background: Color.background, padding:'10px 25px', fontWeight:'bold', fontSize:13, display:'flex'}}>
                    {t('Set floor sell rate')}<span style={{color:Color.orange}}>*</span>
                    <div 
                      onClick={()=>this.setState({show_floor_sell_rate: !this.state.show_floor_sell_rate})}
                      style={{display:'inline-block', width:16, height:16, lineHeight:'16px', 
                        verticalAlign:'middle', marginLeft:16, cursor:'pointer'}}>
                      <i 
                        style={{padding:4, border:'solid black', borderWidth:'0 2px 2px 0', borderColor: Color.themeBlue, display: 'inline-block',
                          transform:this.state.show_floor_sell_rate?'translateY(0px) rotate(45deg)':'translateY(4px) rotate(225deg)'
                        }}
                      />
                    </div>                    
                  </div>
                  { this.state.show_floor_sell_rate && <div>
                      <div style={{background: Color.background, display:'flex'}}>
                        { ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(item => 
                            <div style={{borderRight:'1px solid #e3e3e3', flexBasis:'14.28%', flexGrow:1, textAlign:'right', lineHeight:1, padding:'2px 10px 16px 0'}}>
                              {t(item)}
                            </div>
                          )
                        }
                      </div>
                      <div style={{display:'flex', border:'solid #e3e3e3', borderWidth:'1px 0 1px 0'}}>
                        { this.state.floor_sell_rates.map( (item, index) => 
                            <div style={{borderRight:'1px solid #e3e3e3', flexBasis:'14.28%', flexGrow:1}}>
                              <input className='rules-table-cell' 
                                value={'$' + item} 
                                onChange={(e)=>this.updateFloorSellRate(e, index)}
                                onBlur={()=>this.onFloorSellRateBlur(index)}
                                style={{ borderWidth:0, lineHeight:'31px', width:'100%', padding:'0px 10px 0px 0px', textAlign:'right',
                                  fontSize: 13, color:'black', boxSizing:'border-box'}}/>                        
                            </div>
                          )
                        }
                      </div>
                      <div style={{lineHeight:'36px', paddingLeft:25, color: '#333333'}}>
                        <span style={{color:Color.orange}}>*</span>
                        {t('Tax inclusive')}
                      </div>
                      <div style={{display:'flex', paddingLeft:25}}>
                        <div onClick={()=>this.setState({maintain_master_derived: !this.state.maintain_master_derived})} 
                          style={{width:18, height:18, background: this.state.maintain_master_derived?Color.themeBlue:'white', 
                            cursor:'pointer', boxSizing:'border-box', border:'2px solid #337ab7', color:'white', borderRadius:3}}>
                          <i className="tick-x" style={{display: this.state.maintain_master_derived?null:'none', 
                            marginLeft:4, marginBottom:1, borderWidth: '0 2px 2px 0', width: 4, height: 8 }}/>
                        </div>                  
                        <span style={{marginLeft:10}}>{t('If adjusting a master rate for floor prices, maintain master/derived relationship for rate plans.')}</span>
                      </div>                    
                    </div>
                  }
                </div>     

                <button 
                  style={{background:Color.orange, width:93, textAlign:'center', fontSize:16, fontWeight:200, cursor:'pointer',
                    lineHeight:'35px', borderRadius:5, color:'white', margin:'10px 24px', outline:'none'}}>
                  {t('Save')}
                </button>
              </div>            
            </div>
          }
        </div>
        <Table3 
          promotion={'CNY promotion'}
        />

        <div className='experiment' style={{width: '100%', height: 800, padding:100, boxSizing:'border-box', background:'#eee'}}>
          <div style={{display:'flex'}}>
            <div onClick={this.toggleOnOff}
              style={{color:this.state.on?'white':'rgba(0, 0, 0, 0.25)', background: this.state.on?Color.themeBlue:null,
              borderRadius:18, height:25, lineHeight:'25px', padding:'0 10px', fontSize:12, cursor:'pointer'}}>
              {t('On')}
            </div>
            <div onClick={this.toggleOnOff}
              style={{color:this.state.on?'rgba(0, 0, 0, 0.25)':'white', background: this.state.on?null:Color.red,
              borderRadius:18, height:25, lineHeight:'25px', padding:'0 10px', fontSize:12, cursor:'pointer'}}>
              {t('Off')}
            </div>
          </div>
        </div>

        {this.state.show_popup && ( 
          <DeletePopup
            text={t('Confirm deleting this ' + (this.state.delete_row_name_index?'row':'column') + '?')}
            confirm={this.deleteRowOrColumn}
            cancel={()=>this.setState({show_popup:false})}
          />
        )}
		  </div>
    </div>
    );
  }
}

export default RulesEngine;