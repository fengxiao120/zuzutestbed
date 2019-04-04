import React from "react"

import ZuzuDateRangePicker from '../../components/DateRangePicker'

import './EditBookingStatus.css'
import RulesEngineApi from '../../api/RulesEngineApi'
import Color from '../../Color'

import Header from './Header'
import Status from './Status'
import Payment from './Payment'
import NoteCard from './NoteCard'

const t = str => str

const days = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const calcDayDiff = ( end_date, start_date ) => {
  return ( new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()) - 
    new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()) ) / 86400000 //this is the count of miniseconds in a day    
}

const formatDate = (dateObject, placeholder, seperator) => {
  if(dateObject)
    return (seperator?seperator:'') + dateObject.getDate().toString().padStart(2,0) + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
  else
    return placeholder || ''
}

class EditBookingStatus extends React.Component {
  state = {
    loading: false,
    channel_booking_id: 61015204608648,
    traveller_name: 'Hangakore Hariwana',
    contact_use_email: true,
    traveller_email: 'hanghari@email.com',
    traveller_number: '+63 977 782 3886',
    traveller_id: '56738982G5',
    room_type: 'Bed in 8-Bed Female dorm',
    room_number: '4.2',
    rate_plan: 'Room only - extra long plan name',
    booking_detail: 'Booking.com Postpay',
    zuzu_room_id: '123532804-01',
    number_of_people: 1,
    start_date: '2018-11-26',
    end_date:'2018-12-01',
    notes: [{
      user_name: 'Front Desk',
      date: '21/09/2018 16:25',
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },{
      user_name: 'Alok Yadav',
      date: '23/09/2018 09:45',
      content: "when an unknown printer took a galley of type and scrambled it to make,"
    }, {
      user_name: 'Whatever',
      date: '25/09/2018 12:17',
      content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"
    }, {
      user_name: 'Ghanu',
      date: '25/11/2018 18:31',
      content: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’"
    }],
    cancel_policy: {
      cancel_policy: 'fsdfasdf sfasdf',
      cancel_status: 'Non-refundable',
      remarks: "Full refund if cancelled at any time up to 3 days before check-in. 100% penalty if cancelled if 3 days or less from check-in.",
      no_show_policy: 'Follow cancellation policy'
    },
    modification_history: [
      {
        modified_by: 'Front Desk',
        modified_at: '2019-02-01 16:22:30',
        changed_field: 'Room type',
        before_change: 'Room type A',
        after_change: 'Room type B',
      }
    ],
  }

  loading = false

