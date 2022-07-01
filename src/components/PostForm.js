import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";

export default function PostForm(props){

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [postText, setPostText] = useState("");
    const [errors, setErrors] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    
    // clear errors when user unputs are changed
    useEffect(()=>{
        setErrors([])
    }, [postText])

    // handle post
    function handleSubmit(e) {
        e.preventDefault();
        setPostText("");
        const newPost = {postText: postText};
        axiosPrivate.post(`http://localhost:3001/posts`, newPost)
        .then(res => {
            const createdPost = res.data;
            setErrors([]);
            props.setPosts( [createdPost, ...props.posts ] );
        }).catch(function (error) {
            // console.log(error);
            // setErrors
            // if (error.response.status === 403 || error.response.status === 401 ){
            //     navigate('/users/signin');
            // } else
            //     setErrors(error.response.data.errors.map(err=>err.msg))
            console.error(error);
            if (!error?.response?.data){
                setErrors(["No server response", ...errors]);
            } else if(error.response.status === 403){
                setErrors(["You don't have the permission to do it", ...errors]);
            } else if (error.response.status === 401){
                navigate("/users/signin");
            }
            else if (error.response.data?.errors){
                setErrors(error.response.data?.errors.map(err=>err.msg))
            } else {
                setErrors([error.response.data])
            }
            window.setTimeout(()=>setErrors([]), 3000);
        })

    }

    return (
        <div className="post-form-container">
        <form className="form" action="POST" onSubmit={handleSubmit}>
            <label htmlFor="post-input-new">Tell the world your story</label>
            <textarea
                id="post-input-new" 
                className={errors.length > 0 ? "form-textarea textarea-error" : "form-textarea"}
                placeholder={errors.length > 0 ? "error posting..." : "your story..."}
                value={postText}
                disabled={auth.accessToken === undefined}
                onChange={(e) => setPostText(e.target.value)}>
            </textarea>
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
            <input disabled={auth.accessToken === undefined} className="form-element-blue fit" type="submit" value="share" />
        </form>
        </div>
    )
}

