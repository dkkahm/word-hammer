import React from 'react';

export class InputPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <button>To Guess Page</button>
        </div>

        <div className="doc">
          <form>
            <div className="question">
              <textarea name="question" id="question"></textarea>
            </div>
            <div className="answer">
              <textarea name="answer" id="answer"></textarea>
            </div>
            <div>
              <button>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
