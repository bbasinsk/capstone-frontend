import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Carousel, Button } from 'antd';
import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';
import Page4 from './page4';

class ConfirmModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  next = () => {
    this.carousel.next();
  };

  prev = () => {
    this.carousel.prev();
  };

  render() {
    return (
      <div>
        <Modal
          title="Welcome"
          visible={this.props.visible}
          onOk={this.props.closeModal}
          onCancel={this.props.closeModal}
        >
          <Carousel
            ref={carousel => {
              this.carousel = carousel;
            }}
            beforeChange={(current, next) =>
              this.setState({ slideIndex: next })
            }
            afterChange={() => console.log(this.state.slideIndex)}
          >
            <Page1 />
            <Page2 />
            <Page3 />
            <Page4 />
          </Carousel>
          {this.state.slideIndex !== 0 && (
            <Button onClick={this.prev} disabled={this.state.slideIndex === 0}>
              Prev
            </Button>
          )}
          {this.state.slideIndex !== 3 && (
            <Button onClick={this.next}>Next</Button>
          )}
        </Modal>
      </div>
    );
  }
}

export default ConfirmModal;
