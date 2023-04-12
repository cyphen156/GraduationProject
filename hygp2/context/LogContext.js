import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import logsStorage from "../storages/logsStorage";
import { useUserContext } from "./UserContext";
import { feedIdExists } from "../lib/feed"
import firestore from '@react-native-firebase/firestore';

const LogContext = createContext();

export function LogContextProvider({children}) {

    const {user} = useUserContext();
    const initialLogsRef = useRef(null);
    const [logs, setLogs] = useState([]);
    // feed 체크
    const [feeds, setFeeds] = useState([]);
    
    useEffect(() => {
      (async () => {
        await searchArray().then(
          console.log("feeds: ",feeds)
        )
      })();
  }, [user, onCreate]);
  
    const onCreate = ({title, body, date}) => {
      const id = user.id;
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
      };
  
      setLogs([log, ...logs]);
      console.log("logs :",logs);
      feedIdExists({id ,feed});
    };


    const onModify = modified => {
        // logs 배열을 순회해 id가 일치하면 log를 교체하고 그렇지 않으면 유지
        const nextLogs = logs.map(log => (log.id === modified.id ? modified : log));
        setLogs(nextLogs);

       //const nextFeeds = feeds.map(feed => (feed.id === modified.id ? modified : feed));
       //setFeeds(nextFeeds);
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


    // 같은 아이디에 feed배열 가져오기
     function searchArray(){
      return firestore().collection('feeds').get().then(function (querySnapshot){
         querySnapshot.forEach(function (doc) {
            console.log(doc.id, '=>', doc.data().feed); 
            setFeeds(doc.data().feed);
             
         });
     });
   };

    return (
        <LogContext.Provider value={{feeds, setFeeds ,onCreate, onModify, onRemove}}>
            {children}
        </LogContext.Provider>
    );
}

export default LogContext;