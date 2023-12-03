import styles from '../styles/settings.module.css'
import { useAuth } from '../hooks';
import { useState } from 'react';
import toast from 'react-hot-toast';
const Settings = () => {
    const auth = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(auth.user?.name ? auth.user.name : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingForm, setSavingForm] = useState(false);

    const clearForm = () => {
        setPassword('');
        setConfirmPassword('');
    }
    const updateProfile = async () => {
        setSavingForm(true);

        let error = false;
        if (!name || !password || !confirmPassword) {
            error = true;
            toast.error("Please fill all the fields!")
        }

        if (password !== confirmPassword) {
            error = true;
            toast.error("Password and Confirm Password do not match!")
        }
        if (error) {
            return setSavingForm(false);
        }

        const response = await auth.updateUser(auth.user._id, name, password, confirmPassword);

        if (response.success) {
            setSavingForm(false);
            setEditMode(false);
            clearForm();
            return toast.success("User details updated successfully")
        } else {
            toast.error(response.message);
        }
        setSavingForm(false);
    }
    return (
        <div className={styles.settings}>
            <div className={styles.imgContainer}>
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="settings image" />
            </div>
            <div className={styles.field}>
                <div className={styles.fieldLabel}>
                    Email
                </div>
                <div className={styles.fieldValue}>
                    {auth.user?.email}
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>
                    Name
                </div>
                {editMode ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input>
                ) : (
                    <div className={styles.fieldValue}>
                        {auth.user?.name}
                    </div>
                )}
            </div >

            {editMode && (
                <>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            Password
                        </div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            Confirm Password
                        </div>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></input>
                    </div>
                </>
            )}

            <div className={styles.btnGrp}>
                {editMode ? (
                    <>
                        <button className={`button ${styles.saveBtn}`} onClick={updateProfile} disabled={savingForm}>
                            {savingForm ? 'Saving Profile...' : 'Save Profile'}
                        </button>
                        <button className={`button ${styles.editBtn}`} onClick={() => setEditMode(false)}>
                            Go Back
                        </button>
                    </>
                ) : (
                    <button className={`button ${styles.editBtn}`} onClick={() => setEditMode(true)}>
                        Edit Profile
                    </button>
                )}

            </div>

        </div >
    )
}

export default Settings;