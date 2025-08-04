'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from "./instructor-dashboard.module.css";
import axios from 'axios';
import { MdDashboard } from 'react-icons/md';
import { FaBars, FaUserCircle, FaSignOutAlt, FaFolderOpen, FaUserTie, FaUserGraduate} from 'react-icons/fa';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import withRoleProtection from './../withRoleProtectiont';



interface Project {
  id: string;
  title: string;
  description: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  fileName: string;
}

const InstructorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [coursesByProject, setCoursesByProject] = useState<{ [key: string]: Course[] }>({});
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const router = useRouter();

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
    
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  const fetchInstructorProjects = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:5151/api/Instructors/${id}/projects`);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch instructor projects:", err);
      setFilteredProjects([]);
    }
  };

  const fetchCoursesByProject = async (projects: Project[]) => {
    try {
      const updatedCourses: { [key: string]: Course[] } = {};

      await Promise.all(projects.map(async (project) => {
        const res = await axios.get(`http://localhost:5151/api/Projects/${project.id}/materials/Getmaterials`);
        updatedCourses[project.id] = res.data;
      }));

      setCoursesByProject(updatedCourses);
    } catch (err) {
      console.error("Failed to fetch courses by project:", err);
    }
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  router.push("/login");
};

  useEffect(() => {
    const idFromURL = new URLSearchParams(window.location.search).get("id");
    if (idFromURL) {
      setInstructorId(idFromURL);
      fetchInstructorProjects(idFromURL);
    }
  }, []);

  useEffect(() => {
    if (filteredProjects.length > 0) {
      fetchCoursesByProject(filteredProjects);
    }
  }, [filteredProjects]);

  
 const handleAddCourse = async () => {
  const { title, description, file } = courseForm;

  if (!title || !description || !file || !selectedProjectId) {
    alert('Please fill all fields before submitting.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    const response = await axios.post(
      `http://localhost:5151/api/Projects/${selectedProjectId}/materials/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert('Course added successfully!');
      setShowCourseModal(false);
      setCourseForm({ title: '', description: '', file: null });
      setSelectedProjectId(null);
      fetchCoursesByProject(filteredProjects);
    } else {
      alert('Something went wrong while adding the course.');
    }
  } catch (error: any) {
    console.error('Error adding course:', error);
    alert(error?.response?.data?.message || 'Failed to add course.');
  }
};

const handleUpdateCourse = async () => {
  if (!editingCourse || !selectedProjectId) return;

  const { title, description, file } = courseForm;

  if (!title || !description) {
    alert('Please fill all required fields before submitting.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.put(
      `http://localhost:5151/api/Projects/${selectedProjectId}/materials/${editingCourse.id}/editmaterial`,
     
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (response.status === 200) {
      alert('Course updated successfully.');
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', file: null });
      setSelectedProjectId(null);
      fetchCoursesByProject(filteredProjects);
    } else {
      alert('Something went wrong while updating the course.');
    }
  } catch (error: any) {
    console.error('Error updating course:', error);
    alert(error?.response?.data?.message || 'Failed to update course.');
  }
};

  

  const handleDeleteCourse = async (projectId: string, materialId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this course?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(
      `http://localhost:5151/api/Projects/${projectId}/materials/${materialId}/deletematerial`
    );

    if (response.status === 200) {
      alert("Course deleted successfully.");
      fetchCoursesByProject(filteredProjects);
    } else {
      alert("Something went wrong while deleting the course.");
    }
  } catch (error: any) {
    console.error("Error deleting course:", error);
    alert(error?.response?.data?.message || "Failed to delete course.");
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
                        <h2>Edit Your Profile</h2>
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
        <h2>My Projects & Courses</h2>
        <div className={styles["add-course-to-project-btn-div"]}>
        <Link href="/all-projects" className={styles["add-course-to-project-btn"]}>show all projects</Link>
        </div>
 
        {filteredProjects.length === 0 && <p className={styles['validations']}>No projects assigned to you.</p>}
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles["project-card"]}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <h4>Materials</h4><br/>
            <ul className={styles["courses-list"]}>
              {(coursesByProject[project.id] || []).map((course) => (
                <li key={course.id}>
                  <span>
                    <strong>{course.title}</strong>: {course.description}
                  </span>
                  <span>
                    <button onClick={() => {
                      setEditingCourse(course);
                      setSelectedProjectId(project.id); 
                      setCourseForm({ title: course.title, description: course.description, file: null });
                      setShowCourseModal(true);
                    }} title="Edit Course">✏️</button>
                    <button onClick={() => handleDeleteCourse(project.id, course.id)} title="Delete Course">🗑️</button>
                  </span>
                </li>
              ))}
              <button
                className={styles["add-course-to-project-btn"]}
                onClick={() => {
                  setEditingCourse(null);
                  setSelectedProjectId(project.id);
                  setCourseForm({ title: '', description: '', file: null });
                  setShowCourseModal(true);
                }}
              >
                ➕ Add Course to Project
              </button>
            </ul>
          </div>
        ))}

        {showCourseModal && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>
              <input
                type="text"
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              />
              <textarea
                placeholder="Course Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCourseForm({ ...courseForm, file: e.target.files[0] });
                  }
                }}
              />
              <div className={styles["modal-buttons"]}>
                {editingCourse ? (
                  <button onClick={handleUpdateCourse}>Update</button>
                ) : (
                  <button onClick={handleAddCourse}>Add</button>
                )}
                <button onClick={() => {
                  setShowCourseModal(false);
                  setEditingCourse(null);
                  setSelectedProjectId(null);
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default withRoleProtection(InstructorDashboard, ['Instructor']);
