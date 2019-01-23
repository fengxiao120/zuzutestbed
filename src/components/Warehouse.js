class Slider extends React.Component {
  state = {
    offset: 0,
    changing: false,
    previousOffset: 0,
  }

  onMouseDown = ( e ) => {
    this.setState({ changing: true, previousOffset: this.state.offset })
  }
 
  onMouseMove = ( e ) => {
    if(this.state.changing)
      this.setState({offset: Math.min(Math.max(4 - e.target.offsetLeft - e.nativeEvent.offsetX, 0), 100)})
  }
 
  onMouseUp = () => {
    this.setState({ changing: false})
  }

  onMouseOut = () => {
    if(this.state.changing)
      this.setState({ offset: this.state.previousOffset, changing: false})
  }  

  render(){
    return (
      <div
        style={{position:'absolute', zIndex:3, left: 0, top: '-80%', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', alignItems:'center',
        width:162, height:54, background: Color.themeBlueLight, padding:'25px 26px 20px', boxSizing:'border-box', display:'flex'}}>
        <div style={{width:10, height:10, borderRadius:5, boxSizing:'border-box', 
          background: '#86b7e8', border:'1px solid', borderColor: '#0163c5'}}></div>
        <div style={{width:90, height:0, border:'1px dashed', borderColor: '#0163c5'}}></div>
        <div
          style={{width:10, height:10, borderRadius:5, boxSizing:'border-box',background: '#86b7e8', position:'relative'}}>
          <div 
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseOut={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            style={{width:18, height:18, top: -4, left: -4 - this.state.offset, lineHeight:'14px', fontSize:14, textAlign:'center',
            borderRadius:9, boxSizing:'border-box',background: '#ffffff', position:'absolute', border:'1px solid #0163c5', cursor:'pointer'}}>
            &#9666;&#9656;
          </div>
          <div style={{position:'absolute', top: - 18, left: - 5 - this.state.offset, fontSize:14, lineHeight:'14px'}}>
            {this.state.offset}%
          </div>          
        </div>        
      </div>
    )
  }
}