'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from "./freelancer-dashboard.module.css";
import Link from 'next/link';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FaUserCircle, FaSignOutAlt} from 'react-icons/fa';
import { faFacebook, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';

interface project {
  id: number;
  title: string;
  icon: string;
  courseCount: number;
}

const FreelancerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showEditProfileForm, setEditProfileForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [passwordVisible, setPasswordVisible] = useState(false);

     const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

  
     const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const handleEditProfile = async () => {
  if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("title", newName); 
  formData.append("description", newEmail);
  formData.append("password", newPassword); 
  
  try {
    const response = await axios.post("http://localhost:5151/api/Projects/CreateProject", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Profile edited:", response.data);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setFormErrors({});
    fetchUser(); 
  } catch (error) {
    console.error("Error edit profil:", error);
    alert("Failed to edit profile.");
  }
};

useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

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

    const fetchUser = async () => {
      try {
        const res = await axios.get(''); // Replace with actual API
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles["layout"]}>
      <nav className={styles["navbar"]}>
        <div className={styles["navbar-left"]}>
          <img src="/images/logo.png" alt="Logo" className={styles["logo"]} />
          <h2 className={styles['name']}></h2>
        </div>
        <ul className={styles["nav-links"]}>
          <li><a href="#">Home</a></li>
          <li><a href="/all-projects">Projects</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
        <div className={styles["navbar-right"]}>
          <div className={styles["profile-wrapper"]} ref={dropdownRef}>
            <div className={styles["profile-icon"]} onClick={toggleDropdown}>
              <FaUserCircle size={32} />
            </div>
            {isOpen && (
              <div className={styles["profile-dropdown"]}>
                <div className={styles["profile-header"]}>
                  <div className={styles["avatar"]}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className={styles["username"]}>{user?.username || 'Loading...'}</p>
         <button onClick={() => setEditProfileForm(true)} className={styles['edit-profile']}>
                  Edit Profile
                  </button>
                  </div>
                    {showEditProfileForm && (
                    <div className={styles["modal-overlay"]}>
                      <div className={styles["modal-content"]}>
                        <h2>Edit Your Profile</h2><br/>
                        <input
                          type="text"
                          placeholder="Name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <textarea
                          placeholder=" New Email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <div className={styles['input-group']}>
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          id="password"
                          placeholder="Password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <FontAwesomeIcon
                          icon={passwordVisible ? faEyeSlash : faEye}
                          className={styles["toggle-password"]}
                          onClick={togglePasswordVisibility}
                        />
                        {formErrors.password && <p className={styles["field-error"]}>{formErrors.password}</p>}
                        </div>
                        <div className={styles["modal-buttons"]}>
                          <button onClick={handleEditProfile}>Submit</button>
                          <button onClick={() => setEditProfileForm(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                <ul className={styles["dropdown-list"]}>
                  <li className={styles["logout"]} onClick={handleLogout}><FaSignOutAlt /> Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className={styles["upper-public"]}>
        <p className={styles["p1"]}>Start learning today</p>
        <p className={styles["p2"]}>The Best<br /> Platform Enroll in<br /> Your Special <br />Course</p>
        <p className={styles["p3"]}>Your Coding Journey Starts Here.<br />Interactive, flexible, and fun programming courses<br /> for future developers.</p>
      </div>
      {/* Top projects */}
      <div className={styles["top-projects"]}>
        <p className={styles["tc"]}>Recent Projects</p>
        <a href='/all-projects'><button className={styles["show-all-btn"]}>Show all Projects</button></a>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : catError ? (
          <p className={styles["error-message"]}>{catError}</p>
        ) : (
          <section className={styles["projects-grid"]}>
            {projects.map((cat) => (
              <div className={styles["projects-card"]} key={cat.id}>
                <img src={`http://localhost:5151/ProjectIcons/${cat.icon}`} alt={cat.title} className={styles["category-icon"]} />
                <h3>{cat.title}</h3>
                <p>{cat.courseCount} Courses</p>
              </div>
            ))}
          </section>
        )}
      </div>
      <footer className={styles["unolgy-footer"]}>
              <div className={styles["footer-content"]}>
                <div className={styles["footer-brand"]}>
                  <img src="/images/logo.png" alt="Logo" className={styles["footer-logo"]} />
                  <p className={styles["tagline"]}>
                    a leading e-learning platform, harnessing the power of programmers to offer high-quality programming courses.
                    Whether you're just starting out or looking to upskill, Unolgy helps you build your career and grow your tech
                    knowledge â€“ all for free.
                  </p>
                  <div className={styles["social-icons"]}>
                    <FontAwesomeIcon icon={faFacebook} />
                    <FontAwesomeIcon icon={faGoogle} />
                    <FontAwesomeIcon icon={faApple} />
                  </div>
                </div>
                <div className={styles["footer-profile"]}>
                  <h3>Your Profile</h3>
                  <ul>
                    <li><Link href="/login">Log In</Link></li>
                    <li><Link href="/signup">Sign Up</Link></li>
                    <li><a href="#">Reset Password</a></li>
                  </ul>
                </div>
              </div>
            </footer>
    </div>
  );
};

export default FreelancerDashboard;