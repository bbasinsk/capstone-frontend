import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon, Button } from 'antd';

let id = 0;

export default class Members extends React.Component {
  static propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired
  };

  remove = k => {
    // can use data-binding to get
    const keys = this.props.getFieldValue('memberKeys');

    // can use data-binding to set
    this.props.setFieldsValue({
      memberKeys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    // can use data-binding to get
    const keys = this.props.getFieldValue('memberKeys');
    // eslint-disable-next-line no-plusplus
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    this.props.setFieldsValue({
      memberKeys: nextKeys
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    getFieldDecorator('memberKeys', { initialValue: [] });
    const keys = getFieldValue('memberKeys');
    const formItems = keys.map(k => (
      <Form.Item {...formItemLayout} required={false} key={k}>
        {getFieldDecorator(`members[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              type: 'email',
              message: 'Please enter a valid email'
            },
            {
              required: true,
              message: 'Please enter an email'
            }
          ]
        })(
          <Input
            placeholder="Member email"
            style={{ width: '50%', marginRight: 8 }}
          />
        )}

        <Icon
          className="dynamic-delete-button"
          type="close"
          onClick={() => this.remove(k)}
        />
      </Form.Item>
    ));

    return (
      <div>
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button type="dashed" onClick={this.add} style={{ width: '50%' }}>
            <Icon type="user-add" /> Add Member
          </Button>
        </Form.Item>
      </div>
    );
  }
}
