import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import {
  EventEmitter
} from 'events';
import FirebaseLib from '../lib/firebase';

const assign = Object.assign;

const ActionTypes = ChatConstants.ActionTypes;
const CHANGE_EVENT = 'change';

let _messages = [];

const MessageStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  watchOnChanged: function(roomID, callback) {
    FirebaseLib.watchOnChanged(roomID, callback);
  },

  watchLastOnAdded: function(roomID, callback) {
    FirebaseLib.watchLastOnAdded(roomID, callback);
  },

  listenLastMessage: function(roomID) {
    FirebaseLib.watchLastOnAdded(roomID, function(newMessage) {
      let findMessage = _messages.find((message) => message.id === newMessage.id);
      if (!findMessage) {
        _messages.push(newMessage);
        MessageStore.emitChange();
      }
    });
  },

  removeWatchLastOnAdded: function(roomID) {
    FirebaseLib.removeWatchLastOnAdded(roomID);
  },

  requestLastMessage: function(roomID, callback) {
    FirebaseLib.readDataLast(roomID).then(function(snapshot) {
      let _message = null;
      snapshot.forEach(function(childSnapshot) {
        _message = childSnapshot.val();
      });
      callback(_message);
    });
  },

  writeMessage: function(text, roomID, authorName) {
    var newKey = FirebaseLib.writeData(roomID, text, authorName);
    let findMessage = _messages.find((message) => message.id === newKey);

    if (!findMessage) {
      _messages.push({
        authorName: authorName,
        text: text,
        id: newKey,
        created: Date.now()
      });
    }
  },

  clearMessages: function() {
    _messages = [];
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

  requestMessages: function(roomID) {
    FirebaseLib.readData(roomID).then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        _messages.push(assign({}, childSnapshot.val(), {
          id: childSnapshot.key
        }));
      });
      MessageStore.emitChange();
    });
  },

  getMessages: function() {
    return _messages;
  }

});

MessageStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {
    case ActionTypes.CREATE_MESSAGE:
      MessageStore.writeMessage(action.text, action.roomID, action.authorName);
      MessageStore.emitChange();
      break

    default:
      // do nothing
  }

});

module.exports = MessageStore;