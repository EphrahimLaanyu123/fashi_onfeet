import React, { useState } from 'react';
import {sup}
import './Auth.css'; // Create an Auth.css file for styling

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error.message);
        setSuccessMessage('');
      } else {
        setSuccessMessage('Successfully signed in! Redirecting...');
        setErrorMessage('');
        // Optionally, redirect the user after successful login
        // window.location.href = '/dashboard'; // Example redirection
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrorMessage('An unexpected error occurred during sign-in.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error.message);
        setSuccessMessage('');
      } else {
        setSuccessMessage('Successfully signed up! Please check your email to verify your account.');
        setErrorMessage('');
        // Optionally, provide feedback to the user to check their email
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
      setErrorMessage('An unexpected error occurred during sign-up.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (isSignUp) {
      await handleSignUp(email, password);
    } else {
      await handleSignIn(email, password);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <p className="toggle-text">
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
          <button type="button" className="toggle-button" onClick={toggleAuthMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;