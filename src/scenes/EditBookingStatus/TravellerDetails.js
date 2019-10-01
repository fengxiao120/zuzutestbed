import React from "react"
import { withNamespaces } from 'react-i18next'

import EditBookingStatusApi from '../../api/EditBookingStatusApi'
import ZuzuSelect from '../../components/ZuzuSelect'

class TravellerDetails extends React.Component {
	state = {
		cvv: 0,
		show_cvv: false,
		cvv_max_reached: false,
		country_dropdown_active: false,
		country_list: [{value:'AF', label:'Afghanistan'}, {value:'AX', label:'Aland Islands'}, {value:'AL', label:'Albania'}, {value:'DZ', label:'Algeria'}, {value:'AS', label:'American Samoa'}, {value:'AD', label:'Andorra'}, {value:'AO', label:'Angola'}, {value:'AI', label:'Anguilla'}, {value:'AG', label:'Antigua and Barbuda'}, {value:'AR', label:'Argentina'}, {value:'AM', label:'Armenia'}, {value:'AW', label:'Aruba'}, {value:'AU', label:'Australia'}, {value:'AT', label:'Austria'}, {value:'AUT', label:'Automation Country'}, {value:'AZ', label:'Azerbaijan'}, {value:'BS', label:'Bahamas'}, {value:'BH', label:'Bahrain'}, {value:'BD', label:'Bangladesh'}, {value:'BB', label:'Barbados'}, {value:'BY', label:'Belarus'}, {value:'BE', label:'Belgium'}, {value:'BZ', label:'Belize'}, {value:'BJ', label:'Benin'}, {value:'BM', label:'Bermuda'}, {value:'BT', label:'Bhutan'}, {value:'BO', label:'Bolivia'}, {value:'BQ', label:'Bonaire, Saint Eustatius and Saba '}, {value:'BA', label:'Bosnia and Herzegovina'}, {value:'BW', label:'Botswana'}, {value:'BV', label:'Bouvet Island'}, {value:'BR', label:'Brazil'}, {value:'IO', label:'British Indian Ocean Territory'}, {value:'VG', label:'British Virgin Islands'}, {value:'BN', label:'Brunei'}, {value:'BG', label:'Bulgaria'}, {value:'BF', label:'Burkina Faso'}, {value:'BI', label:'Burundi'}, {value:'KH', label:'Cambodia'}, {value:'CM', label:'Cameroon'}, {value:'CA', label:'Canada'}, {value:'CV', label:'Cape Verde'}, {value:'KY', label:'Cayman Islands'}, {value:'CF', label:'Central African Republic'}, {value:'TD', label:'Chad'}, {value:'CL', label:'Chile'}, {value:'CN', label:'China'}, {value:'CX', label:'Christmas Island'}, {value:'CC', label:'Cocos Islands'}, {value:'CO', label:'Colombia'}, {value:'KM', label:'Comoros'}, {value:'CK', label:'Cook Islands'}, {value:'CR', label:'Costa Rica'}, {value:'HR', label:'Croatia'}, {value:'CU', label:'Cuba'}, {value:'CW', label:'Curacao'}, {value:'CY', label:'Cyprus'}, {value:'CZ', label:'Czech Republic'}, {value:'CD', label:'Democratic Republic of the Congo'}, {value:'DK', label:'Denmark'}, {value:'DJ', label:'Djibouti'}, {value:'DM', label:'Dominica'}, {value:'DO', label:'Dominican Republic'}, {value:'TL', label:'East Timor'}, {value:'EC', label:'Ecuador'}, {value:'EG', label:'Egypt'}, {value:'SV', label:'El Salvador'}, {value:'GQ', label:'Equatorial Guinea'}, {value:'ER', label:'Eritrea'}, {value:'EE', label:'Estonia'}, {value:'ET', label:'Ethiopia'}, {value:'FK', label:'Falkland Islands'}, {value:'FO', label:'Faroe Islands'}, {value:'FJ', label:'Fiji'}, {value:'FI', label:'Finland'}, {value:'FR', label:'France'}, {value:'GF', label:'French Guiana'}, {value:'PF', label:'French Polynesia'}, {value:'TF', label:'French Southern Territories'}, {value:'GA', label:'Gabon'}, {value:'GM', label:'Gambia'}, {value:'GE', label:'Georgia'}, {value:'DE', label:'Germany'}, {value:'GH', label:'Ghana'}, {value:'GI', label:'Gibraltar'}, {value:'GR', label:'Greece'}, {value:'GL', label:'Greenland'}, {value:'GD', label:'Grenada'}, {value:'GP', label:'Guadeloupe'}, {value:'GU', label:'Guam'}, {value:'GT', label:'Guatemala'}, {value:'GG', label:'Guernsey'}, {value:'GN', label:'Guinea'}, {value:'GW', label:'Guinea-Bissau'}, {value:'GY', label:'Guyana'}, {value:'HT', label:'Haiti'}, {value:'HM', label:'Heard Island and McDonald Islands'}, {value:'HN', label:'Honduras'}, {value:'HK', label:'Hong Kong'}, {value:'HU', label:'Hungary'}, {value:'IS', label:'Iceland'}, {value:'IN', label:'India'}, {value:'ID', label:'Indonesia'}, {value:'IR', label:'Iran'}, {value:'IQ', label:'Iraq'}, {value:'IE', label:'Ireland'}, {value:'IM', label:'Isle of Man'}, {value:'IL', label:'Israel'}, {value:'IT', label:'Italy'}, {value:'CI', label:'Ivory Coast'}, {value:'JM', label:'Jamaica'}, {value:'JP', label:'Japan'}, {value:'JE', label:'Jersey'}, {value:'JO', label:'Jordan'}, {value:'CAN', label:'Kanada'}, {value:'KZ', label:'Kazakhstan'}, {value:'KE', label:'Kenya'}, {value:'KI', label:'Kiribati'}, {value:'XK', label:'Kosovo'}, {value:'KW', label:'Kuwait'}, {value:'KG', label:'Kyrgyzstan'}, {value:'LA', label:'Laos'}, {value:'LV', label:'Latvia'}, {value:'LB', label:'Lebanon'}, {value:'LS', label:'Lesotho'}, {value:'LR', label:'Liberia'}, {value:'LY', label:'Libya'}, {value:'LI', label:'Liechtenstein'}, {value:'LT', label:'Lithuania'}, {value:'LU', label:'Luxembourg'}, {value:'MO', label:'Macao'}, {value:'MK', label:'Macedonia'}, {value:'MG', label:'Madagascar'}, {value:'MW', label:'Malawi'}, {value:'MY', label:'Malaysia'}, {value:'MV', label:'Maldives'}, {value:'ML', label:'Mali'}, {value:'MT', label:'Malta'}, {value:'MH', label:'Marshall Islands'}, {value:'MQ', label:'Martinique'}, {value:'MR', label:'Mauritania'}, {value:'MU', label:'Mauritius'}, {value:'YT', label:'Mayotte'}, {value:'MX', label:'Mexico'}, {value:'FM', label:'Micronesia'}, {value:'MD', label:'Moldova'}, {value:'MC', label:'Monaco'}, {value:'MN', label:'Mongolia'}, {value:'ME', label:'Montenegro'}, {value:'MS', label:'Montserrat'}, {value:'MA', label:'Morocco'}, {value:'MZ', label:'Mozambique'}, {value:'MM', label:'Myanmar'}, {value:'NA', label:'Namibia'}, {value:'NR', label:'Nauru'}, {value:'NP', label:'Nepal'}, {value:'NPL', label:'Nepal'}, {value:'NL', label:'Netherlands'}, {value:'NC', label:'New Caledonia'}, {value:'NZ', label:'New Zealand'}, {value:'NI', label:'Nicaragua'}, {value:'NE', label:'Niger'}, {value:'NG', label:'Nigeria'}, {value:'NU', label:'Niue'}, {value:'NF', label:'Norfolk Island'}, {value:'KP', label:'North Korea'}, {value:'MP', label:'Northern Mariana Islands'}, {value:'NO', label:'Norway'}, {value:'OM', label:'Oman'}, {value:'PK', label:'Pakistan'}, {value:'PW', label:'Palau'}, {value:'PS', label:'Palestinian Territory'}, {value:'PA', label:'Panama'}, {value:'PG', label:'Papua New Guinea'}, {value:'PY', label:'Paraguay'}, {value:'PE', label:'Peru'}, {value:'PH', label:'Philippines'}, {value:'PN', label:'Pitcairn'}, {value:'PL', label:'Poland'}, {value:'PT', label:'Portugal'}, {value:'PR', label:'Puerto Rico'}, {value:'QA', label:'Qatar'}, {value:'CG', label:'Republic of the Congo'}, {value:'RE', label:'Reunion'}, {value:'RO', label:'Romania'}, {value:'RU', label:'Russia'}, {value:'RW', label:'Rwanda'}, {value:'BL', label:'Saint Barthelemy'}, {value:'SH', label:'Saint Helena'}, {value:'KN', label:'Saint Kitts and Nevis'}, {value:'LC', label:'Saint Lucia'}, {value:'MF', label:'Saint Martin'}, {value:'PM', label:'Saint Pierre and Miquelon'}, {value:'VC', label:'Saint Vincent and the Grenadines'}, {value:'WS', label:'Samoa'}, {value:'SM', label:'San Marino'}, {value:'ST', label:'Sao Tome and Principe'}, {value:'SA', label:'Saudi Arabia'}, {value:'SN', label:'Senegal'}, {value:'RS', label:'Serbia'}, {value:'SC', label:'Seychelles'}, {value:'SL', label:'Sierra Leone'}, {value:'SG', label:'Singapore'}, {value:'SX', label:'Sint Maarten'}, {value:'SK', label:'Slovakia'}, {value:'SI', label:'Slovenia'}, {value:'SB', label:'Solomon Islands'}, {value:'SO', label:'Somalia'}, {value:'ZA', label:'South Africa'}, {value:'GS', label:'South Georgia and the South Sandwich Islands'}, {value:'KR', label:'South Korea'}, {value:'SS', label:'South Sudan'}, {value:'ES', label:'Spain'}, {value:'LK', label:'Sri Lanka'}, {value:'SD', label:'Sudan'}, {value:'SR', label:'Suriname'}, {value:'SJ', label:'Svalbard and Jan Mayen'}, {value:'SZ', label:'Swaziland'}, {value:'SE', label:'Sweden'}, {value:'CH', label:'Switzerland'}, {value:'SY', label:'Syria'}, {value:'TW', label:'Taiwan'}, {value:'TJ', label:'Tajikistan'}, {value:'TZ', label:'Tanzania'}, {value:'TH', label:'Thailand'}, {value:'TG', label:'Togo'}, {value:'TK', label:'Tokelau'}, {value:'TO', label:'Tonga'}, {value:'TT', label:'Trinidad and Tobago'}, {value:'TN', label:'Tunisia'}, {value:'TR', label:'Turkey'}, {value:'TM', label:'Turkmenistan'}, {value:'TC', label:'Turks and Caicos Islands'}, {value:'TV', label:'Tuvalu'}, {value:'UG', label:'Uganda'}, {value:'UA', label:'Ukraine'}, {value:'AE', label:'United Arab Emirates'}, {value:'GB', label:'United Kingdom'}, {value:'US', label:'United States'}, {value:'UM', label:'United States Minor Outlying Islands'}, {value:'UY', label:'Uruguay'}, {value:'UZ', label:'Uzbekistan'}, {value:'VU', label:'Vanuatu'}, {value:'VE', label:'Venezuela'}, {value:'VN', label:'Vietnam'}, {value:'WF', label:'Wallis and Futuna'}, {value:'EH', label:'Western Sahara'}, {value:'YE', label:'Yemen'}, {value:'ZM', label:'Zambia'}, {value:'ZW', label:'Zimbabwe'}],

		first_name: this.props.firstName || '',
		last_name: this.props.lastName || '',
		email: this.props.email || '',
		passport: this.props.passport || '',
		country: this.props.country || '',
		mobile: this.props.contactNumber || '',
	}

