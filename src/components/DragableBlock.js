import React, { Component } from 'react';
 
class DragableBlock extends Component {
  state = {
    backgroundColor: '#080',
    position: 'static',
    posXOffset: 0, 
    posYOffset: 0, 
    mouseInitialPosX: 0,
    mouseInitialPosY: 0,
    cursor: 'auto',
  }
  onMouseDown = ( e ) => {
    // console.log(e.nativeEvent.offsetY)
    // console.log(e.target.offsetLeft)
    // console.log(e.target.offsetTop)
    this.props.onSelect(this.props.index)
    this.setState({ backgroundColor: '#afa', position: 'relative', 
      left:0, top: 0, cursor: 'pointer',
      posXOffset: e.target.offsetLeft, posYOffset: e.target.offsetTop,
      mouseInitialPosX: e.nativeEvent.offsetX, mouseInitialPosY: e.nativeEvent.offsetY})
  }
 
  onMouseMove = ( e ) => {
    if(this.state.position == 'relative'){
      const left = e.nativeEvent.offsetX + e.target.offsetLeft - this.state.mouseInitialPosX - this.state.posXOffset
      const top = e.nativeEvent.offsetY + e.target.offsetTop - this.state.mouseInitialPosY - this.state.posYOffset      
      this.setState({left: left, top: top})
      // console.log(e.nativeEvent.offsetX)      
      // console.log(e.nativeEvent.offsetY)
    }
  }
 
  onMouseUp = () => {
    this.setState({ backgroundColor: '#080', position: 'static',
      posXOffset: 0, posYOffset: 0, cursor:'auto',
      mouseInitialPosX: 0, mouseInitialPosY: 0,
      left:0, top: 0,
    })
  }
 
  render() {
    // console.log('rendering')
    return (
      <div 
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        style={{width: 300, height: 200, background: this.state.backgroundColor, position: this.state.position,
          left: this.state.left, top: this.state.top, zIndex: 0, color:'white', cursor: this.state.cursor,
          marginBottom:20, textAlign:'center', lineHeight:'200px'}}>
          <div style={{lineHeight:'20px', pointerEvents:'none'}}>{this.props.name}</div>
          <div style={{lineHeight:'20px', pointerEvents:'none'}}>{this.props.numOfPeople}</div>
          <div style={{lineHeight:'20px', pointerEvents:'none'}}>{this.props.bookingTime}</div>
          <div style={{lineHeight:'20px', pointerEvents:'none'}}>{this.props.source}</div>        
      </div>
    )
  }
}
 
export default DragableBlock;