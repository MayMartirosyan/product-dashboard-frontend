import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { useIsAuthenticated } from '../../../hooks/useIsAuthenticated';
import './Header.scss'

const Header = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('storageUpdate'));
    navigate('/signin');
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className='actions-wrapper'>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          {isAuthenticated && <Link to="/profile">My Profile</Link>}
        </div>

        <div>
          {!isAuthenticated && <Link to="/signup">Sign Up</Link>}
          {!isAuthenticated && <Link to="/signin">Sign In</Link>}

          {isAuthenticated && (
            <Button onClick={handleLogout} variant="error">
              Logout
            </Button>
          )}
        </div>
        </div>
      
      </div>
    </nav>
  );
};

export default Header;
