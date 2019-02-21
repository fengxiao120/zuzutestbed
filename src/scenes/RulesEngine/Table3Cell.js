import React from "react";
import Color from '../../Color'

import Table3CellPopup from './Table3CellPopup'
import CornerTriangle from '../../components/CornerTriangle'
import IconWithHover from '../../components/IconWithHover'

const t = str => str

const CellTypeColorMapping = {
  available: '#9bd0fe',
  manually_edited: '#ffa377',
  derived_no_link: '#ffdfd0',
  broken_link: '#e3c6d7',
}

class Table3Cell extends React.Component {
  state = {  
    showPopup: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state != nextState || this.props.day_disabled != nextProps.day_disabled ||
      this.props.collapsed != nextProps.collapsed || this.props.rate != nextProps.rate )
      return true
    else
      return false
  }

  collapsePopup = (e) => {
    // if(!e || !e.target.matches('.table3-cell, .table3-cell span'))
      this.setState({showPopup: false})
  }

  showCellPopup = ( e ) => {
    if( e.target.matches('.table3-cell, .table3-cell span') )
      this.setState({showPopup: true})
  }

  editCell = (price, update_derived, update_derived_prev_manual, room_type_index, rate_index) => {
    this.props.editCell(price, update_derived, update_derived_prev_manual, room_type_index, rate_index, this.props.dayIndex)
    this.collapsePopup()
  }

  render() {
    const { day_disabled, rate, dayIndex, room_type_index, rate_index, collapsed, taxRate } = this.props
    return (
      <div key={rate_index} className={'table3-cell-wrapper'} 
        style={{ display: collapsed?'none':'block' }}>
        <div 
          onClick={ day_disabled || rate.disabled? null: this.showCellPopup }
          className={'table3-cell ' + ( room_type_index == this.state.visibleRTIndex
          && rate_index == this.state.visibleRateIndex && 'active ') + ((day_disabled || rate.disabled)&&' disabled')}
          style={{ background: CellTypeColorMapping[rate.type] }}>
          { rate.value } 
          <span style={{color:day_disabled || rate.disabled?'#b7b7b7':'red', fontSize: 9, marginLeft:5, }}>{ rate.change }</span>
          { this.state.showPopup && 
            <Table3CellPopup 
              price={rate.value}
              taxRate={taxRate}
              roomTypeIndex={room_type_index}
              rateIndex={rate_index}
              onCancel={this.collapsePopup}
              onConfirm={this.editCell}
            />
          }
          <IconWithHover 
            style={{position: 'absolute', right: 2, top: 2, color: '#333'}}
            className='disabled-cell-info'
            explanation={t('Shaded cells will not be applied when submitting price changes')}
            position='right'
          />
          <CornerTriangle
            onClick={()=>this.props.disableCell(dayIndex, room_type_index, rate_index, true)}
            position='top-right'
            color='#e6e6e6'
            className='table3-cell-top-right'
          />
          { !day_disabled &&
            <CornerTriangle
              onClick={()=>this.props.disableCell(dayIndex, room_type_index, rate_index, false)}
              position='bottom-left'
              color='#4d4d59'
              className='table3-cell-bottom-left'
            />
          }                        
        </div> 
      </div> 
    );
  }
}

export default Table3Cell