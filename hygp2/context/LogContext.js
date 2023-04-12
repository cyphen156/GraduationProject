import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import logsStorage from "../storages/logsStorage";
import { useUserContext } from "./UserContext";
import {createFeed, addFeed, feedIdSearch, feedIdExists} from "../lib/feed"
import firestore from '@react-native-firebase/firestore';

const LogContext = createContext();

export function LogContextProvider({children}) {

    const {user} = useUserContext();
    const initialLogsRef = useRef(null);
    const [logs, setLogs] = useState([]);
    console.log("Log:",user)
    // feed 체크
    let checking = false;

    // 컬렉션 id 여부 확인 함수
    let collectionId = (id) => {
      firestore().collection('feeds').get().then(function (querySnapshot){
          querySnapshot.forEach(function (doc) {
              if (doc.id == id){
                  console.log(doc.id, '=>', doc.data());   
                  checking = true;          
              }
          });
      });
    }
    const onCreate = ({title, body, date}) => {
      const id = user.id;
      const displayName = user.displayName;
        const log = {
            id: uuidv4(),
            title,
            body,
            date,
        };
        const feed = {
          id: uuidv4(),
          displayName : user.displayName,
          title,
          body,
          date,
        }
      setLogs([log, ...logs]);
      //addFeed({id, feed})
      //createFeed({id, feed});
      //collectionId(id);
      feedIdExists({id ,feed});

      console.log(checking);
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

    useEffect(() => {
      (async () => {
        const savedLogs = await logsStorage.get();
        if(savedLogs) {
            initialLogsRef.current = savedLogs;
            setLogs(savedLogs);
        }
      })();
    }, []);

    useEffect(() => {
      if (logs === initialLogsRef.current) {
        return;
      }
      logsStorage.set(logs);
    }, [logs]);
    
    return (
        <LogContext.Provider value={{logs, onCreate, onModify, onRemove}}>
            {children}
        </LogContext.Provider>
    );
}

export default LogContext;