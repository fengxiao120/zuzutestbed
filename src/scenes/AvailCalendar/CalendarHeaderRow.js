import React from 'react'
import { withNamespaces } from 'react-i18next'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class CalendarHeaderRow extends React.PureComponent {
  render() {
    const date = new Date()
    return (
      <React.Fragment>
        {this.props.skipped > 0 && (
          <div style={{ gridColumnStart: this.props.skipped }}>&nbsp;</div>
        )}
        {this.props.rowData.map((dayData, index) => (
          <div
            key={index}
            className={
              index === this.props.rowData.length - 1
                ? 'last-column calendar-header-cell'
                : 'calendar-header-cell'
            }
          >
            <div>{days[dayData.date.getDay()]}</div>
            <div className="bold">{dayData.date.getDate()}</div>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

export default withNamespaces('translation')(CalendarHeaderRow)