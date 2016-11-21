import React from 'react';

const ReactPropTypes = React.PropTypes;

export default class MessageListItem extends React.Component {

  render() {
    var message = this.props.message;
    var messageDate = new Date(message.created).toLocaleTimeString();
    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.authorName}</h5>
        <div className="message-time">
          {messageDate}
        </div>
        <div className="message-text">{message.text}</div>
      </li>
    );
  };

};

MessageListItem.propTypes = {
  message: ReactPropTypes.object
}