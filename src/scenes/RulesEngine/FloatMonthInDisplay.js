import React from "react";
import Color from '../../Color'

const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const FloatMonthInDisplay = ( props ) => 
    <div style={{position:'absolute', left:234, top:46, textAlign:'right', background: Color.background,
      width:72, fontSize:12,  zIndex:1}}>
      {mon[new Date( props.monthInDisplay + '-01' ).getMonth()]} {new Date( props.monthInDisplay + '-01' ).getFullYear()}
    </div>

export default FloatMonthInDisplay