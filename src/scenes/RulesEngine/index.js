import React from "react"
import Navigation from '../../components/Navigation'
import DeletePopup from '../../components/DeletePopup'

import './RulesEngine.css'
import RulesEngineApi from '../../api/RulesEngineApi'
import Color from '../../Color'

import EditableRange from './EditableRange'

const t = str => str

const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

class RulesEngine extends React.Component {
  state = {
    show_popup: false,
    show_revenue_management_rules: false,

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
    visibleRowNameIndex: 3,

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
    if(!event || !event.target.matches('.edtiable-header, .edtiable-header *, .editable-row-names *'))
      this.setState({visibleRowNameIndex: -1, visibleHeaderIndex: -1})
  }

  whichMonthToDisplay = ( table_index) => {
    const day_count = this['calendar_scroll_distance' + table_index]/78;

    for(let i=0; i<this['calendar_lengths_list' + table_index].length; i++){
      if( day_count < this['calendar_lengths_list' + table_index][i] ){
        if(i!=this.state['month_in_display' + table_index])
          this.setState({['month_in_display' + table_index]: i})
        break
      }
    }
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

  scrollLeft = (table_index) => {
    console.log('scrollLeft is called')
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(table_index), 16)
  }

  scrollLeftDirtyWork = (table_index) => {
    console.log('scrollLeftDirtyWork is called:', document.getElementById('calendar-view-container' + table_index).scrollLeft)
    document.getElementById('calendar-view-container' + table_index).scrollBy(-16,0)
    this['calendar_scroll_distance' + table_index] = document.getElementById('calendar-view-container' + table_index).scrollLeft
    this.whichMonthToDisplay(table_index)
  }

