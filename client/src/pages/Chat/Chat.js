import React, { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import { Context } from '../../Store';
import { StyledChat } from './Chat.styled';
import { Spinner } from '../../components';
import isEmpty from '../../util/is-empty';

const Chat = () => {
  // context store
  const { allChats, sendChatAction, userTyping, userStoppedTyping, createNewChat, fetchAllChats } = useContext(Context);
  const topics = allChats.map(chat => chat.topic);

  // local state
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [usernameSelected, setUsernameSelected] = useState(false)
  const [newTopic, setNewTopic] = useState('');
  const [chatEntered, setChatEntered] = useState(false)
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const [timer, setTimer] = useState();
  const [notification, setNotification] = useState({})
  
  let activeChat = allChats.find(chat => chat.topic === activeTopic);
  
  let isUserTyping;

  if (activeChat) {
    isUserTyping = activeChat.typing.length > 0;
  }

  const isFirstRender = useRef(true);

  /*
  if (isFirstRender.current) {
    isFirstRender.current = false;
    fetchAllChats();
    setLoading(false);
  }
  */

  useEffect(() => {
    if (isFirstRender.current) {
      fetchAllChats();
      setLoading(false);
      isFirstRender.current = false;
      return;
    }

    const toastConfig = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
    };

    if (!isEmpty(notification)) {
      if (notification.success) {
        toast.success(
          <><FontAwesomeIcon icon={faCheckCircle} size="1x" />&nbsp;{notification.text}</>,
          toastConfig
        );
      } else {
        toast.error(
          <><FontAwesomeIcon icon={faExclamationCircle} size="1x" />&nbsp;{notification.text}</>,
          toastConfig
        );
      }
    }
  }, [notification]);

  // refresh timer while user is typing; send data to store after timeout
  const setTypingTimer = () => {
    clearTimeout(timer);
    setTimer(setTimeout(() => {
      userStoppedTyping({ from: username, topic: activeTopic });
    }, 3000));
  };

  const selectUsername = () => {
    if (isEmpty(username)) {
      setNotification({ text: 'Username empty', success: false });
    } else {
      // TODO: check for unique username
      setUsernameSelected(true);
    }
  };

  return (
    <StyledChat>
      <h1>Chat</h1>
      {!usernameSelected ?
        <div>
          <label>Username: </label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <br />
          <button type="button" onClick={selectUsername}>select username</button>
        </div>
      :
        <div>
          {loading ?
            <Spinner />
          :
            <>
              <ul>
                {topics.map(topic => (
                <li key={topic} onClick={e => {
                  setActiveTopic(e.target.innerText);
                  setChatEntered(true);
                }} className={topic === activeTopic ? 'active' : undefined}>
                  {topic}
                </li>
                ))}
              </ul>
              <div>
                <input type="text" value={newTopic} onChange={e => setNewTopic(e.target.value)} />
                <button type="button" className="btn-icon" onClick={() => createNewChat(newTopic)}>
                  <FontAwesomeIcon icon={faPlus} size="2x" />
                </button>
              </div>
            </>
          }
        </div>
      }
      {chatEntered && 
        <div>
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
          <button type="button" className="btn-icon" onClick={() => {
            sendChatAction({ from: username, message, topic: activeTopic });
            userStoppedTyping({ from: username, topic: activeTopic });
            setMessage('');
          }}><FontAwesomeIcon icon={faPaperPlane} size="2x" /></button>
        </div>
      }
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange={false}
        draggable={false}
        pauseOnHover
      />
    </StyledChat>
  );
}

export default Chat;
