import React from 'react';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="nav">
          <button onClick={() => this.props.history.push('/')}>
            To Guess Page
          </button>
          <button onClick={() => this.props.history.push('/input')}>
            To Input Page
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
