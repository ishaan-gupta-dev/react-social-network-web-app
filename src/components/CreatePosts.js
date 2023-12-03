import { useState } from 'react';
import styles from '../styles/home.module.css';
import toast from 'react-hot-toast';
import { usePosts } from '../hooks';
import { addPost } from '../api';
const CreatePost = () => {
    const posts = usePosts();
    const [post, setPost] = useState('');
    const [addingPost, setAddingPost] = useState(false);

    const handleAddPostClick = async () => {

        setAddingPost(true);

        if (post.length === 0) {
            toast.error("Post cannot be empty");
            setAddingPost(false);
            return;
        }
        const response = await addPost(post);
        if (response.success) {
            setPost('');
            posts.addPostToState(response.data.post);
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
        setAddingPost(false);
    }
    return (
        <div className={styles.createPost}>
            <textarea className={styles.addPost} value={post} onChange={(e) => setPost(e.target.value)} />
            <div>
                <button className={styles.addPostBtn} onClick={handleAddPostClick} disabled={addingPost}>
                    {addingPost ? 'Adding Post...' : 'Add Post'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;