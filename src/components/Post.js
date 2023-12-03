import PropTypes from 'prop-types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { createComment, toggleLike } from '../api';
import { usePosts } from '../hooks';
import styles from '../styles/home.module.css';
import { Comment } from './';
const Post = ({ post }) => {
    const [comment, setComment] = useState('');
    const [creatingComment, setCreatingComment] = useState(false);
    const posts = usePosts();

    const handleAddComment = async (e) => {
        if (e.key === 'Enter') {
            setCreatingComment(true);

            if (comment.length === 0) {
                toast.error("Comment cannot be empty");
                setCreatingComment(false);
                return;
            }

            const response = await createComment(comment, post._id);

            if (response.success) {
                setComment('');
                posts.addComment(response.data.comment, post._id);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }

            setCreatingComment(false)
        };
    };

    const handlePostLikeClick = async () => {
        const response = await toggleLike(post._id, 'Post');
        if (response.success) {
            if (response.data.deleted) {
                toast.success('Like removed');
            } else {
                toast.success('Like added');
            }
        } else {
            toast.error(response.message);
        }
    }

    return (
        <div className={styles.postWrapper}>
            <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1990/1990261.png"
                        alt="user-pic"
                    />
                    <div>
                        <Link to={`/user/${post.user._id}`}
                            state={{ user: post.user }}
                            className={styles.postAuthor} >
                            {post.user.name}
                        </Link>
                        <span className={styles.postTime}>{post.createdAt}</span>
                    </div>
                </div>
                <div className={styles.postContent}>{post.content}</div>

                <div className={styles.postActions}>
                    <div className={styles.postLike}>
                        <img onClick={handlePostLikeClick}
                            src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                            alt="likes-icon"
                        />
                        <span>{post.likes.length}</span>
                    </div>

                    <div className={styles.postCommentsIcon}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/13/13673.png"
                            alt="comments-icon"
                        />
                        <span>{post.comments.length}</span>
                    </div>
                </div>
                <div className={styles.postCommentBox}>
                    <input placeholder="Start typing a comment" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={handleAddComment} />
                </div>

                <div className={styles.postCommentsList}>
                    {post.comments.map((comment) => (
                        <Comment comment={comment} key={`comment-${comment._id}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}


Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;