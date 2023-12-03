import styles from '../styles/settings.module.css'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import { Loader } from '../components';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
    /* if we want to use useLocation hook
    const location = useLocation();
    console.log("location in UserProfile", location);
    const { user = {} } = location.state;
    */

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const getUser = async () => {
            const response = await fetchUserProfile(userId);

            if (response.success) {
                setUser(response.data.user)
            } else {
                toast.error(response.message);
                return navigate('/');
            }
            setLoading(false);
        };

        getUser();
    }, [userId, toast, navigate]);

    const checkIfUserIsAFriend = () => {
        const friends = auth.user.friends;
        if (!friends) {
            return true;
        }
        const friendIds = friends.map((friend) => friend.to_user._id);
        const index = friendIds.indexOf(userId);

        if (index !== -1) {
            return true;
        }

        return false;
    }

    const handleAddFriendClick = async () => {
        setRequestInProgress(true);

        const response = await addFriend(userId);

        if (response.success) {
            const { friendship } = response.data;

            auth.updateUserFriends(true, friendship);
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }

        setRequestInProgress(false);
    }

    const handleRemoveFriendClick = async () => {
        setRequestInProgress(true);

        const response = await removeFriend(userId);

        if (response.success) {
            const friendship = auth.user.friends.filter((friend) => friend.to_user._id === userId);

            auth.updateUserFriends(false, friendship[0]);
            toast.success("Friend removed successfully");
        } else {
            toast.error(response.message);
        }

        setRequestInProgress(false);
    }
    if (loading) {
        return <Loader />;
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
                    {user.email}
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>
                    Name
                </div>
                <div className={styles.fieldValue}>
                    {user.name}
                </div >
            </div>
            <div className={styles.btnGrp}>

                {checkIfUserIsAFriend() ? (
                    <button className={`button ${styles.saveBtn}`} onClick={handleRemoveFriendClick} disabled={requestInProgress}>
                        {requestInProgress ? "Removing friend..." : "Remove friend"}
                    </button>
                ) : (
                    <button className={`button ${styles.saveBtn}`} onClick={handleAddFriendClick} disabled={requestInProgress}>
                        {requestInProgress ? "Adding friend..." : "Add friend"}
                    </button>
                )}
            </div>
        </div>
    )
}

export default UserProfile;