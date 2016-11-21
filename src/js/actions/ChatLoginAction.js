import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';

const ActionTypes = ChatConstants.ActionTypes;

export default {
  Login: function() {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.LOGIN
    });
  }
};
