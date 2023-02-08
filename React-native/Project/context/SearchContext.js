import { createContext, useState } from "react";

const SearchContext = createContext();

export function SearchContextProvider({children}) {
    const [keyward, onChangeText] = useState("");
    
    return (
        <SearchContext.Provider value={{keyward, onChangeText}}>
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;