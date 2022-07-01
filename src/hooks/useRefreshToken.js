import { useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';


const useRefreshToken = () => {
    const { setAuth, auth } = useContext(AuthContext);

    const refresh = async () => {
        console.log("refreshing token...")
        const response = await axios.get('/users/refresh', {
            withCredentials: true
        });
        setAuth(() => {
            return { ...auth, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;