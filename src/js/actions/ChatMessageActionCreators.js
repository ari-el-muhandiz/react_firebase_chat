import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';

const ActionTypes = ChatConstants.ActionTypes;

export default {
	CreateMessage: function(text, roomID, authorName) {
		ChatAppDispatcher.dispatch({
			type: ActionTypes.CREATE_MESSAGE,
			roomID: roomID,
			text: text,
			authorName: authorName
		});
	}
};