import React from "react";
import Navigation from '../components/Navigation'
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Hotel.css'

import ZuzuDateRangePicker from '../components/DateRangePicker'
import Format from '../utils/Format'

import dialogBox from '../img/dialog-box.svg'

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { DateRangePicker, DateRange } from 'react-date-range';

const t = str => str

const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const length_of_stay_color_mappings = ['#15c9fb', '#1cebd2', '#f5a623', '#7ed321', '#fc4444']

const booking_window_color_mappings = ['#6050b2', '#eb508d', '#003083', '#fabe02', '#186652', '#aee7ff', '#7ba251', '#f80000']

const formatDate = (dateObject, placeholder, seperator) => {
  if(dateObject)
    return (seperator?seperator:'') + dateObject.getDate().toString().padStart(2,0) + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
  else
    return placeholder
}

class Hotel extends React.Component {
	constructor(props){
		super(props)
		this.state = {
      dialogBoxOffset: 5,
      length_of_stay_last_month: [3, 2, 3, 2, 1],
      length_of_stay_ytd: [4, 1, 3, 0, 2],
      booking_window_last_month: [3, 2, 3, 2, 1, 1, 1, 1],
      booking_window_ytd: [3, 2, 1, 0, 2, 3, 1, 0],
      booked_ranges: [{}],
      checkin_ranges: [{}]  
		}
	}

	onRangeSelected = (range, index, which_range) => {
    let new_ranges = this.state[which_range].slice()
    new_ranges[index] = range
		this.setState({[which_range]: new_ranges})
	}

  addOneMoreRange = (which_range) => {
    this.setState( { [which_range]: this.state[which_range].slice().concat([{}]) } )
  }

  removeRange = (index, which_range) => {
    if(this.state[which_range].length > 1){
      let new_ranges = this.state[which_range].slice()
      new_ranges.splice(index, 1)
      this.setState({[which_range]: new_ranges})
    } else
      this.setState({[which_range]:[{}]})
  }

  onHover = (e) => {
    console.log(e.nativeEvent.offsetX)
    this.setState({dialogBoxOffset: e.nativeEvent.offsetX})
  }

