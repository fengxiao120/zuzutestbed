
import React, { PureComponent } from 'react';
import Loader from 'react-loader-spinner'
import Modal from 'react-modal';

const modalCustomStyles = {
  content : {
    top                   : 30,
    bottom                : 30,
    width                 : 100,
    height:100,
    margin                : 'auto',
    background: 'transparent',
    border: 'none',
  }
};

if(document.getElementById('react-promotions'))
  Modal.setAppElement('#react-promotions')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(51, 51, 51, 0.65)';
Modal.defaultStyles.overlay.zIndex = '1040';



class Spinner extends PureComponent {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.spinning}
          onRequestClose={this.props.stop}
          style={modalCustomStyles}
          contentLabel="Spinner"
        >
          <Loader 
            type="Oval"
            color="#ccc"
            height="100" 
            width="100"
          />       
        </Modal>
      </div>
    );
  }
}

export default Spinner;
