// UserContext.js : useState를 사용해 user 상태를 관리하며, 
//                  user와 setUser를 Context의 value로 사용

import React, {useContext, createContext, useState} from "react";

const UserContext = createContext(null);

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    return(
        <UserContext.Provider
            children={children}
            value={{
                user,
                setUser,
            }}
        />
    );
}

/** 사용자 정보 조회 함수 */
export function useUserContext(){
    const userContext = useContext(UserContext);
    if (!UserContext){
        throw new Error('UserContext.Provider is not found');
    }
    return userContext;
}
