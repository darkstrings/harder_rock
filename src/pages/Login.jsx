import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Heading from "../ui/Heading";
import Logo from "../ui/Logo";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-0);
  @media (max-width: 500px) {
    grid-template-columns: 30rem;
  }
`;

const StyledHeading = styled(Heading)`
  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;

function Login() {
  return (
    <LoginLayout>
      <Logo />
      <StyledHeading as="h4">Log in to your account</StyledHeading>
      <LoginForm />
      <StyledHeading as="h4">Made with terminals in a hotel in mind.</StyledHeading>
      <StyledHeading as="h4">Not for mobile.</StyledHeading>
    </LoginLayout>
  );
}

export default Login;
