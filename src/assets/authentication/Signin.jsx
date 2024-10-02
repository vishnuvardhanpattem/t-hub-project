
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import "../css/Auth.css" // Assuming this CSS file contains the styles you shared.

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate('/survey');
      }
    });
  }, [navigate]);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/survey');
    } catch (error) {
      alert(error.message);
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrap">
        <div className="login-html">
          <input id="tab-1" type="radio" name="tab" className="sign-in" checked readOnly />
          <label htmlFor="tab-1" className="tab">Sign In</label>
          <input id="tab-2" type="radio" name="tab" className="sign-up" />
          <label htmlFor="tab-2" className="tab" onClick={() => navigate('/signup')}>Sign Up</label>
          <div className="login-form">
            <div className="sign-in-htm">
              <form onSubmit={handleSignin}>
                <div className="group">
                  <label htmlFor="user" className="label">Email</label>
                  <input id="user" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="group">
                  <label htmlFor="pass" className="label">Password</label>
                  <input id="pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="group">
                  <input id="check" type="checkbox" className="check" defaultChecked />
                  <label htmlFor="check">
                    <span className="icon"></span> Keep me Signed in
                  </label>
                </div>
                <div className="group">
                  <button type="submit" className="button">Sign In</button>
                </div>
                <div className="hr"></div>
                <div className="foot-lnk">
                  <NavLink className="foot-lnk-nav">Forgot Password?</NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
