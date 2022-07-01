import { createContext, useState } from "react";

const AuthContext = createContext({})

// provide context for storing user data
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return <AuthContext.Provider value={{auth, setAuth}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;