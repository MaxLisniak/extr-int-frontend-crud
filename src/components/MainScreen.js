import { useState, useEffect, useContext } from 'react';
import Post from './Post';
import PostForm from './PostForm';
import axios from "../api/axios";
import useRefreshToken from "../hooks/useRefreshToken";
import AuthContext from "../context/AuthProvider";



export default function MainScreen(props){

    const { auth } = useContext(AuthContext);
    const refresh = useRefreshToken();
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState([]);

    const fetchPosts = async() => {
        try{
            const response = await axios(
                `/posts/`,
                {
                    method: 'get',
                }
            );
            setPosts(response.data);
            setErrors([]);
            
            try{
                await refresh();
            } catch(error){
                setErrors(["Not authorized, please sign in", ...errors])
            }
            
        } catch(error) {
            console.error(error);
            if (!error?.response?.data){
                setErrors(["No server response", ...errors]);
            }  else {
                setErrors(["Loading failed", ...errors]);
            }
        }
    }

    // fetch posts
    useEffect( function (){
        fetchPosts();
    }, [])

    return(
        <div className="container">
            {
                errors.length > 0 ? 
                (
                    <ul>
                    {
                        errors.map((error, i) => {
                            return <li key={i} className="error-message"><p>{error}</p></li>
                        })
                    }
                    </ul>
                )
                : <></>
            }
            
            {auth.accessToken === undefined ? "":
            (
                <PostForm setPosts={setPosts} posts={posts} />
            )} 
            
            <ul id="post-list">
                {posts.map(post => {
                return <Post 
                posts={posts} 
                setPosts={setPosts} 
                post={post} 
                key={post.id}
                />
                })}
            </ul>          
        </div>
    )
}