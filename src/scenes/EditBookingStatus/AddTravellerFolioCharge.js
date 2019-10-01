import React from "react"
import { withNamespaces } from 'react-i18next'
import { validateNumberLimitDecimal } from '../../utils/Common'
import DatePicker from 'react-day-picker'

class AddTravellerFolioCharge extends React.PureComponent { //Also known as table1
  state = {
    description: '',
    charge_type: '',
    payment_date: new Date(),
    payment_note: '',
    base: '',
    tax_total: '',
    total: '',
    applicable_tax: [],
    tax_breakdown_dropdown: false
  }  

  componentDidMount = () => {
    window.addEventListener('click', this.collapseDropdown)
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown) 
  }

  collapseDropdown = ( event ) => {      
    if( !event.target.matches('.tax-breakdown, .tax-breakdown *'))
      this.setState( {tax_breakdown_dropdown: false} )
  }

  validateTravellerFolioCharge = () => {
    if(!this.state.description.trim()){
      this.props.showToast('error', 'Missing description field')
      return false
    } else if(!this.state.charge_type){
      this.props.showToast('error', 'Missing charge type field')
      return false
    } else if(!this.state.base){
      this.props.showToast('error', 'Missing base field')
      return false
    } else if(!this.state.total){
      this.props.showToast('error', 'Missing total field')
      return false
    } else
      return true
  }

  addTravellerFolioCharge = () => {  
  }

  onInputChange = ( e ) => {
    this.setState( { [e.target.name]: e.target.value} )
  }

  onNumberInputChange = ( e, changed_index ) => {
    if(validateNumberLimitDecimal(e.target.value)){
      if(e.target.name === 'base' ){
          const applicable_tax = this.state.applicable_tax.map( tax => {
            switch(tax.rate_type){
              case 'default':
                return {...tax, amount: e.target.value === ''?'': parseFloat(e.target.value)*parseFloat(tax.level)/100}
              default:
                return tax
            }
          })
          const tax_total = e.target.value === ''? '': this.calcTotalTax( parseFloat(e.target.value), applicable_tax)
          this.setState({
            base: e.target.value,
            applicable_tax: applicable_tax,
            tax_total: tax_total,
            total: e.target.value === ''? '': parseFloat(e.target.value) + tax_total
          })
      } else if(e.target.name === 'total'){
          const total = parseFloat(e.target.value)
          const percentage_sum = this.state.applicable_tax.filter( tax => tax.rate_type == 'default').reduce( (sum, tax) => sum + parseFloat(tax.level), 0 )
          const fixed_tax = this.state.applicable_tax.reduce( (sum, tax) => {
            switch(tax.rate_type){
              case 'per_room':
                return sum + parseFloat(tax.level)
              case 'per_room_night':
                return sum + parseFloat(tax.level)*this.props.numberOfNights
              default:
                return sum
            }
          }, 0)
          const base = e.target.value === '' || total < fixed_tax? '' : (total - fixed_tax)/(1 + percentage_sum/100)
          const applicable_tax = this.state.applicable_tax.map( tax => {
            switch(tax.rate_type){
              case 'default':
                return {...tax, amount: base === ''?'': base*parseFloat(tax.level)/100}
              default:
                return tax
            }
          })          
          this.setState({
            total: e.target.value,
            applicable_tax: applicable_tax,
            base: base,
            tax_total: base === ''? '': total - base
          })
      } else if(e.target.name === 'per_room'){
          console.log( e.target.value )
          const applicable_tax = this.state.applicable_tax.map( (tax, index) => {
              if(changed_index != index)
                return tax
              else
                return {...tax, level: e.target.value}
          })
          const tax_total = this.state.base === ''? '': this.calcTotalTax( parseFloat(this.state.base), applicable_tax)
          this.setState({
            applicable_tax: applicable_tax,
            tax_total: tax_total,
            total: tax_total === ''? '': parseFloat(this.state.base) + tax_total
          })
      } else if(e.target.name === 'per_room_night'){
          const applicable_tax = this.state.applicable_tax.map( (tax, index) => {
              if(changed_index != index)
                return tax
              else
                return {...tax, level: e.target.value}
          })
          const tax_total = this.state.base === ''? '': this.calcTotalTax( parseFloat(this.state.base), applicable_tax)
          this.setState({
            applicable_tax: applicable_tax,
            tax_total: tax_total,
            total: tax_total === ''? '': parseFloat(this.state.base) + tax_total
          })
      } else if(e.target.name === 'tax_percentage'){
          const applicable_tax = this.state.applicable_tax.map( (tax, index) => {
              if(changed_index != index)
                return tax
              else
                return {...tax, level: e.target.value, amount: this.state.base === '' ||  e.target.value === '' ? '': parseInt(this.state.base)*parseFloat(e.target.value)/100 }
          })
          const tax_total = this.state.base === ''? '': this.calcTotalTax( parseFloat(this.state.base), applicable_tax)
          this.setState({
            applicable_tax: applicable_tax,
            tax_total: tax_total,
            total: tax_total === ''? '': parseFloat(this.state.base) + tax_total
          })
      } else if(e.target.name === 'tax_amount'){
          const applicable_tax = this.state.applicable_tax.map( (tax, index) => {
              if(changed_index != index)
                return tax
              else
                return {...tax, amount: e.target.value, level: this.state.base === '' ||  e.target.value === '' ? '': parseFloat(e.target.value)*100/parseInt(this.state.base)}
          })
          const tax_total = this.state.base === ''? '': this.calcTotalTax( parseFloat(this.state.base), applicable_tax)
          this.setState({
            applicable_tax: applicable_tax,
            tax_total: tax_total,
            total: tax_total === ''? '': parseFloat(this.state.base) + tax_total
          })
      }
    }
  }

  onChargeTypeChange = ( e ) => {
    const { t } = this.props
    const new_charge_type_id = parseInt(e.target.value)
    const charge_type = this.props.chargeTypeTax.find( charge_type => charge_type.charge_type_id == new_charge_type_id )
    if( !charge_type )
      alert(t("There is some error"))
    else{
      const applicable_tax = charge_type.taxCollection.map( tax => {
        switch(tax.rate_type){
          case 'default':
            return {...tax, amount: this.state.base?parseFloat(this.state.base)*parseFloat(tax.level)/100: ''}
          default:
            return tax
        }
      })
      const tax_total = this.state.base? this.calcTotalTax( parseFloat(this.state.base), applicable_tax): ''
      this.setState( {
        charge_type: charge_type.charge_type_id,
        applicable_tax: applicable_tax,
        tax_total: tax_total,
        total: this.state.base? parseFloat(this.state.base) + tax_total : ''
      } )
    }
  }

  calcTotalTax = ( base, applicable_tax ) => {
    const total_tax = Math.round(applicable_tax.reduce( (sum, tax) => {
      switch(tax.rate_type){
        case 'default':
          return sum + tax.amount
        case 'per_room':
          return sum + parseFloat(tax.level)
        case 'per_room_night':
          return sum + parseFloat(tax.level)*this.props.numberOfNights
        default:
          return sum
      }
    }, 0)*100)/100
    return isNaN(total_tax)?'':total_tax
  }

  render() {
    const { t } = this.props
    return (
      <div style={{marginTop: 20}}>     
        <div className='flex between'>
          <div className='relative'>
            <span className='float-label z-index'>{t('Charge type')}<span className='asterisk'>*</span></span>
            <div style={{marginTop: 12, border: '1px solid #ddd', borderRadius: '5px', width: 166, position: 'relative', background:'#fff'}}>
              <span style={{color: '#337ab7', position: 'absolute', right: 20, top: 18, transform: 'scaleX(2.3)', fontSize: 7 }}
                className='dropdown-triangle'>▼</span>                
              <select ref={select => this.chargeType = select} 
                className='edit-field-x half' name="charge_type" value={this.state.charge_type} 
                style={{border: 'none', width: 166, marginTop: 0, position: 'relative', paddingRight: 33, background: 'transparent'}}
                onChange={this.onChargeTypeChange}>
                <option value=''>{t('select_a_charge_type')}</option>
                { Object.entries( this.props.chargeTypes || {} ).map( (item, index) => 
                  <option value={item[0]} key={index}>{item[1]}</option>
                )}
              </select>
            </div>
          </div>                   
        </div>

        <div className='flex between'>
          <div className='relative'>
            <span className='float-label'>{t('Base')}<span className='asterisk'>*</span></span>
            <input className='edit-field-x half' value={this.state.base} name='base' onChange={this.onNumberInputChange}>
            </input>
          </div>
          <div className='relative'>
            <span className='float-label z-index'>{t('Tax')}<span className='asterisk'>*</span></span>
            <div className={'edit-field-x half clickable-dropdown-container tax-breakdown ' + (this.state.tax_breakdown_dropdown && 'active')} 
              onClick={()=>this.setState({tax_breakdown_dropdown: true})} name='tax-breakdown'>
              {this.state.tax_total}&nbsp;
              <div className='dropdown-content'>
                { this.state.applicable_tax.map( (tax, index) => {
                  switch(tax.rate_type){
                    case 'per_room_night':
                      return ( <div className='tax-breakdown-line'>
                        <div>{tax.tax_name}</div>
                        <div className='flex between'>
                          <div className='flex'>
                            <div className='width-24'>{this.props.currencySymbol}</div>
                            <input value={tax.level} onChange={(e) => this.onNumberInputChange( e, index) } name='per_room_night'/>
                          </div>
                          <div className='flex'>
                            <div className='width-24'>{this.props.currencySymbol}</div>
                            <div style={{width: 56}}>{ Math.round(tax.level*this.props.numberOfNights*100)/100}</div>
                          </div>
                        </div>
                        <div style={{marginLeft: 24, fontSize: 9, color: '#65646d', lineHeight: '9px', marginTop: 2}}>{t('per night')}</div>
                      </div>);
                    case 'per_room':
                      return ( <div className='tax-breakdown-line'>
                        <div>{tax.tax_name}</div>
                        <div className='flex'>
                          <div className='width-24'>{this.props.currencySymbol}</div>
                          <input value={tax.level} onChange={(e) => this.onNumberInputChange( e, index) } name='per_room' />
                        </div>
                        <div style={{marginLeft: 24, fontSize: 9, color: '#65646d', lineHeight: '9px', marginTop: 2}}>{t('per room')}</div>
                      </div>);
                    case 'default':
                      return ( <div className='tax-breakdown-line'>
                        <div>{tax.tax_name}</div>
                        <div className='flex between'>
                          <div className='flex'>
                            <div className='width-24'>%</div>
                            <input value={tax.level} onChange={(e) => this.onNumberInputChange( e, index) } name='tax_percentage'/>
                          </div>
                          <div className='flex'>
                            <div className='width-24'>{this.props.currencySymbol}</div>
                            <input value={tax.amount} onChange={(e) => this.onNumberInputChange( e, index) } name='tax_amount'/>
                          </div>
                        </div>
                      </div>);
                    default:
                     return (<div></div>)  
                  }
                })}
              </div>
            </div>
          </div>                   
        </div>

        <div className='flex between'>
          <div className='relative'>
            <span className='float-label'>{t('Total')}<span className='asterisk'>*</span></span>
            <input className='edit-field-x' value={this.state.total} name='total' onChange={this.onNumberInputChange}>
            </input>
          </div>                   
        </div>

        <div className='flex'>
          <div className='save-traveller-payment clickable'
            onClick={this.addTravellerFolioCharge}>
            {t('Save')}
          </div>
          <div onClick={ this.props.cancel }
            className='blue clickable' style={{marginTop: 20, marginLeft:20}}>
            {t('Cancel')}
          </div>
        </div>              
      </div>
    )
  }
}

export default withNamespaces('translation')(AddTravellerFolioCharge)