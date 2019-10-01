import React, { Fragment } from "react"
import { withNamespaces } from 'react-i18next'

import PaymentCard from './PaymentCard'

class Payment extends React.Component {
  state = {
    payment_dropdown_active: false,
    show_payment_card: false,
  }

  componentDidMount = () => { 
    window.addEventListener('click', this.collapseDropdown)
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = (event) => {
    if( !event.target.matches('.fa-list-alt') )
      this.setState({ payment_dropdown_active: false })     
  }

  render() {
	const { t } = this.props
    return ( 
	    <Fragment>
		<div className='payment-section1'>
			<div>
				{t('Net room amount to hotel')}
			</div>
			<div>
				<div className='nrf-label'>{t('NRF')}</div>
				<div className={'payment-amount red clickable-dropdown-container ' + 
					(this.state.payment_dropdown_active && ' active')}>
					{this.props.balance}
					<i onClick={()=>this.setState( { payment_dropdown_active: !this.state.payment_dropdown_active} )}
						className='to-left fa fa-list-alt' />
					<div className='payment-breakdown dropdown-content'>
						<div className='flex'>
							<div className='width-116'>Date</div>
							<div className='width-94'>Amount</div>						
						</div>
						<div className='flex'>
							<div className='width-116'>26 Nov 2018</div>
							<div className='width-94'>$13.83</div>						
						</div>
						<div className='flex'>
							<div className='width-116'>27 Nov 2018</div>
							<div className='width-94'>$17.28</div>						
						</div>
						<div className='flex'>
							<div className='width-116'>28 Nov 2018</div>
							<div className='width-94'>$16.30</div>						
						</div>
						<div className='flex'>
							<div className='width-116'>29 Nov 2018</div>
							<div className='width-94'>$16.79</div>						
						</div>																								
					</div>
				</div>
			</div>
		</div>
		<div className='traveller-payments'>
			<div style={{display:'flex', justifyContent:'space-between'}}>
				<div className='black-header'>{t('Traveller payments')}</div>
				<i onClick={ ()=>this.setState( {show_payment_card: !this.state.show_payment_card } )}
					className='clickable fa fa-credit-card-alt' />
				{ this.state.show_payment_card && 
					<PaymentCard
						cardInfo={{
							number:1111222233334444, 
							name:'Hangakore Hariwana',
							expires:{
								hour: 47,
								min: 34,
							},
							validThru: '01/23'
						}}
					/>
				}
			</div>
			<div style={{display:'flex'}}>
				<div className='payment-detail'>
					<div className='payment-detail-header'>{t('Owed')}</div>
					<div className='payment-amount red'>{ this.props.currencySymbol + this.props.owed}</div>
				</div>
				<div className='payment-detail'>
					<div className='payment-detail-header'>{t('Settled')}</div>
					<div className='payment-amount'>{ this.props.currencySymbol + this.props.settled}</div>
				</div>
				<div className='payment-detail'>
					<div className='payment-detail-header'>{t('Balance')}</div>
					<div className='payment-amount red'>{ this.props.currencySymbol + (this.props.owed - this.props.settled) }</div>
				</div>						
			</div>		
		</div>
		</Fragment>
	)
  }
}

export default withNamespaces('translation')(Payment);