import React from "react"

import { withNamespaces } from 'react-i18next'

import DatePicker from 'react-day-picker'
import Checkbox from '../../components/Checkbox'

import { formatCurrency, formatDate } from '../../utils/Format'

import 'react-day-picker/lib/style.css';
import AddTravellerFolioCharge from './AddTravellerFolioCharge'

const handleOnDragStart = e => e.preventDefault()

class TravellerPaymentCard extends React.Component {
  state = {
    charge_types: [],
    show_add_one_more_traveller_folio: true,
    charge_type_tax: [
      {charge_type_id: 2, taxCollection: [
        {level: 49, rate_type: "per_room_night", tax_id: 1, tax_name: "Government tax"}, 
        {level: 11, rate_type: "per_room", tax_id: 2, tax_name: "Service charge"},
      ]},
      {charge_type_id: 3, taxCollection: [
        {level: 49, rate_type: "per_room_night", tax_id: 1, tax_name: "Government tax"}, 
        {level: 1134160, rate_type: "per_room", tax_id: 2, tax_name: "Service charge"},
        {level: 7, rate_type: "default", tax_id: 3, tax_name: "Goods and Services Tax"},
      ]},
      {charge_type_id: 4, taxCollection: [
        {level: 49, rate_type: "per_room_night", tax_id: 1, tax_name: "Government tax"}, 
        {level: 11, rate_type: "per_room", tax_id: 2, tax_name: "Service charge"},
      ]},
      {charge_type_id: 5, taxCollection: [
        {level: 11, rate_type: "per_room", tax_id: 2, tax_name: "Service charge"},
      ]},
      {charge_type_id: 6, taxCollection: [
        {level: 49, rate_type: "per_room_night", tax_id: 1, tax_name: "Government tax"}, 
        {level: 11, rate_type: "per_room", tax_id: 2, tax_name: "Service charge"},
      ]},                                          
    ],

    traveller_folio: {
      breakdown: [
        {date: '26/10/18', desc: 'Room rate', charge_type: 'tax', amount: '12345678', tax_amount: '1345678'},
        {date: '27/10/18', desc: 'Room rate', charge_type: 'tax ', amount: '12345678', tax_amount: '1345678'},
        {date: '28/10/18', desc: 'Room rate', charge_type: 'tax', amount: '12345678', tax_amount: '1345678'},
      ],
      directly_owed_amount: 3291833
    },
    zuzu_room_id: '61015204608648',
    deposit: [
      {type: 'collect_deposit', amount: 33}, 
      {type: 'collect_deposit', amount: 34}, 
      {type: 'collect_deposit', amount: 35},
      {type: 'collect_deposit', amount: 36},
      {type: 'collect_deposit', amount: 37},
      {type: 'collect_deposit', amount: 38},
    ],
    deposit_type: 'collect_deposit',

    payment_user: 'anton@zuzuhs.com',
    traveller_payment_not_refund: true,
    traveller_payment_amount: '',

    close_balanced_bill: true,

    currentIndex: 0,
    itemsInSlide: 3,

    tfna_payment_date_dropdown: false,

    show_message: true
  }

