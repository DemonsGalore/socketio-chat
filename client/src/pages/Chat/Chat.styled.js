import styled from 'styled-components';

export const StyledChat = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    cursor: pointer;
    margin: 0.5rem 0;
  }
  li.active {
    color: ${({ theme }) => theme.secondary};
  }
`;
