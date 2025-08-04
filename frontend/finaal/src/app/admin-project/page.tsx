'use client';
import React, { useState, useEffect,useRef} from 'react';
import Select from 'react-select';
import { MdDashboard } from 'react-icons/md';
import { FaBars, FaUserCircle, FaSignOutAlt ,FaFolderOpen, FaUserTie, FaUserGraduate } from 'react-icons/fa';
import styles from "./admin-project.module.css";
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import withRoleProtection from './../withRoleProtectiont';

interface ProjectDetails {
  title: string;
  description: string;
  instructors: string[];
  materialCount: number;
}

interface Material{
  id: number;
  title: string;
  description: string;
  fileName?: string;
}

const AdminProject = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [showAddProjectForm, setShowAddProjectForm] = useState(false);
    const [showAddInstructorForm, setShowAddInstructorForm] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [instructorList, setInstructorList] = useState<string[]>([]);
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

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

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  router.push("/login"); // أو "/" حسب ما بدك
};
 const handleViewFile = (materialId: number) => {
    const fullFileUrl = `http://localhost:5151/api/Projects/${id}/materials/${materialId}/showmaterial`;
    setFileUrl(fullFileUrl);
    setShowModal(true);
  };
  
    const userRole = localStorage.getItem("role"); 


  const Getmaterials = async () => {
  if (!id) return; 

  try {
    const res = await axios.get(`http://localhost:5151/api/Projects/${id}/materials/Getmaterials`);
    setMaterials(res.data);
  } catch (err) {
    console.error('Failed to fetch materials:', err);
  }
};
  interface SelectOption {
  value: string;
  label: string;
}

const instructorOptions: SelectOption[] = instructorList.map(instructor => ({
  value: instructor,
  label: instructor
}));


    useEffect(() => {
      Getmaterials();
    }, [id]);

const handleDeleteMaterial = async (materialId: number) => {
   console.log('Deleting material with ID:', materialId);
  try {
    await axios.delete(`http://localhost:5151/api/Projects/${id}/materials/${materialId}/deletematerial`);
    Getmaterials(); 
  } catch (err) {
    console.error('Failed to delete material:', err);
    alert('Failed to delete material.');
  }
};

  const handleDeleteProject = async () => {
  if (!id) {
    alert('Project ID is missing');
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5151/api/Projects/${id}`);
    alert('Project deleted successfully!');
    
    window.location.href = '/admin-dashboard'; 
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    alert('Failed to delete project. Please try again.');
  }
};

const handleUpdateProject = async () => {
  if (!id) {
    alert('Project ID is missing');
    return;
  }

  if (!newProjectName || !newProjectDescription) {
    alert('Please fill in all fields');
    return;
  }

  const formData = new FormData();
  formData.append('title', newProjectName);
  formData.append('description', newProjectDescription);
  if (newProjectImage) {
    formData.append('icon', newProjectImage);
  }

  try {
    const response = await axios.put(
      `http://localhost:5151/api/Projects/${id}/updateprojectinfo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      alert('Project updated successfully');
      setShowAddProjectForm(false);
      fetchProjectDetails(); // Refresh the project info
    }
  } catch (error) {
    console.error('Failed to update project:', error);
    alert('Failed to update project. Please try again.');
  }
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

useEffect(() => {
   fetchInstructorList();
}, []);

