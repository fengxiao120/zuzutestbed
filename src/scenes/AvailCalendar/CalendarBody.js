import React from 'react'
import { withNamespaces } from 'react-i18next'
import Column from './Column'
import {
  formatRequestDate,
  addDays,
  calcDayDiff,
  calcMonthDiff
} from '../../utils/Format'

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const COLUMN_WIDTH = 80
const cellsOnScreen = 30

//helper functions
const addMonthDay1 = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  result.setDate(1)
  return result
}

const addMonthDayLastDay = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months + 1)
  result.setDate(0)
  return result
}

class CalendarBody extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      skip_cols: 0
    }
  }

  last_scroll_left = 0 

  onScroll = () => {
    const scroll_left = document.getElementById('calendar-body-container').scrollLeft
    const Col_in_action = this.props.headers[Math.ceil(scroll_left/COLUMN_WIDTH)]

    if( scroll_left > this.last_scroll_left){ // means it is scrolling right
      const last_day = addMonthDayLastDay(Col_in_action.date, 0)
      const remaining_days = calcDayDiff(last_day, Col_in_action.date)
      if(remaining_days < 25){
        const month_to_fetch = calcMonthDiff(Col_in_action.date, this.props.headers[0].date) + 1
        if(month_to_fetch < 24)
          this.props.onScroll( month_to_fetch )
      }
    } else if( scroll_left < this.last_scroll_left ){ // means it is scrolling left
      const first_day = addMonthDay1(Col_in_action.date, 0)
      const remaining_days = calcDayDiff(Col_in_action.date, first_day)
      if(remaining_days < 10){
        const month_to_fetch = calcMonthDiff(Col_in_action.date, this.props.headers[0].date) - 1
        if(month_to_fetch > 0)
          this.props.onScroll( month_to_fetch )
      }
    }

    this.props.onMonthInDisplayChange(month[Col_in_action.date.getMonth()] + ' ' + Col_in_action.date.getFullYear())

    this.last_scroll_left = scroll_left
    this.setState({skip_cols: Math.max( Math.floor( scroll_left / COLUMN_WIDTH ) - 5, 0  ) })    
  }

  render() {
    console.log('CalendarBody rendering')
    return (
      <div className="calendar-body-container" id='calendar-body-container' onScroll={this.onScroll}>
        <div id="calendar-body" style={{display: 'flex'}}>
          { this.props.headers.map( (day, day_index) => {
            if(this.state.skip_cols>day_index){
              if(!day_index)
                return (<div style={{minWidth: COLUMN_WIDTH*this.state.skip_cols}}>&nbsp;</div>)
              else
                return null
            } else if (this.state.skip_cols + cellsOnScreen<day_index ){
              if(day_index === this.props.headers.length - 1)
                return (<div style={{minWidth: COLUMN_WIDTH*(day_index - this.state.skip_cols - cellsOnScreen )}}>&nbsp;</div>)
              else
                return null      
            } else
              return(<Column
              date={day.date}
              index={day_index}
              isLastColumn={day_index === this.props.headers.length - 1}
              skipped={this.state.skip_cols}
              roomTypes={this.props.roomTypes}
              availability={this.props.availability[day_index]}
              rates={this.props.rates[day_index]}
            />)
          })}
        </div>
      </div>
    )
  }
}

export default withNamespaces('translation')(CalendarBody)