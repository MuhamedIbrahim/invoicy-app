import React, { useState, useContext } from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [userId, setUserId] = useState(null);
    return (
    <AuthContext.Provider value={{userId, setUserId}}>
        {children}
    </AuthContext.Provider>
    );
};

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;