import React from 'react';

export class EditDoc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      answer: this.props.answer,
      description: this.props.description,
      resultText: '',
    };
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
