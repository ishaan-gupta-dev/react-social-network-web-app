import { API_URLS, getFormBody, LOCALSTORAGE_TOKEN_KEY } from '../utils';
const customFetch = async (url, { body, ...customConfig }) => {

    const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

    const headers = {
        //'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        //Accept: 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const config = {
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        //config.body = JSON.stringify(body);
        config.body = getFormBody(body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (data.success) {
            return {
                data: data.data,
                success: true,
            };
        }

        throw new Error(data.message);
    } catch (error) {
        console.error('error');
        return {
            message: error.message,
            success: false,
        };
    }

};

export const getPosts = (page = 1, limit = 5) => {
    return customFetch(API_URLS.posts(page, limit), {
        method: 'GET',
        //mode:'no-cors'
    });
};

export const login = (email, password) => {
    return customFetch(API_URLS.login(), {
        method: 'POST',
        body: { email, password },
    });
};

export const register = async (name, email, password, confirmPassword) => {
    return customFetch(API_URLS.signup(), {
        method: 'POST',
        body: { name, email, password, confirm_password: confirmPassword },
    });
};

export const editProfile = async (userId, name, password, confirmPassword) => {
    return customFetch(API_URLS.editUser(), {
        method: 'Post',
        body: { id: userId, name, password, confirm_password: confirmPassword },
    });
};

export const fetchUserProfile = async (userId) => {
    return customFetch(API_URLS.userInfo(userId), {
        method: 'GET',
    });
};

export const fetchUserFriends = async () => {
    return customFetch(API_URLS.friends(), {
        method: 'GET',
    });
};

export const addFriend = async (userId) => {
    return customFetch(API_URLS.createFriendship(userId), {
        method: 'POST',
        mode: 'cors',
    });
};

export const removeFriend = async (userId) => {
    return customFetch(API_URLS.removeFriend(userId), {
        method: 'POST',
    });
};

export const addPost = async (content) => {
    return customFetch(API_URLS.createPost(), {
        method: 'POST',
        body: {
            content,
        },
    });
};

export const createComment = async (content, postId) => {
    return customFetch(API_URLS.comment(), {
        method: 'POST',
        body: {
            post_id: postId,
            content,
        },
    });
};

export const toggleLike = async (itemId, itemType) => {
    return customFetch(API_URLS.toggleLike(itemId, itemType), {
        method: 'POST',
    });
};

export const searchUsers = async (searchText) => {
    return customFetch(API_URLS.searchUsers(searchText), {
        method: 'GET',
    });
};