  componentDidMount = () => {
    window.addEventListener('click', this.collapseDropdown)
    this.getChargeTypes()
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = ( event ) => {      
    if( !event.target.matches('.tfna-payment-date, .tfna-payment-date *'))
      this.setState( {tfna_payment_date_dropdown: false} )
  }

  save = () => {
    alert('Saved')
    // EditBookingStatusApi.updateTravellerDetail({
    //   first_name: this.state.first_name,
    //   last_name: this.state.last_name,
    //   email: this.state.email,
    //   passport: this.state.passport,
    //   country: this.state.country,
    //   mobile: this.state.mobile,
    // })
    // .then( response => {
    //   if(response.success)
    //     console.log('success')
    //   else
    //     throw response
    // })
    // .catch( error => {
    //   console.log(error)
    // })    
  }

  getChargeTypes = () => {
    const charge_types = [{id: '', name: 'Select a charge type'},{id: 5, name: 'Concierge charge'}, {id: 6, name: 'Front-desk charge'}, 
      {id: 4, name: 'Housekeeping charge'}, {id: 2, name: 'In-room F&B charge'}, {id: 7, name: 'Other charge'}, 
      {id: 3, name: 'Restaurant F&B charge'}, {id: '8', name: 'Room cancellation charge'}, {id: 1, name: 'Room charge'}, ]

    this.setState( {charge_types: charge_types} )
  }

  saveTravellerPayment = () => {
    alert('saveTravellerPayment')
  }

  onInputChange = ( e ) => {
    this.setState( { [e.target.name]: e.target.value} )
  }

  handleDayClick = ( selected_day ) => {
    this.setState( {tfna_payment_date: selected_day, tfna_payment_date_dropdown: false } ) 
  }

  depositTypeChange = ( e ) => {
    this.setState( { deposit_type: e.target.getAttribute('name') } )
  }

  slidePrevPage = () => {
    const currentIndex = this.state.currentIndex - this.state.itemsInSlide
    this.setState({ currentIndex })
  }

  slideNextPage = () => {
    const { itemsInSlide, galleryItems: { length }} = this.state
    let currentIndex = this.state.currentIndex + itemsInSlide
    if (currentIndex > length) currentIndex = length

    this.setState({ currentIndex })
  }

  handleOnSlideChange = (event) => {
    const { itemsInSlide, item } = event
    this.setState({ itemsInSlide, currentIndex: item })
  }

  sendEmail = () => {
    alert('Sending email to ' + this.state.traveller_emails)
  }

  checkout = () => {
    alert('Checking out with ' + (this.state.close_balanced_bill?'close balanced bill':'unclosed balanced bill'))
  }

  render() {
    const { t } = this.props
    return ( 
      <React.Fragment>
      <div className='traveller-details-container'>
        <div style={{textAlign:'right'}}>
          <span className='close-cross clickable' onClick={this.props.onClose}>&times;</span>
        </div>
        <div className='black-header'>{t('Traveller folio')}</div>
        <div className='flex-between clickable' style={{marginTop: 10}}>
          <div>{this.props.zuzuRoomId}</div>
          <div className='blue' onClick={()=>this.setState({ show_email_field: true })}>
            <i className='fa fa-envelope-o' style={{marginRight: 6}}/>
            {t('Email to traveller')}
          </div>
        </div>

        { this.state.show_email_field && 
          <div style={{marginBottom: 24}}>
            <textarea 
              className='edit-field-x'
              onChange={(e)=>this.setState({traveller_emails: e.target.value})} 
              rows="5" 
              style={{resize: 'vertical', padding: 8}}
              placeholder={t('Traveller email') + '*'}
            >
            </textarea>
            <div className='flex'>
              <div className='checkout-button clickable'
                onClick={this.sendEmail}>
                {t('Send email')}
              </div>
              <div onClick={ ()=>this.setState({ show_email_field: false }) }
                class='blue clickable' style={{marginTop: 20, marginLeft:20}}>
                {t('Cancel')}
              </div>
            </div>
          </div>
        }

        <div className='flex gray traveller-folio-headers' >
          <div className='width-60' >{t('Dates')}</div>
          <div className='width-116' >{t('Description')}</div>
          <div className='width-94' >{t('Charge type')}</div>
          <div className='width-70 right-align' >{t('Amount')}</div>
        </div>
        { this.state.traveller_folio.breakdown.map( (charge, index) => 
          <div key={index} className='flex' style={{ borderBottom: '1px solid #dadada', padding: '8px 0 6px' }}>
            <div className='width-60'>{charge.date}</div>
            <div className='width-116'>
              <div>{charge.desc}</div>
              <div class='size-10 gray'>{t('tax')}</div>
            </div>
            <div className='width-94'>{charge.charge_type}</div>
            <div className='width-70 right-align'>
              <div dangerouslySetInnerHTML={{__html: formatCurrency(charge.amount, this.props.countryCode, '') }}></div>
              <div class='size-10 gray' dangerouslySetInnerHTML={{__html: formatCurrency(charge.tax_amount, this.props.countryCode , '') }}></div>
            </div>
          </div>
        )}      
        <div className='flex-between traveller-folio-direct-owe'>
          <div className='width-250 right-align' style={{fontWeight: 500}}>{t('Traveller folio balance')}</div>
          <div className='black-header' dangerouslySetInnerHTML={{__html: formatCurrency(this.state.traveller_folio.directly_owed_amount, this.props.countryCode, '') }}></div>          
        </div>

        <div className='hidden'>***********************************add one more traveller folio********************************************</div>
        { !this.state.show_add_one_more_traveller_folio && 
          <div className='right-align'>
            <div className='add-one-more-button' onClick={()=>this.setState({show_add_one_more_traveller_folio: true})}>
              +
            </div>
          </div>        
        }
        { this.state.show_add_one_more_traveller_folio && 
          <AddTravellerFolioCharge
            chargeTypes={{2: "In-room F&B charge", 3: "Restaurant F&B charge", 4: "Housekeeping charge", 5: "Concierge charge", 6: "Front-desk charge"}}
            chargeTypeTax={this.state.charge_type_tax}
            numberOfNights={3}
            currencySymbol={'AUD'}
            cancel={()=>this.setState({ show_add_one_more_traveller_folio: false })}
          />          
        }

        <div className='spacer-1'>**************************************Payment****************************************************************</div>


        <div className='black-header'>{t('Payment')}</div>
        <div className='gray'>{t('User')}&nbsp;{this.state.payment_user}</div>

        <div className='inline-block'>
          <div className='selection-tab-container'>
            <div onClick={()=> this.setState({traveller_payment_not_refund: true})}
              className={'selection-tab ' + (this.state.traveller_payment_not_refund&&'in-focus')}>
              {t('Traveller payment')}
            </div>            
            <div onClick={()=> this.setState({traveller_payment_not_refund: false})}
              className={'selection-tab ' + (!this.state.traveller_payment_not_refund&&'in-focus')}>
              {t('Traveller refund')}
            </div>
          </div>
        </div>

        <div style={{marginTop:12}}>       
          <i className='clickable fa fa-credit-card-alt' />
          <span className='blue payment-details'>{t('Payment details')}</span>
        </div>

        <div className='relative'>
          <span className='float-label'>{t('Traveller amount to be paid now')}<span className='asterisk'>*</span></span>
          <input className='edit-field-x' value={this.state.traveller_payment_amount} name='traveller_payment_amount' onChange={this.onInputChange}>
          </input>
        </div>

        <div className='flex-between'>
          <div className='relative'>
            <span className='float-label'>{t('Payment date')}<span className='asterisk'>*</span></span>
            <input className='edit-field-x half' value={this.state.payment_date} name='payment_date' onChange={this.onInputChange}>
            </input>
          </div>
          <div className='relative'>
            <span className='float-label'>{t('Payment method')}</span>
            <input className='edit-field-x half' value={this.state.payment_method} name='payment_method' onChange={this.onInputChange}>
            </input>
          </div>                   
        </div>   

        <div className='relative'>
          <span className='float-label'>{t('Payment note')}</span>
          <textarea className='edit-field-x' name="payment_note" rows="5" onChange={this.onInputChange} style={{resize: 'vertical'}}></textarea>
        </div> 

        <div className='save-traveller-payment' onClick={this.saveTravellerPayment}>
          {t('Save')}
        </div>


        <div className='spacer-1'>************************************Deposit******************************************************************</div>


        <div className='black-header'>{t('Deposit')}</div>
        <div className='gray'>{t('User')}&nbsp;{this.state.payment_user}</div>

        <div className='carousel-container'>
          <div className='flex-between deposit-item-container'>
            { this.state.deposit.map( deposit_item => 
              <div className='deposit-q flex'>
                <div className='deposit-q-col'>
                  <div className='blue'>
                    {t('Deposit date')}
                  </div>
                  <div>
                    {t('Amount deposited')}
                  </div>
                </div>
                <div className='deposit-q-values'>
                  <div>
                    {'09 Nov 2018'}
                  </div>
                  <div>
                    {deposit_item.amount}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex'>
          { [{name:'collect_deposit', text: 'Collecting a deposit'}, {name:'refund_deposit', text: 'Refunding a deposit'}, 
            {name:'offset_charge', text: 'Offset charges'}].map( (item, index) => 
              <div className='deposit-type flex'>
                <div onClick={this.depositTypeChange} name={item.name} key={index}
                  class={this.state.deposit_type===item.name?'radio-x active':'radio-x'}>
                  <div name={item.name} class='radio-x-inner'>
                  </div>
                </div>
                <span className='deposit-type-label'>
                  {t(item.text)}
                </span>            
              </div>
          )}          
        </div>

        <div className='relative'>
          <span className='float-label'>{t('Traveller amount to be paid now')}<span className='asterisk'>*</span></span>
          <input className='edit-field-x' value={this.state.traveller_payment_amount} name='traveller_payment_amount' onChange={this.onInputChange}>
          </input>
        </div>

        <div className='flex-between'>
          <div className='relative'>
            <span className='float-label'>{t('Payment date')}<span className='asterisk'>*</span></span>
            <input className='edit-field-x half' value={this.state.payment_date} name='payment_date' onChange={this.onInputChange}>
            </input>
          </div>
          <div className='relative'>
            <span className='float-label'>{t('Payment method')}</span>
            <input className='edit-field-x half' value={this.state.payment_method} name='payment_method' onChange={this.onInputChange}>
            </input>
          </div>                   
        </div>   

        <div className='relative'>
          <span className='float-label'>{t('Payment note')}</span>
          <textarea className='edit-field-x' name="payment_note" rows="5" onChange={this.onInputChange} style={{resize: 'vertical'}}></textarea>
        </div> 

        <div className='save-traveller-payment' onClick={this.saveTravellerPayment}>
          {t('Save')}
        </div>   

        <div className='complete-checkout-section'>
          <div className='black-header'>{t('Complete check-out')}</div>

          <div className='flex vertical-center' style={{marginTop: 12}}>
            <Checkbox
              checked={ this.state.close_balanced_bill }
              onClick={ ()=>this.setState({close_balanced_bill: true} ) }
            />
            <span className="width-116" style={{marginLeft:6}}>{t('Close balanced bill ')}</span>
            <Checkbox
              checked={ !this.state.close_balanced_bill }
              onClick={ ()=>this.setState({close_balanced_bill: false} ) }
            />
            <span className="width-116" style={{marginLeft:6}}>{t('Check-out with unbalanced bill')}</span>
          </div>  

          <div className='checkout-button clickable'
            onClick={this.checkout}>
            {t('Check-out')}
          </div>
        </div>

        <div className='spacer-2'></div>        
      </div>
      { this.state.show_message && <div className='traveller-details-container' style={{background:'rgba(0,0,0, 0.7)', textAlign:'center', border: 'none', boxShadow: 'none', zIndex: 2  }}>
          <div style={{padding: "30px 12px", margin: "20px 12px", background: 'white'}}>
            <div>{'No available inventory for the exact same room'}</div>
            <div>{'Room 5.1 is not available on ‘<3 September 2019>’ and ‘<4 September 2019>’ Guest will be allocated to room 5.3 for these nights.'}</div>
            <button className='submit-button' style={{ width: 264, marginTop: 16 }}>
              {t('Proceed')}
            </button>
            <div>
              <div class='clickable' style={{marginTop: 20, color: 'rgb(51, 122, 183)', display: 'inline-block'}}
                onClick={()=>this.setState({show_message: false})}>
                {t('Cancel')}
              </div>
            </div>
          </div>      
        </div>
      }
      </React.Fragment>
    )
  }
}

export default withNamespaces('translation')(TravellerPaymentCard);