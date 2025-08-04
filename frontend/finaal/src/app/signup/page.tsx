'use client';
import React, { useState, FormEvent } from 'react';
import styles from './signup.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash} 
from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


interface SignupResponse {
  message: string;
}

const Signup: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setFormErrors({});
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!userName || !email || !password) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post<SignupResponse>('http://localhost:5151/api/Accounts/register', {
        userName,
        email,
        password,
      });

      toast.success('🎉 Signup successful! Please confirm your email befor login.');
      // setSuccessMessage(response.data.message || 'Signup successful!');
      setTimeout(() => setSuccessMessage(null), 5000);

      setUserName('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
  router.push('/login');
}, 3000); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          const errorObj: { [key: string]: string[] } = error.response.data.errors;
          const newErrors: { [key: string]: string } = {};
          for (const key in errorObj) {
            const message = errorObj[key].join(' ');
            newErrors[key] = message;
            toast.error(`${key}: ${message}`);
          }
          setFormErrors(newErrors);
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          console.error('Signup error:', error.response?.data || error.message);
          toast.error('Signup failed. Please try again.');
        }
      } else {
        toast.error('Unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className={styles["navbar"]}>
        <img src="/images/logo.png" alt="Logo" className={styles["logo"]} />
        <ul className={styles["nav-links"]}>
          <li><a href="/public">Home</a></li>
          <li><a href="/all-projects">Projects</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </header>

      <main className={styles["signup-container"]}>
        <h1>Sign Up</h1>

        {successMessage && <div className={styles["success-message"]}>{successMessage}</div>}

        {errors.length > 0 && (
          <div className={styles["error-messages"]}>
            {errors.map((error, index) => (
              <p key={index} className={styles["error-message"]}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="userName"
              placeholder="Full Name"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {formErrors.userName && <p className={styles["field-error"]}>{formErrors.userName}</p>}
          </div>

          <div className={styles["input-group"]}>
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && <p className={styles["field-error"]}>{formErrors.email}</p>}
          </div>

          <div className={styles["input-group"]}>
            <FontAwesomeIcon icon={faLock} />
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className={styles["toggle-password"]}
              onClick={togglePasswordVisibility}
            />
            {formErrors.password && <p className={styles["field-error"]}>{formErrors.password}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles["divider"]}>Other sign up options</div>
        <div className={styles["social-icons"]}>
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faGoogle} />
          <FontAwesomeIcon icon={faApple} />
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Signup;
