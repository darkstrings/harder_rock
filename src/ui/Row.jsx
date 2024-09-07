import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;
  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

// With this, you can remove "type: vertical from the ones that have it set to that since it's now set as default"
Row.defaultProps = {
  type: "vertical",
};

export default Row;
