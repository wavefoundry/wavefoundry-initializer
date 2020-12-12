import React from "react";
import { FIREBASE_CREDENTIALS } from "../config";

const FirebaseContext = React.createContext<any>(null);

let instance: any;
function getFirebase(firebase: any) {
  if (!instance) {
    instance = firebase.default.initializeApp(FIREBASE_CREDENTIALS);
    if (window.location.hostname === "localhost") {
      instance.functions().useEmulator("localhost", 5001);
      instance.firestore().useEmulator("localhost", 8080);
    }
  }
  return instance;
}

const FirebaseProvider: React.FC = (props) => {
  const [firebase, setFirebase] = React.useState<any>(null);
  React.useEffect(() => {
    const app = import('firebase/app');
    const functions = import ('firebase/functions');
    const firestore = import('firebase/firestore')
    Promise.all([app, functions, firestore])
    .then((result) => {
        setFirebase(getFirebase(result[0]))
    })
  }, [])
  return (
    <FirebaseContext.Provider value={firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => {
  const firebase = React.useContext(FirebaseContext);
  return firebase;
};

export { FirebaseProvider, useFirebase };
