import React from 'react';
import 'react-quill/dist/quill.snow.css';

class Quill extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line global-require
      this.ReactQuill = require('react-quill');
    }

    this.state = {
      text: [{ insert: 'Hello world!' }]
    };

    this.quillRef = null; // Quill instance
    this.reactQuillRef = null; // ReactQuill component
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  handleChange() {
    if (typeof this.quillRef.getEditor !== 'function') {
      return;
    }
    console.log(this.quillRef.getEditor().getContents());
    // this.setState({ text: e.target.value });
  }

  render() {
    const { ReactQuill } = this;

    return (
      <div>
        Quill
        {ReactQuill && (
          <ReactQuill
            ref={el => {
              this.reactQuillRef = el;
            }}
            value={this.state.text}
          />
        )}
      </div>
    );
  }
}

export default Quill;
