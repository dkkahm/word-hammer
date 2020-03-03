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

const GUESSING = 0;
const GIVE_UP = 1;
const HIT = 2;
const EDITING = 3;

export class GuessPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
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
        let full_text = this.makeFullText(doc); // doc.question.replace(/_\$\d+_/g, '____');

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
    this.setState({
      docs: result.data,
      index: 0,
      state: GUESSING,
      errorText: '',
      inputText: '',
    });

    window.addEventListener('keyup', this.keyHandling);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyHandling);
  }

  render() {
    if (this.state.docs) {
      if (this.state.state === GUESSING) {
        return this.renderDocGuessing();
      } else if (this.state.state === EDITING) {
        return this.renderDocEditing();
      } else {
        return this.renderDocGiveUp();
      }
    } else {
      return this.renderLoading();
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
    const doc = this.state.docs[this.state.index];
    const { question, answer, description } = doc_content;

    try {
      /*const result = */ await axios.put(`/doc/${doc.id}`, {
        question,
        answer,
        description,
      });

      const docs = this.state.docs;
      docs[this.state.index] = {
        id: doc.id,
        ...doc_content,
      };

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
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  renderDocGuessing() {
    const doc = this.state.docs[this.state.index];

    let question = this.makeFullText(doc); // doc.question.replace(/_\$\d+_/g, '____');

    return (
      <div>
        {this.renderHeader()}
        <div></div>
        <div className="doc">
          <div className="question">
            <h3>{question}</h3>
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

    let question = this.makeFullText(doc); // doc.question.replace(/_\$\d+_/g, '____');

    return (
      <div>
        {this.renderHeader()}
        <EditDoc
          question={question}
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

    let give_up_text = this.makeFullText(doc);

    return (
      <div>
        {this.renderHeader()}

        <div className="doc">
          <div className="question">
            <h3>{give_up_text}</h3>
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

  makeFullText(doc) {
    const answer_list = doc.answer.split(' ');
    let give_up_text = doc.question;

    for (let i = 0; i < doc.answerLength; ++i) {
      const slot_text = `_$${i + 1}_`;
      give_up_text = give_up_text.replace(slot_text, answer_list[i]);
    }

    return give_up_text;
  }
}
