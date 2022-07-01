import React, { useState, useContext } from "react";
import { DateTime } from "luxon";
import EditForm from "./EditForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router";
import jwtDecode from 'jwt-decode';
import AuthContext from "../context/AuthProvider";


export default function Post(props){

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleDelete = async (e) => {
        try{
            await axiosPrivate(
                `/posts/${props.post.id}`,
                {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            props.setPosts(props.posts.filter(selectedPost => {
                return selectedPost.id !== props.post.id
            }));
            setErrors([]);
        } catch(error) {
            console.error(error);
            if (!error?.response?.data){
                setErrors(["No server response", ...errors]);
            } else if(error.response.status === 403){
                setErrors(["You don't have the permission to do it", ...errors]);
            } else if (error.response.status === 401){
                navigate("/users/signin");
            }
            else {
                setErrors(["Deleting failed", ...errors]);
            }
            window.setTimeout(()=>setErrors([]), 3000);
        }
    }
    

    return (
        <div className="post-container">
            <p className="post-username">{props.post.username}:</p>
            <p className="post-created">{DateTime.fromISO(props.post.created).toLocaleString(DateTime.DATETIME_MED)}</p>
            
            {
                editing === true ? 
                <EditForm 
                posts={props.posts} 
                setPosts={props.setPosts} 
                setEditing={setEditing} 
                post={props.post}
                 /> : 
                (
                    <>
                        <p className="post-text">{props.post.postText}</p>
                        {auth.accessToken === undefined || jwtDecode(auth.accessToken).username !== props.post.username ? "": 
                        (
                            <div className="button-group">
                                <input 
                                    type="button" 
                                    className="form-element-blue" 
                                    onClick={() => setEditing(true)} 
                                    value="Edit" 
                                    />
                                <input 
                                    type="button" 
                                    className="form-element-blue" 
                                    onClick={handleDelete} 
                                    value="Delete post" 
                                    />
                            </div>

                        )}
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
                    </>
                )
            }
        </div>
    )
}

