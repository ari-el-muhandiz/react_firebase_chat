const express = require('express');
const firebase = require('firebase-admin');
const app = express()
const bodyParser = require('body-parser');

const dummyUser = [{
	id: 'u_1',
	name: 'John Doe',
	email: 'john.doe@mail.com',
	type: 'supervisor',
	timestamp: Date.now()
}, {
	id: 'u_2',
	name: 'Michael Gorbachev',
	email: 'm.gorbachev@mail.com',
	type: 'client',
	clientId: 'u_1',
	timestamp: Date.now()
}, {
	id: 'u_3',
	name: 'Palo Alto',
	email: 'palo@mail.com',
	type: 'client',
	clientId: 'u_1',
	timestamp: Date.now()
}, {
	id: 'u_4',
	name: 'Gatot Nurmantyo',
	email: 'gatot.n@mail.com',
	type: 'client',
	clientId: 'u_1',
	timestamp: Date.now()
}];

firebase.initializeApp({
	credential: firebase.credential.cert("./serviceAccountKey.json"),
	databaseURL: "https://chat-c3a13.firebaseio.com"
});


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// respond with "hello world" when a GET request is made to the homepage
app.post('/token', function(req, res) {
	let user = null;
	
	if (req.body.user === 'supervisor') {
		user = dummyUser[0];
	} else {
		user = dummyUser.find(function(usr){
			return usr.id === req.body.user;
		}) || dummyUser[1];
	}

	firebase.auth().createCustomToken(user.id, {
		name: user.name,
		email: user.email,
		type: user.type
	}).then(function(customToken) {
		// Send token back to client
		res.json({
			token: customToken,
			user: user
		});

	}).catch(function(error) {
		console.log("Error creating custom token:", error);
	});
});

app.get('/clients/:client_id', function(req, res){
	let clients = dummyUser.filter(function(user){
		return user.clientId === req.params.client_id;
	});

	res.json({
		clients: clients
	});
});

app.listen(7001, function() {
	console.log('Server Running On port 7001')
});