import React from 'react';
import axios from 'axios';
import Speech from 'speak-tts'; // es6

import { EditDoc } from '../components/edit-doc';

const speech = new Speech(); // will throw an exception if not browser supported
if (speech.hasBrowserSupport()) {
  // returns a boolean
  console.log('speech synthesis supported');
}

speech
  .init({
    volume: 1,
    lang: 'en-US',
    rate: 0.8,
    pitch: 1,
    voice: 'Microsoft Zira Desktop - English (United States)',
    splitSentences: true,
  })
  .then(data => {
    // The "data" object contains the list of available voices and the voice synthesis params
    console.log('Speech is ready, voices are available'); //, data);
  })
  .catch(e => {
    console.error('An error occured while initializing : ', e);
  });

const LOADING = 0;
const EMPTY = 1;
const GUESSING = 2;
const GIVE_UP = 3;
const HIT = 4;
const EDITING = 5;

export class GuessPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      state: LOADING,
      inputText: '',
      showFullText: true,
    };
  }

  keyHandling = e => {
    // console.log(e.keyCode);

    if (e.keyCode === 37) {
      // left
      this.handlePrev();
    } else if (e.keyCode === 39) {
      // right
      this.handleNext();
    } else if (e.keyCode === 38) {
      // up
      if (this.state.docs && this.state.docs.length > 0) {
        const doc = this.state.docs[this.state.index];
        let full_text = doc.full_text; // doc.question.replace(/_\$\d+_/g, '____');

        speech
          .speak({
            text: full_text,
          })
          .then(() => {
            //console.log('Success !');
          })
          .catch(e => {
            console.error('An error occurred :', e);
          });
      }
    } else if (e.keyCode === 40) {
      // down
      this.handleGiveUp();
    }
  };

  async componentDidMount() {
    const result = await axios.get('/session?count=100');

    let docs = result.data;

    if (docs.length === 0) {
      this.setState({
        state: EMPTY,
      });
    } else {
      docs.forEach(doc => {
        doc.bar_text = this.makeBarText(doc);
        doc.full_text = this.makeFullText(doc);
        doc.slot_text = this.makeSlotText(doc);
      });

      this.setState({
        docs: docs,
        index: 0,
        state: GUESSING,
        errorText: '',
        inputText: '',
      });

      window.addEventListener('keyup', this.keyHandling);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyHandling);
  }

  render() {
    if (this.state.state === LOADING) {
      return this.renderLoading();
    } else if (this.state.state === EMPTY) {
      return this.renderEmpty();
    } else if (this.state.state === GUESSING) {
      return this.renderDocGuessing();
    } else if (this.state.state === EDITING) {
      return this.renderDocEditing();
    } else {
      return this.renderDocGiveUp();
    }
  }

  handlePrev = e => {
    if (this.state.index > 0) {
      const prevIndex = this.state.index - 1;
      this.setState({
        index: prevIndex,
        state: GUESSING,
        errorText: '',
        inputText: '',
      });
    }
  };

  handleNext = e => {
    if (this.state.index < this.state.docs.length - 1) {
      const nextIndex = this.state.index + 1;
      this.setState({
        index: nextIndex,
        state: GUESSING,
        errorText: '',
        inputText: '',
      });
    }
  };

  handleTry = async e => {
    if (this.state.state === GUESSING) {
      const doc = this.state.docs[this.state.index];

      const input_text = this.state.inputText.trim().toLowerCase();
      const answer = doc.answer.toLowerCase();

      if (input_text !== answer) {
        this.setState({
          errorText: '아닙니다~',
        });
      } else {
        const result = await axios.post('/session/guess', {
          docId: doc.id,
          hit: true,
        });
        console.log(result.data);

        this.setState({
          state: HIT,
        });
      }
    }
  };

  handleGiveUp = async e => {
    if (this.state.state !== GIVE_UP) {
      const doc = this.state.docs[this.state.index];

      const result = await axios.post('/session/guess', {
        docId: doc.id,
        hit: false,
      });
      // console.log(result.data);

      this.setState({
        state: GIVE_UP,
      });
    }
  };

  handleEdit = e => {
    this.setState({
      state: EDITING,
    });
  };

  handleDoneEditing = async doc_content => {
    const docs = this.state.docs;
    const doc = this.state.docs[this.state.index];

    const { question, answer, description } = doc_content;
    // console.log(doc_content);

    try {
      const result = await axios.put(`/doc/${doc.id}`, {
        question,
        answer,
        description,
      });

      doc.question = result.data.question;
      doc.answer = result.data.answer;
      doc.description = result.data.description;
      doc.bar_text = this.makeBarText(doc);
      doc.full_text = this.makeFullText(doc);
      doc.slot_text = this.makeSlotText(doc);

      setTimeout(() => {
        this.setState({
          docs,
          state: GUESSING,
        });
      }, 0);

      return { message: 'OK' };
    } catch (error) {
      return { message: error.response.data.message };
    }

    return { clear: false, message: '' };
  };

  handleChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    this.setState({ [name]: value });
  };

  renderDocGuessing() {
    const doc = this.state.docs[this.state.index];

    return (
      <div>
        {this.renderHeader()}
        <div>{this.renderOptionBox()}</div>
        <div className="doc">
          <div className="question">
            <h3>{this.state.showFullText ? doc.full_text : doc.bar_text}</h3>
          </div>
          {this.state.errorText ? this.renderErrorText() : ''}
          {this.renderAnswerBox()}
        </div>
        {this.renderFooter()}
      </div>
    );
  }

  renderDocEditing() {
    const doc = this.state.docs[this.state.index];

    return (
      <div>
        {this.renderHeader()}
        <EditDoc
          question={doc.slot_text}
          answer={doc.answer}
          description={doc.description}
          handleSubmit={this.handleDoneEditing}
        />
        {this.renderFooter()}
      </div>
    );
  }

  renderDocGiveUp() {
    const doc = this.state.docs[this.state.index];

    return (
      <div>
        {this.renderHeader()}

        <div className="doc">
          <div className="question">
            <h3>{doc.full_text}</h3>
          </div>
          <div className="detail">
            <h4>{doc.description}</h4>
          </div>
        </div>
        {this.renderFooter()}
      </div>
    );
  }

  renderHeader() {
    return (
      <div className="header">
        <div className="progress">
          <div>{`${this.state.index + 1}/${this.state.docs.length}`}</div>
        </div>
      </div>
    );
  }

  renderOptionBox() {
    return (
      <div className="option-box">
        <label htmlFor="showFullText">Show full text</label>
        <input
          type="checkbox"
          id="showFullText"
          name="showFullText"
          checked={this.state.showFullText}
          onChange={this.handleChange}
        ></input>
      </div>
    );
  }

  renderFooter() {
    if (this.state.state !== EDITING) {
      return (
        <div className="footer">
          <div className="nav">
            <button onClick={this.handlePrev}>Previous</button>
            <button onClick={this.handleNext}>Next</button>
            <button onClick={this.handleEdit}>Edit</button>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  renderAnswerBoxOld() {
    return (
      <div className="answer">
        <input
          id="inputText"
          name="inputText"
          onChange={this.handleChange}
        ></input>
        <button onClick={this.handleTry}>Try</button>
        <button onClick={this.handleGiveUp}>Give Up</button>
      </div>
    );
  }

  renderAnswerBox() {
    return (
      <div className="answer">
        <button onClick={this.handleGiveUp}>Show Description</button>
      </div>
    );
  }

  renderErrorText() {
    return <div className="error">{this.state.errorText}</div>;
  }

  renderLoading() {
    return <div>Loading</div>;
  }

  renderEmpty() {
    return <div>No document</div>;
  }

  makeBarText(doc) {
    let bar_text = doc.question;

    for (let i = 0; i < doc.answerLength; ++i) {
      const slot_string = `_$${i + 1}_`;
      bar_text = bar_text.replace(slot_string, '____');
    }

    return bar_text;
  }

  makeFullText(doc) {
    const answer_list = doc.answer.split(' ');
    let full_text = doc.question;

    for (let i = 0; i < doc.answerLength; ++i) {
      const slot_string = `_$${i + 1}_`;
      full_text = full_text.replace(slot_string, answer_list[i]);
    }

    return full_text;
  }

  makeSlotText(doc) {
    let slot_text = doc.question;

    for (let i = 0; i < doc.answerLength; ++i) {
      const slot_string = `_$${i + 1}_`;
      slot_text = slot_text.replace(slot_string, '&&&&');
    }

    return slot_text;
  }
}
