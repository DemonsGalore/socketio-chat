import React, { createContext, useReducer } from 'react';
import io from 'socket.io-client';

export const Context = createContext();

const reducer = (state, action) => {
  const { from, message, topic } = action.payload;

  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      let index = state.findIndex(chat => chat.topic === topic);

      state[index].messages.push({ from, message });

      return [
        ...state,
      ];
    case 'USER_TYPING':
      //console.log("user typing reducer", action.payload);
      return [
        ...state
      ]
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
}

const Store = (props) => {
  const [allChats, dispatch] = useReducer(reducer, initState);

  if (!socket) {
    socket = io(':5000')
    socket.on('message', (message) => {
      dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
    });

    socket.on('typing', (message) => {
      //dispatch({ type: 'USER_TYPING', payload: message });
    });
  }

  return (
    <Context.Provider value={{allChats, sendChatAction, userTyping}}>
      {props.children}
    </Context.Provider>
  );
};

export default Store;
