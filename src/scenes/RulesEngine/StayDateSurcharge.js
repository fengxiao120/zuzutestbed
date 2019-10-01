import React from "react"
import { withNamespaces } from 'react-i18next'

import PercentageToggle from '../../components/PercentageToggle'
import SurchargeEditor from './SurchargeEditor'

import RulesEngineApi from '../../api/RulesEngineApi'

import Color from '../../Color'
import { formatRequestDate } from '../../utils/Format'

const SCROLL_STEP = 12
const SCROLL_INTERVAL = 16
const NUM_OF_MONTH_IN_TWO_YEARS = 24
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

class Day extends React.Component {
  render() {
    return (
      <div name={this.props.day}
        className={this.props.className} 
        onClick={this.props.onClick}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        style={{boxSizing: 'content-box', width: 'calc( 14.285% - 2px )', height:28, textAlign:'center', lineHeight:'28px', cursor:'pointer'}}>
        {this.props.day?this.props.day:''}
      </div>
    )
  }
}

class StayDateSurcharge extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      show_stay_surcharge: false,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
      active_month: 0,
      week_day_surcharge: [{amount: '0', overwrite_day: false}, {amount: '0', overwrite_day: false}, {amount: '0', overwrite_day: false}, 
      {amount: '0', overwrite_day: false}, {amount: '0', overwrite_day: false}, {amount: '0', overwrite_day: false}, {amount: '0', overwrite_day: false},],

      active_day_surcharge_index: -1,
      active_week_day_surcharge_index: -1,

      day_surcharges: [ { start: '2019-10-17', val: 10, type: '%' }, { start: '2019-10-28', val: 15, type: '#' }, { start: '2019-10-29', val: 12, type: '%' }, 
        { start: '2019-10-07', val: 233383, type: '#' }, { start: '2019-11-17', val: 13, type: '%' }, { start: '2019-11-18', val: 18, type: '#' }],
    }
  }  

  scrollLeft = () => {
    this.setLeftInterval = setInterval(()=>this.scrollLeftDirtyWork(), SCROLL_INTERVAL)
  }

  scrollLeftDirtyWork = () => {
    document.getElementById('month-container').scrollBy(-SCROLL_STEP,0)
    this.calendar_scroll_distance = document.getElementById('month-container').scrollLeft
  }

  scrollRight = () => {
    this.setRightInterval = setInterval(()=>this.scrollRightDirtyWork(), SCROLL_INTERVAL)
  }

  scrollRightDirtyWork = () => {
    document.getElementById('month-container').scrollBy(SCROLL_STEP,0)
    this.calendar_scroll_distance = document.getElementById('month-container').scrollLeft
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
      <div>
        <div style={{background: Color.background, padding:'10px 40px', fontWeight:'bold', fontSize:13, display:'flex'}}>
          {t('Stay-date surcharges')}<span style={{color:Color.orange}}>*</span>
          <div 
            onClick={ () => this.setState({show_stay_surcharge: !this.state.show_stay_surcharge})}
            style={{display:'inline-block', width:16, height:16, lineHeight:'16px', 
              verticalAlign:'middle', marginLeft:16, cursor:'pointer'}}>
            <i style={{padding:4, border:'solid black', borderWidth:'0 2px 2px 0', borderColor: Color.themeBlue, display: 'inline-block',
                transform:this.state.show_stay_surcharge?'translateY(4px) rotate(225deg)':'translateY(0px) rotate(45deg)'
              }}
            />
          </div>
        </div>

        { this.state.show_stay_surcharge && <div style={{ background: '#f9f9f9'}}>
          <div className='flex' style={{padding: '0px 40px', background: '#f9f9f9'}}>
            <div className={'weird-oval-button ' + (this.props.staySurchargeOnlyOnMarketPricing&&'active') }
              onClick={()=>this.props.onStateChange({stay_surcharge_only_on_market_pricing: !this.props.staySurchargeOnlyOnMarketPricing})}>
              {t("Apply only on days using 'Market Pricing'")}
            </div>
            <div className={'weird-oval-button ' + (!this.props.staySurchargeOnlyOnMarketPricing&&'active') }
              onClick={()=>this.props.onStateChange({stay_surcharge_only_on_market_pricing: !this.props.staySurchargeOnlyOnMarketPricing})}>
              {t("Apply on days using ‘Market Pricing’ and ‘Default BAR")}
            </div>
          </div>

          <div className='flex' style={{marginTop: 10}}>
            <div onMouseOver={()=>this.scrollLeft()} onMouseOut={()=>this.onMouseOutLeft()}
              style={{minWidth:40, cursor:'pointer', textAlign: 'center', lineHeight:'44px'}}>
              <i className="arrow left" style={{ borderColor: 'black', width:7, height:7, padding:0, borderWidth:'0 2px 2px 0'}}/>
            </div>
            <div className='flex calendar-view-container' id='month-container'>
              <div className='calendar-view'>{
              Array(NUM_OF_MONTH_IN_TWO_YEARS).fill(0).map( (item, index) => <div className={'month-box ' + (this.state.active_month === index && 'active')}
                onClick={()=>this.setState({active_month: index})}>
                <div>{ month[new Date(this.state.year, this.state.month + index, this.state.day).getMonth()] }</div>
                <div>{ new Date(this.state.year, this.state.month + index, this.state.day).getFullYear() }</div>
              </div>)
              }</div>
            </div>

            <div onMouseOver={()=>this.scrollRight()} onMouseOut={()=>this.onMouseOutRight()}
              style={{minWidth:40, cursor:'pointer', textAlign: 'center', lineHeight:'44px'}}>
              <i className="arrow right" style={{ borderColor: 'black', width:7, height:7, padding:0, borderWidth:'0 2px 2px 0'}}/>
            </div>
          </div>

          <div className='flex start wrap' style={{margin: '30px 40px 10px'}}>

            { this.state.week_day_surcharge.map( (week_day_surcharge, index) => <div 
              className='week-day-surcharge'
              onClick={()=>this.setState({active_week_day_surcharge_index: index})}>
              <div style={{background: '#f36f31', padding: '4px 6px 0', color: 'white', borderRadius: '5px 5px 0 0'}}>{week[index]}</div>
              <div className='flex between' style={{background: 'white', padding: '4px 6px 0', borderRadius: '0 0 5px 5px', borderColor: '#ccc', borderWidth: '0 1px 1px 1px', borderStyle: 'solid'}}>
                <span>{week_day_surcharge.amount.includes('%')?'%':'$'}</span>
                <span>{week_day_surcharge.amount}</span>
              </div>
              { this.state.active_week_day_surcharge_index == index && <SurchargeEditor 
                index={index}
                surcharge={week_day_surcharge.amount}
                isWeekDaySurcharge={true}
                overwriteDaySurcharge={week_day_surcharge.overwrite_day}
                onConfirm={(surcharge, m_index) => this.setState({
                  week_day_surcharge: this.state.week_day_surcharge.slice(0, m_index).concat(surcharge).concat(this.state.week_day_surcharge.slice(m_index+1)),
                  active_week_day_surcharge_index: -1,
                })}
                onCancel={()=>this.setState({active_week_day_surcharge_index: -1})}
              />
              }
            </div>)
            }

            { Array(new Date(this.state.year, this.state.month + this.state.active_month, 1).getDay()).fill(0).map((item, index)=><div className='empty-block' key={index}> </div>)}

            { Array(new Date(this.state.year, this.state.month + 1, 0).getDate()).fill(0).map((day, index)=>index+1).map((day, index)=> {
              const date = formatRequestDate( new Date(this.state.year, this.state.month + this.state.active_month, day) )
              const day_surcharge_index = this.state.day_surcharges.findIndex( item => item.start === date )
              const day_surcharge = day_surcharge_index >=0 ? this.state.day_surcharges[day_surcharge_index].val + (this.state.day_surcharges[day_surcharge_index].type === '%'?'%':'') : '0'
              return (<div 
                className='day-surcharge'
                onClick={()=>this.setState({active_day_surcharge_index: index})}>
                { day === 1 && <span style={{position: 'absolute', top: -20, fontWeight: 'bold'}}>
                  { month[(this.state.month + this.state.active_month)%12] + ' ' + new Date(this.state.year, this.state.month + this.state.active_month, 1).getFullYear()}
                </span>}
                <div style={{padding: '4px 6px 0'}}>
                  <div style={{background: '#f36f31', color: 'white', borderRadius: 7, width: 14, height: 14, textAlign:'center', fontSize: 10}}>{day}</div>
                </div>
                <div className='flex between' style={{padding: '4px 6px 0'}}>
                  <span>{day_surcharge.includes('%')?'%':'$'}</span>
                  <span>{day_surcharge.replace('%', '')}</span>
                </div>
                { this.state.active_day_surcharge_index == index && <SurchargeEditor 
                  index={index}
                  surcharge={day_surcharge}
                  isWeekDaySurcharge={false}
                  onConfirm={(surcharge) => {
                    const new_surcharge = { start: date, val: surcharge.amount.replace('%', ''), type: surcharge.amount.includes('%')?'%':'' }
                    this.setState({
                      day_surcharges: day_surcharge_index >=0 ?
                        this.state.day_surcharges.slice(0, day_surcharge_index).concat(new_surcharge).concat(this.state.day_surcharges.slice(day_surcharge_index+1)):
                        this.state.day_surcharges.concat(new_surcharge),
                      active_day_surcharge_index: -1,
                    })
                  }}
                  onCancel={()=>this.setState({active_day_surcharge_index: -1})}
                />
                }
              </div>)
            })}
          </div>

          <div>
          </div>
        </div>
        }
      </div> 
    )
  }
}

export default withNamespaces('translation')(StayDateSurcharge);