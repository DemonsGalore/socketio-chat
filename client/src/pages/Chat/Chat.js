import React, { useContext, useState } from 'react';
import { Context } from '../../Store';
import { StyledChat } from './Chat.styled';

const Chat = () => {
  // context store
  const { allChats, sendChatAction, userTyping, userStoppedTyping } = useContext(Context);
  const topics = allChats.map(chat => chat.topic);

  // local state
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [chatEntered, setChatEntered] = useState(false)
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [timer, setTimer] = useState();
  
  let activeChat = allChats.find(chat => chat.topic === activeTopic);
  let isUserTyping = activeChat.typing.length > 0;

  // refresh timer while user is typing; send data to store after timeout
  const setTypingTimer = () => {
    clearTimeout(timer);
    setTimer(setTimeout(() => {
      userStoppedTyping({ from: username, topic: activeTopic });
    }, 3000));
  };

  const enterChat = () => {
    if (username !== '') {
      setChatEntered(true);
    }
  };

  return (
    <StyledChat>
      <h1>Chat</h1>
      {!chatEntered ?
        <>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <button type="button" onClick={enterChat}>enter chat</button>
        </>
      :
        <>
          <ul>
            {topics.map(topic => (
            <li key={topic} onClick={e => setActiveTopic(e.target.innerText)} className={topic === activeTopic ? 'active' : undefined}>
              {topic}
            </li>
            ))}
          </ul>
          <h3>{activeTopic}</h3>
          <div>
            {activeChat.messages.map((chat, i) => (
              <div key={i}>
                <label><strong>{chat.from}</strong></label>
                {chat.message}
              </div>
            ))}
          </div>
          {isUserTyping && <div><em>
            {activeChat.typing.length > 1 ? (activeChat.typing.join(', ') + ' are typing') : (activeChat.typing[0] + ' is typing')}
          </em></div>}

          <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyUp={() => {
            userTyping({ from: username, topic: activeTopic });
            setTypingTimer();
          }} />
          <button type="button" onClick={() => {
            sendChatAction({ from: username, message, topic: activeTopic });
            userStoppedTyping({ from: username, topic: activeTopic });
            setMessage('');
          }}>send</button>
        </>
      }
    </StyledChat>
  );
}

export default Chat;
