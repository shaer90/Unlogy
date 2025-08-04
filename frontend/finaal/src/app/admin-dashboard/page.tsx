'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MdDashboard } from 'react-icons/md';
import axios from 'axios';
import { FaBars, FaUserCircle, FaSignOutAlt, FaFolderOpen, FaUserTie, FaUserGraduate} from 'react-icons/fa';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './admin-dashboard.module.css';
import Select from 'react-select';
import Link from "next/link";
import { useRouter } from "next/navigation";
import withRoleProtection from './../withRoleProtectiont';


interface Instructor {
  id: number | null;       // ممكن يكون null حسب API
  name: string;
  email: string;
  projects: number;
}

interface Freelancer {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  title: string;
  icon: string;
  courseCount: number;
}

const Admindashboard: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);
  const [newInstructorName, setNewInstructorName] = useState('');
  const [newInstructorEmail, setNewInstructorEmail] = useState('');
  const [instructorPage, setInstructorPage] = useState(1);
  const [instructorTotalPages, setInstructorTotalPages] = useState(1);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [showAddFreelancerForm, setShowAddFreelancerForm] = useState(false);
  const [newFreelancerName, setNewFreelancerName] = useState('');
  const [newFreelancerEmail, setNewFreelancerEmail] = useState('');
  const [freelancerPage, setFreelancerPage] = useState(1);
  const [freelancerTotalPages, setFreelancerTotalPages] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [instructorList, setInstructorList] = useState<string[]>([]);
  


  

  const [showEditProfileForm, setEditProfileForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);

   const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const router = useRouter();
  const rowsPerPage = 5;

  interface SelectOption {
  value: string;
  label: string;
}

const instructorOptions: SelectOption[] = instructorList.map(instructor => ({
  value: instructor,
  label: instructor
}));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
    const fetchInstructorList = async () => {
    try {
      const res = await axios.get('http://localhost:5151/api/Instructors/instructorlist');
      setInstructorList(res.data);
    } catch (err) {
      console.error('Error fetching instructor list:', err);
      setInstructorList([]);
    }
  };



const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  router.push("/login");
};


  const handleDeleteInstructor = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5151/api/Instructors/DeleteInstructor/${id}`);
      fetchInstructors();
    } catch (err) {
      console.error('Failed to delete instructor:', err);
    }
  };


 
const handleAddInstructor = async () => {
  if (!newInstructorName || !newInstructorEmail) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5151/api/Instructors/AddInstructor', {
      userName: newInstructorName,
      email: newInstructorEmail,
      password: ""
    });

    if (response.status === 200) {
      alert(response.data.message || "Instructor added successfully.");
      
      setShowAddInstructorForm(false);
      setNewInstructorName('');
      setNewInstructorEmail('');
      fetchInstructorList(); // Refresh the instructor list after addition
      fetchInstructors();
    } else {
      alert('Something went wrong.');
    }
  } catch (error: any) {
    console.error('Failed to add instructor:', error);
    
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message); 
    } else {
      alert('Failed to add instructor. Please check your backend/server.');
    }
  }
};



const handleDeleteFreelancer = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5151/api/Freelancers/DeleteFreelancer/${id}`);//endpoint for delete freelancer
      fetchFreelancers();
      fetchInstructorList();
    } catch (err) {
      console.error('Failed to delete freelancer:', err);
    }
  };

//   const HandleAddFreelancer = async () => {
//   if (!newFreelancerName || !newFreelancerEmail) {
//     alert("Please enter both name and email.");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       'http://localhost:5151/api/Freelancers/AddFreelancer',
//       {
//         userName: newFreelancerName,
//         email: newFreelancerEmail
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json' 
//         }
//       }
//     );

//     alert(response.data.message || "Freelancer added successfully.");
//     setNewFreelancerName('');
//     setNewFreelancerEmail('');
//     setShowAddFreelancerForm(false);
//   } catch (error) {
//     console.error(error);
//     alert(
//       error.response?.data?.message ||
//       "Something went wrong while adding the freelancer."
//     );
//   }
// };

