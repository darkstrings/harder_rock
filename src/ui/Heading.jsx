import styled, { css } from "styled-components";

const Heading = styled.h1`
  /* using .as so that they're styled as the right element since this is a styled h1 be default (see the note in App.jsx about this on that end) */
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: font-weight 500;
    `}
  ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: font-weight 600;
      text-align: center;
    `}
  line-height:1.4;
`;

export default Heading;
