import React from "react";
import './Pagination.css'
import ReactSelect, { components }  from 'react-select';

const DropdownIndicator = (props) => {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <div>
      <i class="down"></i>
      </div>
    </components.DropdownIndicator>
  );
};

export default class Pagination extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pageSize: props.pageSize,
      page: props.page,
      pages:Math.ceil(props.total/props.pageSize),
      total: props.total,
      page_input: props.page
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      pageSize: nextProps.pageSize,
      page: nextProps.page,
      pages: Math.ceil(nextProps.total/nextProps.pageSize),
      total: nextProps.total,
      page_input: nextProps.page
    })
  }

  changePage = (page) => {
    this.props.onPageChange(page);
  }  

  changePageSize = () => {
    this.props.onPageSizeChange(this.state.pageSize)
  }

  monitorEnter = ( e ) => {
    if(e.key=='Enter'){
      let page = parseInt(this.state.page_input)
      if( page >=0 && page <=this.state.pages - 1)
        page = page
      else if(page > this.state.pages - 1)
        page = this.state.pages - 1
      else 
        page = 0
      this.changePage(page)
    }
  }

  render() {
    const reactSelectCustomStyles = {
      control: (base, state) => ({
        ...base,
        backgroundColor: '#f8f8f8',
        borderRadius: 2,
        border:'1px solid #aaa',
        boxShadow: 'none !important',
        outline:'none !important',
        width:80,
        height:27,
        minHeight: 27,
        paddingLeft:10,
      }),
      placeholder: (base, state) => ({
        color: '#333',
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color:'#333',
        padding:'0 10px 6px',
      }),  
      indicatorSeparator: (base, state) => ({
        ...base,
        display:'none',
      }),
      menu: (base, state) => ({
        ...base,
        top: 'auto', 
        bottom: '100%',
      }), 
    }

    return (
      <div className="react-select" style={{textAlign:'right'}}>
        <div style={{display:'inline-block', verticalAlign:'top', height:27, lineHeight:'27px'}}>
        Showing {1 + this.state.pageSize*this.state.page} to {Math.min(this.state.pageSize*(this.state.page+1), this.state.total)} of {this.state.total} entries | View 
        </div>
        <div style={{display:'inline-block', margin:'0 6px',verticalAlign:'top', height:27}}>
          <ReactSelect
            styles={reactSelectCustomStyles}
            value={this.state.pageSize}
            isSearchable={false}
            components={{ DropdownIndicator }}
            placeholder={this.state.pageSize}
            options={[25, 50, 100, 250].map(item => { return {value:item, label:item}})}
            onChange={(item)=>this.setState({pageSize:item.value}, this.changePageSize)}
          />
        </div>      
        <div style={{display:'inline-block',verticalAlign:'top', height:27, lineHeight:'27px'}}>
        at a time &nbsp;&nbsp; Page
        </div>  
        <div style={{display:'inline-block', marginLeft:10, marginRight: 6, verticalAlign:'top', height:27}}>
          <div style={{border:'1px solid #aaa', display:'flex', borderRadius:'2px'}}>
            <div onClick={this.state.page>0?()=>this.changePage(this.state.page-1):null} style={{borderRight:'1px solid #aaa', background:'#f8f8f8', cursor:'pointer', padding:'4px 10px'}}><i class="left"></i></div>
            <input type="number" style={{padding:'4px 0', background:'#fff', width:50, textAlign:'center'}}
              value={this.state.page_input + 1} 
              min='1'
              max={this.state.pages}
              onChange={(e)=>this.setState({page_input: parseInt(e.target.value) - 1})}
              onKeyPress={this.monitorEnter}
            />
            <div onClick={this.state.page+1<this.state.pages?()=>this.changePage(this.state.page+1):null} style={{borderLeft:'1px solid #aaa', background:'#f8f8f8', cursor:'pointer', padding:'4px 10px'}}><i class="right"></i></div>
          </div>
        </div>
        <div style={{display:'inline-block', verticalAlign:'top', height:27, lineHeight:'27px'}}>
        of {this.state.pages}
        </div>        
      </div>
    );
  }
}