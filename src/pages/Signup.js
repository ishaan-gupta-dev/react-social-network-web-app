import { useState } from 'react';
import styles from '../styles/login.module.css';
import toast, { Toaster, useToaster } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { useNavigate, Navigate } from 'react-router-dom';
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [signingUp, setSigningUp] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    //console.log(auth);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSigningUp(true);

        let error = false;
        // email => codeial_test_user_one@codeial.com
        // password => 123
        if (!email || !password || !name || !confirmPassword) {
            error = true;
            toast.error('Please fill all the fields')
        }

        if (password !== confirmPassword) {
            error = true;
            toast.error('Make sure password and confirm password matches')
        }

        if (error) {
            return setSigningUp(false);
        }

        const response = await auth.signup(name, email, password, confirmPassword);
        console.log("response in signup", response);
        if (response.success) {
            // navigate.push('/login');
            navigate('/login');
            setSigningUp(false);
            toast.success('Successfully signed up')
        } else {
            toast.error(response.message)
        }

        setSigningUp(false);

    };

    if (auth.user) {
        return <Navigate to="/" />
    }

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <span className={styles.loginSignupHeader}>Register</span>
            <div className={styles.field}>
                <label>Name</label>
                <input type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} autoComplete="new-password" required />
            </div>
            <div className={styles.field}>
                <label>Email ID</label>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="new-password" required />
            </div>

            <div className={styles.field}>
                <label>Password</label>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className={styles.field}>
                <label>Confirm Password</label>
                <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className={styles.field} >
                <button disabled={signingUp}>
                    {signingUp ? 'Signing up...' : 'Signup'}
                </button>
            </div>
        </form>
    )
}

export default Register;