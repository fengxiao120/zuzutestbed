import React from "react"
import { withNamespaces } from 'react-i18next'

import EditBookingStatusApi from '../../api/EditBookingStatusApi'

import Header from './Header'
import Status from './Status'
import Payment from './Payment'
import NoteCard from './NoteCard'
import TravellerDetails from './TravellerDetails'
import TravellerPaymentCard from './TravellerPaymentCard'

import Spinner from '../../components/Spinner'

import './EditBookingStatus.css'
import { formatTime, calcDayDiff, formatDate } from '../../utils/Format'

class EditBookingStatus extends React.Component {
  state = {
    loading: false,   
    tab: 'one-click-check-in',
    modification_history: [
      {
        modified_by: 'Front Desk',
        modified_at: '2019-02-01 16:22:30',
        changed_field: 'Room type',
        before_change: 'Room type A',
        after_change: 'Room type B',
      }
    ],

    cancelled: false,
    no_show: false,
    payment_settled: true,

    show_edit_traveller_detail: false,
    show_edit_traveller_payment: true,
  }

  loading = false

  componentDidMount = () => { 
    window.addEventListener('click', this.collapseDropdown)
    //this.getSmallCardData()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = ( event ) => {      
    if( !event.target.matches('.fa-print'))
      this.setState( {print_dropdown_active: false} )
    if( !event.target.matches('#contact-dropdown'))
      this.setState( {contact_dropdown_active: false} )    
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

  noShow = ()=>this.setState({no_show: true})

  cancelBooking = () => {
    this.setState({loading: true})
    EditBookingStatusApi.updateBookingStatus ({
      status: 'cancel',
    })
    .then( response => {
      if(response.success){
        this.setState({ cancelled: true, loading: false })
      }
      else
        throw response
    })
    .catch( error => {
      this.setState({ loading: false })
      console.log(error)
      alert('Error')
    })    
  } 

  revertToConfirm = ()=>this.setState( {no_show: false, cancelled: false, tab: 'one-click-check-in'} )

  closeCancelOrNoShow = ()=>this.setState({tab: 'one-click-check-in'})



  showEditTravellerDetails = () => this.setState({ show_edit_traveller_detail: true })

  showEditTravellerPayment = () => this.setState({ show_edit_traveller_payment: true })

  render() {
    console.log('rendering')
    const { t, bookingDetails } = this.props
    return (
    <div className='ebs-card'>
      <div className='popup-cancel clickable' onClick={this.props.onCancel}>
        &times;
      </div>

      <Spinner
        loading={this.state.loading}
        local={true}
      /> 

      <Header 
        tab={this.state.tab}
        onClick={ ( tab )=>this.setState( {tab: tab} ) }
        noShowDisabled={false}
        cancelBookingDisable={false}
      />

      <div className='ebs-card-content'>
        { (this.state.tab =='cancel-booking' || this.state.tab =='no-show') && !this.state.cancelled && !this.state.no_show &&
          <div className={'ebs-card-content-overlay ' + (!this.state.payment_settled && 'with-payment')}>
            <div className='container1'>
              <div className='black-header'>
                {t(this.state.tab =='cancel-booking'?'Cancel booking':'No show')}
              </div>
              <div className='text1'>
                {t(this.state.tab =='cancel-booking'?
                  "Cancel booking text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy ":
                  "No show text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy ")}
              </div>
              <div className='flex'>
                <div className={'submit-button ' + (this.state.tab =='cancel-booking'?'red':'blue')}
                  onClick={ this.state.tab =='cancel-booking'?this.cancelBooking:this.noShow }>
                  {t('Confirm')}
                </div>
                <div className='cancel-button'
                  onClick={ this.closeCancelOrNoShow }>
                  {t('Cancel')}
                </div>              
              </div>                              
            </div>            
          </div>
        }

        { (this.state.cancelled || this.state.no_show) && 
          <div className={'ebs-card-content-overlay ' + (!this.state.payment_settled && 'with-payment')}>
            <div className='container1'>
              <div className='cancelled-booking'>
                {t(this.state.cancelled?'Cancelled booking':'No show')} ({formatTime(new Date())})
              </div>
              <div className='text2'>
                <span onClick={this.revertToConfirm}>
                {t("Revert to 'Confirmed'")}
                </span>
              </div>                              
            </div>
          </div>
        }

        <Status
          acknowledgementStatus={bookingDetails.acknowledgement_status}
          status={bookingDetails.booking_status}
          statusHistory={[]}
          acknowledgementHistory={[]}
        />

        <div className='line-1' style={{display:'flex', justifyContent:'space-between', margin:'10px 16px 2px'}}>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Channel booking ID')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.channel_booking_id}
            </div>
          </div>
          <div className={'clickable-dropdown-container ' + (this.state.print_dropdown_active && 'active')} 
            style={{color: '#337ab7', paddingRight:10, lineHeight: '20px'}}>
            <i className='clickable to-left fa fa-envelope-o'/>
            <i className='clickable to-left-l fa fa-print'
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
            {bookingDetails.traveller_first_name}&nbsp;{bookingDetails.traveller_last_name}
          </div>
          <span className={'clickable-dropdown-container  clickable edit-buttom ' + (this.state.edit_dropdown && ' active') } 
            style={{color: '#337ab7', paddingRight:10}}
            onClick={()=>this.setState({ edit_dropdown: !this.state.edit_dropdown })}>
            <i className='to-right-s fa fa-pencil' />{t('Edit')}

            <div className='print dropdown-content'>
              <div className='light-blue-hover'
                onClick={this.showEditTravellerDetails}>
                {t('Traveller details')}
              </div>
              <div className='light-blue-hover'
                onClick={this.showEditTravellerPayment}>
                {t('Traveller payment')}
              </div>
            </div>

          </span>
          { this.state.show_edit_traveller_detail &&
            <TravellerDetails 
              countryList={ this.state.country_list }
              firstName={ bookingDetails.traveller_first_name }
              lastName={ bookingDetails.traveller_last_name }
              email={ bookingDetails.traveller_email }
              passport={ bookingDetails.traveller_id }
              country={ bookingDetails.traveller_country_code }
              contactNumber={ bookingDetails.traveller_contact_number }
              onClose={()=>this.setState({ show_edit_traveller_detail: false })}
            />
          }
          { this.state.show_edit_traveller_payment &&
            <TravellerPaymentCard
              zuzuRoomId={ bookingDetails.zuzu_room_id }
              countryCode={ bookingDetails.country_code }
              onClose={()=>this.setState({ show_edit_traveller_payment: false })}
            />
          }

        </div>

        <div className='line-3' style={{display:'flex', margin:'4px 16px', alignItems:'center'}}>
          <div className='stay-range' style={{}}>
             <i className='to-right fa fa-calendar' />
             {formatDate( new Date(bookingDetails.check_in_date.slice(0, 10) ) ) + formatDate( new Date(bookingDetails.check_out_date.slice(0, 10)), '', ' - ' )}
          </div>
          <span style={{ marginLeft:15}}>
            <i className='to-right-s fa fa-moon-o' />
            {calcDayDiff(new Date(bookingDetails.check_out_date.slice(0, 10)), new Date(bookingDetails.check_in_date.slice(0, 10)))}
          </span>
          <span style={{ marginLeft:15}}>
            <i className='to-right-s fa fa-user' />
            {bookingDetails.guest_count}
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
                  {bookingDetails.traveller_email}
                </div>
                <div className='contact-header'
                  onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: false} ) }}>
                  Phone number
                </div>
                <div onClick={()=>{ this.setState( {contact_dropdown_active: false, contact_use_email: false} ) }}>
                  {bookingDetails.traveller_contact_number || 'N/A'}
                </div>                                
              </div>
            </div>
            <div className='no-overflow'>
              { this.state.contact_use_email?bookingDetails.traveller_email:bookingDetails.traveller_contact_number }
            </div>
          </div>
          <div className='left-wrapper fixed-right'>
            <div className='field-header'>
              {t('Passport/ID')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.traveller_id}
            </div>
          </div>
        </div>

        <div className='line-5' style={{display:'flex', margin:'10px 16px 2px'}}>
          <div className='left-wrapper fixed'>
            <div className='field-header'>
              {t('Room type')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.room_type}
            </div>
          </div>
          <div className='left-wrapper fixed-right'>
            <div className='field-header'>
              {t('Room')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.room_number}
            </div>
          </div>
        </div>

        <div className='line-6' style={{display:'flex', margin:'10px 16px 2px'}}>
          <div className='left-wrapper'>
            <div className='field-header'>
              {t('Rate plan')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.rate_plan}
            </div>
          </div>
        </div>

        <div className='line-7' style={{display:'flex',  margin:'10px 16px 2px'}}>
          <div className='left-wrapper fixed'>
            <div className='field-header'>
              {t('Booking details')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.booking_detail}
            </div>
          </div>
          <div className='left-wrapper fixed-right'>
            <div className='field-header'>
              {t('ZUZU room ID')}
            </div>
            <div className='no-overflow'>
              {bookingDetails.zuzu_room_id}
            </div>
          </div>
        </div>    

        <Payment
          owed={81.48}
          settled={0.00}
          currencySymbol={'$'}
        />

        <div className='note-card-container'>
          <NoteCard
            type='note'
            data={bookingDetails.notes}
          />
          <NoteCard
            type='cancel_policy'
            data={bookingDetails.cancel_policy}
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

export default withNamespaces('translation')(EditBookingStatus);