  render() {
    return (	
    <div style={{}}>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        	root='Hotels'
    		path={'/hotel'}
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', 
    		display:'inline-block', verticalAlign:'top', boxSizing:'border-box'}}> 
			  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
				  textAlign:'center', height:140, borderBottom:'2px solid #ddd',
				  background:'#def', fontFamily: "Raleway Webfont",}}>
				  This is Hotel page
  			</div>
        <div className='content' style={{}}>
          <div style={{position:'absolute', width:36, height:27}}>
            <img src={require('../img/dialog-box.svg')}/>
            <div style={{width:36, height:27, top:0, left:0, textAlign:'center', fontSize: 13, fontWeight: 'bold', position:'absolute', }}>1</div>
          </div>

          <div style={{padding:30, background:'#f9f9f9'}}>
            <h1 class="table-top-header">
              {t('Stayed metrics')}  
            </h1>

            <div style={{padding:'0', background:'white', display:'flex', borderRadius:6,  minWidth:1070,
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.14)' , marginTop:20}}>

              <div style={{padding:'20px 20px', minWidth:360, boxSizing:'content-box', flexGrow:1}}>
               <div style={{fontSize:18, fontWeight:600,}}>Length of stay</div>
               <div style={{display:'flex', marginTop:20}}>
                  <div style={{width: 68, fontSize:13, color:'#65646d', textAlign:'right', fontWeight:300}}>
                    Last month (November)
                  </div>
                  <div style={{display:'flex', minWidth: 280, flexGrow:1, height: 15, marginLeft: 12, marginTop:3,}}>
                    { this.state.length_of_stay_last_month.map( (item, index) => 
                      <div onMouseMove={this.onHover}
                        className="color-bar"
                        style={{background: length_of_stay_color_mappings[index], 
                        flexGrow: item, display: item?'block':'none'}}>
                        &nbsp;
                        <div className="dialog-box"
                          style={{width:36, height:27, bottom: 15, left: this.state.dialogBoxOffset, transform:'translateX(-50%)'}}>
                          <img src={require('../img/dialog-box.svg')} />
                          <div style={{top:0, left:0, textAlign:'center', width:'100%', position:'absolute', lineHeight:'18px', fontSize: 13, fontWeight:'bold'}}>
                            {item}
                          </div>
                        </div>
                      </div>
                      )
                    } 
                  </div>                 
               </div>
               <div style={{display:'flex', marginTop:20}}>
                  <div style={{width: 68, fontSize:13, color:'#65646d', textAlign:'right', fontWeight:300}}>YTD</div>
                  <div style={{display:'flex', minWidth: 280, flexGrow:1, height: 15, marginLeft: 12, marginTop:3}}>
                    { this.state.length_of_stay_ytd.map( (item, index) => 
                      <div style={{background: length_of_stay_color_mappings[index], 
                        flexGrow: item, display: item?'block':'none'}}>
                        &nbsp;
                      </div>
                      )
                    } 
                  </div>                 
               </div> 
               <div style={{display:'flex', marginTop:38, fontSize:13, fontWeight:300, justifyContent:'center', lineHeight:1}}>
                <div style={{color: '#65646d',}}># of nights </div>
                { ['1', '2', '3', '4-7', '8+'].map((item, index) => <div style={{display:'flex'}}>
                  <div style={{width:14, height:14, borderRadius: 7,  marginLeft:20,
                    background: length_of_stay_color_mappings[index]}}>
                  </div>
                  <div style={{marginLeft:6}}>{item}</div>
                </div>)}
               </div>              
              </div>  

              <div className="cancellation-box"
                style={{padding:'20px 16px', minWidth:146, boxSizing:'content-box', textAlign:'center', 
                boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.14)'}}>
                <div style={{borderBottom:'1px dashed #c0c0c0', paddingBottom:10}}>
                  <div style={{fontSize:18, fontWeight:600}}>{t('Cancellation rate')}</div>
                  <div style={{color:'#65646d', width:80, display:'inline-block', fontWeight:300}}>{t('Last month') + ' (' + 'November' + ')'}</div>
                  <div style={{fontSize:40, lineHeight:1}}>15
                    <span style={{fontSize:20, verticalAlign:'top', paddingTop:5, fontWeight:300, color:'#4d4d59',
                      display:'inline-block'}}>%</span>
                  </div>
                </div>
                <div style={{paddingTop:10}}>
                  <div style={{color:'#65646d', width:80, display:'inline-block', fontWeight:300}}>YTD</div>
                  <div style={{fontSize:40, lineHeight:1}}>12
                    <span style={{fontSize:20, verticalAlign:'top', paddingTop:5, fontWeight:300, color:'#4d4d59',
                      display:'inline-block'}}>%</span>
                  </div>                  
                </div>                
              </div> 

              <div style={{padding:'20px 20px', minWidth:456, boxSizing:'content-box', flexGrow:1.2}}>
               <div style={{fontSize:18, fontWeight:600,}}>{t('Booking window')}</div>
               <div style={{display:'flex', marginTop:20}}>
                  <div style={{width: 68, fontSize:13, color:'#65646d', textAlign:'right', fontWeight:300}}>
                    Last month (November)
                  </div>
                  <div style={{display:'flex', minWidth: 376, flexGrow:1, height: 15, marginLeft: 12, marginTop:3, position: 'relative'}}>
                    { this.state.booking_window_last_month.map( (item, index) => 
                      <div onMouseOver={this.onHover} style={{background: booking_window_color_mappings[index], 
                        flexGrow: item, display: item?'block':'none'}}>
                        &nbsp;
                      </div>
                      )
                    } 
                  </div>                 
               </div>
               <div style={{display:'flex', marginTop:20}}>
                  <div style={{width: 68, fontSize:13, color:'#65646d', textAlign:'right', fontWeight:300}}>YTD</div>
                  <div style={{display:'flex', minWidth: 376, flexGrow:1, height: 15, marginLeft: 12, marginTop:3}}>
                    { this.state.booking_window_ytd.map( (item, index) => 
                      <div style={{background: booking_window_color_mappings[index], 
                        flexGrow: item, display: item?'block':'none'}}>
                        &nbsp;
                      </div>
                      )
                    } 
                  </div>                 
               </div> 
               <div style={{display:'flex', marginTop:38, fontSize:13, fontWeight:300, justifyContent:'center', lineHeight:1}}>
                <div style={{color: '#65646d',}}># of days </div>
                { ['<1', '1', '2-6', '7-13', '14-21', '21-28', '28-59', '60'].map((item, index) => <div style={{display:'flex'}}>
                  <div style={{width:14, height:14, borderRadius: 7, background: booking_window_color_mappings[index]}}
                    className="margin-changer">
                  </div>
                  <div style={{marginLeft:6}}>{item}</div>
                </div>)}
               </div>              
              </div>                             
            </div>            
          </div>


    			<h1>own DRP demo</h1>
          {
            this.state.booked_ranges.map( (booked_range, index) => 
              <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', width:180}}>
                <div className="time-dropdown">
                  <div>
                    {formatDate(booked_range.start, 'Select a date range') + formatDate(booked_range.end, '', ' - ')}&nbsp;
                  </div>                
                  <div className="time-dropdown-content">
                    <ZuzuDateRangePicker
                      year={2018}
                      month={11}
                      disabledRanges={this.state.booked_ranges.filter((item, sub_index)=>sub_index!=index)}
                      selectedRange={booked_range}
                      onRangeSelected={(range)=>this.onRangeSelected(range, index, 'booked_ranges')}                         
                    />
                  </div>                
                </div> 
                <div style={{marginLeft:6, cursor:'pointer'}}
                  onClick={()=>this.removeRange(index, 'booked_ranges')}>
                  &times;
                </div>
                <div onClick={()=>this.addOneMoreRange('booked_ranges')}
                  style={{cursor: 'pointer',display: (index+1==this.state.booked_ranges.length&&booked_range.end)?'inline-block':'none'}}>
                  <div style={{display:'inline-block', border:'1px dotted gray', cursor: 'pointer',
                  borderRadius:3, width:20, height:20, textAlign:'center', marginRight:10}}>+</div>                  
                  <div style={{display:'inline-block', verticalAlign:'top', height:20, lineHeight:'20px'}}>
                    {t('Add another')}
                  </div> 
                </div>
              </div>
            )
          }
          {
            this.state.checkin_ranges.map( (booked_range, index) => 
              <div style={{display:'flex', alignItems:'center', flexWrap:'wrap', width:180}}>
                <div className="time-dropdown">
                  <div>
                    {formatDate(booked_range.start, 'Select a date range') + formatDate(booked_range.end, '', ' - ')}&nbsp;
                  </div>                
                  <div className="time-dropdown-content">
                    <ZuzuDateRangePicker
                      year={2018}
                      month={11}
                      disabledRanges={this.state.checkin_ranges.filter((item, sub_index)=>sub_index!=index)}
                      selectedRange={booked_range}
                      onRangeSelected={(range)=>this.onRangeSelected(range, index, 'checkin_ranges')}                         
                    />
                  </div>                
                </div> 
                <div style={{marginLeft:6, cursor:'pointer'}}
                  onClick={()=>this.removeRange(index, 'checkin_ranges')}>
                  &times;
                </div>
                <div onClick={()=>this.addOneMoreRange('checkin_ranges')}
                  style={{cursor: 'pointer',display: (index+1==this.state.checkin_ranges.length&&booked_range.end)?'inline-block':'none'}}>
                  <div style={{display:'inline-block', border:'1px dotted gray', cursor: 'pointer',
                  borderRadius:3, width:20, height:20, textAlign:'center', marginRight:10}}>+</div>                  
                  <div style={{display:'inline-block', verticalAlign:'top', height:20, lineHeight:'20px'}}>
                    {t('Add another')}
                  </div> 
                </div>
              </div>
            )
          }
        </div> 
      </div>
    </div>
    );
  }
}

export default Hotel;