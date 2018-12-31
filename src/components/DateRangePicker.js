import React from "react";

import './DateRangePicker.css'

const Mon = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 
]

class Block extends React.Component {
  render() {
    return (
      <div style={{width:40, height:30, textAlign:'center', lineHeight:'30px'}}>{this.props.text}</div>
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
        style={{boxSizing: 'content-box', width:38, height:28, textAlign:'center', lineHeight:'28px', cursor:'pointer'}}>
        {this.props.day?this.props.day:''}
      </div>
    )
  }
}

class ZuzuDateRangePicker extends React.Component {
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
    if(this.props.disabledRanges != nextProps.disabledRanges){
      console.log(1)
      console.log(this.props.disabledRanges)
      console.log(nextProps.disabledRanges)
    }
    if(this.props.selectedRange != nextProps.selectedRange)
      console.log(2)
    if(this.props.year != nextProps.year)
      console.log(3)
    if(this.props.month != nextProps.month)
      console.log(4)
    if(this.props.onRangeSelected != nextProps.onRangeSelected)
      console.log(5)    
    console.log('wtf')
    this.setState({
      disabledDays: nextProps.disabledRanges.map(disabledRange=>this.getSelectedDays(disabledRange)).reduce(this.concat, []),
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

  onClick = (e) => {
    if(!this.state.dayStart || this.state.dayEnd){
      const dayStart = new Date(this.state.year, this.state.month, e.target.getAttribute('name'))
      console.log(dayStart.getTime())
      this.setState({selectedRange: [dayStart.getTime()], dayStart: dayStart, dayEnd: null})
    } 
    else{
      const d1 = this.state.dayStart
      const d2 = new Date(this.state.year, this.state.month, e.target.getAttribute('name'))
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
        dayEnd: new Date(this.state.year, this.state.month, e.target.getAttribute('name')), 
        daysInHoveredRange: []
      })      
    }
  }

  onMouseEnter = (e) => {
    console.log(this.state.selectedRange)
    if(this.state.dayStart){
      let start = 1
      let length = 0

      if(this.state.dayStart.getTime() < new Date(this.state.year, this.state.month, 1)){
        start = 1
        length = e.target.getAttribute('name') - start
      } else if(this.state.dayStart.getTime() >= new Date(this.state.year, this.state.month + 1, 1)){
        start = parseInt(e.target.getAttribute('name'))
        length = new Date(this.state.year, this.state.month + 1, 0).getDate() - start
      } else {
        start = new Date(this.state.year, this.state.month, e.target.getAttribute('name')).getTime() < this.state.dayStart.getTime()? parseInt(e.target.getAttribute('name')):this.state.dayStart.getDate()
        length = Math.abs(e.target.getAttribute('name') - this.state.dayStart.getDate())
      }

      const daysInHoveredRange = []
      for(let i = 0; i < length + 1 ; i++)
        daysInHoveredRange.push(  start + i )       
      this.setState({daysInHoveredRange: daysInHoveredRange})
    }
    else
      this.setState( {daysInHoveredRange: [ parseInt(e.target.getAttribute('name'))]} )
  }

  onMouseLeave = (e) => {
    this.setState({daysInHoveredRange: []})
  }  

  onMonthChange = (forward) => {
    let new_date = ''
    if(forward){
      new_date = new Date(this.state.year, this.state.month + 1)
    } else {
      new_date = new Date(this.state.year, this.state.month - 1)
    }
    
    this.setState({year: new_date.getFullYear(), month: new_date.getMonth()})
  }

  render() {
    return (
      <div className='d-r-p' 
        style={{padding:10}}>
        <div className="calendar-header" style={{display:'flex', justifyContent: 'space-between', width:281, fontWeight:600, fontSize:14, marginBottom: 10}}> 
          <div style={{marginLeft:40}}>{Mon[this.state.month]} {this.state.year} </div>
          <div>
            <div onClick={()=>this.onMonthChange()} style={{cursor:'pointer', display:'inline-block'}}>
              <i className='arrow left' style={{marginRight:20}}/>
            </div>           
            <div onClick={()=>this.onMonthChange(true)} style={{cursor:'pointer', display:'inline-block'}}>
              <i className='arrow right'style={{marginRight:20}}/>
            </div>  
          </div>
        </div>
        <div className="calendar" style={{display:'flex', flexWrap:'wrap', width:281}}>
          {['Sun', 'Mon', 'Tue',  'Wed', 'Thu', 'Fri', 'Sat'].map(item=><Block key={item} text={item}/>)}
          { Array(new Date(this.state.year, this.state.month, 1).getDay()).fill(0).map((item, index)=><Block key={index} text={''}/>)}

          { Array(new Date(this.state.year, this.state.month + 1, 0).getDate()).fill(0).map((item, index)=>index+1).map((item, index)=>
            <Day 
              key={index}
              className={( this.state.selectedRange.includes(new Date(this.state.year, this.state.month, item).getTime())?'selected ' :'normal ') 
              + (this.state.daysInHoveredRange.includes(item)?'hovered ':'')
              + (this.state.disabledDays.includes(new Date(this.state.year, this.state.month, item).getTime())?'disabled ' :'')
              }
              onMouseEnter={this.state.dayEnd?null:this.onMouseEnter}
              onMouseLeave={this.state.dayEnd?null:this.onMouseLeave}
              onClick={this.state.disabledDays.includes(new Date(this.state.year, this.state.month, item).getTime())?null:this.onClick} 
              day={item}/>
          )}
        </div>
      </div>
    );
  }
}

export default ZuzuDateRangePicker