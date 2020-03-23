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
  addDays,
  calcDayDiff,
  calcMonthDiff
} from '../../utils/Format'

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TODAY = new Date()

const SCROLL_STEP = 8
const SCROLL_INTERVAL = 20
const COLUMN_WIDTH = 80

// Colors
const MANUAL_EDIT_COLOR = '#ffdfd0'
const LINK_BROKEN_COLOR = '#9bd0fe'
const DEACTIVATED_RATE_COLOR = '#e6e6e6'
const STOP_SELL_COLOR = '#d9534f'
const LEGEND_BORDER_COLOR = '#979797'


//helper functions
const addMonthDay1 = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  result.setDate(1)
  return result
}

const addMonthDayLastDay = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months + 1)
  result.setDate(0)
  return result
}

class AvailCalendar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      jump_date: TODAY,
      hotel: {},
      room_types: [],
      rates: [],
      availability: [],
      update_derived: true,
      month_year_in_display: month[TODAY.getMonth()] + ' ' + TODAY.getFullYear(),

      show_avail_breakdown: false,
    }
  }

  // These variables are not in state as they are meant as request parameters not for UI
  hotel_id = 971

  rate_month_data_fetch = Array(24).fill(false) // array to keep track of which month rates has been fetched; 24 months in total
  avail_month_data_fetch = Array(24).fill(false) // array to keep track of which month availability has been fetched; 24 months in total

  getRates_loading = false
  getAvailability_loading = false

  calendar_end_date = TODAY

  componentDidMount = async () => {
    window.addEventListener('click', this.collapseDropdown)
    await this.getRoomTypes()

    const to_date = addMonthDayLastDay(TODAY, 1)
    this.calendar_end_date = to_date
    this.getRates(TODAY, to_date, [0, 1])
    this.getAvailability(TODAY, to_date, [0, 1])
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown)
  }

  collapseDropdown = (event) => {
    if (!event.target.matches('.filter-by-channel, .filter-by-channel *'))
      this.setState({ filter_by_channel_dropdown: false })
  }

  onScroll = ( month_to_fetch ) => {
  	if( !this.getRates_loading && !this.getAvailability_loading &&!this.rate_month_data_fetch[month_to_fetch] ){
    	const from_date = addMonthDay1(TODAY, month_to_fetch)
    	const to_date = addMonthDayLastDay(TODAY, month_to_fetch)
    	this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_to_fetch])
	    this.getAvailability(from_date, to_date, [month_to_fetch])  		
  	}
  }

  jumpDate = async ( selected_day ) => {
	await this.setState({jump_date: selected_day})

  	const dest_date = new Date(this.state.jump_date)
  	const month_diff = calcMonthDiff(dest_date, TODAY)
  	const day_diff = calcDayDiff(dest_date, TODAY)
  	if( dest_date < TODAY || dest_date > addDays(TODAY, 720) || this.rate_month_data_fetch[month_diff] === undefined )
  		return
  	else if(month_diff < 2)
    	document.getElementById('calendar-body-container').scrollLeft = day_diff*COLUMN_WIDTH
  	else if( this.rate_month_data_fetch[month_diff - 1] && this.rate_month_data_fetch[month_diff] && this.rate_month_data_fetch[month_diff + 1])
    	document.getElementById('calendar-body-container').scrollLeft = day_diff*COLUMN_WIDTH
    else if(this.rate_month_data_fetch[month_diff - 1] && !this.rate_month_data_fetch[month_diff] && !this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff)
	    const to_date = addMonthDayLastDay(TODAY, month_diff + 1)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff, month_diff + 1], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff, month_diff + 1])

    } else if(this.rate_month_data_fetch[month_diff - 1] && this.rate_month_data_fetch[month_diff] && !this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff + 1)
	    const to_date = addMonthDayLastDay(TODAY, month_diff + 1)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff + 1], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff + 1])

    } else if(this.rate_month_data_fetch[month_diff - 1] && !this.rate_month_data_fetch[month_diff] && this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff)
	    const to_date = addMonthDayLastDay(TODAY, month_diff)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff])

    } else if(!this.rate_month_data_fetch[month_diff - 1] && !this.rate_month_data_fetch[month_diff] && this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff - 1)
	    const to_date = addMonthDayLastDay(TODAY, month_diff)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff - 1, month_diff], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff - 1, month_diff])  

    } else if(!this.rate_month_data_fetch[month_diff - 1] && this.rate_month_data_fetch[month_diff] && this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff - 1)
	    const to_date = addMonthDayLastDay(TODAY, month_diff - 1)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff - 1], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff - 1])  

  	} else if(!this.rate_month_data_fetch[month_diff - 1] && !this.rate_month_data_fetch[month_diff] && !this.rate_month_data_fetch[month_diff + 1]){
   		this.setState({ loading: true })
    	const from_date = addMonthDay1(TODAY, month_diff - 1)
	    const to_date = addMonthDayLastDay(TODAY, month_diff + 1)
	    this.calendar_end_date = this.calendar_end_date < to_date? to_date:this.calendar_end_date
	    this.getRates(from_date, to_date, [month_diff - 1, month_diff, month_diff + 1], day_diff)
	    this.getAvailability(from_date, to_date, [month_diff - 1, month_diff, month_diff + 1])
  	}
  }

  getRoomTypes = async () => {
    this.setState({ loading: true })
    try {
      const response = await AvailabilityCalendarApi.getRoomTypes(this.hotel_id, { language_id: 1 })
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
  	let temp_room_types = room_types.slice()
  	room_types.forEach( (room_type, room_type_index) => room_type.child_room_type_ids.forEach( child_room_type_id => {
  		const child_index = room_types.findIndex(rt => rt.room_type_id === child_room_type_id)
  		if(child_index>=0){
	  		if(temp_room_types[room_type_index].child_room_types)
	  			temp_room_types[room_type_index].child_room_types.push({...room_types[child_index], is_child: true})
	  		else
	  			temp_room_types[room_type_index].child_room_types = [{...room_types[child_index], is_child: true}]
	  		temp_room_types[child_index] = 0
  		}
  	}) )

  	let ordered_room_types = []
  	temp_room_types.filter(item => item).forEach( (room_type, room_type_index) => {
  		ordered_room_types.push(room_type)
  		if(room_type.child_room_types)
  			room_type.child_room_types.forEach( child_room_type => ordered_room_types.push(child_room_type) )
  	})  	

  	return ordered_room_types.map( room_type => ({...room_type, expanded: false, avail_expanded: false, rate_plans: room_type.hotel_rate_plan_ids.map( rate_plan_id => rate_plans.find(rate_plan => rate_plan_id === rate_plan.id)).filter(item => item) }) )
  }

  getRates = (from_date, to_date, months_to_fetch_array, day_diff ) => { // is day_diff is not null, means a jump
    this.getRates_loading = true
    AvailabilityCalendarApi.getRates(this.hotel_id, {from_date: formatRequestDate(from_date), to_date: formatRequestDate(to_date) })
    .then( (response) => {
    	this.setState({loading: this.state.loading && this.getAvailability_loading })
    	this.getRates_loading = false
    	months_to_fetch_array.forEach( month_index => this.rate_month_data_fetch[month_index] = true  )
    	this.sortRates( response.room_rate_prices, months_to_fetch_array, day_diff )
    })
    .catch( error  => {
    	this.setState({loading:false})
    	console.log(error)
    })
  }

  sortRates = ( response_rates, months_fetched_array, day_diff) =>{
  	let new_rates_obj = {}
	response_rates.forEach( rate => {
	    if(new_rates_obj[rate.date])
	        new_rates_obj[rate.date].push(rate)
	    else
	        new_rates_obj[rate.date] = [rate]
	})

  	let new_rates = Object.values(new_rates_obj)

  	const start_offset = calcDayDiff( addMonthDay1(TODAY, months_fetched_array[0]), TODAY ) 
  	const end_offset = calcDayDiff( addMonthDayLastDay(TODAY, months_fetched_array[months_fetched_array.length - 1]), TODAY ) 

  	let stitched_new_rates = []
  	if(this.state.rates.length){
  		if(start_offset > this.state.rates.length)
  			stitched_new_rates = this.state.rates.concat(Array(start_offset - this.state.rates.length).fill(0)).concat(new_rates)
  		else
  			stitched_new_rates = this.state.rates.slice(0, start_offset).concat(new_rates).concat(this.state.rates.slice(end_offset+1, this.state.rates.length))
  	} else
  		stitched_new_rates = new_rates

  	this.setState({rates: stitched_new_rates }, day_diff?()=> document.getElementById('calendar-body-container').scrollLeft = day_diff*COLUMN_WIDTH:null)
  }

  getAvailability = (from_date, to_date, months_to_fetch_array) => {
    this.getAvailability_loading = true

    AvailabilityCalendarApi.getAvailability(this.hotel_id, {
      from_date: formatRequestDate(from_date),
      to_date: formatRequestDate(to_date)
    })
      .then((response) => {
        this.setState({ loading: this.state.loading && this.getRates_loading })
    	this.getAvailability_loading = false
        this.sortAvailability(response, months_to_fetch_array)
      })
      .catch((error) => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  sortAvailability = (response, months_fetched_array) => {
    let new_avail_obj = {}
    response.availabilities.forEach( avail => {
        if(new_avail_obj[avail.date])
            new_avail_obj[avail.date].push(avail)
        else
            new_avail_obj[avail.date] = [avail]
    })

    const new_avails = Object.values(new_avail_obj) 

    let stitched_new_avails = []
    if(this.state.availability.length){
      const start_offset = calcDayDiff( addMonthDay1(TODAY, months_fetched_array[0]), TODAY ) 
      const end_offset = calcDayDiff( addMonthDayLastDay(TODAY, months_fetched_array[months_fetched_array.length - 1]), TODAY )      
      if(start_offset > this.state.availability.length)
        stitched_new_avails = this.state.availability.concat(Array(start_offset - this.state.availability.length).fill(0)).concat(new_avails)
      else
        stitched_new_avails = this.state.availability.slice(0, start_offset).concat(new_avails).concat(this.state.availability.slice(end_offset+1, this.state.availability.length))
    } else
      stitched_new_avails = new_avails

    this.setState({availability: stitched_new_avails })   
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

  toggleRoomTypeAvail = ( room_type_change_index ) => {
  	this.setState({
  		room_types: this.state.room_types.map( (room_type, room_type_index) => {
  			if(room_type_change_index === room_type_index)
  				return {...room_type, avail_expanded: !room_type.avail_expanded}
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
    document.getElementById('calendar-body-container').scrollBy(-SCROLL_STEP, 0)
  }

  scrollRight = () => {
    clearInterval(this.setRightInterval)
    this.setRightInterval = setInterval(() => this.scrollRightDirtyWork(), SCROLL_INTERVAL)
  }

  scrollRightDirtyWork = () => {
    document.getElementById('calendar-body-container').scrollBy(SCROLL_STEP, 0)
  }

  onMouseOutLeft = () => {
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    clearInterval(this.setRightInterval)
  }

  render() {
    const { t } = this.props

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
	        		{ `${week[TODAY.getDay()]}, ${TODAY.getDate()}`}
	        		<span className='orange-date-wtf'>{`${month[TODAY.getMonth()]} ${TODAY.getYear()}`}</span>
	        	</div>
	        </div>

	        <div className='month-year-in-display'>{this.state.month_year_in_display}</div>

	        <div className='flex'>
	        	<LeftPanel
	        		scrollLeft={this.scrollLeft}
	        		onMouseOutLeft={this.onMouseOutLeft}
	        		scrollRight={this.scrollRight}
	        		onMouseOutRight={this.onMouseOutRight}
	        		jumpDate={this.jumpDate}
	        		dateToJump={this.state.jump_date}
	        		roomTypes={this.state.room_types}
	        		toggleRoomType={this.toggleRoomType}
	        		toggleRoomTypeAvail={this.toggleRoomTypeAvail}
	        		updateDerived={this.state.update_derived}
	        		showAvailBreakdown={this.state.show_avail_breakdown}
	        		onStateToggle={( state_to_toggle ) => this.setState({[state_to_toggle]: !this.state[state_to_toggle]})}
	        	/>
	        	<CalendarBody
	        		onScroll={this.onScroll}
	        		onMonthInDisplayChange={(new_month_year_in_display)=>this.setState({month_year_in_display: new_month_year_in_display})}
	        		roomTypes={this.state.room_types}
            		headers={Array( calcDayDiff(this.calendar_end_date, TODAY, true) ).fill(0).map((item, index) => ({ date: addDays(TODAY, index) }))}
	        		availability={this.state.availability}
	        		rates={this.state.rates}
	        		showAvailBreakdown={this.state.show_avail_breakdown}

	        	/>
	        	<div className='right-column'>
	        		<div className='left-panel-header'>
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
