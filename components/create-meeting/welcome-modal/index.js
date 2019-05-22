import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Carousel, Button, Icon } from 'antd';
import Page from './page';
import config from './config';

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
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          bodyStyle={{
            position: 'relative',
            padding: 0
          }}
          centered
          footer={
            this.state.slideIndex === 4 ? (
              <Button type="primary" onClick={this.props.closeModal}>
                Close
              </Button>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <Button onClick={this.props.closeModal}>Skip</Button>
              </div>
            )
          }
        >
          <Carousel
            ref={carousel => {
              this.carousel = carousel;
            }}
            beforeChange={(_, next) => this.setState({ slideIndex: next })}
          >
            <Page
              title={config[0].title}
              desc={config[0].desc}
              imgUrl={config[0].imgUrl}
            />
            <Page
              title={config[1].title}
              desc={config[1].desc}
              imgUrl={config[1].imgUrl}
            />
            <Page
              title={config[2].title}
              desc={config[2].desc}
              imgUrl={config[2].imgUrl}
            />
            <Page
              title={config[3].title}
              desc={config[3].desc}
              imgUrl={config[3].imgUrl}
            />
            <Page
              title={config[4].title}
              desc={config[4].desc}
              imgUrl={config[4].imgUrl}
            />
          </Carousel>

          {this.state.slideIndex !== 0 && (
            <Button
              shape="circle"
              onClick={this.prev}
              disabled={this.state.slideIndex === 0}
              style={{ position: 'absolute', left: 20, top: 256 }}
            >
              <Icon type="left" />
            </Button>
          )}
          {this.state.slideIndex !== 4 && (
            <Button
              shape="circle"
              onClick={this.next}
              style={{ position: 'absolute', right: 20, top: 256 }}
            >
              <Icon type="right" />
            </Button>
          )}
        </Modal>
        <style jsx global>{`
          .ant-carousel .slick-dots li button {
            background: gray;
          }
          .ant-carousel .slick-dots li.slick-active button {
            background: gray;
          }
        `}</style>
      </div>
    );
  }
}

export default ConfirmModal;
