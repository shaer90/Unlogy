'use client';
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import styles from'./login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGoogle,
  faApple
} from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}


const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!username || !password) {
    toast.error('Please fill in both username and password.');
    return;
  }

  try {
    const response = await axios.post<LoginResponse>(
      'http://localhost:5151/api/Accounts/login',
      {
        username,
        password
      }
    );

    const token = response.data.token;
    localStorage.setItem('token', token);


    const role = response.data.user.role;
    localStorage.setItem('role',role);
    const userId = response.data.user.id;

    toast.success(`🎉 Welcome ${role}!`);

    if (role === 'Admin') {
      router.push('/admin-dashboard');
    } else if (role === 'Instructor') {
      router.push(`/instructor-dashboard?id=${userId}`);
    } else if (role === 'Freelancer') {
      router.push('/freelancer-dashboard');
    } else {
      router.push('/');
    }

  } catch (error: any) {
    if (error.response?.data?.message) {
      toast.error(`Login failed: ${error.response.data.message}`);
    } else {
      toast.error('Login failed. Please try again.');
    }
    console.error('Login error:', error);
  }
};


  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles["login-left"]}>
        <header className={styles["navbar"]}>
          <img src="/images/logo.png" alt="Logo" className={styles["logo"]} />
          <ul className={styles["nav-links"]}>
            <li><a href="/public">Home</a></li>
            <li><a href="/all-projects">Projects</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </header>

        <h2 >Login to Your Account</h2>
        <p>Login with social network</p>

        <div className={styles["social-icons"]}>
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faGoogle} />
          <FontAwesomeIcon icon={faApple} />
        </div>

        <div className={styles["divider"]}>OR</div>

        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <FontAwesomeIcon icon={faLock} />
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className={styles["toggle-password"]}
              onClick={togglePasswordVisibility}
            />
          </div>

          <div className={styles["password"]}>
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forget password?</a>
          </div>

          <button type="submit" className={styles["login-button"]}>Login</button>
        </form>
      </div>

      <div className={styles["login-right"]}>
        <h2>New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities</p>
        <button className={styles["sign-up-btn"]} onClick={handleSignUp}>Sign Up</button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
