'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import './public.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
interface project {
  id: number;
  title: string;
  icon: string;
  courseCount: number;
}

const Public: React.FC = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5151/api/Projects/recentprojects');
        setProjects(res.data);
      } catch (err) {
        setCatError('Failed to load projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="/all-projects">Projects</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>

      </header>

      {/* Hero */}
      <div className="upper-public">
        <p className="p1">Start learning today</p>
        <p className="p2">The Best<br /> Platform Enroll in<br /> Your Special <br />Course</p>
        <p className="p3">Your Coding Journey Starts Here.<br />Interactive, flexible, and fun programming courses<br /> for future developers.</p>
        <div className="button-group">
          <Link href="/login"><button className="login-button">Login</button></Link>
          <Link href="/signup"><button className="signup-button">Sign Up</button></Link>
        </div>
      </div>

      {/* Top projects */}
      <div className="top-projects">
        <p className="tc">Recent Projects</p>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : catError ? (
          <p className="error-message">{catError}</p>
        ) : (
          <section className="projects-grid">
            {projects.map((cat) => (
              <div className="projects-card" key={cat.id}>
                <img src={`http://localhost:5151/ProjectIcons/${cat.icon}`} alt={cat.title} className="category-icon" />
                <h3>{cat.title}</h3>
                <p>{cat.courseCount} Courses</p>
              </div>
            ))}
          </section>
        )}
      </div>
      {/* Footer */}
      <footer className="unolgy-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Logo" className="footer-logo" />
            <p className="tagline">
              a leading e-learning platform, harnessing the power of programmers to offer high-quality programming courses.
              Whether you're just starting out or looking to upskill, Unolgy helps you build your career and grow your tech
              knowledge – all for free.
            </p>
            <div className="social-icons">
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faGoogle} />
              <FontAwesomeIcon icon={faApple} />
            </div>
          </div>
          <div className="footer-profile">
            <h3>Your Profile</h3>
            <ul>
              <li><Link href="/login">Log In</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Public;
