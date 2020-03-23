import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

class Column extends React.PureComponent {
  render() {
    const availability_sum = this.props.availability && this.props.rates && this.props.availability.reduce( (sum, item) => {
            const rates = this.props.rates.find(rates => rates.room_type_id ===  item.room_type_id )
            return !rates? sum: {
              sold_count: sum.sold_count + item.hotel_rate_plans_availabilities.reduce((sum1, item1) => sum1 + item1.sold_count, 0),
              count: sum.count + item.count, 
              closed_count: sum.closed_count + item.closed_count, 
              available_count: sum.available_count + item.available_count, 
            }
          }, {sold_count: 0, count: 0, closed_count:0, available_count: 0})

    return (
      <div className='column'>
        <div className='col-day'>{days[this.props.date.getDay()]}</div>
        <div className='col-date bold'>{this.props.date.getDate()}</div>
        { !!this.props.availability && !!this.props.rates && <React.Fragment>
          <div className='avail-sum-container'>
            <div className='avail-sum'>{availability_sum.available_count}</div>
            { this.props.showAvailBreakdown && <React.Fragment>
                <div className='avail-breakdown'>{availability_sum.sold_count}</div>
                <div className='avail-breakdown'>{availability_sum.closed_count}</div>
                <div className='avail-breakdown'>{availability_sum.count - availability_sum.sold_count - availability_sum.closed_count - availability_sum.available_count}</div>
                </React.Fragment>
            }
          </div>
          { this.props.roomTypes.map( (room_type, room_type_index) => {
              const avail = this.props.availability.find(avail => avail.room_type_id ===  room_type.room_type_id )
              const rates = this.props.rates.find(rates => rates.room_type_id ===  room_type.room_type_id ) || {rate_plan_prices: []}
              const sold_count = avail && avail.hotel_rate_plans_availabilities.reduce((sum, item) => sum + item.sold_count, 0)
              return (<React.Fragment key={room_type_index}>
                <div className={'avail-cell-container ' + (!room_type.is_child && 'not-child ') + (!room_type_index && 'is-top')}>
                  <div className={classNames('avail-cell', {
                      'empty': !avail,
                      'stop-sell': avail && !avail.hotel_rate_plans_availabilities.filter(rate_plan_avail => rate_plan_avail.is_allow_to_sell).length
                    })}>
                    {avail?avail.available_count:'N/A'}
                  </div>
                  { room_type.avail_expanded && <React.Fragment>
                      <div className='avail-breakdown'>{sold_count}</div>
                      <div className='avail-breakdown'>{avail && avail.closed_count}</div>
                      <div className='avail-breakdown'>{avail && avail.count - avail.closed_count - avail.available_count - sold_count}</div>
                      </React.Fragment>
                  }                   
                </div>    
                <div>
                { room_type.rate_plans.map((rate_plan, rate_plan_index) => {
                    const rate_pan_price = rates.rate_plan_prices.find( rate_pan_price => rate_plan.id == rate_pan_price.hotel_rate_plan_id)
                    const stop_sell_avail = avail && avail.hotel_rate_plans_availabilities.find( rate_avail => rate_avail.hotel_rate_plan_id === rate_plan.id)
                    const is_stop_sell = stop_sell_avail?!stop_sell_avail.is_allow_to_sell: false
                    if(!room_type.expanded && rate_plan_index !== 0)
                      return null
                    else
                    return (<div 
                      key={rate_plan_index}
                      className={classNames('rate-cell', {
                        'empty': !rate_pan_price,
                        'rate-stop-sell': is_stop_sell
                      })}                        
                      >
                    {rate_pan_price?rate_pan_price.price_with_tax:'N/A'}
                  </div>)
                })}  
                </div>
              </React.Fragment>)
            })
          }
        </React.Fragment>}
      
      </div>
    )
  }
}

export default withNamespaces('translation')(Column)