import './App.css';
import React, { useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';




firebase.initializeApp({
  apiKey: "AIzaSyCXBScu9DUhRFtAyubmNsS5ZSt6tAz2KFA",
  authDomain: "chap-app-df55f.firebaseapp.com",
  projectId: "chap-app-df55f",
  storageBucket: "chap-app-df55f.appspot.com",
  messagingSenderId: "612404689455",
  appId: "1:612404689455:web:cae00715ed26dfbe2964da"
})

const auth = firebase.auth();
const firestore = firebase.firestore(); 

function SignIn(){

  const SignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return(
    <button onClick={SignInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut}>Sign Out</button>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  

  return (
    <div className={`message ${messageClass}`}>
       <img src={photoURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQApAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcCBAUDAf/EADcQAAICAQIDBQUGBQUAAAAAAAABAgMEBREGITESQVFhcRMygZGxInKhwdHhFCQzUnMVI0JTYv/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8AtIAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8bSTbaSXVvkkcjM4m0zGk4q13SXX2Ud18+gHYBHa+MNPlLadd8E+9xT/ADOzhahiZ8XLEvhZt1in9peq6gbIAAAAAAAAAAAAAAAAAAAAAYXXQx6Z3XT7FcFvKXgjMh3G+oSlbXp9TfZilO373cvlz+IHM1zXsjVJuEd68Ze7Xv73mzkD06AqBnTbZRbG2mbhZHpKL2aMABPuGte/1ODx8naOVBb8uli73t4ndKpxr7Ma+u+l7WVy7UfUs7AyoZuHTk18o2QUtvB96+DIrYAAAAAAAAAAAAAAAAAABdSr9XueRqmVbJtt2y238OhaCKqzY9nMyIvutl9WB4gA0gAABOeCLpWaXbU237O17ejW5BiacCR/ksqXjYl+BlUnAAAAAAAAAAAAAAAAAAArjiXHeNreTHblN+0j6S5/Xcscj/Fukzz8WORjre+hP7KXOUfD1/cCCAJcgVAAAOpYPCOP7DRKpS63Nz+D6fgiHaLpdmqZsaYpqqOztn/bH9WWTCKhCMIJKEUlFLuS6EVkAAAAAAAAAAAAAAAAAAAAA4Wr8M4mfN3Uy/h75e84x3jLzaI9fwnqtcn7ONN0fGFmz+T2J5Kca12pyUUu9vZGlZrOmUvazPx0/BT3+gVCo8M6vJ7fwqXrZHb6nSweDr21LPyIQjvzhTvJ/PoSCOv6RJ7LPpXrv+ht0ZuLk/0Mmmz7lib+QR8wsPHwaFRi1quteHVvxb7zYAAAAAAAAAAAAAAAAAAAHN1vV6tJx1Oa7d0/6de+2/m/IDZzs3HwaHblWxrj59X5Jd5E9R4uyLW4afBUQ6e0mt5P4dEcHOzcjPyHflT7c30XdHyS7jXA9cjJyMmXayLp2v8A9y3PL0ALiA6Pdcn4gDB08DXtRwmuxkOcO+u37Sf5olWk8TYudKNV/wDL3vklJ/Zl6P8AUgQCxbYITw7xJPGcMXPk50PlGxvnX6+K+hNU00mnun0fiQfQAAAAAAAAAAAAGtqObVp+HZk3e7Be7/c+5FaZ+Zbn5dmTe95zfRdEu5LyO5xpqDvzY4dcv9ujnLZ9Z/stvxI4AABUoACgAAAAAEs4O1jmtNyJf4ZPr939CJmUZyrkpwk1KD7Sa6polWLZBp6TmrUNPpyVspSW00u6S6m4QAAAAAAAADzvujj0WXz92qLm/NLmehyeKLXVoWVtyc1GHwbAryyyd1krbXvObcpPzZiAWJQAFAAAAAAAAAAEqxLOBMpqWViSfJpWw+j/ACJeV5wla6tdoS/5px+a/YsJdCD6AAAAAAAAcLjN7aJLzsh9QAICACxkABVAAAAAAAAAAB0eHXtrmFt/2r6Msrw9ACLAAEAAAf/Z'} />
      <p>{text}</p>
    </div>
  )
}

function ChatRoom(){

  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query , {idField: 'id'})
  const [formValue , setFormValue] = React.useState('')

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser

    await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({behaviour : 'smooth'})
  }
  return (
    <>
        <main> 
        {messages && messages.map(msg => <ChatMessage key={msg.id}  message={msg}/>)}
        </main>
       <div ref={dummy}></div>
     <form onSubmit={sendMessage}>
         <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
         <button type="submit">send</button>
     </form>
    </>
  )
}
function App() {
  const [user] = useAuthState(auth)


  return (
    <div className="App">
     
      <header></header>
      <section>

        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

export default App


