import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import { formatCurrency } from '../../utils/Format'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class CalendarRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rate_plan_index: -1,
      day_index: -1,
    }
  }

  render() {
    return (
      <React.Fragment>
        {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
        { this.props.availability.map( (dayData, index) => <div 
          key={index}
          className={classNames(
            'empty-cell top-border',
            { 
              'last-column': index === this.props.availability.length - 1,
              'stop-sell': !dayData.hotel_rate_plans_availabilities.filter(rate_plan_avail => rate_plan_avail.is_allow_to_sell).length
            }
          )}>          
           &nbsp;
          </div>)
        }      
        {(this.props.skipped > 0) && <div style={{ gridColumnStart: (this.props.skipped ) }}>&nbsp;</div>}
        { this.props.availability.map( (dayData, index) => <div 
          key={index} 
          className={classNames(
            'calendar-cell bold line-height-1',
            { 
              'last-column': index === this.props.availability.length - 1,
              'stop-sell': !dayData.hotel_rate_plans_availabilities.filter(rate_plan_avail => rate_plan_avail.is_allow_to_sell).length
            }
          )}>
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
                  rate_data.rates_by_rate_plan.map( (dayData, day_index) => <div 
                  key={day_index} 
                  onClick={()=>this.setState({rate_plan_index, day_index})}
                  className={classNames(
                    'calendar-cell clickable-dropdown-container',
                    { 
                      'last-column': day_index === rate_data.rates_by_rate_plan.length - 1,
                      'rate-stop-sell': !this.props.availability[day_index].hotel_rate_plans_availabilities.find( rate_plan => rate_plan.hotel_rate_plan_id === rate_data.rate_plan_id).is_allow_to_sell,
                      'active': this.state.day_index === day_index && this.state.rate_plan_index === rate_plan_index
                    }
                  )}>
                   {formatCurrency(dayData.price_with_tax, 'SG', '')}
                   <div className='dropdown-content rate-editor'>
                    <input value={5}/>
                   </div>
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