import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const COLUMN_WIDTH = 80
const cellsOnScreen = 20

class Column extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    if(this.props.skipped>this.props.index){
      if(!this.props.index)
        return (<div style={{minWidth: COLUMN_WIDTH*this.props.skipped}}>&nbsp;</div>)
      else
        return null
    } else if (this.props.skipped + cellsOnScreen<this.props.index ){
      if(this.props.isLastColumn)
        return (<div style={{minWidth: COLUMN_WIDTH*(this.props.index - this.props.skipped - cellsOnScreen )}}>&nbsp;</div>)
      else
        return null      
    } else{
      return (
        <div className='column'>
          <div className='col-day'>{days[this.props.date.getDay()]}</div>
          <div className='col-date bold'>{this.props.date.getDate()}</div>
          { !!this.props.availability && !!this.props.rates && <React.Fragment>
            <div className='bold avail-sum'>&nbsp;</div>
            {
              this.props.roomTypes.map( room_type => {
                const avail = this.props.availability.find(avail => avail.room_type_id ===  room_type.room_type_id )
                const rates = this.props.rates.find(rates => rates.room_type_id ===  room_type.room_type_id ) || {rate_plan_prices: []}
                return (<React.Fragment>
                  <div className={avail?'avail-cell':'avail-cell empty'}>{avail?avail.available_count:'N/A'}</div>
                  { room_type.rate_plans.map((rate_plan, rate_plan_index) => {
                      const rate_pan_price = rates.rate_plan_prices.find( rate_pan_price => rate_plan.id == rate_pan_price.hotel_rate_plan_id)
                      return (<div 
                        className={classNames('rate-cell', {
                          'empty': !rate_pan_price,
                          'hidden': !room_type.expanded && rate_plan_index !== 0
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
}

export default withNamespaces('translation')(Column)