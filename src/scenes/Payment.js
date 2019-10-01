import React from "react"

import Navigation from '../components/Navigation'
import EmailPopup from '../components/EmailPopup'

import EditBookingStatus from '../scenes/EditBookingStatus'


import Color from '../Color'

const t = str => str

class Payment extends React.Component {
  state = {
    show_edit_booking_status: true,
    show_email_popup: false,  
    emails: [{type: 'Hotel manager', email: 'hotelmanager@gmail.com', checked: true}, 
            {type: 'Back office', email: 'backoffice1@gmail.com', checked: false}, 
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false}, 
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk', email: 'frontdesk1@gmail.com', checked: false},
            {type: 'Hotel frontdesk limited', email: 'frontdesklimited1@gmail.com', checked: false},],           
  }

  render() {
    console.log('rendering')
    return (
    <div style={{display:'flex'}}>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Payments'
    		path={'/payments'}
    	/>
    	<div className="App"
        style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  		  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
          textAlign:'center', height:140, borderBottom:'2px solid #ddd',
          background:'#def', fontFamily: "Raleway Webfont",}}>
          This is R&A
  			</div>
        <div style={{padding: '18px 36px', color:'white'}}>
          <div style={{whiteSpace:'pre'}}>{t("Once you are happy with all of the ‘Recommended sell rates’ and the ‘Required BAR \
          to deliver recommended sell rates’ prices, please submit the price changes,\nand they will update the ‘Rates and avail\
          ability>Calendar’ and be passed to the channels")}</div>
          <button onClick={()=>this.setState({show_email_popup: true})}
            style={{background:Color.orange, color:'white', padding:'10px 20px', border:'none', fontSize:16, borderRadius:5, marginTop:15, marginRight: 15}}>
            {t('Submit price changes')}
          </button>
          <button onClick={()=>this.setState({show_edit_booking_status: true})}
            style={{background:Color.orange, color:'white', padding:'10px 20px', border:'none', fontSize:16, borderRadius:5, marginTop:15}}>
            {t('Bring up edit booking status')}
          </button>
        </div>

        {this.state.show_email_popup && ( 
          <EmailPopup
            hotelSlug='zuzu-blok-m-plaza'
            emails={this.state.emails}
            confirm={(emails)=>console.log(emails)}
            cancel={()=>this.setState({show_email_popup:false})}
          />
        )}
        { this.state.show_edit_booking_status && 
          <EditBookingStatus 
            bookingDetails={{
              acknowledgement_status: "unacknowledged",
              booking_detail: "Booking.com-12546284565-12546284565",
              booking_status: "confirmed",
              cancel_policy: {
                cancel_policy: "TestAutomationCancellationPolicy", 
                cancel_status: "Refundable", 
                remarks: "test automation cancellation policy", 
                no_show_policy: "Follow cancellation policy"
              },
              channel_booking_id: "1236547854",
              check_in_date: "2019-04-07 00:00:00",
              check_out_date: "2019-04-10 00:00:00",
              guest_count: 2,
              notes: [],
              owed: "0.00",
              owed_formatted: "0",
              room_number: "123-12546284565-12546284565",
              rate_plan: "Room only-12546284565-12546284565",
              room_type: "Anggrek Room-12546284565-12546284565",
              room_type_id: 91,
              settled: 0,
              settled_formatted: "0",
              country_code:'ID',
              traveller_contact_number: "+00 0124578963-12546284565",
              traveller_email: "gayana.p@eyepax.com",
              traveller_id: "251478963-12546284565-12546284565",
              traveller_first_name: "prasanna",
              traveller_last_name: "777 zero",
              zuzu_room_id: "12546284565-12546284565-01",        
            }}
            onCancel={()=>this.setState({ show_edit_booking_status: false })}
          />
        }
		  </div>
    </div>
    );
  }
}

export default Payment;