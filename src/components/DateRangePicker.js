import React from "react";

import './DateRangePicker.css'

const Mon = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 
]

class Block extends React.Component {
  render() {
    return (
      <div style={{width:'14.285%', height:30, textAlign:'center', lineHeight:'30px'}}>{this.props.text}</div>
    )
  }
}

class Day extends React.Component {
  render() {
    return (
      <div name={this.props.day}
        className={this.props.className} 
        onClick={this.props.onClick}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        style={{boxSizing: 'content-box', width: 'calc( 14.285% - 2px )', height:28, textAlign:'center', lineHeight:'28px', cursor:'pointer'}}>
        {this.props.day?this.props.day:''}
      </div>
    )
  }
}

class Zuzu2MonthDateRangePicker extends React.Component {
  constructor(props) {
    super()
    this.state = {
      year: props.selectedRange.start?new Date(props.selectedRange.start).getFullYear():props.year,
      month: props.selectedRange.start?new Date(props.selectedRange.start).getMonth():props.month,
      dayStart: null,
      dayEnd: null,
      daysInHoveredRange: [],
      disabledDays: props.disabledRanges.map(disabledRange=>this.getSelectedDays(disabledRange)).reduce(this.concat, []),
      selectedRange: this.getSelectedDays(props.selectedRange),
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.disabledRanges != nextProps.disabledRanges)
      this.setState({
        disabledDays: nextProps.disabledRanges.map(disabledRange=>this.getSelectedDays(disabledRange)).reduce(this.concat, []),
      })
    if(this.props.selectedRange != nextProps.selectedRange)
      this.setState({
        selectedRange: this.getSelectedDays(nextProps.selectedRange)
      })    
  }

  concat = (total, disabledDays) => {
    return total.concat(disabledDays)
  }

  getSelectedDays = ( range ) => {
    if( !range.end ){
      return []
    }
    const start = range.start.getTime()
    const end = range.end.getTime()
    const length = (end - start)/86400000
    const days = []
    for( let i = 0; i < length + 1 ; i++ )
      days.push(start + i * 86400000)

    return days   
  }

  onClick = (e, selectedMonth) => {
    if(!this.state.dayStart || this.state.dayEnd){
      const dayStart = new Date(Date.UTC(this.state.year, selectedMonth, e.target.getAttribute('name')))
      const dayStartTime = dayStart.getTime()
      this.setState({selectedRange: [dayStartTime], dayStart: dayStart, dayEnd: null})
    } 
    else{
      const d1 = this.state.dayStart
      const d2 = new Date(Date.UTC(this.state.year, selectedMonth, e.target.getAttribute('name')))
      const start = d1.getTime() < d2.getTime() ? d1:d2;
      const end = d1.getTime() < d2.getTime() ? d2:d1;

      for (var disabledRange of this.props.disabledRanges) {
        if(disabledRange.start.getTime() > start && disabledRange.start.getTime() < end){
          alert('This selection overlaps with existing date range')
          this.setState({dayStart:null})
          return 
        }        
      }

      this.props.onRangeSelected( {start, end} )
      
      this.setState({
        dayEnd: new Date(Date.UTC(this.state.year, selectedMonth, e.target.getAttribute('name'))), 
        daysInHoveredRange: []
      })      
    }
  }

  onMouseEnter = (e, hoveredMonth) => {
    if(this.state.dayStart){
      let start = 0
      let length = 0

      if(this.state.dayStart < Date.UTC(this.state.year, hoveredMonth, parseInt(e.target.getAttribute('name'))) ){
        start = this.state.dayStart.getTime()
        length = Date.UTC(this.state.year, hoveredMonth, parseInt(e.target.getAttribute('name'))) - start
      } else if( this.state.dayStart >= Date.UTC(this.state.year, hoveredMonth, parseInt(e.target.getAttribute('name')))  ){
        start = Date.UTC(this.state.year, hoveredMonth, parseInt(e.target.getAttribute('name')))
        length = this.state.dayStart - start
      } 

      length /= 86400000
      const daysInHoveredRange = []
      for(let i = 0; i < length + 1 ; i++)
        daysInHoveredRange.push(  start + i*86400000 )       
      this.setState({daysInHoveredRange: daysInHoveredRange})
    }
    else
      this.setState( {daysInHoveredRange: [ 
        new Date(Date.UTC(this.state.year, hoveredMonth, parseInt(e.target.getAttribute('name')) )).getTime() 
      ]}, () => console.log(this.state.daysInHoveredRange) )
  }

  onMouseLeave = (e) => {
    this.setState({daysInHoveredRange: []})
  }  

  onMonthChange = (forward) => {
    let new_date = ''
    if(forward){
      new_date = new Date(this.state.year, this.state.month + (this.props.twoMonth?2:1) )
    } else {
      new_date = new Date(this.state.year, this.state.month - (this.props.twoMonth?2:1) )
    }
    
    this.setState({year: new_date.getFullYear(), month: new_date.getMonth()})
  }

