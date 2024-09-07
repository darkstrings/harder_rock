import styled from "styled-components";
// On top of installed the styled-components library, be sure to get the vscode extension too for autocomplete and formatting
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

// styled.[element] creates an instance of that element as a vanilla copy of an input, button etc but lets you add styling on top of it.

// Since App is already a component, we can't make App in styled components like we did with H!, Button and Input, so instead we style the <div> at the very top of it. The convention is to call it StyledApp

const StyledApp = styled.div`
  /* background-color: orangered; */
  padding: 20px;
`;
// We use "as" (which is part or StyledComponents) instead of our customer made "type" prop to tell the browser to render it AS h2 and AS h3 because they're primarily h1 because in Heading.jsx, Heading is a styled h1. This way it will show properly as the right element for SEO and accessibility
function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Row>
          <Row type="horizontal">
            <Heading as="h1">The Wild Oasis</Heading>
            <div>
              <Heading as="h2">Check in and out</Heading>
              <Button variation="primary" size="medium" onClick={() => alert("in")}>
                Check in
              </Button>
              <Button variation="secondary" size="small" onClick={() => alert("out")}>
                Check out
              </Button>
            </div>
          </Row>

          <Row>
            <Heading as="h3">Form</Heading>
            <form>
              <Input type="number" placeholder="Number of guests" />
              <Input type="number" placeholder="Number of guests" />
            </form>
          </Row>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
