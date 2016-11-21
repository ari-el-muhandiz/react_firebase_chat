import firebase from 'firebase';
import FirebaseConfig from '../constants/FirebaseConfig';

firebase.initializeApp(FirebaseConfig);

const assign = Object.assign;

export default {

	readData: function(path) {
		return firebase.database().ref('chats/' + path).orderByKey().once('value');
	},

	readDataLast(path) {
		return firebase.database().ref('chats/' + path).limitToLast(1).once('value');
	},

	signInWithCustomToken(token) {
		return firebase.auth().signInWithCustomToken(token)
	},

	watchStateSession(callback) {
		return firebase.auth().onAuthStateChanged(callback);
	},

	writeData(path, text, authorName) {
		var newPostRef = firebase.database().ref('chats/' + path).push();

		newPostRef.set({
			text: text,
			authorName: authorName,
			created: firebase.database.ServerValue.TIMESTAMP
		});

		return newPostRef.key;
	},

	watchOnChanged(path) {
		var ref = firebase.database().ref('chats/' + path);

		ref.on("child_changed", function(snapshot) {
			var changedPost = snapshot.val();
			console.log("The updated post title is " + changedPost.title);
		});
	},

	watchLastOnAdded(path, callback) {
		var ref = firebase.database().ref('chats/' + path);

		ref.orderByChild('created').startAt(Date.now()).limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
			var newData = snapshot.val();
			callback(assign({}, newData, { id: snapshot.key}));
		});
	},

	removeWatchLastOnAdded(path, callback) {
		var ref = firebase.database().ref('chats/' + path);
		ref.orderByChild('created').startAt(Date.now()).limitToLast(1).off("child_added", callback);
	}
}