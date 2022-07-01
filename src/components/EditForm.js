import React, { useEffect } from "react";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router";

export default function EditForm(props){

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [postText, setPostText] = useState("");
    const [errors, setErrors] = useState([]);

    // intitialize the edit form
    useEffect(function(){
        setPostText(props.post.postText);
    }, [])

    // clear errors when user unputs are changed
    useEffect(()=>{
        setErrors([])
    }, [postText])
    
    // handle edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axiosPrivate(
                `/posts/${props.post.id}`,
                {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: { postText: postText }
                }
            );
            setPostText("");
            props.setEditing(false);  
            props.setPosts(props.posts.map(selectedPost => {
                if (props.post.id === selectedPost.id){
                    return {...selectedPost, postText: postText};
                } return selectedPost;
            }))        
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
                const errorList = error.response.data.errors;
                if (errorList.length > 0){
                    setErrors([...errors, ...errorList.map(errorObj => errorObj.msg)]);
                } else {
                    setErrors(["Editing failed", ...errors]);
                }
            }
            window.setTimeout(()=>setErrors([]), 3000);
        }
    }

    function handleCancelEditing(){
        setErrors([]);
        props.setEditing(false);
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="form-textarea">Change your story</label>
            <textarea
                id="form-textarea"
                className={errors.length > 0  ? "form-textarea textarea-error" : "form-textarea"}
                placeholder={errors.length > 0 ? "error updating..." : "your story..."}
                value={postText}
                onChange={(e)=>setPostText(e.target.value)}>
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
            <div className="button-group">
                <input 
                    className="form-element-blue" 
                    type="submit" 
                    value="share" 
                    />
                <input 
                    className="form-element-blue" 
                    type="button" 
                    value="cancel" 
                    onClick={handleCancelEditing}
                    />
            </div>
        </form>
    )
}

