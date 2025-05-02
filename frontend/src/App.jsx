import React from 'react'
import SignUp from './components/SignUp'
import FeaturePanel from './components/FeaturePanel'
import ChatInterface from './components/ChatInterface'
import ChatBox from './components/ChatBox'
import Home from './components/Home'
import Login from './components/Login'
import { Routes,Route ,useNavigate} from 'react-router-dom'
import { useEffect } from "react";
import { Toaster} from 'react-hot-toast'
import useAuth from './store/UseAuth';

function App() {
  const navigate = useNavigate();
  
  const {checkAuth,isCheckingAuth,authUser}=useAuth()

  useEffect(() => {
    checkAuth();
   
  
   
  }, [])
  
  {
    if(isCheckingAuth && !authUser){
      <p>loading..</p>
    }
  }
 
  return (
    <>
    
    <Toaster />
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
     
    <Route path="/login" element={<Login />} />
      <Route path="/chat"element={authUser?<ChatBox/>:<Home/>} />
    
    </Routes>
  
   </>
  )
}

export default App