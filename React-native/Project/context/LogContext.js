import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const LogContext = createContext();

export function LogContextProvider({children}) {
    const [logs, setLogs] = useState([]);
    
    const onCreate = ({title, body, date}) => {
        const log = {
            id: uuidv4(),
            title,
            body,
            date,
        };
        setLogs([log, ...logs]);
    };

    const onModify = modified => {
        // logs 배열을 순회해 id가 일치하면 log를 교체하고 그렇지 않으면 유지
        const nextLogs = logs.map(log => (log.id === modified.id ? modified : log));
        setLogs(nextLogs);
    };

    const onRemove = id => {
        const nextLogs = logs.filter(log => log.id !== id);
        setLogs(nextLogs);
    };

    return (
        <LogContext.Provider value={{logs, onCreate, onModify, onRemove}}>
            {children}
        </LogContext.Provider>
    );
}

export default LogContext;