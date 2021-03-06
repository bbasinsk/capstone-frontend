import React from 'react';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';

class Quill extends React.Component {
  static propTypes = {
    agendaItemId: PropTypes.number.isRequired,
    connection: PropTypes.any.isRequired
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

    // Create local doc instance for the agenda item
    const doc = this.props.connection.get(
      'agenda_notes',
      `${this.props.agendaItemId}`
    );

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
      <div className="react-quill--wrapper">
        {ReactQuill && (
          <ReactQuill
            className="react-quill"
            theme="snow"
            placeholder="Notes..."
            ref={el => {
              this.reactQuillRef = el;
            }}
          />
        )}
        <style jsx global>{`
          .react-quill--wrapper {
            height: 100%;
            border-left: 1px solid #e8e8e8;
            word-break: break-all;
          }

          .react-quill {
            height: 100%;
          }

          .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid #e8e8e8;
          }

          .ql-container.ql-snow {
            border: none;
          }
        `}</style>
      </div>
    );
  }
}

export default Quill;