const handleAssignInstructorsToProject = async () => {
  if (!id) {
    alert('Project ID is missing');
    return;
  }

  if (selectedInstructors.length === 0) {
    alert('Please select at least one instructor');
    return;
  }

  try {
    const payload = {
      instructorUserNames: selectedInstructors 
    };

    await axios.post(
      `http://localhost:5151/api/Projects/${id}/addinstructors`,
      payload, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    alert('Instructors assigned successfully!');
    setSelectedInstructors([]);
    setShowAddInstructorForm(false);
    fetchProjectDetails();
  } catch (error: any) {
    console.error('Failed to assign instructors:', error);
    alert(error.response?.data?.message || 'Failed to assign instructors.');
  }
};

const handleRemoveInstructorFromProject = async (username: string) => {
  if (!id) {
    alert("Project ID is missing");
    return;
  }

  const confirmDelete = window.confirm(`Are you sure you want to remove ${username} from this project?`);
  if (!confirmDelete) return;

  try {
    
    await axios.delete(`http://localhost:5151/api/Projects/${id}/deleteinstructor`, {
      data: {
        instructorUserNames: [username]
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    alert(`Instructor ${username} removed from project.`); 
    fetchProjectDetails();
  } catch (error: any) {
    console.error('Failed to remove instructor:', error);
    alert(error.response?.data?.message || 'Failed to remove instructor from project.');
  }
};

      const fetchProjectDetails = async () => {
        if (!id) return;
        try {
          const res = await axios.get(`http://localhost:5151/api/Projects/${id}/projectdetails`);
          setProjectDetails(res.data);
        } catch (err) {
          console.error('Error fetching project details:', err);
        }
      };
      
  useEffect(() => {
      fetchProjectDetails();
      fetchUser();
    }, [id]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
    
  return (
    <div className={styles["layout"]}>
      <nav className={styles["navbar"]}>
        <div className={styles["navbar-left"]}>
          <FaBars className={styles["menu-icon"]} onClick={() => setSidebarOpen(!sidebarOpen)} />
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

      <main className={styles["main-content"]}>
            {userRole === "Admin" && (
            <>
        
        <button className={styles["delete-project"]} onClick={handleDeleteProject}>
          Delete Project
        </button>
        <button onClick={() => setShowAddProjectForm(true)} className={styles['edit-project']}>Edit Project</button>
          {showAddProjectForm && (
  <div className={styles["modal-overlay"]}>
    <div className={styles["modal-content"]}>
      <h2>Add New Project</h2><br/>
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
          onChange={(e) => setNewProjectImage(e.target.files?.[0] || null)}
        />

      <div className={styles["modal-buttons"]}>
        <button onClick={handleUpdateProject}>Submit</button>
        <button onClick={() => setShowAddProjectForm(false)}>Cancel</button>
      </div>
    </div>
  </div>
  
)}
</>
)}
    {projectDetails && (
        <>
        <h1 className={styles["project-name"]}>{projectDetails.title}</h1><br/>
        <p>{projectDetails.description}</p><br/>
        <h4>Total Materials: {projectDetails.materialCount}</h4>
       </>
    )}
        <div>
          <h2>All Courses</h2>
          <div className={styles["material-list"]}>
          {materials.map((material, index) => (
            <div key={material.id} className={styles["material-card"]}>
              <div className={styles["material-header"]}>
                <h4>{material.title}</h4><br/>
                 {userRole === "Admin" && (
                  <>
                  <div className={styles["course-container"]}>
                    <button onClick={() =>{ handleDeleteMaterial(material.id)}} className={styles["trash-button"]}>
                      🗑️
                    </button>
                  </div>
                  </>
                  )}
              </div>
             <p>{material.description}</p><br/>

      {material.fileName && (
          <button onClick={() => handleViewFile(material.id)} className={styles["viewButton"]}>
            View File
          </button>
        )}

        {/* File Modal */}
        {showModal && (
          <div className={styles['modalOverlay']} onClick={() => setShowModal(false)}>
            <div className={styles['modalContent']} onClick={(e) => e.stopPropagation()}>
              <button className={styles['closeButton']} onClick={() => setShowModal(false)}>✖</button>
              <iframe
                src={fileUrl}
                title="Material File"
                className={styles['fileViewer']}
               
              ></iframe>
            </div>
          </div>
        )}

      {showModal && (
        <div className={styles["fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"]}>
          <div className={styles["bg-white w-11/12 h-5/6 rounded-lg shadow-lg relative p-4"]}>
            <button
              onClick={() => setShowModal(false)}
              className={styles["absolute top-2 right-2 text-black font-bold text-lg"]}>
              &times;
            </button>
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
              title="File Viewer"
              className={styles["w-full h-full"]}
            ></iframe>
          </div>
        </div>
      )}
            </div>
          ))}
        </div>
        </div>
        <div className={styles["video-card"]}>
          <video controls poster="video-thumbnail.jpg" src="/images/comingsoon.mp4"></video>
        </div>
      </main>

      <aside className={styles["progress-sidebar"]}>
        {userRole === "Admin" && (
            <>
        <h2>Current Project Instructors</h2>
 
        {projectDetails && (
  <table className={styles["instructor-table"]}>
    <thead>
      <tr>
        <th>Name</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
       
      {projectDetails.instructors.map((name, index) => (
        <tr key={index}>
          <td>{name}</td>
          <td>
            <div >
             <button onClick={() => handleRemoveInstructorFromProject(name)}>🗑️</button>
            </div>
          </td>
        </tr>
      ))}
  
    </tbody>
  </table>
)}
</>
)}
           {userRole === "Admin" && (
            <>
           <button className={styles["add-instructor"]} onClick={() => setShowAddInstructorForm(!showAddInstructorForm)}>
          {showAddInstructorForm ? 'Cancel' : '+ Add Instructors'} </button>
        {showAddInstructorForm && (
               <div className={styles["add-form"]}>
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
              className={styles["w-full"]}
              placeholder="Select Instructors"
            />
            <button className={styles["submit-instructor"]} onClick={handleAssignInstructorsToProject}>Submit</button>
          </div>   
        )}
          </>
        )}
      </aside>   
      </main>
    </div>
  );
};

export default withRoleProtection(AdminProject, ['Admin','Instructor','Freelancer']);
