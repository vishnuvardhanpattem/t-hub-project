import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css'; // Use your custom CSS for animations
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
    <div className="home-container">
      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1 className="intro-title">Track Your Mental Health</h1>
          <p className="intro-tagline">Complete daily surveys and improve your mental well-being.</p>
          <Link to="/survey" className="survey-btn">Start Survey</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">What We Offer</h2>
        <div className="features-list">
          <div className="feature-item">
            <i className="icon-survey"></i>
            <h3>Daily Surveys</h3>
            <p>Track your stress, sleep, and overall mental health.</p>
          </div>
          <div className="feature-item">
            <i className="icon-motivation"></i>
            <h3>Motivational Stories</h3>
            <p>Get daily motivational stories and health tips.</p>
          </div>
          <div className="feature-item">
            <i className="icon-weekly-report"></i>
            <h3>Weekly Reports</h3>
            <p>View your weekly progress with interactive charts.</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;

