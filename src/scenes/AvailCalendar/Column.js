import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

class Column extends React.PureComponent {
  render() {
    return (
      <div className='column'>
        <div className='col-day'>{days[this.props.date.getDay()]}</div>
        <div className='col-date bold'>{this.props.date.getDate()}</div>
        { !!this.props.availability && !!this.props.rates && <React.Fragment>
          <div className='bold avail-sum'>{this.props.availability.reduce( (sum, item) => {
            const rates = this.props.rates.find(rates => rates.room_type_id ===  item.room_type_id )
            return !rates? sum: sum + item.available_count
          }, 0)}</div>
          {
            this.props.roomTypes.map( room_type => {
              const avail = this.props.availability.find(avail => avail.room_type_id ===  room_type.room_type_id )
              const rates = this.props.rates.find(rates => rates.room_type_id ===  room_type.room_type_id ) || {rate_plan_prices: []}
              return (<React.Fragment>
                <div className={classNames('avail-cell', {
                    'empty': !avail,
                    'stop-sell': avail && !avail.hotel_rate_plans_availabilities.filter(rate_plan_avail => rate_plan_avail.is_allow_to_sell).length
                  })}>
                  {avail?avail.available_count:'N/A'}
                </div>
                { room_type.rate_plans.map((rate_plan, rate_plan_index) => {
                    const rate_pan_price = rates.rate_plan_prices.find( rate_pan_price => rate_plan.id == rate_pan_price.hotel_rate_plan_id)
                    const stop_sell_avail = avail && avail.hotel_rate_plans_availabilities.find( rate_avail => rate_avail.hotel_rate_plan_id === rate_plan.id)
                    const is_stop_sell = stop_sell_avail?!stop_sell_avail.is_allow_to_sell: false
                    return (<div 
                      className={classNames('rate-cell', {
                        'empty': !rate_pan_price,
                        'hidden': !room_type.expanded && rate_plan_index !== 0,
                        'rate-stop-sell': is_stop_sell
                      })}                        
                      >
                    {rate_pan_price?rate_pan_price.price_with_tax:'N/A'}
                  </div>)
                })}  
              </React.Fragment>)
            })
          }
        </React.Fragment>}
      
      </div>
    )
  }
}

export default withNamespaces('translation')(Column)