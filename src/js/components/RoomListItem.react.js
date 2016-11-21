import ChatRoomActionCreators from '../actions/ChatRoomActionCreators';
import React from 'react';
import classNames from 'classnames';

const ReactPropTypes = React.PropTypes;

export default class RoomListItem extends React.Component {

  render() {
    let room = this.props.room;
    let lastMessage = room.lastMessage;
    
    let lastMessageDate = lastMessage && lastMessage.created ? new Date(lastMessage.created).toLocaleTimeString() : null;
    let lastMessageText = lastMessage && lastMessage.text ? lastMessage.text : null;

    return (
      <li
        className={classNames({
          'thread-list-item': true,
          'active': room.id === this.props.currentClientID
        })}
        onClick={ this._onClick.bind(this) } ref="messageItem">
        <h5 className="thread-name">{room.name}</h5>
        <div className="thread-time">
          { lastMessageDate }
        </div>
        <div className={classNames({
          'thread-last-message': true,
          'unread': lastMessage.isRead === false && room.id !== this.props.currentClientID
        })}>
          { lastMessageText }
        </div>
      </li>
    );
  }

  _onClick() {
    ChatRoomActionCreators.clickRoom(this.props.room.id, this.props.parentID);
  }

};

RoomListItem.propTypes = {
    room: ReactPropTypes.object,
    currentClientID: ReactPropTypes.string
}