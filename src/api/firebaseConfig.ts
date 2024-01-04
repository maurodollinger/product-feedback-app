// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from 'firebase/app';
//import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, get, set, remove } from 'firebase/database';
import { ApiType, ApiContextProps, AddSuggestion, Suggestions } from '../models/types';

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
//const auth = getAuth(app);
const db = getDatabase(app);

const nodeSuggestions = 'productRequests';

export const firebaseApi: ApiType = {
  getData: async () => {
    const dataRef = ref(db);
    const snapshot = await get(dataRef);
  
    const data: ApiContextProps = {
      currentUser: snapshot.child('currentUser').val(),
      suggestions: snapshot.child('productRequests').val(),
    };
  
    return data;
  },
  
  addSuggestion: async (newData: AddSuggestion) => {
    const dataRef = ref(db, nodeSuggestions);
    // Obtén el snapshot del nodo y conviértelo a un objeto de JavaScript
    const snapshot = await get(dataRef);
    const dataObject = snapshot.val();
    const newRegisterId = Object.keys(dataObject).length;
    newData.id = (newRegisterId+1).toString(); 
  
    await set(ref(db, `${nodeSuggestions}/${newRegisterId}`), newData);
  },
  
  deleteSuggestion: async (id: string) => {
    const dataRef = ref(db, `${nodeSuggestions}/${id}`);
    await remove(dataRef);
  },

  updateSuggestion: async (id: string, updatedData: Suggestions) => {
    const dataRef = ref(db, `${nodeSuggestions}/${id}`);
    console.log(dataRef,updatedData);
    await set(dataRef, updatedData);
  },
  /*
  listenAuthState: (callback: (user: User | null) => void) => {
    onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },*/
};