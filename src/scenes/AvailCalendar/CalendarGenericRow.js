import React from 'react'
import { withNamespaces } from 'react-i18next'

class CalendarGenericRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <React.Fragment>
        {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
        { this.props.rowData.map( (dayData, index) => <div 
          key={index} 
          className={(index === this.props.rowData.length - 1) ? `last-column calendar-cell ${this.props.rowClass}` : `calendar-cell ${this.props.rowClass}`}>
           {this.props.dataKey?dayData[this.props.dataKey]:dayData}
          </div>)
        }
      </React.Fragment>
    )
  }
}

export default withNamespaces('translation')(CalendarGenericRow)