  render() {
    return (
      <div className='d-r-p' 
        style={{padding:10, }}>
        <div className="calendar-header" style={{display:'flex', justifyContent: 'space-between', fontWeight:600, fontSize:14, marginBottom: 10}}> 
          <div style={{width:'50%', textAlign:'center', display:this.props.twoMonth?'block':'none'}}>
            {Mon[(this.state.month + 12 - 1)%12]} {this.state.month?this.state.year:this.state.year - 1}
          </div>
          <div style={{marginLeft:40}}>{Mon[this.state.month]} {this.state.year} </div>
          <div>
            <div onClick={this.props.disableBefore > new Date(this.state.year, this.state.month, 1)?null:()=>this.onMonthChange()} style={{cursor:'pointer', display:'inline-block',marginRight:20}}>
              <i className='arrow left' />
            </div>           
            <div onClick={this.props.disableAfter < new Date(this.state.year, this.state.month+1, 0)?null:()=>this.onMonthChange(true)} style={{cursor:'pointer', display:'inline-block',marginRight:20}}>
              <i className='arrow right'/>
            </div>  
          </div>
        </div>
        <div className='calendar-wrapper' style={{display: 'flex', height: 210}}>
          { this.props.twoMonth && <div className="calendar" style={{display:'flex', flexWrap:'wrap', width:320, marginRight:6,alignContent:'flex-start'}}>
            {['Sun', 'Mon', 'Tue',  'Wed', 'Thu', 'Fri', 'Sat'].map(item=><Block key={item} text={item}/>)}
            { Array(new Date(this.state.year, this.state.month - 1, 1).getDay()).fill(0).map((item, index)=><Block key={index} text={''}/>)}

            { Array(new Date(this.state.year, this.state.month, 0).getDate()).fill(0).map((item, index)=>index+1).map((item, index)=>
              <Day 
                key={index}
                className={( this.state.selectedRange.includes(new Date(Date.UTC(this.state.year, this.state.month - 1, item)).getTime())?'selected ' :'normal ') 
                + (this.state.daysInHoveredRange.includes(new Date(Date.UTC(this.state.year, this.state.month - 1, item)).getTime())?'hovered ':'')
                + (this.state.disabledDays.includes(new Date(Date.UTC(this.state.year, this.state.month - 1, item)).getTime())?'disabled ' :'')
                }
                onMouseEnter={this.state.dayEnd?null:(e)=>this.onMouseEnter(e, this.state.month - 1)}
                onMouseLeave={this.state.dayEnd?null:this.onMouseLeave}
                onClick={this.state.disabledDays.includes(new Date(Date.UTC(this.state.year, this.state.month - 1, item)).getTime())?null:(e)=>this.onClick(e, this.state.month - 1)} 
                day={item}/>
            )}
          </div>
          }        
          <div className="calendar" style={{display:'flex', flexWrap:'wrap', width:320, alignContent:'flex-start'}}>
            {['Sun', 'Mon', 'Tue',  'Wed', 'Thu', 'Fri', 'Sat'].map(item=><Block key={item} text={item}/>)}
            { Array(new Date(this.state.year, this.state.month, 1).getDay()).fill(0).map((item, index)=><Block key={index} text={''}/>)}

            { Array(new Date(this.state.year, this.state.month + 1, 0).getDate()).fill(0).map((item, index)=>index+1).map((item, index)=>
              <Day 
                key={index}
                className={( this.state.selectedRange.includes(new Date(Date.UTC(this.state.year, this.state.month, item)).getTime())?'selected ' :'normal ') 
                + (this.state.daysInHoveredRange.includes(new Date(Date.UTC(this.state.year, this.state.month, item)).getTime())?'hovered ':'')
                + (this.props.disableBefore > Date.UTC(this.state.year, this.state.month, item) || this.props.disableAfter< Date.UTC(this.state.year, this.state.month, item) || this.state.disabledDays.includes(new Date(Date.UTC(this.state.year, this.state.month, item)).getTime())?'disabled ' :'')
                }
                onMouseEnter={this.state.dayEnd?null:(e)=>this.onMouseEnter(e, this.state.month)}
                onMouseLeave={this.state.dayEnd?null:this.onMouseLeave}
                onClick={this.props.disableBefore > Date.UTC(this.state.year, this.state.month, item) || this.props.disableAfter< Date.UTC(this.state.year, this.state.month, item) || this.state.disabledDays.includes(new Date(Date.UTC(this.state.year, this.state.month, item)).getTime())?null:(e)=>this.onClick(e, this.state.month )} 
                day={item}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Zuzu2MonthDateRangePicker