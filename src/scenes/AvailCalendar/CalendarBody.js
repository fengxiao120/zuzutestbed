import React from 'react'
import { withNamespaces } from 'react-i18next'
import CalendarRow from './CalendarRow'
import CalendarHeaderRow from './CalendarHeaderRow'
import CalendarGenericRow from './CalendarGenericRow'


const COLUMN_WIDTH = 80
const cellsOnScreen = 20

const RATE_PLAN_DATA = Array(720).fill(0).map( (item, index) => ({price: index}) ) // debug

class CalendarBody extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      skip_cols: 0
    }
  }

  onScroll = () => {
    console.log('scrolling')
    const scroll_left = document.getElementById('calendar-body').scrollLeft
    this.setState({skip_cols: Math.max( Math.floor( scroll_left / COLUMN_WIDTH ) - 2, 0  ) })
  }

  getVisibleCells = (cells) => {
    const newCells = [].concat(cells)
    newCells.splice(0, this.state.skip_cols)

    return newCells.slice(0, cellsOnScreen )
  }

  render() {
    console.log('CalendarBody is rendering')
    return (
      <div className="calendar-body" id='calendar-body' onScroll={this.onScroll}>

        <div style={{
          display: 'grid',
          'grid-template-rows': `50px 30px repeat(${this.props.roomTypes.length}, 25px)`,
          'grid-template-columns': `repeat(${this.props.headers.length}, ${COLUMN_WIDTH}px)`,
        }}>
          <CalendarHeaderRow
            rowData={this.getVisibleCells(this.props.headers)}
            skipped={this.state.skip_cols}
          />
          <CalendarGenericRow
            rowClass='availability'
            rowData={this.getVisibleCells(this.props.availabilitySum)}
            skipped={this.state.skip_cols}
          />
          { this.props.roomTypes.map( (roomType, index) => {
            const availability = this.props.availability.find( avail => roomType.room_type_id === avail.room_type_id)
            const rate = this.props.rates.find( rate => roomType.room_type_id === rate.room_type_id)
            if( !availability || !rate)
              return null
            else
              return (<CalendarRow 
              key={index} 
              expanded={this.props.roomTypes[index].expanded}
              availability={this.getVisibleCells( availability.avails )}
              rates={ rate.grouped_rate_by_rate_plan.map( rate_plan => ({
               rate_plan_id: rate_plan.rate_plan_id,
               rates_by_rate_plan: this.getVisibleCells( rate_plan.rates_by_rate_plan )
              }) ) }
              ratePlans={roomType.rate_plans}
              skipped={this.state.skip_cols}
              />)
          })}
        </div>


      </div>
    )
  }
}

export default withNamespaces('translation')(CalendarBody)