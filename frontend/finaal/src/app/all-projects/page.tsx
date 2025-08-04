'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './all-projects.module.css';
import axios from 'axios';
import {MdDashboard,} from 'react-icons/md';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FaBars,FaUserCircle,FaSignOutAlt,FaFolderOpen,FaUserTie,FaUserGraduate} from 'react-icons/fa';
import Link from 'next/link';
import withRoleProtection from './../withRoleProtectiont';


interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  courseCount: number;
  instructorCount: number;
}

const AllProjects: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditProfileForm, setEditProfileForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [passwordVisible, setPasswordVisible] = useState(false);
  
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

   const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
// أو "/" حسب ما بدك
};


  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5151/api/Projects/allprojects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(''); // ضع API المستخدم إذا توفر
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUser();
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
          <FaBars className={styles["menu-icon"]} onClick={() => setSidebarOpen(!sidebarOpen)} />
          <span className={styles["page-name"]}>Dashboard</span>
        </div>
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

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <p className={styles['app-name']}></p>
        <img src="/images/logo.png" alt="Logo" className={styles["logo"]} />
        <ul>
          <li><MdDashboard className={styles['sidebar-icon']} />Dashboard</li>
          <li><FaFolderOpen className={styles['sidebar-icon']} />Projects</li>
          <li><FaUserTie className={styles['sidebar-icon']}/>Project Managers</li>
          <li><FaUserGraduate className={styles['sidebar-icon']} />Freelancers</li>
        </ul>
      </aside>

      <main className={`${styles.mainContent} ${sidebarOpen ? styles.expanded : styles.collapsed}`}>
        <section className={styles["projects-section"]}>
          <h2>All Projects</h2>
          {loading ? (
            <p className={styles['validations']}>Loading projects...</p>
          ) : (
            <div className={styles["projects-grid"]}>
              {projects.length === 0 ? (
                <p className={styles['validations']}>No projects found.</p>
              ) : (
                projects.map((project) => (
                  <Link
                    href={`/admin-project?id=${project.id}`}
                    key={project.id}
                    className={styles["projects-card"]}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img
                      src={`http://localhost:5151/ProjectIcons/${project.icon}`}
                      alt={project.title}
                      className={styles["project-icon"]}
                    />
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles["project-meta"]}>
                      <span>📘 Courses: {project.courseCount}</span>
                      <span>👨‍🏫 Instructors: {project.instructorCount}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default withRoleProtection(AllProjects, ['Admin','Instructor','Freelancer']);
