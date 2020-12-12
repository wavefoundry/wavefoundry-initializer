import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import { FIREBASE_CREDENTIALS } from './config';

export default firebase.initializeApp(FIREBASE_CREDENTIALS);