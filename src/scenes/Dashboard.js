import React from "react";
import Navigation from '../components/Navigation'


import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './Dashboard.css';

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
}

const grid = 20

const getItemStyle = (isDragging, draggableStyle, isHorizontal) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    margin: isHorizontal?`0 ${grid}px 0 0`: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
})

const getListStyle = ( isDraggingOver, isHorizontal ) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 20,
    display: isHorizontal?'flex':'block',
    boxSizing: 'border-box',
})

class Dashboard extends React.Component {
  state = {
    left_items: [{
      name: 'Zhou',
      num_of_people: 2,
      booking_time: '2018-12-05',
      source: 'Ctrip'
    },{
      name: 'Park',
      num_of_people: 2,
      booking_time: '2018-12-06',
      source: 'Ctrip'
    },{
      name: 'Wang',
      num_of_people: 4,
      booking_time: '2018-12-01',
      source: 'Ctrip'
    },{
      name: 'Kevin',
      num_of_people: 1,
      booking_time: '2018-12-15',
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

  scrollLeft = () => {
    console.log('scrollLeft is called')
    this.setLeftInterval = setInterval(this.scrollLeftDirtyWork, 16)
  }

  scrollLeftDirtyWork = () => {
    console.log('scrollLeftDirtyWork is called')
    document.getElementById('calendar-view-container').scrollBy(-10,0)
  }

  scrollRight = () => {
    console.log('scrollRight is called')
    this.setRightInterval = setInterval(this.scrollRightDirtyWork, 16)
  }

  scrollRightDirtyWork = () => {
    console.log('scrollRightDirtyWork is called')
    document.getElementById('calendar-view-container').scrollBy(10,0)
  }

  onMouseOutLeft = () => {
    console.log('onMouseOutLeft is called')
    clearInterval(this.setLeftInterval)
  }

  onMouseOutRight = () => {
    console.log('onMouseOutRight is called')
    clearInterval(this.setRightInterval)
  }

  onDragEnd = ( result ) => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) 
          return
      console.log(source)
      console.log(destination)
      if (source.droppableId === destination.droppableId) {
          const items = this.reorder(
              source.droppableId,
              source.index,
              destination.index
          );

          this.setState( { [this.id2List[source.droppableId]]: items} );
      }

      if (source.droppableId != destination.droppableId) {
        const result = this.move( source, destination )
        this.setState({ left_items: result.left_items, row0_items: result.row0_items})
      } 
  }

  id2List = {
    droppable1: 'left_items',
    droppable2: 'row0_items',
    droppable3: 'row1_items',
    droppable4: 'row2_items',
  }

  reorder = (id, startIndex, endIndex) => {
      const result = this.state[this.id2List[id]].slice()
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
  }

  move = (droppableSource, droppableDestination) => {
      const sourceClone = this.state.left_items.slice()
      const destClone = this.state.row0_items.slice()
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      destClone.splice(droppableDestination.index, 0, removed);

      const result = {
        left_items: sourceClone,
        row0_items: destClone
      }

      return result;
  }

  render() {
    return (
    <div style={{display:'flex'}}>
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
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div style={{minWidth:220, boxSizing:'border-box', position:'relative'}}>
            <Droppable droppableId="droppable1">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver, false)}>
                        {this.state.left_items.map((item, index) => (
                            <Draggable
                                key={item.name}
                                draggableId={item.name}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={ {...getItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style,
                                      ), width: 180, height: 120, background: '#080', 
                                      color:'white', textAlign:'center', lineHeight:'200px'}}>
                                      <div style={{lineHeight:'20px'}}>{item.name}</div>
                                      <div style={{lineHeight:'20px'}}>{item.num_of_people}</div>
                                      <div style={{lineHeight:'20px'}}>{item.booking_time}</div>
                                      <div style={{lineHeight:'20px'}}>{item.source}</div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>     
          </div>

          <div style={{flexGrow:1, overflow: 'hidden', height: 450, display:'flex'}}>
            <div style={{minWidth:50, textAlign:'center'}}>
              <div onMouseOver={this.scrollLeft} onMouseOut={this.onMouseOutLeft}
                style={{textAlign:'center', height:36, width:36, lineHeight:'36px',display:'inline-block', 
                borderRadius:18, marginTop:20, background:'#337ab7', cursor:'pointer'}}>
                <i className="arrow left" style={{ borderColor: 'white', width:10, height:10, padding:0, 
                  borderWidth:'0 4px 4px 0', left:2, top:3, position:'relative'}}/>
              </div>
            </div>
            <div id='calendar-view-container' style={{flexGrow:1, overflow: 'auto', height: 450, background: 'lightgrey'}}>
              <div id='calendar-view' className="row 0" >
                <Droppable droppableId="droppable2" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      style={{...getListStyle(snapshot.isDraggingOver, true)}}
                      ref={provided.innerRef}>
                      {this.state.row0_items.map((item, index) => (
                        <Draggable
                          key={item.name}
                          draggableId={item.name}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{...getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style,
                                            true
                                        ), background:'#060', height:80, minWidth:100, color:'white', margin:5}}>
                              <div style={{lineHeight:'20px'}}>{item.name}</div>
                              <div style={{lineHeight:'20px'}}>{item.num_of_people}</div>
                              <div style={{lineHeight:'20px'}}>{item.booking_time}</div>
                              <div style={{lineHeight:'20px'}}>{item.source}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>                                
              </div>
            </div>
            <div style={{minWidth:50, textAlign:'center'}}>
              <div onMouseOver={this.scrollRight} onMouseOut={this.onMouseOutRight}
                style={{textAlign:'center', height:36, width:36, lineHeight:'36px',display:'inline-block', 
                borderRadius:18, marginTop:20, background:'#337ab7', cursor:'pointer'}}>
                <i className="arrow right" style={{ borderColor: 'white', width:10, height:10, padding:0, 
                  borderWidth:'0 4px 4px 0', left:-2, top:3, position:'relative'}}/>
              </div>
            </div>
          </div>
        
        </DragDropContext>
        </div>
		  </div>
    </div>
    );
  }
}

export default Dashboard;
