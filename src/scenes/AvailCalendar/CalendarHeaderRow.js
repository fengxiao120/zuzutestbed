import React from 'react'
import { withNamespaces } from 'react-i18next'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class CalendarHeaderRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const date = new Date()
    return (
      <React.Fragment>
        { (this.props.skipped > 0) && <div style={{ gridColumnStart: this.props.skipped }}>&nbsp;</div>}
        { this.props.rowData.map( (dayData, index) => <div 
          key={index} 
          className={(index === this.props.rowData.length - 1) ? 'last-column calendar-header-cell' : 'calendar-header-cell'}>
           <div>{mon[new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayData.date).getDay()]}</div>
           <div className='bold'>{dayData.date}</div>
          </div>)
        }
      </React.Fragment>
    )
  }
}

export default withNamespaces('translation')(CalendarHeaderRow)