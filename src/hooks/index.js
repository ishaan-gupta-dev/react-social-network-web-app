import { useContext, useEffect, useState } from "react";
import { AuthContext, PostsContext } from "../providers";
import { login as userLogin, register, editProfile, fetchUserFriends, getPosts, addPost } from "../api";
import { getItemFromLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemFromLocalStorage, setItemInLocalStorage } from "../utils";
import jwt from 'jwt-decode';
import toast, { Toaster, useToaster } from 'react-hot-toast';

export const useAuth = () => {
    return useContext(AuthContext);
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getUser = async () => {
            const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
            if (userToken) {
                const user = jwt(userToken);
                const response = await fetchUserFriends();
                //console.log('response in index of hooks.js', response);
                let friends = [];
                if (response.success) {
                    friends = response.data.friends;
                }

                setUser({
                    ...user,
                    friends: response.data.friends
                })
            }
            setLoading(false);
        };

        getUser();

    }, []);


    const login = async (email, password) => {
        const response = await userLogin(email, password);
        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    };


    const signup = async (name, email, password, confirmPassword) => {
        const response = await register(name, email, password, confirmPassword);
        console.log("response in index js of hooks", response);
        if (response.success) {
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    };

    const logout = () => {
        toast.success('Successfully logged out')
        setUser(null);
        removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY ? LOCALSTORAGE_TOKEN_KEY : null);
    }


    const updateUser = async (userId, name, password, confirmPassword) => {
        const response = await editProfile(userId, name, password, confirmPassword);
        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    };

    const updateUserFriends = async (addFriend, friend) => {
        if (addFriend) {
            setUser({
                ...user,
                friends: [...user.friends, friend],
            });
            return;
        }

        // remove friend logic
        const newFriends = user.friends.filer((f) => f.to_user._id !== friend.to_user._id);
        setUser({
            ...user,
            friends: newFriends,
        });
    };

    return {
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        updateUserFriends,
    }
};


export const usePosts = () => {
    return useContext(PostsContext);
}

export const useProvidePosts = () => {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchPosts = async () => {
            const response = await getPosts();
            //console.log('response', response);
            if (response.success) {
                setPosts(response.data.posts);
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);


    const addPostToState = (post) => {
        const newPosts = [post, ...posts];
        setPosts(newPosts);
    };

    const addComment = (comment, postId) => {
        const newPosts = posts.map((post) => {
            if (post._id === postId) {
                return { ...post, comments: [...post.comments, comment] };
            }
            return post;
        });

        setPosts(newPosts);
    };

    return {
        data: posts,
        loading,
        addPostToState,
        addComment,
    }
};