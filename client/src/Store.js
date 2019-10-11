import React, { createContext, useReducer } from 'react';
import io from 'socket.io-client';

export const Context = createContext();

const reducer = (state, action) => {
  const { from, message, topic } = action.payload;
  let index;

  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      index = state.findIndex(chat => chat.topic === topic);
      state[index].messages.push({ from, message });
      return [...state];
    case 'USER_TYPING':
      index = state.findIndex(chat => chat.topic === topic);
      if (!state[index].typing.includes(from)) {
        state[index].typing.push(from);
      }
      return [...state];
    case 'USER_STOPPED_TYPING':
      index = state.findIndex(chat => chat.topic === topic);
      state[index].typing.splice(state[index].typing.indexOf(from), 1);
      return [...state];
    default:
      return state;
  }
};

const initState = [
  {
    topic: 'general',
    messages: [
      { from: 'Andreas', message: 'general'},
      { from: 'Andreas', message: 'Hello'},
      { from: 'Andreas', message: 'Hello'},
    ],
    typing: []
  },
  {
    topic: 'topic2',
    messages: [
      { from: 'Andreas', message: 'topic2'},
      { from: 'Andreas', message: 'Hello'},
    ],
    typing: []
  }
];

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

const Store = (props) => {
  const [allChats, dispatch] = useReducer(reducer, initState);

  if (!socket) {
    socket = io(':5000')
    socket.on('message', (message) => {
      dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
    });

    socket.on('typing', (message) => {
      dispatch({ type: 'USER_TYPING', payload: message });
    });

    socket.on('stopped-typing', (message) => {
      dispatch({ type: 'USER_STOPPED_TYPING', payload: message });
    });
  }

  return (
    <Context.Provider value={{allChats, sendChatAction, userTyping, userStoppedTyping}}>
      {props.children}
    </Context.Provider>
  );
};

export default Store;
