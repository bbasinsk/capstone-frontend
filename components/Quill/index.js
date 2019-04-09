import React from 'react';
import PropTypes from 'prop-types';
import sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import ReconnectingWebSocket from 'reconnecting-websocket';
import 'react-quill/dist/quill.snow.css';

sharedb.types.register(richText.type);

class Quill extends React.Component {
  static propTypes = {
    agendaItemId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line global-require
      this.ReactQuill = require('react-quill');
    }

    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
  }

  componentDidMount() {
    this.attachQuillRefs();

    const socket = new ReconnectingWebSocket(
      (window.location.protocol === 'http:' ? 'ws://' : 'wss://') +
        window.location.host
    );
    const connection = new sharedb.Connection(socket);

    // Create local doc instance for the agenda item
    const doc = connection.get('agenda_notes', `${this.props.agendaItemId}`);

    // subscribe to changes
    doc.subscribe(err => {
      if (err) throw err;

      // create a document if it doesn't exist
      if (doc.type === null) {
        doc.create([], 'rich-text', () => {});
      }

      // set quill to current data
      this.quillRef.setContents(doc.data);

      // set up new updates
      doc.on('op', (op, source) => {
        if (source === this.quillRef) return;
        this.quillRef.updateContents(op);
      });
    });

    // submit local changes to the database
    this.quillRef.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;
      doc.submitOp(delta, { source: this.quillRef });
    });
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  render() {
    const { ReactQuill } = this;

    return (
      <div>
        agendaItemId :{this.props.agendaItemId}
        {ReactQuill && (
          <ReactQuill
            ref={el => {
              this.reactQuillRef = el;
            }}
          />
        )}
      </div>
    );
  }
}

export default Quill;
