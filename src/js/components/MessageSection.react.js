import React from 'react';
import classNames from 'classnames';

import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import MessageStore from '../stores/MessageStore';
import RoomStore from '../stores/RoomStore';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getMessageListItem(message) {
  return (
    <MessageListItem
      key={message.id}
      message={message}
    />
  );
}

export default class MessageSection extends React.Component {

  constructor(props) {
    super();
    let session = props.session;

    this.state = {
      session,
      currentRoom: {},
      messages: []
    };

    if(session.type === 'client') {
      
      this.state.currentRoom = {
        id: session.clientId + '_' + session.id,
        name: session.name
      }

    }
    else {
      this.state.messages = [
        { 
          text: 'Please Select Client first!',
          id: 'xxx',
          authorName: 'Information',
          created: Date.now()
        }
      ]
    }

    if(this.state.currentRoom.id) {
      MessageStore.requestMessages(this.state.currentRoom.id);
    }
   
  };

  watchOnAdded() {
    if(this.state.currentRoom.id) {
       MessageStore.listenLastMessage(this.state.currentRoom.id);   
    }
  };

  stopWatchOnAdded() {
    if(this.state.currentRoom.id) {
       MessageStore.removeWatchLastOnAdded(this.state.currentRoom.id);   
    }
  };

  componentDidMount() {
    this._scrollToBottom();
    this.watchOnAdded();
    MessageStore.addChangeListener(this._onChange.bind(this));
    RoomStore.addClickRoomListener(this._onChange.bind(this));
  };

  componentWillUnmount() {
    this.stopWatchOnAdded();
    MessageStore.removeChangeListener(this._onChange.bind(this));
    RoomStore.removeClickRoomListener(this._onChange.bind(this));
  };

  componentDidUpdate() {
    this._scrollToBottom();
  };

  render() {
    let messageListItems = this.state.messages.map(getMessageListItem);

    let ComposerItem = null;
  
    if(this.state.session.type === 'supervisor' && !this.state.currentRoom.id) {
      ComposerItem = null;
    }
    else {
      ComposerItem = <MessageComposer roomID={this.state.currentRoom.id} authorName={this.state.session.name} />;
    }

    const spanStyle = {
      float: 'right',
      fontSize: 'small',
      lineHeight: '25px'
    };

    return (
      <div className={classNames({
          'message-section': true,
          'client': this.state.session.type === 'client'
        })} >
        <h3 className="message-thread-heading">
          Demo Chat { this.state.session.type.capitalize() } App
          <span style={spanStyle}>Hi, { this.state.session.name }</span>
        </h3>
        <ul className="message-list" ref="messageList">
          { messageListItems } 
        </ul>
          { ComposerItem }
      </div>
    );
  };

  _scrollToBottom() {
    var ul = this.refs.messageList;
    ul.scrollTop = ul.scrollHeight;
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange(roomID, roomName) {
    if(roomID && roomName) {
      this.stopWatchOnAdded();
      this.state.currentRoom = {
        id: roomID,
        name: roomName
      }
      this.watchOnAdded();
    }
    this.state.messages = MessageStore.getMessages();
    this.setState(this.state);
  }

};