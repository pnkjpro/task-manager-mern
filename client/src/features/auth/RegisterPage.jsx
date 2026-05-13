import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from './authSlice';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">✓</div>
            <h1>Task Management</h1>
          </div>
          <p className="auth-subtitle">Create your account and start managing tasks.</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <div className="input-wrapper">
              <HiOutlineUser className="input-icon" />
              <input
                type="text"
                id="register-name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <div className="input-wrapper">
              <HiOutlineMail className="input-icon" />
              <input
                type="email"
                id="register-email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input
                type="password"
                id="register-password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input
                type="password"
                id="register-confirm-password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Create Account <HiOutlineArrowRight />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
