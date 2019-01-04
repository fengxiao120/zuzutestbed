import React from "react";
import Navigation from '../components/Navigation'

import './RevenueManagementRules.css';

const t = str => str
const Color = {
  background: '#f9f9f9',
  themeBlue: '#337ab7',
  themeBlueLight: '#eff7ff'
}
class Slider extends React.Component {
  state = {
    offset: 0,
  }
  render(){
    return (
      <div style={{position:'absolute', zIndex:1, left: -20, top: '-40%', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', alignItems:'center',
        width:156, height:54, background: Color.themeBlueLight, padding:'25px 26px 20px', boxSizing:'border-box', display:'flex'}}>
        <div style={{width:10, height:10, borderRadius:5, boxSizing:'border-box', 
          background: '#86b7e8', border:'1px solid', borderColor: '#0163c5'}}></div>
        <div style={{width:86, height:0, border:'1px dashed', borderColor: '#0163c5'}}></div>
        <div style={{width:10, height:10, borderRadius:5, boxSizing:'border-box',background: '#86b7e8', position:'relative'}}>
          <div style={{width:18, height:18, top: -4, left: -4 - this.state.offset, lineHeight:'14px', fontSize:14, textAlign:'center',
            borderRadius:9, boxSizing:'border-box',background: '#ffffff', position:'absolute', border:'1px solid #0163c5'}}>
            &#9666;&#9656;
          </div>
        </div>        
      </div>
    )
  }
}

class RatesAndAvailability extends React.Component {
  state = {
    price_not_market_price: true,
    visibleRowNameIndex: -1,
    headers: ['Same day bookings', 'Last-minute (1-2 days)', '3-6 days', '7-13 days', '14-30 days', '31-60 days', '60+ days'],
    rowNames: [{start: 0, end: 20},  {start: 21, end: 40}, {start: 41, end: 60}, {start: 61, end: 80}, {start: 81, end: 90}, {start: 91, end: 100}],
    data:[
      [1,2,3,4,5,6,7],
      [2,3,4,5,6,7,8],
      [3,4,5,6,7,8,9],
      [4,5,6,7,8,9,10],
      [5,6,7,8,9,10,11],
      [6,7,8,9,10,11,12],
    ]
  }
  render() {
    return (
    <div style={{display:'flex'}}>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Rates and availability'
    		path={'/rates-and-availability'}
    	/>
    	<div className="App revenue-management-rules"
        style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  		  <div style={{fontWeight:600, fontSize:36, lineHeight:'140px',
          textAlign:'center', height:140, borderBottom:'2px solid #ddd',
          background:'#def', fontFamily: "Raleway Webfont",}}>
          This is RatesAndAvailability
  			</div>
        <div class="page-top-header" style={{padding:'20px 30px'}}>
          Revenue management rules
        </div>

        <div style={{display:'inline-block'}}>
          <div style={{margin:'10px 30px', display:'flex',  borderRadius: 16,
            background:'#eff7ff', height:32, padding:'0 7px', boxSizing:'border-box'}}>
            <div onClick={()=>this.setState({price_not_market_price: true})}
              className={this.state.price_not_market_price?'header-tab in-focus':'header-tab'}>
              {t('Price')}
            </div>
            <div onClick={()=>this.setState({price_not_market_price: false})}
              className={this.state.price_not_market_price?'header-tab':'header-tab in-focus'}>
              {t('Market prices')}
            </div>          
          </div>
        </div>

        <div className='rules-table' style={{marginTop:36}}>
          <div className='rules-table-header'
            style={{display:'flex', background: Color.background, padding: '15px 30px 7px'}}>
            <div style={{width:78}}></div>
            { this.state.headers.map( item => 
              <div style={{color: '#4d4d59', paddingRight:12, boxSizing:'border-box',
              display:'flex', flexDirection:'column-reverse',
              width:79, textAlign:'right'}}>{item}</div>) }
          </div>
          <div className='rules-table-body' style={{display:'flex'}}>
            <div style={{width:108}}>
              { this.state.rowNames.map( (item, index) => 
                <div style={{marginLeft:30, color: '#4d4d59', width:78, position: 'relative',
                  textAlign:'right', height: 32, lineHeight:'32px', borderBottom: '1px solid #eee'}}>
                  <div onClick={()=>this.setState({ visibleRowNameIndex: index})}
                  style={{background: Color.themeBlueLight, borderBottom:'2px dashed', borderColor: '#75baff', 
                    display:'inline-block', fontSize: 12, color: '#333333',
                    width:61, height: 20, lineHeight:'20px', textAlign:'center'}}>
                    {item.start + ' - ' + item.end + '%'}
                  </div>
                  { this.state.visibleRowNameIndex === index && <Slider />}
                </div>) 
              }
            </div>
            <div className='rules-table-content'>
              { this.state.data.map( row => 
                  <div className="rules-table-row" style={{display:'flex'}}>
                    { row.map(cell => 
                        <div className='rules-table-cell' style={{height:32, width:78, borderRight: '1px solid #f3f3f3', 
                          borderBottom:'1px solid #f3f3f3', lineHeight:'32px', textAlign:'center', fontSize: 13, color:'black'}}>
                          +{cell}
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>  
          <div style={{marginLeft:30, height:32, width: 632, borderBottom: '1px solid #f3f3f3'}}>
            <div style={{marginLeft:14, width:61, textAlign:'center', lineHeight:'32px', color:'#337ab7', fontSize:16}}>+</div>
          </div>        
        </div>
		  </div>
     </div>
    );
  }
}

export default RatesAndAvailability;
