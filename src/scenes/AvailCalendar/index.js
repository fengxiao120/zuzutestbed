/* eslint-disable */
import React from 'react'

import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { withNamespaces } from 'react-i18next'

import Navigation from '../../components/Navigation'
import Loader from '../../components/Spinner'

import LeftPanel from './LeftPanel'
import CalendarBody from './CalendarBody'
import './index.css'
// flags
import AvailabilityCalendarApi from '../../api/AvailabilityCalendarApi'

import {
  formatRequestDate,
  addDays
} from '../../utils/Format'

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const SCROLL_STEP = 12
const SCROLL_INTERVAL = 10
const DAY_NUMBER = 600

// Colors
const MANUAL_EDIT_COLOR = '#ffdfd0'
const LINK_BROKEN_COLOR = '#9bd0fe'
const DEACTIVATED_RATE_COLOR = '#e6e6e6'
const STOP_SELL_COLOR = '#d9534f'
const LEGEND_BORDER_COLOR = '#979797'

class AvailCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      today: new Date('2020-03-11'),
      hotel: {},
      room_types: [],
      rates: [],
      availability: [],
      update_derived: true
    }
  }

  // These variables are not in state as they are meant as request parameters not for UI
  hotel_id = 971

  componentDidMount = async () => {
    window.addEventListener('click', this.collapseDropdown)
    await this.getRoomTypes()
    this.getAvailability()
    this.getRates()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown)
  }

  collapseDropdown = (event) => {
    if (!event.target.matches('.filter-by-channel, .filter-by-channel *'))
      this.setState({ filter_by_channel_dropdown: false })
  }

  getRoomTypes = async () => {
    this.setState({ loading: true })
    try {
      const response = await AvailabilityCalendarApi.getRoomTypes(this.hotel_id, { language_id: 1 })
      this.setState({ loading: false })

      const room_types = response.hotel_room_types
      const rate_plans = response.hotel_rate_plans
      const valid_room_types = room_types.filter(
        (room_type) => room_type.hotel_rate_plan_ids.length
      )
      await this.setState({
        room_types: this.matchRoomTypeRatePlans(valid_room_types, rate_plans)
      })
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }
  }

  matchRoomTypeRatePlans = ( room_types, rate_plans ) => {
  	return room_types.map( room_type => ({...room_type, expanded: true, rate_plans: room_type.hotel_rate_plan_ids.map( rate_plan_id => rate_plans.find(rate_plan => rate_plan_id === rate_plan.id)).filter(item => item) }) )
  }

  getAvailability = () => {
    this.setState({ loading: true })
    AvailabilityCalendarApi.getAvailability(this.hotel_id, {
      from_date: formatRequestDate(this.state.today),
      to_date: formatRequestDate(addDays(this.state.today, DAY_NUMBER - 1))
    })
      .then((response) => {
        this.setState({ loading: false })
        this.sortAvailability(response)
      })
      .catch((error) => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  sortAvailability = (response) => {
    const availability = response.availabilities
    const avail_by_room_type = this.state.room_types.map((room_type) => ({
      room_type_id: room_type.room_type_id,
      avails: []
    }))
    const availability_sum = []
    availability.forEach((avail, index, array_itself) => {
      if (!index || avail.date !== array_itself[index - 1].date)
        availability_sum.push(avail.available_count)
      else availability_sum[availability_sum.length - 1] += avail.available_count
      const room_type_index = avail_by_room_type.findIndex(
        (room_type) => room_type.room_type_id === avail.room_type_id
      )
      avail_by_room_type[room_type_index].avails.push(avail)
    })
    this.setState({ availability: avail_by_room_type, availability_sum: availability_sum })
  }

  getRates = () => {
    this.setState({loading:true})
    AvailabilityCalendarApi.getRates(this.hotel_id, {from_date: formatRequestDate(this.state.today), to_date: formatRequestDate(addDays(this.state.today, DAY_NUMBER - 1)) })
    .then(response => {
    	this.setState({loading:false})
    	this.sortRates( response.room_rate_prices )
    })
    .catch( error  => {
    	this.setState({loading:false})
    	console.log(error)
    })
  }

  sortRates = ( rates ) =>{
  	let rates_by_room_type = this.state.room_types.map( room_type => ({ room_type_id: room_type.room_type_id, rates: [] }) )
  	rates.forEach( (rate, index, array_itself) => {
  		const room_type_index = rates_by_room_type.findIndex( room_type => room_type.room_type_id === rate.room_type_id  )
  		rates_by_room_type[room_type_index].rates.push(rate)
  	})
  	rates_by_room_type = rates_by_room_type.map( rate_by_room_type => {
  		const rate_by_rate_plan = []
  		rate_by_room_type.rates.forEach( item => item.rate_plan_prices.forEach( rate_plan_price => rate_by_rate_plan.push(rate_plan_price) ) )
  		const grouped_rate_by_rate_plan = {}
  		rate_by_rate_plan.forEach( rate => {
  			if(grouped_rate_by_rate_plan[rate.hotel_rate_plan_id])
  				grouped_rate_by_rate_plan[rate.hotel_rate_plan_id].push(rate)
  			else
  				grouped_rate_by_rate_plan[rate.hotel_rate_plan_id] = [rate]
  		})

  		rate_by_room_type.grouped_rate_by_rate_plan = Object.keys(grouped_rate_by_rate_plan).map( key => ({rate_plan_id: parseInt(key), rates_by_rate_plan: grouped_rate_by_rate_plan[key] }) )
  		return rate_by_room_type
  	})
  	this.setState({rates: rates_by_room_type})  	
  }

  toggleRoomType = ( room_type_change_index ) => {
  	this.setState({
  		room_types: this.state.room_types.map( (room_type, room_type_index) => {
  			if(room_type_change_index === room_type_index)
  				return {...room_type, expanded: !room_type.expanded}
  			else
  				return room_type
  		}) 
  	})
  }

  scrollLeft = () => {
    clearInterval(this.setLeftInterval)
    this.setLeftInterval = setInterval(() => this.scrollLeftDirtyWork(), SCROLL_INTERVAL)
  }

  scrollLeftDirtyWork = () => {
    document.getElementById('calendar-body').scrollBy(-SCROLL_STEP, 0)
  }

  scrollRight = () => {
    clearInterval(this.setRightInterval)
    this.setRightInterval = setInterval(() => this.scrollRightDirtyWork(), SCROLL_INTERVAL)
  }

  scrollRightDirtyWork = () => {
    document.getElementById('calendar-body').scrollBy(SCROLL_STEP, 0)
  }

  onMouseOutLeft = () => {
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    clearInterval(this.setRightInterval)
  }

  render() {
    const { t } = this.props

    console.log('index is rendering')

    return (
    <div style={{display:'flex'}}>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
       		root='Payments'
    		path={'/payments'}
    	/>
    	<div className="App avail-calendar"
			style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}>
	        <div className="avail-calendar-header">
	        	{t('Availability calendar')}
	        	<div className='orange-date'>
	        		{ `${week[this.state.today.getDay()]}, ${this.state.today.getDate()}`}
	        		<span className='orange-date-wtf'>{`${month[this.state.today.getMonth()]} ${this.state.today.getYear()}`}</span>
	        	</div>
	        </div>

	        <div className='flex'>
	        	<LeftPanel
	        		scrollLeft={this.scrollLeft}
	        		onMouseOutLeft={this.onMouseOutLeft}
	        		scrollRight={this.scrollRight}
	        		onMouseOutRight={this.onMouseOutRight}
	        		roomTypes={this.state.room_types}
	        		toggleRoomType={this.toggleRoomType}
	        		updateDerived={this.state.update_derived}
	        		onChangeUpdateDerived={() => this.setState({update_derived: !this.state.update_derived})}
	        	/>
	        	<CalendarBody
	        		roomTypes={this.state.room_types}
            		headers={Array(DAY_NUMBER).fill(0).map((item, index) => ({ date: addDays(this.state.today, index) }))}
	        		availability={this.state.availability}
	        		availabilitySum={this.state.availability_sum}
	        		rates={this.state.rates}
	        	/>
	        	<div className='right-column'>
	        		<div className='spacer-1'>
		            <div
		              onMouseOver={() => this.scrollRight()}
		              onMouseOut={() => this.onMouseOutRight()}
		              className="scroller-icon"
		            >
		              {'>'}
		            </div>
	        		</div>
	        	</div>
	        </div>

	        <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore} />

	        <Loader fullPage loading={this.state.loading} local={false} />			
		</div>
	</div>
    )
  }
}


export default withNamespaces('translation')(AvailCalendar)
