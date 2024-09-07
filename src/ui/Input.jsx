import styled from "styled-components";

// In GlobalStyles, we have a bunch of css (the color pallette with the brand colors and greys etc) that mimics tailwind so here we combine those design tokens with StyledComponents using var()
export const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

export default Input;
