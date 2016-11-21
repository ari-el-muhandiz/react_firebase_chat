import ChatMessageActionCreators from '../actions/ChatMessageActionCreators';
import React from 'react';

const ENTER_KEY_CODE = 13;

export default class MessageComposer extends React.Component {

  constructor(props) {
    super();
    this.state = {text: ''};
  };

  render() {
    return (
      <textarea
        className="message-composer"
        name="message"
        value={this.state.text}
        onChange={this._onChange.bind(this)}
        onKeyDown={this._onKeyDown.bind(this)}
      />
    );
  };

  _onChange(event, value) {
    this.setState({text: event.target.value});
  };

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        ChatMessageActionCreators.CreateMessage(text, this.props.roomID, this.props.authorName);
      }
      this.setState({text: ''});
    }
  }

};

MessageComposer.propTypes = {
  roomID: React.PropTypes.string.isRequired
}