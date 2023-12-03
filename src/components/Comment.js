import PropTypes from 'prop-types';
import styles from '../styles/home.module.css'
import { toggleLike } from '../api';
import toast from 'react-hot-toast';
const Comment = ({ comment }) => {

    const handleCommentLikeClick = async () => {
        const response = await toggleLike(comment._id, 'Comment');
        if (response.success) {
            if (response.data.deleted) {
                toast.success('Comment removed');
            } else {
                toast.success('Comment added');
            }
        } else {
            toast.error(response.message);
        }
    }

    return (
        <div className={styles.postCommentsItem}>
            <div className={styles.postCommentHeader}>
                <span className={styles.postCommentAuthor}>{comment.user.name}</span>
                <span className={styles.postCommentTime}>{comment.createdAt}</span>
                <span className={styles.commentLike}>
                    <img onClick={handleCommentLikeClick}
                        src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                        alt="likes-icon"
                    />
                </span>
                <span className={styles.postCommentLikes}>{comment.likes.length}</span>
            </div>
            <div className={styles.postCommentContent}>{comment.content}</div>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
};

export default Comment;