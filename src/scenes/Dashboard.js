import React from "react";
import Navigation from '../components/Navigation'

import DragableBlock from '../components/DragableBlock';

import './Dashboard.css';

class Dashboard extends React.Component {
  state = {
    left_items: [{
      name: 'Zhou',
      num_of_people: 2,
      booking_time: '2018-12-05',
      source: 'Ctrip'
    },{
      name: 'Tamikiwa',
      num_of_people: 1,
      booking_time: '2018-12-03',
      source: 'Airbnb'
    },{
      name: 'Yamin',
      num_of_people: 2,
      booking_time: '2018-12-08',
      source: 'Expedia'
    }],
    row0_items: [{
      name: 'Jake',
      num_of_people: 2,
      booking_time: '2018-10-01',
      source: 'Expedia'
    },{
      name: 'Bob',
      num_of_people: 3,
      booking_time: '2018-11-12',
      source: 'Agoda'
    },{
      name: 'Dylon',
      num_of_people: 1,
      booking_time: '2018-11-01',
      source: 'Expedia'
    },{
      name: 'Anton',
      num_of_people: 2,
      booking_time: '2018-12-01',
      source: 'Booking.com'
    },],
    row1_items: [],
    row2_items: [],
  }

  onBlockSelect = ( index ) => {
    this.setState({selected: index})
    console.log(index)
  }

  onRowCellHover = ( cellInex, rowIndex ) => {
    console.log(this.state.selected)
    if(typeof(this.state.selected) == 'number'){
      const poped_item = this.state.left_items[this.state.selected]
      const new_row_items = this.state['row' + rowIndex + '_items'].slice(0, cellInex).concat([poped_item]).concat(this.state['row' + rowIndex + '_items'].slice(cellInex))
      const new_left_items = this.state.left_items.slice()
      new_left_items.splice(this.state.selected, 1)
      console.log(poped_item)
      this.setState({selected: null, left_items: new_left_items, ['row' + rowIndex + '_items']: new_row_items})
    }
  }

  render() {
    return (
    <div>
    	<Navigation
    		width={this.props.width}
    		history={this.props.history}
    		toggleWidth={this.props.toggleWidth}
        root='Dashboard'
    		path='/dashboard'
    	/>
    	<div style={{width: 'calc(100% - ' + this.props.width + 'px )', display:'inline-block', verticalAlign:'top'}}> 
  			<div style={{height:'100%', fontWeight:600, fontSize:36, borderBottom:'2px solid #ddd',
  				textAlign:'center', height: 140, lineHeight: '140px',
  			background:'#def', fontFamily: "Raleway Webfont",}}>
  			This is Dashboard
  			</div>
        <div className='App' style={{display:'flex'}}>
          <div style={{minWidth:340, boxSizing:'border-box', padding:20, position:'relative'}}>
            { this.state.left_items.map( (item, index) => 
              <DragableBlock
                onSelect={this.onBlockSelect}
                index={index}
                name={item.name}
                numOfPeople={item.num_of_people}
                bookingTime={item.booking_time}
                source={item.source}
              />
            )}       
          </div>
          <div style={{background:'#fefefe', width:'99%', height:600}}>
            <div className="row 0">
            {
              this.state.row0_items.map( (item, index) => <div
                onMouseOver={()=>this.onRowCellHover(index, 0)}
                style={{background:'#060', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'white', padding:'0 5px'}}>
                  <div style={{lineHeight:'20px'}}>{item.name}</div>
                  <div style={{lineHeight:'20px'}}>{item.num_of_people}</div>
                  <div style={{lineHeight:'20px'}}>{item.booking_time}</div>
                  <div style={{lineHeight:'20px'}}>{item.source}</div>
                </div>)
            }    
              <div
                onMouseOver={()=>this.onRowCellHover(this.state.row0_items.length, 0)}
                style={{background:'#adfdad', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'#eee', padding:'0 5px', textAlign:'center', fontSize:36}}>
                +
              </div>                    
            </div>
            <div className="row 1">
            {
              this.state.row1_items.map( (item, index) => <div
                onMouseOver={()=>this.onRowCellHover(index, 1)}
                style={{background:'#060', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'white', padding:'0 5px'}}>
                  <div style={{lineHeight:'20px'}}>{item.name}</div>
                  <div style={{lineHeight:'20px'}}>{item.num_of_people}</div>
                  <div style={{lineHeight:'20px'}}>{item.booking_time}</div>
                  <div style={{lineHeight:'20px'}}>{item.source}</div>
                </div>)
            }    
              <div
                onMouseOver={()=>this.onRowCellHover(this.state.row1_items.length, 1)}
                style={{background:'#adfdad', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'#eee', padding:'0 5px', textAlign:'center', fontSize:36}}>
                +
              </div>                      
            </div>
            <div className="row 2">
            {
              this.state.row2_items.map( (item, index) => <div
                onMouseOver={()=>this.onRowCellHover(index, 2)}
                style={{background:'#060', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'white', padding:'0 5px'}}>
                  <div style={{lineHeight:'20px'}}>{item.name}</div>
                  <div style={{lineHeight:'20px'}}>{item.num_of_people}</div>
                  <div style={{lineHeight:'20px'}}>{item.booking_time}</div>
                  <div style={{lineHeight:'20px'}}>{item.source}</div>
                </div>)
            }        
              <div
                onMouseOver={()=>this.onRowCellHover(this.state.row2_items.length, 2)}
                style={{background:'#adfdad', height:80, minWidth:100, marginRight:10, zIndex:10,
                color:'#eee', padding:'0 5px', textAlign:'center', fontSize:36}}>
                +
              </div>                   
            </div>
          </div>
        </div>
		  </div>
    </div>
    );
  }
}

export default Dashboard;
