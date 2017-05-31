import React, {Component} from 'react';

import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: []
    };
    this.addNewMessage = this.addNewMessage.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.socket.onmessage = (message) => {

      const incomingObj = JSON.parse(message.data);
      // console.log("message.data", message.data)
      // console.log("Incoming Type:", incomingObj);
      // console.log("this.state", this.state)
      let notices = [];
      notices = this.state.messages.concat(incomingObj);
      // console.log(notices);
      this.setState({ messages: notices });
      // console.log('Received message:', message);
    };

    this.socket.onopen = function(event) {
      console.log('Connected to Server');
    };
  }

  addNewMessage(name, content) {
    const message = {
      id: this.state.messages.length + 1,
      username: name,
      content: content
    };
    this.socket.send(JSON.stringify(message));

    console.log(message);
    const newMessages = this.state.messages.concat(message);
    this.setState({messages: newMessages});
  }

  render() {
    return (
      <div className='messagecontainer'>
          <nav className='navbar'>
            <a href='/' className='navbar-brand'>Chatty</a>
          </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar user={ this.state.currentUser.name } newMessage={ this.addNewMessage }/>
      </div>
    );
  }
}

export default App;
