import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import {
  EventEmitter
} from 'events';
import axios from 'axios';
import MessageStore from './MessageStore';

import each from 'async/each';

const assign = Object.assign;

const ActionTypes = ChatConstants.ActionTypes;
const CHANGE_EVENT = 'change';
const ROOM_CLICK = 'room_clicked';

let _clients = null;
let _currentClientID = null;


const RoomStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitClickRoom: function(roomID, roomName) {
    this.emit(ROOM_CLICK, roomID, roomName);
  },

  addClickRoomListener: function(callback) {
    this.on(ROOM_CLICK, callback);
  },

  removeClickRoomListener: function(callback) {
    this.removeListener(ROOM_CLICK, callback);
  },

  watchLastMessage: function(roomID, client) {
    let child_id = client.id;

    MessageStore.watchLastOnAdded(roomID, function(newMessage) {
  
      if(child_id === _currentClientID) {
        newMessage.isRead = true;  
      }
      else {
        newMessage.isRead = false;  
      }
      
      _clients.map((client) => {
        client.lastMessage = client.id === child_id ? newMessage : client.lastMessage;
        return client;
      });

      RoomStore.emitChange();

    });
  },

  requestClients: function(parent_id) {
    // Make a request for a user with a given ID
    axios.get('http://localhost:7001/clients/' + parent_id).then(function(response) {
      _clients = [];

      each(response.data.clients, function(client, callback) {
        let roomID = parent_id + '_' + client.id;

        RoomStore.watchLastMessage(roomID, client);

        MessageStore.requestLastMessage(roomID, function(message) {

          let data = assign({}, {...client
          }, {
            lastMessage: message
          });

          _clients.push(data);
          callback();
        });
      }, function(err) {
        RoomStore.emitChange();
      });

    }).catch(function(error) {

    });
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAllClients: function() {
    return _clients;
  },

  getCurrentClientID: function() {
    return _currentClientID;
  },

  getCurrentClient: function() {
    let index = _clients.map(x => x.id).indexOf(this.getCurrentClientID());
    return this.get(index);
  },

  get: function(id) {
    return _clients[id];
  }

});

RoomStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {
    case ActionTypes.CLICK_ROOM:
      _currentClientID = action.clientID;
      RoomStore.getCurrentClient().lastMessage.isRead = true;
      let roomID = action.parentID + '_' + action.clientID;
      MessageStore.clearMessages();
      MessageStore.requestMessages(roomID);
      RoomStore.emitClickRoom(roomID, RoomStore.getCurrentClient().name);
      break;

    default:
      // do nothing
  }

});

module.exports = RoomStore;