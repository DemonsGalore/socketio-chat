import React, { useContext, useState } from 'react';
import { Context } from '../../Store';
import { StyledChat } from './Chat.styled';

const Chat = () => {
  // context store
  const { allChats, sendChatAction, userTyping } = useContext(Context);
  const topics = allChats.map(chat => chat.topic);

  // local state
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [activeTopic, setActiveTopic] = useState(topics[0]);

  return (
    <StyledChat>
      <h1>Chat</h1>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <ul>
        {topics.map(topic => (
        <li key={topic} onClick={e => setActiveTopic(e.target.innerText)} className={topic === activeTopic ? 'active' : undefined}>
          {topic}
        </li>
        ))}
      </ul>
      <h3>{activeTopic}</h3>
      <div>
        {allChats.find(chat => chat.topic === activeTopic).messages.map((chat, i) => (
          <div key={i}>
            <label><strong>{chat.from}</strong></label>
            {chat.message}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyUp={() => userTyping({ from: username, topic: activeTopic })} />
      <button type="button" onClick={() => {
        sendChatAction({ from: username, message, topic: activeTopic });
        setMessage('');
      }}>send</button>
    </StyledChat>
  );
}

export default Chat;
