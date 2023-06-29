import { createContext, useState } from "react";
import { useUserContext } from "./UserContext";


// 컬렉션 friends 에서 id 배열을 가져오고, id로 user 전체 값 가져오기
const FriendsContext = createContext();

  export function FriendsContextProvider({children}) {

    
    const [ isLoading, setIsLoading ] = useState(true);
    const [friends, setFriends] = useState('');

    return (
      <FriendsContext.Provider value={{friends}}>
          {children}
      </FriendsContext.Provider>
    );
   

}

export default  FriendsContext;