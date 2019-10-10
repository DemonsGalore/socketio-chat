import React, { useContext, useState } from 'react';
import { Context } from '../../Store';
import { StyledChat } from './Chat.styled';

const Chat = () => {
  // context store
  const [allChats] = useContext(Context);
  const topics = Object.keys(allChats);

  // local state
  const [textInput, setTextInput] = useState('');
  const [activeTopic, setActiveTopic] = useState(topics[0]);

  const onClick = () => {
    console.log("send message");
  }

  return (
    <StyledChat>
      <h1>Chat</h1>
      <ul>
        {topics.map(topic => (
        <li key={topic} onClick={e => setActiveTopic(e.target.innerText)} class={topic === activeTopic && 'active'}>
          {topic}
        </li>
        ))}
      </ul>
      <h3>{activeTopic}</h3>
      <div>
        {allChats[activeTopic].map((chat, i) => (
          <div key={i}>
            <label>{chat.from}</label>
            {chat.msg}
          </div>
        ))}
      </div>
      <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)} />
      <button type="button" onClick={onClick}>send</button>
    </StyledChat>
  );
}

export default Chat;