	componentDidMount = () => { 
		window.addEventListener('click', this.collapseDropdown)
	}

	componoentWillUnmount = () => {
		window.removeEventListener('click', this.collapseDropdown) 
	}

	collapseDropdown = (event) => {
		if( !event.target.matches('.country-selector, .country-selector *') )
		  this.setState({ country_dropdown_active: false })     
	}  

	save = () => {
		EditBookingStatusApi.updateTravellerDetail({
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			passport: this.state.passport,
			country: this.state.country,
			mobile: this.state.mobile,
		})
		.then( response => {
			if(response.success)
				console.log('success')
			else
				throw response
		})
		.catch( error => {
			console.log(error)
		})		
	}

	onInputChange = ( e ) => {
		this.setState( { [e.target.name]: e.target.value} )
	}

  	render() {
		const { t } = this.props
		return ( 
			<div className='traveller-details-container'>
				<div style={{textAlign:'right'}}>
					<span className='close-cross clickable' onClick={this.props.onClose}>&times;</span>
				</div>
				<div className='black-header'>{t('Traveller details')}</div>

				<div className='flex-between'>
					<div className='relative'>
						<span className='float-label'>{t('First name')}<span className='asterisk'>*</span></span>
						<input className='edit-field-x half' value={this.state.first_name} name='first_name' onChange={this.onInputChange}>
					</input>
					</div>

					<div className='relative'>
						<span className='float-label'>{t('Last name')}<span className='asterisk'>*</span></span>
						<input className='edit-field-x half' value={this.state.last_name} name='last_name' onChange={this.onInputChange}>
					</input>
					</div>
				</div>


				<div className='relative'>
					<span className='float-label'>{t('Email')}<span className='asterisk'>*</span></span>
					<input className='edit-field-x' value={this.state.email} name='email' onChange={this.onInputChange}>
					</input>
				</div>

				<div className='flex-between'>
					<div className='relative'>
						<span className='float-label z-index'>{t('Country')}<span className='asterisk'>*</span></span>
						<div className={'edit-field-x half country-selector clickable clickable-dropdown-container ' +  (this.state.country_dropdown_active&&'active')}
							onClick={()=>this.setState({ country_dropdown_active: true })}>
							{this.state.country_list.find( item => item.value == this.state.country)?
								this.state.country_list.find( item => item.value == this.state.country).label: ''}&nbsp;
							{ this.state.country_dropdown_active &&
				                <ZuzuSelect
				                  placeholder={t('Select or type...')}
				                  value={this.state.country}
				                  className='dropdown-content'
				                  options={this.state.country_list}
				                  onSelect={(value)=>this.setState({country: value})}
				                /> 
							}						
						</div>				
					</div>
					<div className='relative'>
						<span className='float-label'>{t('Passport/ID')}<span className='asterisk'>*</span></span>
						<input type='text' className='edit-field-x half' value={this.state.passport} name='passport' onChange={this.onInputChange}>
						</input>
					</div>
				</div>

				<div className='relative'>
					<span className='float-label'>{t('Mobile number')}<span className='asterisk'>*</span></span>
					<input className='edit-field-x' value={this.state.mobile} name='mobile' onChange={this.onInputChange}>
					</input>
				</div>

				<button className='submit-button' onClick={this.save}>
					{t('Save')}
				</button>
			</div>
		)
  	}
}

export default withNamespaces('translation')(TravellerDetails);