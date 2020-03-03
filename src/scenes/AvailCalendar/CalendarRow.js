import React from 'react'
import { withNamespaces } from 'react-i18next'
import { formatCurrency } from '../../utils/Format'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class CalendarRow extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
        { this.props.availability.map( (dayData, index) => <div 
          key={index} 
          className={(index === this.props.availability.length - 1) ? 'last-column empty-cell top-border' : 'empty-cell top-border'}>
           &nbsp;
          </div>)
        }      
        {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
        { this.props.availability.map( (dayData, index) => <div 
          key={index} 
          className={(index === this.props.availability.length - 1) ? 'last-column calendar-cell bold' : 'calendar-cell bold'}>
           {dayData.available_count}
          </div>)
        }
        {  this.props.rates && !!this.props.rates.length && this.props.ratePlans.map( (rate_plan, rate_plan_index) => {
          const rate_data = this.props.rates.find( rate => rate.rate_plan_id === rate_plan.id ) 

          if( this.props.expanded || rate_plan_index === 0 ){
            if(rate_data)
              return <React.Fragment>
                {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
                {
                  rate_data.rates_by_rate_plan.map( (dayData, index) => <div 
                  key={index} 
                  className={(index === rate_data.rates_by_rate_plan.length - 1) ? 'last-column calendar-cell' : 'calendar-cell'}>
                   {formatCurrency(dayData.price_with_tax, 'SG', '')}
                  </div>)              
                }
              </React.Fragment>
            else
              return <React.Fragment>
                {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
                {
                  this.props.availability.map( (dayData, index) => <div 
                  key={index} 
                  className={(index === this.props.availability.length - 1) ? 'last-column calendar-cell' : 'calendar-cell'}>
                   {'N/A'}
                  </div>)              
                }
              </React.Fragment>
          } else
            return null
        }) }

        { !this.props.rates || !this.props.rates.length && this.props.ratePlans.map( (item, rate_plan_index) => {
            if( this.props.expanded || rate_plan_index === 0)
              return <React.Fragment>
                {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
                {
                  this.props.availability.map( (dayData, index) => <div 
                  key={index} 
                  className={(index === this.props.availability.length - 1) ? 'last-column calendar-cell' : 'calendar-cell'}>
                   &nbsp;
                  </div>)              
                }
              </React.Fragment>
            else
              return null
          })

        }


      </React.Fragment>
    )
  }
}

export default withNamespaces('translation')(CalendarRow)