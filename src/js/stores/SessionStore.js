import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';
import axios from 'axios';

const assign = Object.assign;

const ActionTypes = ChatConstants.ActionTypes;
const CHANGE_EVENT = 'change';

let _session = null;

const SessionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  loginRequest: function() {
    const fragment = window.location.hash.substr(1) || 'supervisor';

    // Make a request for a user with a given ID
    axios.post('http://localhost:7001/token', {
        user: fragment
      }).then(function(response) {
        _session = response.data;
        SessionStore.emitChange()
      }).catch(function(error) {
        console.log(error);
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

  get: function() {
    return _session;
  }

});

SessionStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {

    case ActionTypes.LOGIN:
      SessionStore.loginRequest();
      break;

    default:
      // do nothing
  }

});

module.exports = SessionStore;