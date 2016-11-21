import React from "react";
import { render } from "react-dom";
import ChatApp from './components/ChatApp.react';

import ChatLoginAction from './actions/ChatLoginAction';
import SessionStore from './stores/SessionStore';
import FirebaseLib from './lib/firebase';

const app = document.getElementById('chat_app');

function getActiveUser() {
	return SessionStore.get();
}

ChatLoginAction.Login();

SessionStore.addChangeListener(function() {
	let user = getActiveUser();

	// Log the user in via Twitter
	FirebaseLib.signInWithCustomToken(user.token);
});

FirebaseLib.watchStateSession(function(user) {
	// Once authenticated, instantiate Firechat with the logged in user
	let session = getActiveUser().user;

	if (user) {
		render( <ChatApp user = {session}/> , app);
	} else {
		render(<h1>Login First!</h1> , app);
	}
});

