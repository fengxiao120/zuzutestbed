import React from "react"

const t = str => str

class Header extends React.Component {
  render() {
    return (    
      <div className='header'>
        <div style={{ position:'relative', maxWidth:80, textAlign:'center', padding:'0 6px', display:'flex', alignItems:'center'}}>
          {t('One-click check-in')}
          { this.props.tab == 'one-click-check-in' && 
            <div style={{width: 'calc( 100% - 12px )', position:'absolute', background:'#f36f31', height:5, bottom:0 }}></div>
          }
        </div>
        <div style={{ position:'relative', maxWidth:80, textAlign:'center', padding:'0 6px', display:'flex', alignItems:'center'}}>
          {t('Complete check-in')}
        </div>   
        <div style={{ position:'relative', maxWidth:80, textAlign:'center', padding:'0 6px', display:'flex', alignItems:'center'}}>
          {t('No show')}
        </div>
        <div style={{ position:'relative', maxWidth:80, textAlign:'center', padding:'0 6px', display:'flex', alignItems:'center'}}>
          {t('Cancel booking')}
        </div>                     
      </div>
    );
  }
}

export default Header;