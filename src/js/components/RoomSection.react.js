import React from 'react';
import RoomListItem from './RoomListItem.react';
import RoomStore from '../stores/RoomStore';
const assign = Object.assign;

export default class RoomSection extends React.Component {

  constructor(props) {
    super();
    RoomStore.requestClients(props.session.id);
 
    this.state = assign({}, props, { 
      unreadCount: 0,
      rooms: [],
      currentClientID: RoomStore.getCurrentClientID()
    });   
  }

  componentDidMount() {
    RoomStore.addClickRoomListener(this._onChange.bind(this));
    RoomStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    RoomStore.removeClickRoomListener(this._onChange.bind(this));
    RoomStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    
    var roomListItems =  this.state.rooms.map(function(room) {
      return (
        <RoomListItem
          key={room.id}
          room={room}
          currentClientID={ this.state.currentClientID }
          parentID={ this.state.session.id }
        />
      );
    }, this);
   
    var unread = this.state.unreadCount === 0 ? null : <span>Unread threads: { this.state.unreadCount }</span>;
    
    return (
      <div className="thread-section">
        <div className="thread-count">
          {unread}
        </div>
        <ul className="thread-list">
          {roomListItems}
          </ul>
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange() {
    let rooms = RoomStore.getAllClients().map(function(client){
      return {
        id: client.id, 
        name: client.name, 
        lastMessage: client.lastMessage
      }
    });
   
    this.state.rooms = rooms;
    this.state.currentClientID = RoomStore.getCurrentClientID();
    this.setState(this.state);
  }

};
