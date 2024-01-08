// ApiContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Api } from '../api/api' ;
import { ApiContextData, ApiContextValue, AddSuggestion, LogMessages, Suggestions, ApiContextProps} from '../models/types';
import Log from '../Components/UI/Log/Log';
import { v4 as uuidv4 } from 'uuid';

const initialApiContext: ApiContextValue = {
  context:{
    data:{
      currentUser:{
        image:'',
        name:'',
        username:''
      },
      suggestions:[],
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
    getData();
  }, []);

  const setAndCleanData = (result: ApiContextProps) =>{
    const cleanSuggestions = Object.values(result.suggestions).filter(item => item !== undefined);
    const cleanData = {...result,suggestions:cleanSuggestions};
    setCtxData({data:cleanData,isLoading:false});
  };

  const getData = async () =>{
    await Api.getData().then((result) => {
      setAndCleanData(result);
    });
  };

  const addSuggestion = async (data: AddSuggestion) => {
    try{
      //setCtxData((prevData) => ({ ...prevData, isLoading: true }));
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
      //setCtxData((prevData) => ({ ...prevData, isLoading: true }));
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
          setAndCleanData(result);
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

