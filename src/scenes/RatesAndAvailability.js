import React from "react";
import Navigation from '../components/Navigation'

import './RevenueManagementRules.css';
import RulesEngineApi from '../api/RulesEngineApi';

const t = str => str

const Color = {
  background: '#f9f9f9',
  themeBlue: '#337ab7',
  themeBlueLight: '#eff7ff',
  orange: '#f36e33',
  red: '#c92d28',
}

const ToastStore = {}
const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class Slider extends React.Component {
  state = {
    offset: 0,
    changing: false,
    previousOffset: 0,
  }

  onMouseDown = ( e ) => {
    this.setState({ changing: true, previousOffset: this.state.offset })
  }
 
  onMouseMove = ( e ) => {
    if(this.state.changing)
      this.setState({offset: Math.min(Math.max(4 - e.target.offsetLeft - e.nativeEvent.offsetX, 0), 100)})
  }
 
  onMouseUp = () => {
    this.setState({ changing: false})
  }

  onMouseOut = () => {
    if(this.state.changing)
      this.setState({ offset: this.state.previousOffset, changing: false})
  }  

  render(){
    return (
      <div
        style={{position:'absolute', zIndex:3, left: 0, top: '-80%', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', alignItems:'center',
        width:162, height:54, background: Color.themeBlueLight, padding:'25px 26px 20px', boxSizing:'border-box', display:'flex'}}>
        <div style={{width:10, height:10, borderRadius:5, boxSizing:'border-box', 
          background: '#86b7e8', border:'1px solid', borderColor: '#0163c5'}}></div>
        <div style={{width:90, height:0, border:'1px dashed', borderColor: '#0163c5'}}></div>
        <div
          style={{width:10, height:10, borderRadius:5, boxSizing:'border-box',background: '#86b7e8', position:'relative'}}>
          <div 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseOut={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            style={{width:18, height:18, top: -4, left: -4 - this.state.offset, lineHeight:'14px', fontSize:14, textAlign:'center',
            borderRadius:9, boxSizing:'border-box',background: '#ffffff', position:'absolute', border:'1px solid #0163c5', cursor:'pointer'}}>
            &#9666;&#9656;
          </div>
          <div style={{position:'absolute', top: - 18, left: - 5 - this.state.offset, fontSize:14, lineHeight:'14px'}}>
            {this.state.offset}%
          </div>          
        </div>        
      </div>
    )
  }
}

class RevenueManagementRules extends React.Component {
  state = {
    year: 2019,
    month: 0,
    last_request_year: 2019,
    last_request_month: 0,
    loading: false,
    all_room_types: true,
    all_rate_plans: true,
    price_not_market_price: true,
    on: true,
    calendar_scroll_distance1: 0,
    calendar_scroll_distance2: 0,
    rowNamesEdit: false,
    newRowBeingClicked: false,
    visibleRowNameIndex: 3,
    headers: ['Same day bookings', 'Last-minute (1-2 days)', '3-6 days', '7-13 days', '14-30 days', '31-60 days', '60+ days'],
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

  componentDidMount = () => { 
    window.addEventListener('click', this.collapsePercentageSelector)
    this.getRulesEngineData()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapsePercentageSelector) 
  }

  collapsePercentageSelector = (event) => {
    if(!event.target.matches('.percentage-selector, .percentage-selector *'))
      this.setState({visibleRowNameIndex: -1})
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
        this.setState({
          last_request_month: this.state.last_request_month + 1,
          loading: false,
          loaded: true, 
          vtr: response.vtr,
          market_pricing_data: this.state.market_pricing_data.concat(response.monthly_market_pricing_data),
        }, ()=>this.loading = false )  
      } else {
        this.setState({loading:false})  
        ToastStore.error(t('There is some error'), 5000, 'update-error') 
        console.log(response)     
      }
    })
    .catch( error => {
      this.loading = false
      this.setState({loading:false})
      console.log(error)
      ToastStore.error(t('There is some error'), 5000, 'update-error')
    })    
  } 

  toggleOnOff = () => {
    this.setState({on:!this.state.on})
  }

  onAvgChange = ( e ) => {
    this.setState({ avg_option:e.target.getAttribute('name') })
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

  updateRowName = (e, index, high_or_low) => {
    const new_row_names = this.state.rowNames.slice()
    if(high_or_low=='high'){
      const upper_bound = this.state.rowNames[index+1]?this.state.rowNames[index+1].high:101
      if(parseInt(e.target.value)>new_row_names[index].low && parseInt(e.target.value)<upper_bound)
        new_row_names[index].high = e.target.value
    } else {
      const lower_bound = this.state.rowNames[index-1]?this.state.rowNames[index-1].low:0
      if(parseInt(e.target.value)<new_row_names[index].high && parseInt(e.target.value)>lower_bound)
        new_row_names[index].low = e.target.value
    }
    this.setState({rowNames: new_row_names})
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

  scrollLeft = (index) => {
    console.log('scrollLeft is called')
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(index), 16)
  }

  scrollLeftDirtyWork = (index) => {
    console.log('scrollLeftDirtyWork is called:', document.getElementById('calendar-view-container' + index).scrollLeft)
    document.getElementById('calendar-view-container' + index).scrollBy(-10,0)
    this.setState({['calendar_scroll_distance' + index]: document.getElementById('calendar-view-container' + index).scrollLeft})
  }

  scrollRight = (index) => {
    console.log('scrollRight is called')
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(index), 16)
  }

  scrollRightDirtyWork = (index) => {
    document.getElementById('calendar-view-container' + index).scrollBy(10,0)
    console.log('scrollRightDirtyWork is called, scrollLeft:', document.getElementById('calendar-view-container' + index).scrollLeft)
    console.log('scrollRightDirtyWork is called, clientWidth:', document.getElementById('calendar-view' + index).clientWidth)    
    this.setState({['calendar_scroll_distance' + index]: document.getElementById('calendar-view' + index).scrollLeft})
    if( !this.loading && 
      document.getElementById('calendar-view' + index).clientWidth - document.getElementById('calendar-view-container' + index).scrollLeft < 78*5 + document.getElementById('calendar-view-container' + index).clientWidth){
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

        <div class='slider-container' style={{width:80, margin:20, borderRadius:25, height:40, padding:10}}>
          <div class='sliderr'
            style={{width:40, height:40, background:'blue', borderRadius:20}}>
          </div>
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
          <div style={{color:'#333333', fontSize:18, padding:'23px 30px 17px', }}>
            {t('Market pricing')}
          </div>
          <div style={{background: '#d9534f', padding:'8px 30px', fontWeight:200,
            lineHeight:1.2, fontSize: 14, color:'white'}}>
            {t('Revenue management rules for this hotel are set to ignore competitive prices')}&nbsp;&nbsp; 
            <span style={{ textDecoration: 'underline'}}> {t('Review')}?</span>
          </div>
        </div>










        <div style={{display:'flex', overflow: 'hidden'}}>
          <div style={{minWidth:232, textAlign:'right',}}>
            <div style={{height:60, background:'#f9f9f9'}}>
              <div onMouseOver={()=>this.scrollLeft(1)} onMouseOut={()=>this.onMouseOutLeft(1)}
                style={{height:14, width:14, display:'inline-block', marginRight:20, 
                marginTop:24, cursor:'pointer'}}>
                <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                  borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
              </div> 
              <div style={{borderRight:'1px solid #dedede', height:24}}>&nbsp;</div>           
            </div>
            <div style={{marginLeft: 30, lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 1</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 2</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 3</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 4</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 5</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 6</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 7</div>              
            <div style={{marginLeft: 30,  lineHeight:'16px', textAlign: 'left', padding:'5px 20px',
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>{t('Mean excluding highest and lowest')}</div>              
          </div>
          <div id='calendar-view-container1' className='calendar-view-container'
            style={{width: 'calc( 100% - 276px )', position:'relative', display: 'flex', overflow:'auto'}}>
              <div style={{position:'absolute', left:0, top:5, textAlign:'right', 
                width:72, background: '#f9f9f9',
                fontSize:12, color:Color.themeBlue, zIndex:100}}>
                {mon[new Date(2019, this.state.calendar_scroll_distance1>78*31?1:0, 1).getMonth()]} 
              </div>              
            <div id='calendar-view1' className='calendar-view' style={{display:'flex'}} >            
            { this.state.market_pricing_data.map(month => month.data.map(  (day, index) => 
                <div style={{minWidth:78}}>
                  <div  style={{background:'#f9f9f9', height:60, display:'flex', flexDirection:'column-reverse'}}>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:15, fontWeight:600,
                      color:'#4d4d59',borderRight:'1px solid #dedede'}}>
                      {day.date}
                    </div>                  
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:'#4d4d59'}}>
                      {days[new Date(month.year, month.month - 1, day.date ).getDay()]} 
                    </div>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:Color.themeBlue, display:!index?'block':'none'}}>
                      {mon[new Date(month.year, month.month - 1, day.date ).getMonth()]} 
                    </div>                    
                  </div>
                  { day.values.map( (item, index) => 
                    <div  style={{height:index+1==day.values.length?42:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                      &nbsp;
                    </div> 
                  )}                                                                                                            
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
          <div style={{color:'#333333', fontSize:18, padding:'23px 30px 17px', }}>
            {t('Market pricing with adjustments')}
          </div>
        </div>
        <div style={{display:'flex', overflow: 'hidden'}}>
          <div style={{minWidth:232, textAlign:'right',}}>
            <div style={{height:60, background:'#f9f9f9'}}>
              <div onMouseOver={()=>this.scrollLeft(2)} onMouseOut={()=>this.onMouseOutLeft(2)}
                style={{height:14, width:14, display:'inline-block', marginRight:20, 
                marginTop:24, cursor:'pointer'}}>
                <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, 
                  borderWidth:'0 2px 2px 0', left:0, top:-1, position:'relative'}}/>
              </div> 
              <div style={{borderRight:'1px solid #dedede', height:24}}>&nbsp;</div>           
            </div>
            <div style={{marginLeft: 30, lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 1</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 2</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 3</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 4</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 5</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 6</div>
            <div style={{marginLeft: 30,  lineHeight:'32px', textAlign: 'left', paddingLeft:20,
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>host name 7</div>              
            <div style={{marginLeft: 30,  lineHeight:'16px', textAlign: 'left', padding:'5px 20px',
              borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>{t('Mean excluding highest and lowest')}</div>              
          </div>
          <div className='calendar-view-container' 
            style={{width:'calc( 100% - 272px )', position:'relative'}}>
            <div style={{position:'absolute', left:0, top:5, textAlign:'right', 
              width:72, background: '#f9f9f9',
              fontSize:12, color:Color.themeBlue, zIndex:100}}>
              {mon[new Date(2019, this.state.calendar_scroll_distance2>78*31?1:0, 1).getMonth()]} 
            </div>            
            <div id='calendar-view2' className='calendar-view' style={{overflow: 'auto', display:'flex'}} >             
            {
              Array(new Date(2019, 1, 0).getDate()).fill(1).map( (item, index) => 
                <div style={{minWidth:78}}>
                  <div  style={{background:'#f9f9f9', height:60, display:'flex', flexDirection:'column-reverse'}}>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:15, fontWeight:600, 
                      color:'#4d4d59',borderRight:'1px solid #dedede'}}>
                      {index + 1}
                    </div>                  
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:'#4d4d59'}}>
                      {days[new Date(2019, 0, index + 1).getDay()]} 
                    </div>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:Color.themeBlue, display:!index?'block':'none'}}>
                      {mon[new Date(2019, 0, index + 1).getMonth()]} 
                    </div>                    
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:42, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>                                                                                                                              

                </div>
              )
            }        
            {
              Array(new Date(2019, 2, 0).getDate()).fill(1).map( (item, index) => 
                <div style={{minWidth:78}}>
                  <div  style={{background:'#f9f9f9', height:60, display:'flex', flexDirection:'column-reverse'}}>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:15, fontWeight:600, 
                      color:'#4d4d59',borderRight:'1px solid #dedede'}}>
                      {index + 1}
                    </div>                  
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color:'#4d4d59'}}>
                      {days[new Date(2019, 1, index + 1).getDay()]} 
                    </div>
                    <div style={{textAlign:'right', paddingRight:6, fontSize:12, color: Color.themeBlue, display:!index?'block':'none'}}>
                      {mon[new Date(2019, 1, index + 1).getMonth()]} 
                    </div>                    
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:32, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>
                  <div  style={{height:42, borderBottom:'1px solid #dedede', borderRight:'1px solid #dedede'}}>
                  &nbsp;
                  </div>                                                                                                                              

                </div>
              )              
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










        <div style={{display:'flex', justifyContent:'space-between', padding:'0 30px', alignItems:'center', marginTop:30}}>
          <div style={{display:'flex',  borderRadius: 16,
            background:'#eff7ff',  padding:'0 7px', boxSizing:'border-box'}}>
            <div onClick={()=>this.setState({price_not_market_price: true})}
              className={this.state.price_not_market_price?'header-tab in-focus':'header-tab'}>
              {t('Default BAR')}
            </div>
            <div onClick={()=>this.setState({price_not_market_price: false})}
              className={this.state.price_not_market_price?'header-tab':'header-tab in-focus'}>
              {t('Market average prices')}
            </div>          
          </div>
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

        <div style={{color:'#9b9b9b', fontSize:12, padding:'15px 50px'}}>
          {t('Description text blah blah and blah')}
        </div>
        <div className='rules-table' style={{}}>
          <div className='rules-table-header'
            style={{display:'flex', background: Color.background, padding: '15px 30px 7px'}}>
            <div style={{minWidth:88, display:'flex', alignItems:'center', 
              justifyContent:'flex-end', fontSize: 12, color:'#257abc',textAlign:'right'}}>
              <div onClick={()=>this.setState({rowNamesEdit: !this.state.rowNamesEdit})}
                style={{width:70, textAlign:'center', cursor:'pointer'}}>
                <i class="zuzu-icon-cog"></i> {t('Edit')}
              </div>
            </div>
            { this.state.headers.map( item => 
              <div style={{color: '#4d4d59', paddingRight:12, boxSizing:'border-box',
              display:'flex', flexDirection:'column-reverse',
              width:79, textAlign:'right'}}>{item}</div>) }
          </div>
          <div className='rules-table-body' style={{display:'flex'}}>
            <div style={{width:118}}>
              { this.state.rowNames.map( (item, index) => 
                <div className="percentage-selector"
                  style={{marginLeft:30, color: '#c0c0c0', width:88, position: 'relative', boxSizing:'border-box',
                  textAlign:'right', height: 33, lineHeight:'32px',}}>
                  {this.state.rowNamesEdit?index+1:null}
                  <div style={{display:'inline-block',height:27, width:70, marginLeft:4,
                    verticalAlign:'top', borderBottom:'1px solid #f3f3f3', padding:'3px 0 2px',}}>
                    <div 
                      className={'row-name' + (this.state.rowNamesEdit?' editing':'')}
                      onClick={ this.state.rowNamesEdit?(e)=>this.setState({ visibleRowNameIndex: index}):null } >
                      {item.low + ' - ' + item.high + '%'}
                      <div style={{width:24, height:24, background:'#ffffff', borderRadius:12, 
                        display: this.state.rowNamesEdit&&index?'block':'none',  boxSizing:'border-box',
                        position:'absolute', right:-16, top:1.5, padding:2}}>
                        <div style={{width:20, height:20, background:'#c92d28', borderRadius:10, fontWeight:200,
                          color:'white', fontSize:16, fontFamily:'sans-serif', lineHeight:'18px'}}>
                        &times;
                        </div>                        
                      </div>
                    </div>
                  </div>
                  { this.state.visibleRowNameIndex === index && 
                    <div style={{background:Color.themeBlueLight, position: 'absolute', zIndex:2, left:-4, top:-12,
                      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', padding:6, borderRadius:2}}>
                      <div style={{display:'flex', color:'#0079cc', textAlign:'center', padding:'2.5px 0',
                        fontSize:10, lineHeight:'1', opacity: 0.75}}>
                        <div style={{width:12, paddingRight:4 }}>&nbsp;</div>
                        <div style={{width:50, }}>>62%</div>
                        <div style={{width:10, }}>&nbsp;</div>
                        <div style={{width:50, }}>{'<98%'}</div>
                      </div>
                      <div style={{display:'flex'}}>
                        <div style={{width:12, paddingRight:4 , textAlign:'right', fontSize:12, color:'#65646d'}}>{index+1}</div>
                        <input style={{width:20, padding:0, borderRadius:4, width:48, height:27, boxSizing:'content-box',
                          fontSize: 18, border:'1px solid #c0c0c0', textAlign:'center'}}
                          value={item.low} 
                          onChange={(e)=>this.updateRowName(e, index, 'low')}
                          />
                        <div style={{width:10, textAlign:'center'}}>-</div>
                        <input style={{width:20, padding:0, borderRadius:4, width:48, height:27, boxSizing:'content-box',
                          fontSize: 18, border:'1px solid #c0c0c0', textAlign:'center'}}
                          value={item.high}
                          onChange={(e)=>this.updateRowName(e, index, 'high')}
                          />
                      </div>
                    </div>
                  }
                </div>) 
              }
            </div>
            <div className='rules-table-content'>
              { this.state.data.map( (row, row_index) => 
                  <div className="rules-table-row" style={{display:'flex'}}>
                    { row.map( (cell, col_index) => 
                        <div 
                          style={{ position:'relative',width:78,borderRight: '1px solid #f3f3f3', borderBottom:'1px solid #f3f3f3'}}>
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
        </div>

        {!this.state.price_not_market_price &&
          <div style={{display:'flex', padding:'20px 30px', flexWrap:'wrap'}}>
            { [{name:'mean', text: 'Mean'}, {name:'mean_exclude', text: 'Mean excluding highest and lowest'}, 
              {name:'median', text: 'Median'}, {name:'median_exclude', text: 'Median excluding highest and lowest'}].map( item => 
              <div style={{display:'flex', marginRight:30, marginTop:10}}>
                <div name={item.name}
                  onClick={this.onAvgChange}
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
        }

		  </div>
     </div>
    );
  }
}

export default RevenueManagementRules;