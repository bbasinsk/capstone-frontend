import React from 'react';
import sharedb from 'sharedb/lib/client';
import StringBinding from 'sharedb-string-binding';
import WebSocket from 'reconnecting-websocket';

// https://github.com/share/sharedb/tree/master/examples/textarea
export default class ShareJS extends React.Component {
  constructor(props) {
    super(props);
    this.textarea = React.createRef();
  }

  componentDidMount = () => {
    const socket = new WebSocket(
      (window.location.protocol === 'http:' ? 'ws://' : 'wss://') +
        window.location.host
    );
    const connection = new sharedb.Connection(socket);

    const doc = connection.get('examples', 'textarea');

    doc.subscribe(err => {
      if (err) throw err;

      const binding = new StringBinding(this.textarea.current, doc, [
        'content'
      ]);
      binding.setup();
    });
  };

  render() {
    return (
      <div>
        <h1>ShareJS</h1>
        {/* TODO: dont use refs-- https://github.com/dmapper/react-sharedb */}
        <textarea ref={this.textarea} />
      </div>
    );
  }
}
