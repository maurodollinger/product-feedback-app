// ApiContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Api } from '../api/api' ;
import { ApiContextData, ApiContextValue, AddSuggestion, LogMessages, Suggestions, ApiContextProps, User, DatabaseUser} from '../models/types';
import Log from '../Components/UI/Log/Log';
import { v4 as uuidv4 } from 'uuid';

const initialApiContext: ApiContextValue = {
  context:{
    data:{
      currentUser:{
        image:'./assets/user-images/image-zena.jpg',
        name:'Zena Kelley',
        username:'velvetround',
        upvotes:[]
      },
      suggestions:[],
      users:[]
    },
    isLoading: true,
  },
  addSuggestion:async (): Promise<void> => {/* */},
  deleteSuggestion:async (): Promise<void> => {/* */},
  updateSuggestion:async (): Promise<void> => {/* */},
  upvoteSuggestion:async (): Promise<void> => {/* */},
  addComment:async (): Promise<void> => {/* */},
  addReply:async (): Promise<void> => {/* */},
};

const ApiContext:React.Context<ApiContextValue> = createContext(initialApiContext);

export const ApiProvider:React.FC<{children:React.ReactNode}> = ({ children }) => {

  const [ctxData, setCtxData] = useState<ApiContextData>(initialApiContext.context);
  const [logState, setLogState] = useState<{ message: string; visible: boolean, logType:string }>({
    message: '',
    visible: false,
    logType:''
  });

  useEffect(() => {
    
    let user:DatabaseUser;
    loginUser().then((_user:any)=>{
      user = _user;
      getData().then(()=>{
        const userLogged = ctxData.data.users.find((u)=>u.uid === user.uid);
        if(userLogged){
          const currentUser:User = {
            name: userLogged.name,
            username: userLogged.username,
            image: userLogged.image,
            upvotes: userLogged.upvotes
          };
          const currentCtxData = ctxData;
  
          const updatedData = {
            ...currentCtxData.data,
            currentUser: currentUser,
          };
          const updatedCtxData = {
            ...currentCtxData,
            data: updatedData,
          };
          setCtxData(updatedCtxData);
          setLogState({ message: `${userLogged.name} ${LogMessages.Logged}`, logType:'success', visible: true });
        }
      });
    });
  }, []);

  const loginUser = async () =>{
    let user;
    await Api.loginUser().then((_user)=>{
      user = _user;
    });

    return user;
  };

  const setAndCleanData = (result: ApiContextProps) =>{
    // console.log(ctxData,'before');
    const cleanSuggestions = Object.values(result.suggestions).filter(item => item !== undefined);
    const cleanData = {...result,suggestions:cleanSuggestions};

    const updatedCtxData = {
      data: {
        ...cleanData,
        currentUser: {
          ...ctxData.data.currentUser,
        },
      },
      isLoading: false,
    };
    setCtxData(updatedCtxData);
  };

  const setUserUpvote = (id:string,result:ApiContextProps) => {
    const currentCtxData = ctxData;
  
    const updatedUser = {
      ...currentCtxData.data.currentUser,
      upvotes: (currentCtxData.data.currentUser.upvotes || []).concat(id),
    };
    const cleanSuggestions = Object.values(result.suggestions).filter(item => item !== undefined);

    const updatedData = {
      ...currentCtxData.data,
      currentUser: updatedUser,
      suggestions:cleanSuggestions
    };
  
    const updatedCtxData = {
      ...currentCtxData,
      data: updatedData,
    };
    //console.log(updatedCtxData);
    setCtxData(updatedCtxData);
  };
   

  const getData = async () =>{
    await Api.getData().then((result) => {
      setAndCleanData(result);
    });
  };

  const addSuggestion = async (data: AddSuggestion) => {
    try{
      const newData = {
        ...data,
        id:uuidv4(),      
      };
      await Api.addSuggestion(newData).then(()=>{
        Api.getData().then((result)=>{
          setAndCleanData(result);
          setLogState({ message: LogMessages.Added, logType:'success', visible: true });
        });
      }).catch(()=>{
        setLogState({ message: LogMessages.Error,logType:'error', visible: true });
      });

    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const deleteSuggestion = async (id:string) => {
    try{
      await Api.deleteSuggestion(id).then(()=>{
        Api.getData().then((result)=>{
          setAndCleanData(result);
          setLogState({ message: LogMessages.Deleted, logType:'success', visible: true });
        });
      }).catch(()=>{
        setLogState({ message: LogMessages.Error,logType:'error', visible: true });
      });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const updateSuggestion = async (id:string, newData: Suggestions) => {
    try{
      await Api.updateSuggestion(id,newData).then(()=>{
        Api.getData().then((result)=>{
          setAndCleanData(result);
          setLogState({ message: LogMessages.Edited, logType:'success', visible: true });
        });
      }).catch(()=>{
        setLogState({ message: LogMessages.Error,logType:'error', visible: true });
      });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const upvoteSuggestion = async (id:string) =>{
    try{
      await Api.upvoteSuggestion(id).then(()=>{
        
        Api.getData().then((result)=>{
          setUserUpvote(id,result);
          //setAndCleanData(result);
          setLogState({ message: LogMessages.Updated, logType:'success', visible: true });
        });
      }).catch(()=>{
        setLogState({ message: LogMessages.Error,logType:'error', visible: true });
      });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const addComment = async (id:string,comment:string) =>{
    try{
      const newData = {
        id:uuidv4(), 
        content:comment,
        user:ctxData.data.currentUser
      };
      await Api.addComment(id,newData).then(()=>{
        Api.getData().then((result)=>{
          setAndCleanData(result);
          setLogState({ message: LogMessages.CommentAdded, logType:'success', visible: true });
        });
      }).catch(()=>{
        setLogState({ message: LogMessages.Error,logType:'error', visible: true });
      });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  }; 

  const addReply = async (arrayId:string[],comment:string,replyingTo?:string) =>{
    try{
      const newData = {
        id:uuidv4(),
        content:comment,
        user:ctxData.data.currentUser,
        ...(replyingTo !== undefined && { replyingTo: replyingTo }),
      };
      await Api.addReply(arrayId,newData).then(()=>{
        Api.getData().then((result)=>{
          setAndCleanData(result);
          setLogState({ message: LogMessages.CommentAdded, logType:'success', visible: true });
        });
      });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };


  const apiContextValue: ApiContextValue = {
    context:ctxData,
    addSuggestion,
    deleteSuggestion,
    updateSuggestion,
    upvoteSuggestion,
    addComment,
    addReply
  };

  return (
    <ApiContext.Provider value={ apiContextValue}>
      {children}
      {logState.visible && <Log message={logState.message} logType={logState.logType} onClose={() => setLogState({ message: '', logType:'', visible: false })} />}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const contextApi = useContext(ApiContext);
  if (!contextApi) {
    throw new Error('useApi debe ser utilizado dentro de un ApiProvider');
  }
  return contextApi;
};

