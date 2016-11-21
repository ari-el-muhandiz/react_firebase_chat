import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';

const ActionTypes = ChatConstants.ActionTypes;

export default {
  clickRoom: function(clientID, parentID) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CLICK_ROOM,
      clientID: clientID,
      parentID: parentID
    });
  }
};
