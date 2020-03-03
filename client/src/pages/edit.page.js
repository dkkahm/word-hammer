import React from 'react';
import axios from 'axios';
import { EditDoc } from '../components/edit-doc';

export class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      question: '',
      answer: '',
      description: '',
    };
  }

  async componentDidMount() {
    const result = await axios.get(`/doc/${this.props.match.params.docId}`);
    const doc = result.data;
    console.log(doc);

    this.setState({
      id: doc.id,
      question: doc.question,
      answer: doc.answer,
      description: doc.description,
    });
  }

  handleSubmit = async doc => {
    const { question, answer, description } = doc;

    try {
      /*const result = */ await axios.put(`/doc/${this.state.id}`, {
        question,
        answer,
        description,
      });

      return { message: 'OK' };
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
