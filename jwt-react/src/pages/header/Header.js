import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const isLoggedIn = Boolean(user);

  return (
    <Navbar bg={isLoggedIn ? 'primary' : 'dark'} variant="dark">
      <Container>
        <Navbar.Brand>Backend Learning</Navbar.Brand>
        <Nav className="ml-auto">
          {isLoggedIn ? (
            <>
              <Navbar.Text className="me-3">
                Signed in as: {user?.name || user?.email}
              </Navbar.Text>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link onClick={onLogout} style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">SignUp</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
