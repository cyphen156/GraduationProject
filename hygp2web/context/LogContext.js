import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import logsStorage from "../storages/logsStorage";
import { useUserContext } from "./UserContext";
import { feedIdExists, updateFeed, removeFeed } from "../lib/feed"
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
   

    const GetData = async () => {
      console.log("useEffect: ", user); 
      if(user == null){
        return
      }
        var result = await searchArray(user.id);
        if(result.length < 1 ){
          return
        }
        console.log("result : ", result);
        return result;
      }
    

    useEffect(() => { 
      //setIsLoading(false);
      
        GetData().then(() => {
          setIsLoading(false);
      })
    
    
  }, [user, onCreate, setFeeds, feedIdExists, searchArray]);



    const onCreate = ({title, body, date}) => {
      const id = user.id;
      const feed = {
          id: uuidv4(),
          displayName : user.displayName,
          title,
          body,
          date,
      };
      console.log("feed: " ,feed)
      feedIdExists({id ,feed});
      feeds[feeds.length] = feed
      
      return setFeeds(feeds);
      
   
    };

    // 새로운 피드를 추가하고, 기존꺼를 삭제한다
    const onModify = feed => {
        // logs 배열을 순회해 id가 일치하면 log를 교체하고 그렇지 않으면 유지
       const id = user.id;
       let original = feeds.filter(log => log.id === feed.id);
       console.log("기존 값: ",original[0])
       original = original[0];
       console.log("변한 값: ",feed)

       let another = feeds.filter(log => log.id !== feed.id);
       another[another.length] = feed;
       console.log("another: ",  another )

       feedIdExists({id ,feed});
       removeFeed(id, original);
       setFeeds(another);
    };

    const onRemove = id => {
        const nextLogs = feeds.filter(log => log.id !== id);
        console.log(feeds.filter(log => log.id !== id))
             
        let one = feeds.filter(log => log.id == id)
        
        removeFeed(user.id, one[0]);
        setFeeds(nextLogs);
  };

    // 같은 아이디에 feed배열 가져오기
     const searchArray = id => {
       firestore().collection('feeds').get().then(function (querySnapshot){
         querySnapshot.forEach(function (doc) {
            //console.log(doc.id, '=>', doc.data().feed); 
            if(doc.id === id){
              return setFeeds(doc.data().feed);
            }
         });
     });
    return feeds;
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
      <LogContext.Provider value={{feeds, setFeeds ,onCreate, onModify, onRemove, searchArray}}>
          {children}
      </LogContext.Provider>
  );
   }

}

export default LogContext;