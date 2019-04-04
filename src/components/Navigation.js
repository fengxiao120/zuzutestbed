import React from "react";
import { withNamespaces } from 'react-i18next';

const nav_items = [{name:'Dashboard', icon:'zuzu-icon-home', link:'/dashboard'},
  {name:'Reservations', icon:'zuzu-icon-key', link:'/reservations',
    childern:[
    {name:'Your hotel today', link:'/your-hotel-today',},
    {name:'All bookings', link:'/hotel/bookings',}
  ]},
  {name:'Rules engine',icon:'zuzu-icon-calendar', link:'/rules-engine'}, 
  {name:'Revenue management', icon:'zuzu-icon-dollar', link:'/revenue-management',
    childern:[
    {name:'Market pricing', link:'/revenue-management/market-pricing',},
    {name:'Promotions', link:'/revenue-management/promotions',}    
  ]},
  {name:'Payments', icon:'zuzu-icon-payment', link:'/payments'},
  {name:'Reports', icon:'fa fa-clipboard menu-ico', link:'/reports'},
  {name:'Hotel Settings', icon:'zuzu-icon-cog', link:'/hotel-settings'},
]
const nav_items_internal = [{name:'Hotels', icon:'zuzu-icon-hotel', link:'/hotel'},
  {name:'Users', icon:'zuzu-icon-profile', link:'/user'},
  {name:'Content', icon:'zuzu-icon-file', link:'/content'},
  {name:'Settings', icon:'zuzu-icon-setting', link:'/settings'},
  {name:'Performance reports', icon:'zuzu-icon-figure', link:'/performace-report'},
  {name:'Channel Managers', icon:'zuzu-icon-channel-manager', link:'/channel-managers'},
  {name:'Finance', icon:'zuzu-icon-dollar', link:'/finance'},
]
class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      showSubitem: props.root,
    }
  }
  toggleWidth = () => {
    this.props.toggleWidth()
  }
  changeRoute = (link) => {
    console.log(link)
    this.props.history.push(link)
  }
  render() {
    const { t } = this.props
    return (
      <div className={this.props.width===70?'nav-collapsed':'nav-expanded'}
      style={{width:this.props.width, background:'#eae9e7'}}>
        <div className='nav-item' style={{height:140, borderBottom:'#f4703269 2px solid', lineHeight:'134px'}}>
          <div style={{textAlign:'center', width:39, display:'inline-block',marginLeft:15, verticalAlign:'top'}}>
            <i style={{fontSize:25}} className='inherit zuzu-icon-profile'></i>
          </div>
          { this.props.width == 299 &&
            <div style={{display:'inline-block', width:220, marginLeft:6, marginTop:36}}>
              <div style={{fontSize:13, lineHeight:'14px'}}>Welcome,</div>
              <div style={{fontSize:17, lineHeight:'34px'}}>Feng Xiao</div>
              <div style={{fontSize:12, lineHeight:'24px'}}>User type: admin</div>
            </div>
          }
        </div>
        { nav_items.map((item, index)=>
          <div onClick={item.childern?()=>this.setState({showSubitem: item.name == this.state.showSubitem?'None':item.name})
            :()=>this.changeRoute(item.link)} 
            key={index}
            className={'nav-item' + (this.props.root == item.name?' in-focus':'') + (this.props.width===70?'':' expanded')}>
            <div style={{width:39, display:'inline-block', textAlign:'center', marginLeft:15, height:45,lineHeight:'45px'}}>
              <i className={item.icon}></i>
            </div>
            {this.props.width===299 && 
              <div style={{textAlign:'left', padding: '0 18px 0 15px', width:196, marginRight:15, height:45,lineHeight:'45px',
                display:'inline-block', verticalAlign:'top'}}>
                <span style={{color:'inherit', textDecoration:'none', marginRight: item.childern?10:0,
                fontSize:15,fontFamily: "Raleway Webfont", verticalAlign:'top', }} 
                >
                  {t(item.name)}
                </span>      
                { item.childern && 
                  <i class={this.state.showSubitem == item.name?"fa arrow menu-expand-arrow":"fa arrow menu-collapsed-arrow"}></i>
                }
              </div>
            }
            {this.props.width===299 &&  item.childern && this.state.showSubitem == item.name && 
              item.childern.map( child => 
              <div onClick={()=>this.changeRoute(child.link)} 
                className={'nav-item-child' + (child.link == this.props.path?' in-focus':'')}>
                {child.name}
              </div>)
            }
            <div className='nav-item-hover' onClick={item.childern?()=>this.setState({expanded:!this.state.expanded}):null}>
              <div style={{textAlign:'left', padding: '0 18px 0 15px', lineHeight:'45px'}}>
                <span style={{color:'inherit', textDecoration:'none', marginRight: item.childern?10:0,
                fontSize:15,fontFamily: "Raleway Webfont", verticalAlign:'top', }} 
                >
                  {item.name}
                </span>      
                { item.childern && 
                  <i className={this.state.expanded?"fa arrow menu-expand-arrow":"fa arrow menu-collapsed-arrow"}></i>
                }
              </div>
              { item.childern && this.state.expanded && 
                item.childern.map( child => 
                <div onClick={()=>this.changeRoute(child.link)} 
                  className={'dark-background' + (child.link==this.props.path?' in-focus':'')}>
                  {child.name}
                </div>)
              }
            </div>    
          </div>
        )}
        <div className='nav-divider'><div style={{height:2, background:'#8E8D93'}}></div></div>

        { nav_items_internal.map((item, index)=>
          <div onClick={item.childern?()=>this.setState({showSubitem: item.name == this.state.showSubitem?'None':item.name})
            :()=>this.changeRoute(item.link)}
            key={index}
            className={'nav-item' + (this.props.root == item.name?' in-focus':'') + (this.props.width===70?'':' expanded')}>
            <div style={{width:39, display:'inline-block', textAlign:'center', marginLeft:15, height:45,lineHeight:'45px'}}>
              <i className={item.icon}></i>
            </div>
            {this.props.width===299 && 
              <div style={{textAlign:'left', padding: '0 18px 0 15px', width:196, marginRight:15, height:48,lineHeight:'48px',
                display:'inline-block', verticalAlign:'top'}}>
                <span style={{color:'inherit', textDecoration:'none', marginRight: item.childern?10:0,
                fontSize:15,fontFamily: "Raleway Webfont", verticalAlign:'top', }} 
                >
                  {item.name}
                </span>      
                { item.childern && 
                  <i className={this.state.showSubitem == item.name?"fa arrow menu-expand-arrow":"fa arrow menu-collapsed-arrow"}></i>
                }
              </div>
            }
            {this.props.width===299 &&  item.childern && this.state.showSubitem == item.name && 
              item.childern.map( child => 
              <div onClick={()=>this.changeRoute(child.link)} 
                className={'nav-item-child' + (child.link == this.props.path?' in-focus':'')}>
                {child.name}
              </div>)
            }
            <div className='nav-item-hover' onClick={item.childern?()=>this.setState({expanded:!this.state.expanded}):null}>
              <div style={{textAlign:'left', padding: '0 18px 0 15px', lineHeight:'48px'}}>
                <span style={{color:'inherit', textDecoration:'none', marginRight: item.childern?10:0,
                fontSize:15,fontFamily: "Raleway Webfont", verticalAlign:'top', }} 
                >
                  {item.name}
                </span>      
                { item.childern && 
                  <i className={this.state.expanded?"fa arrow menu-expand-arrow":"fa arrow menu-collapsed-arrow"}></i>
                }
              </div>
              { item.childern && this.state.expanded && 
                item.childern.map( child => 
                <div onClick={()=>this.changeRoute(child.link)} 
                  className={'dark-background' + (child.link==this.props.path?' in-focus':'')}>
                  {child.name}
                </div>)
              }
            </div>
          </div>
        )}        
        <div className='nav-item' style={{height:'calc( 100vh - 804px )'}}></div>
        <div className='nav-handle' onClick={this.props.toggleWidth}
        style={{position:'fixed', left:this.props.width - 1, top: '48.5vh', width:14, height:63, 
        borderWidth: '1px 1px 1px 1px', borderRadius: '0 5px 5px 0', zIndex:2,
        borderStyle:'solid', borderColor:'#ccc #ccc #ccc rgb(234, 233, 231)',
        background:'#eae9e7'}}>
        </div>
      </div> 
    );
  }
}

export default withNamespaces('translation')(Navigation);