import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import { addDays, formatDate } from '../../utils/Format'
import { ZuZuDatePicker } from 'zuzuhs-react-components'

import 'zuzuhs-react-components/dist/css/main.css'

const SCROLL_STEP = 12
const SCROLL_INTERVAL = 16
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TODAY = new Date()

const ROOM_TYPE_DAFAULT_OFFSET = 32

class LeftPanel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      show_day_picker: false,
    }
  }

  componentDidMount = async () => {
    window.addEventListener('click', this.collapseDropdown)
  }

  componoentWillUnmount = () => {
    window.removeEventListener('click', this.collapseDropdown)
  }

  collapseDropdown = (event) => {
    if (!event.target.matches('.jump-date, .jump-date *'))
      this.setState({ show_day_picker: false })
  }

  jumpDate = ( selected_day ) => {
    this.setState({show_day_picker: false})
    this.props.jumpDate(selected_day)
  }

  toggleRoomType = (room_type_id) => {
    this.setState((s) => {
      const new_room_types = s.room_types.slice()
      const index = new_room_types.findIndex((item) => item.room_type_id === room_type_id)
      new_room_types[index].collapsed4 = !new_room_types[index].collapsed4
      return {
        room_types: new_room_types,
        table_collapsed: !new_room_types[index].collapsed4 ? false : s.table_collapsed
      }
    })
  }

  collapseAllRates = () => {
    this.setState((s) => {
      const new_collapsed = !s.table_collapsed
      const new_room_types = s.room_types.map((item) => ({ ...item, collapsed4: new_collapsed }))
      return {
        room_types: new_room_types,
        table_collapsed: new_collapsed
      }
    })
  }

  render() {
    const { t } = this.props
    return (
        <div className="left-panel">
          <div className='spacer-1'>
            <div className='update-derived'>
              <div
                tabIndex={0}
                role="button"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    this.props.onChangeUpdateDerived()
                  }
                }}
                onClick={this.props.onChangeUpdateDerived}
                className={classNames('blue-select-box', {
                  'selected': this.props.updateDerived
                })}
              >
                {this.props.updateDerived && <i className='tick-x' />}
              </div>         
              <div style={{width: 40}}>
                {t('Update derived')}
              </div>         
            </div>

            <div
              className={`jump-date clickable-dropdown-container ${this.state.show_day_picker && 'active'}`}
              onClick={() => this.setState({ show_day_picker: true })}
            >
              <i className='fa fa-calendar'/>
              {formatDate(this.props.dateToJump, '')}
              <div
                onClick={(e) => e.stopPropagation()}
                className="dropdown-content date-selector"
              >
                <ZuZuDatePicker
                  onDateSelected={this.jumpDate}
                  selectedDate={this.props.dateToJump}
                  year={TODAY.getFullYear()}
                  month={TODAY.getMonth() + 1}
                  disableBefore={TODAY}
                  disableAfter={addDays(TODAY, 720)}
                />                
              </div>
            </div>


            <div
              onMouseOver={() => this.props.scrollLeft()}
              onMouseOut={() => this.props.onMouseOutLeft()}
              className="left scroller-icon"
            >
              {'<'}
            </div>
          </div>

          <div className="all-room-avail">
            <span>{t('See all')}</span>
            <span>{t('All room availability')}</span>
          </div>

          {this.props.roomTypes.map((room_type, index) => (
            <div key={index} className='room-type-with-rate-plans'>
              <div className="row-name room-type">
                <div className="room-type-name line-height-1">
                    {room_type.name}
                </div>
                <span className='line-height-1'>
                  {t('Availability')}
                </span>
              </div>
              {room_type.rate_plans.map((rate_plan, rate_plan_index) => (
                <div key={rate_plan_index} className={ !rate_plan_index || room_type.expanded ?'row-name':'hidden'}>
                  <div className={rate_plan_index?'hidden':'expand-rate-plan'}
                    onClick={()=>this.props.toggleRoomType(index)}>
                    { room_type.expanded?'-':'+'}
                  </div>
                  <div className={rate_plan_index?'rate-plan left-padding':'rate-plan'}>
                    {rate_plan.name}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
    )
  }
}

export default withNamespaces('translation')(LeftPanel)        