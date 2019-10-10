import React, { createContext, useReducer } from 'react';
import io from 'socket.io-client';

export const Context = createContext();

const reducer = (state, action) => {
  const { from, message, topic } = action.payload;

  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        [topic]: [
          ...state[topic],
          { from, message }
        ]
      }
    default:
      return state;
  }
};

const initState = {
  general: [
    { from: 'Andreas', message: 'general'},
    { from: 'Andreas', message: 'Hello'},
    { from: 'Andreas', message: 'Hello'},
  ],
  topic2: [
    { from: 'Andreas', message: 'topic2'},
    { from: 'Andreas', message: 'Hello'},
  ]
};

let socket;

const sendChatAction = (message) => {
  socket.emit('message', message);
};

const Store = (props) => {
  const [allChats, dispatch] = useReducer(reducer, initState);

  if (!socket) {
    socket = io(':5000')
    socket.on('message', (message) => {
      dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
    });
  }

  return (
    <Context.Provider value={{allChats, sendChatAction}}>
      {props.children}
    </Context.Provider>
  );
};

export default Store;
