import React from "react"
import { withNamespaces } from 'react-i18next'

class PaymentCard extends React.Component {
	state = {
		cvv: 123,
		show_cvv: false,
	}

	requestCVV = () => {
		this.setState( {show_cvv: true} )
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
				{ this.insertHourAndMin( t('card_details_expire_in_x_hours_y_mins') ) }
				<div className='payment-card'>
					<div className='card-number'>
						{this.formatCreditCardNumber(this.props.cardInfo.number)}
					</div>
					<div className='card-name'>
						{this.props.cardInfo.name}
					</div>
					<div className='card-valid-thru'>
						{t('VALID THRU')}&nbsp;{this.props.cardInfo.validThru}
					</div>		
					<div className='payment-card-wtf'></div>			
				</div>
				<div className='flex '>
					<div className='cvv-container'>
						{ this.state.show_cvv && this.state.cvv}
						{ !this.state.show_cvv && <div className='cvv-number'></div>} 
					</div>
					<div>
						<div onClick={this.requestCVV}
							className='clickable cvv-button'>
							{t('Click to view CVV')}
						</div>
						<div>{t('you_have_x_of_y_available_views', {x:3, y:4})}</div>
					</div>
				</div>
			</div>
		)
  	}
}

export default withNamespaces('translation')(PaymentCard);