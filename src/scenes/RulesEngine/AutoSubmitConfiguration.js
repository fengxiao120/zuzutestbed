import React from "react"
import { withNamespaces } from 'react-i18next'

import RulesEngineApi from '../../api/RulesEngineApi'


const MAX_DAYS_DEFAULT_BAR = 730 // two years
const SCROLL_STEP = 12
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December']
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

class AutoSubmitConfiguration extends React.PureComponent {
  state = {
    show_stay_surcharge: false,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    active_month: 0,
  }

  onMouseLeave = (e) => {
    console.log(e)
  }   

  render() {
    const { t } = this.props
    return (
      <div className='autos-submission-container dropdown-content' style={{...this.props.style}}>
      </div> 
    )
  }
}

export default withNamespaces('translation')(AutoSubmitConfiguration);