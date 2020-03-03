import React from 'react';
import axios from 'axios';

const GUESSING = 0;
const GIVE_UP = 1;
const HIT = 2;

export class GuessPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
    };
  }

  async componentDidMount() {
    const result = await axios.get('/api/session?count=100');
    this.setState({
      docs: result.data,
      index: 0,
      state: GUESSING,
      errorText: '',
      inputText: '',
    });
  }

  render() {
    if (this.state.docs) {
      if (this.state.state === GUESSING) {
        return this.renderDocGuessing();
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
        const result = await axios.post('/api/session/guess', {
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

      const result = await axios.post('/api/session/guess', {
        docId: doc.id,
        hit: false,
      });
      // console.log(result.data);

      this.setState({
        state: GIVE_UP,
      });
    }
  };

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  renderDocGuessing() {
    const doc = this.state.docs[this.state.index];

    let question = doc.question.replace(/_\$\d+_/g, '____');

    return (
      <div>
        {this.renderHeader()}
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

  renderDocGiveUp() {
    const doc = this.state.docs[this.state.index];

    let give_up_text = this.makeGiveUpText(doc);

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
        <div className="nav">
          <button>To Input Page</button>
        </div>
        <div className="progress">
          <div>{`${this.state.index + 1}/${this.state.docs.length}`}</div>
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className="footer">
        <div className="nav">
          <button onClick={this.handlePrev}>Previous</button>
          <button onClick={this.handleNext}>Next</button>
        </div>
      </div>
    );
  }

  renderAnswerBox() {
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

  renderErrorText() {
    return <div className="error">{this.state.errorText}</div>;
  }

  renderLoading() {
    return <div>Loading</div>;
  }

  makeGiveUpText(doc) {
    const answer_list = doc.answer.split(' ');
    let give_up_text = doc.question;

    for (let i = 0; i < doc.answerLength; ++i) {
      const slot_text = `_\$${i + 1}_`;
      give_up_text = give_up_text.replace(slot_text, answer_list[i]);
    }

    return give_up_text;
  }
}
