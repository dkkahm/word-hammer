import React from 'react';

export class EditDoc extends React.Component {
  constructor(props) {
    super(props);

    console.log('props=', this.props);

    this.state = {
      question: props.question,
      answer: props.answer,
      description: props.description,
      resultText: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      question: nextProps.question,
      answer: nextProps.answer,
      description: nextProps.description,
      resultText: '',
    });
  }

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const question = this.state.question.trim();
    const answer = this.state.answer.trim();
    const description = this.state.description.trim();

    if (!question || !description) {
      return this.setState({
        resultText: '빈 문자열 !!!',
      });
    }

    const result = await this.props.handleSubmit({
      question,
      answer,
      description,
    });
    // console.log(result);

    if (result.clear) {
      this.setState({
        question: '',
        answer: '',
        description: '',
        resultText: result.message,
      });
    } else {
      this.setState({
        resultText: result.message,
      });
    }
  };

  render() {
    return (
      <div className="input-page">
        <div className="doc">
          <div className="hint">
            <h3>slot text is &&&&</h3>
          </div>
          <div className="result">{this.state.resultText || ''}</div>
          <div className="question">
            <label htmlFor="question">Question</label>
            <textarea
              name="question"
              id="question"
              rows="3"
              cols="100"
              onChange={this.handleChange}
              value={this.state.question}
            ></textarea>
          </div>
          <div className="answer">
            <label htmlFor="answer">Answer</label>
            <input
              name="answer"
              id="answer"
              onChange={this.handleChange}
              value={this.state.answer}
            ></input>
          </div>
          <div className="description">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows="3"
              cols="100"
              onChange={this.handleChange}
              value={this.state.description}
            ></textarea>
          </div>
          <div>
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
}
