import styled from 'styled-components';

export const StyledChat = styled.div`
  li.active {
    color: ${({ theme }) => theme.accent};
  }
`;
