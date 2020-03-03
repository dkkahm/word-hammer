import React from 'react';
import axios from 'axios';
import { EditDoc } from '../components/edit-doc';

export class InputPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: '',
      answer: '',
      description: '',
    };
  }

  handleSubmit = async doc => {
    const { question, answer, description } = doc;

    try {
      /*const result = */ await axios.post('/doc', {
        question,
        answer,
        description,
      });

      return { clear: true, message: 'OK' };
    } catch (error) {
      return { message: error.response.data.message };
    }
  };

  render() {
    return (
      <EditDoc
        question={this.state.question}
        answer={this.state.answer}
        description={this.state.description}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}
