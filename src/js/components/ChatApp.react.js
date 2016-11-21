import React from 'react';
import MessageSection from './MessageSection.react';
import RoomSection from './RoomSection.react';
const ReactPropTypes = React.PropTypes;

export default class ChatApp extends React.Component {
	constructor(props) {
		super();
		this.state = {
			session: props.user
		}
	}

	render() {
		let roomItems = this.state.session.type === 'supervisor' ? 
			<RoomSection session={ this.state.session }/> : 
			null;
			
		return (
			<div class="chatapp">
				{ roomItems }
				<MessageSection session={ this.state.session }/>
			</div>
		)
	}
}

ChatApp.propTypes = {
    user: ReactPropTypes.object
}