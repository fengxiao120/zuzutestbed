import React from "react"
import { withNamespaces } from 'react-i18next'

import EditBookingStatusApi from '../../api/EditBookingStatusApi'

class PaymentCard extends React.Component {
	state = {
		resend: false,
		cvv: 0,
		show_cvv: false,
		cvv_max_reached: false
	}

	requestCVV = () => {
		EditBookingStatusApi.getCVV()
		.then( response => {
			if(response.success)
				this.setState( {show_cvv: true, cvv: response.cvv} )
			else
				throw response
		})
		.catch( error => {
			this.setState( { cvv_max_reached: true } )
			console.log(error)
		})
		
	}

	insertHourAndMin = ( str ) => {
		const x_index= str.indexOf('<x>')
		const y_index= str.indexOf('<y>')
		const str1 = str.slice(0, x_index)
		const str2 = str.slice(x_index + 3, y_index)
		const str3 = str.slice(y_index + 3)
		return <div className='card-expires-in'>
				{str1}
				<span className='yellow-number'>{this.props.cardInfo.expires.hour}</span>
				{str2}
				<span className='yellow-number'>{this.props.cardInfo.expires.min}</span>
				{str3}
			</div>
	}

	formatCreditCardNumber = ( credit_card_number ) =>{
		credit_card_number = credit_card_number.toString()
		return credit_card_number.slice(0,4) + ' ' + credit_card_number.slice(4,8) + ' ' + credit_card_number.slice(8,12) + ' '
			+ credit_card_number.slice(12)
	}

  	render() {
		const { t } = this.props
		return ( 
			<div className='payment-card-container'>
				<div class='cancel-cross'>&times;</div>
				<div className='card-expires-in'>
					{t('OTP sent')}
				</div>
				<div className='payment-card'>
					<div className='flex'>
						<input className='OTP'/>
						<div className='submit-otp'
							onClick={this.submitOTP}>
							{t('Submit')}
						</div>
					</div>
					<div className='payment-card-wtf'></div>	
				</div>
				
				<div className='send-otp'><span onClick={this.sendOTP}>{t(this.state.resend?'Resend OTP':'Send OTP')}</span></div>
			</div>
		)
  	}
}

export default withNamespaces('translation')(PaymentCard);