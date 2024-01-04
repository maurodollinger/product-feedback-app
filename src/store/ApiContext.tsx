// ApiContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Api } from '../api/api' ;
import { ApiContextData, ApiContextValue, AddSuggestion, LogMessages, Suggestions} from '../models/types';
import Log from '../Components/UI/Log/Log';


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
  updateSuggestion:async (): Promise<void> => {/* */}
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
    Api.getData().then((result) => {
      setCtxData({data:result,isLoading:false});
    });
  }, []);

  const addSuggestion = async (newData: AddSuggestion) => {
    try{
      setCtxData((prevData) => ({ ...prevData, isLoading: true }));
      await Api.addSuggestion(newData);
      // Actualizar los datos después de añadir la sugerencia
      const updatedData = await Api.getData();
      setCtxData({ data: updatedData, isLoading: false });
      setLogState({ message: LogMessages.Added, logType:'success', visible: true });

    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const deleteSuggestion = async (id:string) => {
    try{
      setCtxData((prevData) => ({ ...prevData, isLoading: true }));
      await Api.deleteSuggestion(id);
      const updatedData = await Api.getData();
      setCtxData({ data: updatedData, isLoading: false });
      setLogState({ message: LogMessages.Deleted, logType:'success', visible: true });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };

  const updateSuggestion = async (id:string, newData: Suggestions) => {
    try{
      setCtxData((prevData) => ({ ...prevData, isLoading: true }));
      await Api.updateSuggestion(id,newData);
      const updatedData = await Api.getData();
      setCtxData({ data: updatedData, isLoading: false });
      setLogState({ message: LogMessages.Edited, logType:'success', visible: true });
    }
    catch(error:any){
      setLogState({ message: LogMessages.Error,logType:'error', visible: true });
    }
  };



  const apiContextValue: ApiContextValue = {
    context:ctxData,
    addSuggestion,
    deleteSuggestion,
    updateSuggestion
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

