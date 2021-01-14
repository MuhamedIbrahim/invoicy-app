import React, { useContext, useState } from 'react';

const LoadingContext = React.createContext();

export const LoadingProvider = (({children}) => {
    const [loading, setLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{loading: loading, setLoading}}>
            {children}
        </LoadingContext.Provider>
    );
});

const useLoading = () => useContext(LoadingContext);

export default useLoading;