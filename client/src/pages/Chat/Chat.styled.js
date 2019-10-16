import styled from 'styled-components';

export const StyledChat = styled.div`
  #chat-wrapper {
    display: grid;
    grid-template-columns: 15rem 1fr 15rem;
  }
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

  .btn-icon {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.secondary};
    padding: 0.25rem;
  }
`;