  componentDidMount = () => { 
    window.addEventListener('click', this.collapseDropdown)
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = (e) => {
    console.log(e.target)
    
    console.log(e.clientX)
    console.log(e.clientY)
    console.log(e.pageX)
    console.log(e.pageY)
    console.log(e.screenX)
    console.log(e.screenY)        
    // if(!event || !event.target.matches('.edtiable-header, .edtiable-header *, .editable-row-names *, .mp-adjustment'))
    //   this.setState({visibleRowNameIndex: -1, visibleHeaderIndex: -1, visibleDailyAdjustmentIndex: -1, visibleAdjustmentIndex: -1})
  }

  printBookingDetails = () => {
    this.setState( {print_dropdown_active: false } )
  }

  printRegistrationCard = () => {
    this.setState( {print_dropdown_active: false } )
  }

  printTravellerFolio = () => {
    this.setState( {print_dropdown_active: false } )
  }

  render() {
    console.log('rendering')
    return (
    <div className='ebs-card'>
      <div className='popup-cancel clickable' onClick={this.props.onCancel}>
        &times;
      </div>

      <Header 
        tab={'one-click-check-in'}
      />

      <div className='ebs-card-content'>
      
        <Status
          acknowledgementStatus={'acknowledged'}
          status={'confirmed'}
        />

        <div className='line-1' style={{display:'flex', justifyContent:'space-between', margin:'10px 16px 2px'}}>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Channel booking ID')}
            </div>
            <div className='no-overflow'>
              {this.state.channel_booking_id}
            </div>
          </div>
          <div className={'clickable-dropdown-container ' + (this.state.print_dropdown_active && 'active')} 
            style={{color: '#337ab7', paddingRight:10, lineHeight: '20px'}}>
            <i className='to-left fa fa-envelope-o'/>
            <i className='to-left-l fa fa-print'
              onClick={()=>{this.setState( { print_dropdown_active: !this.state.print_dropdown_active } )}}
            />
            <span className='dropdown-triangle close'>▼</span>
            <div className='print dropdown-content'>
              <div className='light-blue-hover'
                onClick={this.printBookingDetails}>
                {t('Booking details')}
              </div>
              <div className='light-blue-hover'
                onClick={this.printRegistrationCard}>
                {t('Registration card')}
              </div>
              <div className='light-blue-hover'
                onClick={this.printTravellerFolio}>
                {t('Traveller folio')}
              </div>
            </div>
          </div>
        </div>

        <div className='line-2' style={{display:'flex', justifyContent:'space-between', margin:'0 16px', alignItems:'center'}}>
          <div className='traveller-name no-overflow' style={{fontSize:18, fontWeight: 'bold'}}>
            {this.state.traveller_name}
          </div>
          <span className='edit-buttom' style={{color: '#337ab7', paddingRight:10}}>
            <i className='to-right-s fa fa-pencil' />{t('Edit')}
          </span>
        </div>

        <div className='line-3' style={{display:'flex', margin:'4px 16px', alignItems:'center'}}>
          <div className='stay-range' style={{}}>
             <i className='to-right fa fa-calendar' />
             {formatDate( new Date(this.state.start_date) ) + formatDate( new Date(this.state.end_date), '', ' - ' )}
          </div>
          <span style={{ marginLeft:15}}>
            <i className='to-right-s fa fa-moon-o' />
            {calcDayDiff(new Date(this.state.end_date), new Date(this.state.start_date))}
          </span>
          <span style={{ marginLeft:15}}>
            <i className='to-right-s fa fa-user' />
            {this.state.number_of_people}
          </span>        
        </div>

        <div className='line-4' style={{display:'flex', margin:'10px 16px 2px'}}>
          <div className='left-wrapper fixed'>
            <div className={'clickable field-header clickable-dropdown-container ' + (this.state.contact_dropdown_active&&'active') }
              onClick={ ()=> this.setState( {contact_dropdown_active: !this.state.contact_dropdown_active} ) }>
              {t('Contact details')}
              <span className='dropdown-triangle' style={{color: '#337ab7'}}>▼</span>
              <div className='contact dropdown-content'>
                <div className='contact-header'
                  onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: true} ) }}>
                  Email
                </div>
                <div onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: true} ) }}>
                  {this.state.traveller_email}
                </div>
                <div className='contact-header'
                  onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: false} ) }}>
                  Phone number
                </div>
                <div onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: false} ) }}>
                  {this.state.traveller_number || 'N/A'}
                </div>                                
              </div>
            </div>
            <div className='no-overflow'>
              { this.state.contact_use_email?this.state.traveller_email:this.state.traveller_number }
            </div>
          </div>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Passport/ID')}
            </div>
            <div className='no-overflow'>
              {this.state.traveller_id}
            </div>
          </div>
        </div>

        <div className='line-5' style={{display:'flex', margin:'10px 16px 2px'}}>
          <div className='left-wrapper fixed'>
            <div className='field-header'>
              {t('Room type')}
            </div>
            <div className='no-overflow'>
              {this.state.room_type}
            </div>
          </div>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Room')}
            </div>
            <div className='no-overflow'>
              {this.state.room_number}
            </div>
          </div>
        </div>

        <div className='line-6' style={{display:'flex', margin:'10px 16px 2px'}}>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Rate plan')}
            </div>
            <div className='no-overflow'>
              {this.state.rate_plan}
            </div>
          </div>
        </div>

        <div className='line-7' style={{display:'flex',  margin:'10px 16px 2px'}}>
          <div className='left-wrapper fixed'>
            <div className='field-header'>
              {t('Booking details')}
            </div>
            <div className='no-overflow'>
              {this.state.booking_detail}
            </div>
          </div>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('ZUZU room ID')}
            </div>
            <div className='no-overflow'>
              {this.state.zuzu_room_id}
            </div>
          </div>
        </div>    

        <Payment
          owed={81.48}
          settled={0.00}
          balance={81.48}
          currencySymbol={'$'}
        />

        <div className='note-card-container'>
          <NoteCard
            type='note'
            data={this.state.notes}
          />
          <NoteCard
            type='cancel_policy'
            data={this.state.cancel_policy}
          />
          <NoteCard
            type='modification_history'
            data={ this.state.modification_history}
          />
        </div>
      </div>
    </div>
    );
  }
}

export default EditBookingStatus;