const HandleAddFreelancer = async () => {
  if (!newFreelancerName || !newFreelancerEmail) {
    alert("Please enter both name and email.");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5151/api/Freelancers/AddFreelancer',
      {
        userName: newFreelancerName,
        email: newFreelancerEmail
      },
      {
        headers: {
          'Content-Type': 'application/json' 
        }
      }
    );

    alert(response.data.message || "Freelancer added successfully.");

   
    setNewFreelancerName('');
    setNewFreelancerEmail('');
    setShowAddFreelancerForm(false);

  
    fetchFreelancers();

  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
      "Something went wrong while adding the freelancer."
    );
  }
};


  const handleAddProject = async () => {
  if (!newProjectName.trim() || !newProjectDescription.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("title", newProjectName); 
  formData.append("description", newProjectDescription); 
  if (newProjectImage) {
    formData.append("icon", newProjectImage); 
  }


  
  selectedInstructors.forEach((instructorName) => {
    formData.append("instructorUserNames", instructorName);
  });


  try {
    const response = await axios.post("http://localhost:5151/api/Projects/CreateProject", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Project added:", response.data);
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectImage(null);
    setSelectedInstructors([]); 
    setShowAddProjectForm(false);
    fetchProjects(); 
  } catch (error) {
    console.error("Error adding project:", error);
    alert("Failed to add project.");
  }
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

 
  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost:5151/api/Instructors/instructorswithprojects', {
        params: {
          pageNumber: instructorPage,
          pageSize: rowsPerPage,
        }
      });
      setInstructors(
        res.data.items.map((inst: any) => ({
          id: inst.id,
          name: inst.userName,
          email: inst.email,
          projects: inst.projectsCount,
        }))
      );
      console.log("API Response items:", res.data.items);
      const totalPages = Math.ceil(res.data.totalCount / rowsPerPage);
      setInstructorTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setInstructors([]);
      setInstructorTotalPages(1);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const res = await axios.get('http://localhost:5151/api/Freelancers/getallfreelancers', {
        params: {
          pageNumber: freelancerPage,
          pageSize: rowsPerPage,
        }
      });
      setFreelancers(
        res.data.items.map((inst: any) => ({
          id: inst.id,
          name: inst.userName,
          email: inst.email,
        }))
      );
      console.log("API Response items:", res.data.items);
      const totalPages = Math.ceil(res.data.totalCount / rowsPerPage);
      setFreelancerTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching freelancers:', err);
      setFreelancers([]);
      setFreelancerTotalPages(1);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5151/api/Projects/recentprojects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFreelancers();
    fetchProjects();
    fetchInstructorList(); 
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [instructorPage]);

  useEffect(() => {
    fetchFreelancers();
  }, [freelancerPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        
        <div className={styles["instructor-container"]}>
          <div className={styles["instructor-header"]}>
            <h2>Instructors</h2>
            <button className={styles["add-button"]} onClick={() => setShowAddInstructorForm(!showAddInstructorForm)}>
            {showAddInstructorForm ? 'Cancel' : '+ Add new Instructor'}
          </button>
          {showAddInstructorForm && (
          <div className={styles["add-form"]}>
          <input
            type="text"
            placeholder="Instructor Name"
            value={newInstructorName}
            onChange={(e) => setNewInstructorName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Instructor Email"
            value={newInstructorEmail}
            onChange={(e) => setNewInstructorEmail(e.target.value)}
          />
          <button onClick={handleAddInstructor}>Add Instructor</button>
          </div>
          )}
          </div>
          <table className={styles["instructor-table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Projects</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst, index) => (
                <tr key={index}>
                  <td>{inst.name}</td>
                  <td>{inst.email}</td>
                  <td>{inst.projects}</td>
                  <td >
                        <button onClick={() => {
                        console.log("Trying to delete instructor with ID:", inst.id);
                         if (inst.id !== null) handleDeleteInstructor(inst.id);
                          }}>
                         🗑️
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles["pagination"]}>
            <button disabled={instructorPage === 1} onClick={() => setInstructorPage(instructorPage - 1)}>{'<'}</button>
            {[...Array(instructorTotalPages)].map((_, i) => (
              <button
                key={i}
                className={instructorPage === i + 1 ? 'active' : ''}
                onClick={() => setInstructorPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={instructorPage === instructorTotalPages} onClick={() => setInstructorPage(instructorPage + 1)}>{'>'}</button>
          </div>
        </div>
                 <div className={styles["instructor-container"]}>
          <div className={styles["instructor-header"]}>
            <h2>Freelancers</h2>
            <button className={styles["add-button"]} onClick={() => setShowAddFreelancerForm(!showAddFreelancerForm)}>
            {showAddFreelancerForm ? 'Cancel' : '+ Add new Freelancer'} 
          </button>
          {showAddFreelancerForm && (
          <div className={styles["add-form"]}>
          <input
            type="text"
            placeholder="Freelancer Name"
            value={newFreelancerName}
            onChange={(e) => setNewFreelancerName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Freelancer Email"
            value={newFreelancerEmail}
            onChange={(e) => setNewFreelancerEmail(e.target.value)}
          />
          <button onClick={HandleAddFreelancer}>Add Freelancer</button>
          </div>
          )}
          </div>
          <table className={styles["instructor-table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {freelancers.map((inst, index) => (
                <tr key={index}>
                  <td>{inst.name}</td>
                  <td>{inst.email}</td>
                  <td>
                        <button onClick={() => {
                    console.log("Trying to delete freelancer with ID:", inst.id);
                    if (inst.id !== null) handleDeleteFreelancer(inst.id);
                    }}>
                     🗑️
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles["pagination"]}>
            <button disabled={freelancerPage === 1} onClick={() => setFreelancerPage(freelancerPage - 1)}>{'<'}</button>
            {[...Array(freelancerTotalPages)].map((_, i) => (
              <button
                key={i}
                className={freelancerPage === i + 1 ? 'active' : ''}
                onClick={() => setFreelancerPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={freelancerPage === freelancerTotalPages} onClick={() => setFreelancerPage(freelancerPage + 1)}>{'>'}</button>
          </div>
        </div>
       
     <div className={styles["projects-container"]}>
  <div className={styles["projects-header"]}>
    <h2>Recent Projects</h2>
    <div className={styles["project-actions"]}>
      <Link href="/all-projects" className={styles["show-link-btn"]}>
        Show all Projects
      </Link>
      <button onClick={() => setShowAddProjectForm(true)} className={styles['show-all-btn']}>
        + Add new Project
      </button>
    </div>

    {showAddProjectForm && (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]}>
          <h2>Add New Project</h2>
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setNewProjectImage(e.target.files[0]);
            }}
          />
          <div className={styles["instructor-selection"]}>
            <Select
              isMulti
              options={instructorOptions}
              value={instructorOptions.filter(option =>
                selectedInstructors.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                setSelectedInstructors(
                  selectedOptions.map(option => option.value)
                );
              }}
              className={styles["react-select-container"]}
              classNamePrefix={styles["react-select"]}
              placeholder="Select Instructors:"
            />
          </div>
          <div className={styles["modal-buttons"]}>
            <button onClick={handleAddProject}>Submit</button>
            <button onClick={() => setShowAddProjectForm(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )}
  </div>

  <section className={styles["projects-grid"]}>
    {projects.map((cat) => (
      <Link
        href={`/admin-project?id=${cat.id}`}
        key={cat.id}
        className={styles["projects-card"]}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={`http://localhost:5151/ProjectIcons/${cat.icon}`}
          alt={cat.title}
          className={styles["Project-icon"]}
        />
        <h3>{cat.title}</h3>
        <p>{cat.courseCount} Courses</p>
      </Link>
    ))}
  </section>
</div>

      </main>
    </div>
  );
};

export default withRoleProtection(Admindashboard, ['Admin']);