  scrollRight = (table_index) => {
    console.log('scrollRight is called')
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(table_index), 16)
  }

  scrollRightDirtyWork = (table_index) => {
    document.getElementById('calendar-view-container' + table_index).scrollBy(16,0)
    this['calendar_scroll_distance' + table_index] = document.getElementById('calendar-view-container' + table_index).scrollLeft
    this.whichMonthToDisplay(table_index)
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
    	<div className="App revenue-management-rules"
        style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  		  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
          textAlign:'center', height:140, borderBottom:'2px solid #ddd',
          background:'#def', fontFamily: "Raleway Webfont",}}>
          This is R&A
  			</div>

        <div class="page-top-header" style={{padding:'40px 30px 10px', fontFamily:'Helvetica, sans-serif'}}>
          {t('Revenue management engine')}
        </div>           

        <div className='options1'
          style={{display:'flex', padding:'0 30px 20px', alignItems:'center', flexWrap:'wrap'}}>

          <div style={{display:'flex', height:34, alignItems:'center'}}>
            <div style={{color: '#077ac1', fontSize: 13, marginLeft:2}}>{t('Promotions')}</div>
            <i className="arrow down" style={{ marginLeft: 13, 
              borderColor: '#077ac1', borderWidth:'0 2px 2px 0', marginBottom:6}}/>
          </div>

          <div style={{height:34, borderRight:'2px solid #ccc', marginLeft:35, marginRight:50}}>
          </div>

          <div style={{display:'flex', height:34, alignItems:'center', marginRight:30}}>
            <div onClick={()=>this.setState({all_room_types: !this.state.all_room_types})} 
              style={{width:18, height:18, background: this.state.all_room_types?Color.themeBlue:'white', cursor:'pointer', 
                boxSizing:'border-box', border:'3px solid #337ab7',marginBottom:3,
                borderRadius:9, color:'white'}}>
              <i className="tick-x" style={{display: this.state.all_room_types?null:'none', 
                marginLeft:3, marginBottom:2}}/>
            </div>
            <div style={{color: '#077ac1', fontSize: 13, marginLeft:6}}>{t('All room types')}</div>
          </div>

          <div style={{display:'flex', height:34, alignItems:'center', marginRight:30}}>
            <div onClick={()=>this.setState({all_rate_plans: !this.state.all_rate_plans})} 
              style={{width:18, height:18, background: this.state.all_rate_plans?Color.themeBlue:'white', cursor:'pointer', 
                boxSizing:'border-box', border:'3px solid #337ab7',marginBottom:3,
                borderRadius:9, color:'white'}}>
              <i className="tick-x" style={{display: this.state.all_rate_plans?null:'none', 
                marginLeft:3, marginBottom:2}}/>
            </div>          
            <div style={{color: '#077ac1', fontSize: 13, marginLeft:6}}>{t('All rate plans')}</div>
          </div>

          <div style={{display:'flex', height:34, alignItems:'center'}}>
            <i class="fa fa-calendar-check-o" 
              style={{color:Color.themeBlue, fontSize:16, marginBottom:2}}></i>
            <div style={{color: '#077ac1', fontSize: 13, marginLeft:10}}>{t('Dates')}</div>
            <i className="arrow down" style={{ marginLeft: 13, 
              borderColor: '#077ac1', borderWidth:'0 2px 2px 0', marginBottom:6}}/>
          </div>

        </div>






        <div style={{background: Color.background}}>
          <div style={{color:'#333333', fontSize:18, padding:'23px 25px 17px', }}>
            {t('Market pricing')}
          </div>
          <div style={{background: '#d9534f', padding:'8px 30px', fontWeight:200,
            lineHeight:1.2, fontSize: 14, color:'white'}}>
            {t('Revenue management rules for this hotel are set to ignore competitive prices')}&nbsp;&nbsp; 
            <span style={{ textDecoration: 'underline'}}> {t('Review')}?</span>
          </div>
        </div>

        <div style={{display:'flex', overflow: 'hidden', position:'relative'}}>
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
            style={{width: 'calc( 100% - 284px )', display: 'flex', overflow:'hidden'}}>            
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
                <div style={{display:'flex', padding:'16px 20px', flexWrap:'wrap', background: Color.background, marginBottom: 2}}>

                  <div style={{display:'flex', flexWrap:'wrap', borderRight: '1px solid #dddddd', maxWidth:400, marginLeft:20}}>
                    { [ [{name:'mean', text: 'Mean'}, {name:'median', text: 'Median'}], 
                      [{name:'mean_exclude', text: 'Mean excluding highest and lowest'}, 
                      {name:'median_exclude', text: 'Median excluding highest and lowest'}] ].map( line => 
                      <div style={{marginRight:20}}>
                        { line.map( item => 
                          <div style={{display:'flex', height:36, alignItems:'center'}}>
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
                    )}
                  </div>

                  <div style={{marginLeft: 20}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <div style={{lineHeight:'20px', margin:8}}>{t('Map competitive average to:')}</div>
                      <div style={{height:12, border:'1px solid #c0c0c0', lineHeight:'12px',
                        borderRadius:16, width:250, background:'white', padding:'6px 16px', textAlign:'right'}}>
                        <div style={{display:'inline-block', width:12, height:12, lineHeight:1, marginBottom:1}}>
                          <i className='arrow down' style={{marginRight:1, padding:4, borderWidth:'0 2px 2px 0', borderColor: Color.themeBlue}}/>
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <div style={{lineHeight:'20px', margin:8}}>{t('For other master room types use which delta?')}</div>
                      <div style={{display:'flex',  borderRadius: 16, height: 24, width:74, border: '1px solid #c0c0c0',
                        background: 'white', position:'relative'}}>
                        <div onClick={()=>this.setState({percentage_not_number: true})}
                          className={this.state.percentage_not_number?'toggle-box-item in-focus':'toggle-box-item'}
                          style={{ left:10 }}>
                          %
                        </div>
                        <div onClick={()=>this.setState({percentage_not_number: false})}
                          className={this.state.percentage_not_number?'toggle-box-item':'toggle-box-item in-focus'}
                          style={{ right:13 }}>
                          #
                        </div>      
                        <div className={this.state.percentage_not_number?'toggle-box':'toggle-box in-right'}
                          style={{background:Color.themeBlue, height:32, width:36, position:'absolute', top:-4, borderRadius:16}}></div>    
                      </div>                
                    </div>              
                  </div>

                </div>
              }

              <div className='rules-table' style={{minWidth:754 + 81*(this.state.headers.length - 7)}}>
                <div className='rules-table-header'
                  style={{display:'flex', background: Color.background, padding: '12px 20px 7px',}}>
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
                <div className='rules-table-body' style={{display:'flex'}}>
                  <div style={{width:108}}>
                    { this.state.rowNames.map( (item, index) => 
                      <div 
                        className='editable-row-names'
                        style={{marginLeft:20, color: '#ebebeb', width:88, position: 'relative', boxSizing:'border-box',
                        textAlign:'right', height: 33, lineHeight:'32px',}}>
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

                <button 
                  style={{background:Color.orange, width:93, textAlign:'center', fontSize:16, fontWeight:200, cursor:'pointer',
                    lineHeight:'35px', borderRadius:5, color:'white', margin:'20px 50px', outline:'none'}}>
                  {t('Save')}
                </button>  
              </div>            
            </div>
          }
        </div>



        <div className='experiment' style={{width: '100%', height: 400, padding:100, boxSizing:'border-box'}}>
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