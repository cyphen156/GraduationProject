import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import logsStorage from "../storages/logsStorage";
import { useUserContext } from "./UserContext";
import { feedIdExists, createFeed, removeFeed } from "../lib/feed"
import firestore from '@react-native-firebase/firestore';
import { View } from "react-native";
import events from "../lib/events";

const LogContext = createContext();


  export function LogContextProvider({children}) {

    const [ isLoading, setIsLoading ] = useState(true);
    const {user} = useUserContext();
    const initialLogsRef = useRef(null);
    const [logs, setLogs] = useState([]);

    // feed 체크
    const [feeds, setFeeds] = useState([]);
   
    useEffect(() => { 
      setIsLoading(false);
      
      if(user !== null){
        
        GetData().then(() => {
          setIsLoading(false);
      })
    }
    
  }, [user, onCreate, setFeeds, feedIdExists]);

    const GetData = async () => {
      console.log("useEffect: ", user); 
      if(user !== null){
        var result = await searchArray(user.id);
        
        return result;
      }
    }

    const onCreate = ({title, body, date}) => {
      const id = user.id;
      const feed = {
          id: uuidv4(),
          displayName : user.displayName,
          title,
          body,
          date,
      };
      feedIdExists({id ,feed});
      console.log("add: " ,feeds.feed)
      // setFeeds(feeds.feed)
      // console.log(feeds.feed)
      return searchArray(id);
  };


    const onModify = modified => {
        // logs 배열을 순회해 id가 일치하면 log를 교체하고 그렇지 않으면 유지
        const nextLogs = logs.map(log => (log.id === modified.id ? modified : log));
       // setLogs(nextLogs);
      
       const nextFeeds = feeds.map(feed => (feed.id === modified.id ? modified : feed));
       console.log(nextFeeds)
       //setFeeds(nextFeeds);
    };

    const onRemove = id => {
        const nextLogs = feeds.filter(log => log.id !== id);
        console.log(feeds.filter(log => log.id !== id))
             
        let one = feeds.filter(log => log.id == id)
        
        removeFeed(user.id, one[0]);
        setFeeds(nextLogs);
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
     async function searchArray(id){
      
      await firestore().collection('feeds').get().then(function (querySnapshot){
         querySnapshot.forEach(function (doc) {
            //console.log(doc.id, '=>', doc.data().feed); 
            if(doc.id === id){
              setFeeds(doc.data().feed);
            }

         });
     });
        return feeds
    };

   if(isLoading)
   {
    return(
      <View>
        
      </View>
    )
   }
   else
   {
    return (
      <LogContext.Provider value={{feeds, setFeeds ,onCreate, onModify, onRemove}}>
          {children}
      </LogContext.Provider>
  );
   }

}

export default LogContext;