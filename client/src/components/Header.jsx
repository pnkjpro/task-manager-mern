import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          <div className="logo-icon-sm">✓</div>
          <span className="header-brand">TaskFlow</span>
        </Link>
      </div>

      <div className="header-right">
        <ThemeToggle />

        <div className="user-info">
          <div className="user-avatar">{getInitial(user.name)}</div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
        </div>

        <button onClick={onLogout} className="btn btn-ghost btn-logout" title="Logout">
          <HiOutlineLogout />
          <span className="logout-text">Logout</span>
        </button>

        <button
          className="btn btn-ghost mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-user-info">
            <div className="user-avatar">{getInitial(user.name)}</div>
            <span>{user.name}</span>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
          <ThemeToggle />
          <button onClick={onLogout} className="btn btn-ghost btn-full">
            <HiOutlineLogout /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
