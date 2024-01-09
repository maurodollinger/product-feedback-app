// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, set,  runTransaction,  query, remove } from 'firebase/database';
import { ApiType, ApiContextProps, AddSuggestion, Suggestions, Comment } from '../models/types';

// Configuración de tu aplicación de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCTw44naIVHFGaEzS9DwHBnmVMJY-1Z1wQ',
  authDomain: 'product-feedback-app-fbf84.firebaseapp.com',
  projectId: 'product-feedback-app-fbf84',
  storageBucket: 'product-feedback-app-fbf84.appspot.com',
  messagingSenderId: '902955773550',
  appId: '1:902955773550:web:f1feff974203bfbca0807f'
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const nodeSuggestions = 'productRequests';

export const firebaseApi: ApiType = {
  getData: async () => {
    const dataRef = ref(db);
    const snapshot = await get(dataRef);
  
    const data: ApiContextProps = {
      currentUser: snapshot.child('currentUser').val(),
      suggestions: snapshot.child('productRequests').val(),
      users: snapshot.child('users').val()
    };
    
    return data;
  },
  
  addSuggestion: async (newData: AddSuggestion) => {    
    await set(ref(db, `${nodeSuggestions}/${newData.id}`), newData);
  },
  

  getNodeById: async (id: string, path = '') => {
    const dataRef = query(ref(db, `${nodeSuggestions}${path}`));
    const querySnapshot = await get(dataRef);
    let result = '';

    querySnapshot.forEach((childSnapshot) => {
      const suggestion = childSnapshot.val();
      if (suggestion.id === id) {
        const key = childSnapshot.key;
        result = key;
      }
    });

    return result;
  },
  
  deleteSuggestion: async (id: string) => {
    const key = await firebaseApi.getNodeById(id);
    const nodeRef = ref(db, `${nodeSuggestions}/${key}`);
    await remove(nodeRef);
  },
  
  updateSuggestion : async (id: string, updatedData: Suggestions) => {
    const key = await firebaseApi.getNodeById(id);
    const nodeRef = ref(db, `${nodeSuggestions}/${key}`);
    await set(nodeRef, updatedData);

  },

  upvoteSuggestion: async (id:string) =>{
    const key = await firebaseApi.getNodeById(id);
    const nodeRef = ref(db, `${nodeSuggestions}/${key}`);

    await runTransaction(nodeRef, (currentData) => {
      if (currentData) {
        currentData.upvotes = (currentData.upvotes || 0) + 1;
      }        
      return currentData;
    });
    
  },

  addComment: async (id:string, newData:Comment)=>{
    try {
      const key = await firebaseApi.getNodeById(id);

      const nodeRef = ref(db, `${nodeSuggestions}/${key}/comments`);

      await runTransaction(nodeRef,(currentData) =>{
        if (!Array.isArray(currentData)) {
          currentData = [];
        }
        currentData.push(newData);

        return currentData;
      });
    }
    catch (error) {
      throw Error;
    }
  },

  addReply: async (idArray:string[], newData:Comment)=>{
    try {
      const key1 = await firebaseApi.getNodeById(idArray[0]);

      const key2 = await firebaseApi.getNodeById(idArray[1],`/${key1}/comments/`);

      const nodeRef = ref(db, `${nodeSuggestions}/${key1}/comments/${key2}/replies`);
      await runTransaction(nodeRef,(currentData) =>{
        if (!Array.isArray(currentData)) {
          currentData = [];
        }
        currentData.push(newData);
        return currentData;
      });
    }
    catch (error) {
      throw Error;
    }
  },

  loginUser: async () =>{
    try{
      const user = 'velvetround@test.com';
      const pass = 'superpass';
      const data = await signInWithEmailAndPassword(auth,user,pass).then((userCredential)=>{
        return userCredential.user.providerData[0];
      }).catch((error)=>{
        console.log(error);
      });
      return data;
    }
    catch(error){
      console.log(error);
      // throw Error;
    }
  }
  /*
  listenAuthState: (callback: (user: User | null) => void) => {
    onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },*/
};