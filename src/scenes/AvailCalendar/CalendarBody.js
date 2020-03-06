import React from 'react'
import { withNamespaces } from 'react-i18next'
import Column from './Column'

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const COLUMN_WIDTH = 80

class CalendarBody extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      skip_cols: 0
    }
  }

  last_scroll_left = 0 

  onScroll = () => {
    console.log('scrolling')
    const scroll_left = document.getElementById('calendar-body-container').scrollLeft
    if(scroll_left > this.last_scroll_left){ //means it is scrolling right
      const body_width = this.props.headers.length*COLUMN_WIDTH
      const remaining_width = body_width - scroll_left - document.getElementById('calendar-body-container').clientWidth
      this.props.onScroll(remaining_width/COLUMN_WIDTH)
    }

    const Col_in_action = this.props.headers[Math.ceil(scroll_left/COLUMN_WIDTH)]
    this.props.onMonthInDisplayChange(month[Col_in_action.date.getMonth()] + ' ' + Col_in_action.date.getFullYear())

    this.last_scroll_left = scroll_left
    this.setState({skip_cols: Math.max( Math.floor( scroll_left / COLUMN_WIDTH ) - 5, 0  ) })    
  }

  render() {
    console.log('CalendarBody is rendering')
    return (
      <div className="calendar-body-container" id='calendar-body-container' onScroll={this.onScroll}>

        <div id="calendar-body" style={{display: 'flex'}}>
          { this.props.headers.map( (day, day_index) => 
            <Column
              date={day.date}
              index={day_index}
              isLastColumn={day_index === this.props.headers.length - 1}
              skipped={this.state.skip_cols}
              roomTypes={this.props.roomTypes}
              availability={this.props.availability[day_index]}
              rates={this.props.rates[day_index]}
            />
          )}
        </div>


      </div>
    )
  }
}

export default withNamespaces('translation')(CalendarBody)