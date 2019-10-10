import React from 'react';
import { NavLink } from 'react-router-dom';
import { StyledNavigation } from './Navigation.styled';

const Navigation = () => {
  return (
    <StyledNavigation>
      <ul>
        <li><NavLink to="/chat">Chat</NavLink></li>
        <li><NavLink to="/videostreaming">VideoStreaming</NavLink></li>
      </ul>
    </StyledNavigation>
  );
};

export default Navigation;
