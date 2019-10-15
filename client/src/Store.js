import React, { createContext, useReducer } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import isEmpty from './util/is-empty';

export const Context = createContext();

const reducer = (state, action) => {
  const { user, message, topic } = action.payload;
  let index;

  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      index = state.findIndex(chat => chat.topic === topic);
      state[index].messages.push({ user, message });
      return [...state];
    case 'USER_TYPING':
      index = state.findIndex(chat => chat.topic === topic);
      if (!state[index].typing.includes(user)) {
        state[index].typing.push(user);
      }
      return [...state];
    case 'USER_STOPPED_TYPING':
      index = state.findIndex(chat => chat.topic === topic);
      state[index].typing.splice(state[index].typing.indexOf(user), 1);
      return [...state];
    case 'CREATE_NEW_CHAT':
      return [...state, action.payload];
    case 'SET_CHAT_DATA':
      return [...action.payload];
    case 'USER_JOINED_CHAT':
      index = state.findIndex(chat => chat.topic === topic);
      if (!state[index].users.includes(user)) {
        state[index].users.push(user);
      }
      return [...state];
    case 'USER_LEFT_CHAT':
      index = state.findIndex(chat => chat.topic === topic);
      state[index].users.splice(state[index].users.indexOf(user), 1);
      return [...state];
  default:
      return state;
  }
};

let socket;

const sendChatAction = (message) => {
  socket.emit('message', message);
};

const userTyping = (data) => {
  socket.emit('typing', data);
};

const userStoppedTyping = (data) => {
  socket.emit('stopped-typing', data);
};

const joinChat = (data) => {
  socket.emit('user-joined-chat', data);
};

const leaveChat = (data) => {
  socket.emit('user-left-chat', data);
};

const createNewChat = (data) => {
  let newTopic;
  if (isEmpty(data)) {
    newTopic = 'Room' + Math.floor(Math.random() * 9999).toString();
  } else {
    newTopic = data;
  }
  socket.emit('create-new-chat', newTopic);
};

const Store = (props) => {
  const [allChats, dispatch] = useReducer(reducer, []);

  const fetchAllChats = async () => {
    try {
      const result = await axios.get('/api/chat/all');
      dispatch({ type: 'SET_CHAT_DATA', payload: result.data });
    } catch (error) {
      console.error(error);
    }
  };

  if (!socket) {
    socket = io(':5000');

    socket.on('message', (message) => {
      dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
    });

    socket.on('typing', (message) => {
      dispatch({ type: 'USER_TYPING', payload: message });
    });

    socket.on('stopped-typing', (message) => {
      dispatch({ type: 'USER_STOPPED_TYPING', payload: message });
    });

    socket.on('create-new-chat', (chat) => {
      dispatch({ type: 'CREATE_NEW_CHAT', payload: chat });
    });

    socket.on('user-joined-chat', (data) => {
      dispatch({ type: 'USER_JOINED_CHAT', payload: data });
    });

    socket.on('user-left-chat', (data) => {
      dispatch({ type: 'USER_LEFT_CHAT', payload: data });
    });
  }

  return (
    <Context.Provider value={{allChats, sendChatAction, userTyping, userStoppedTyping, createNewChat, fetchAllChats, joinChat, leaveChat}}>
      {props.children}
    </Context.Provider>
  );
};

export default Store;
