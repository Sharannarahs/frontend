import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const {authUser} = useContext(AuthContext);

  return (
    //Background imag is displayed on entire app, therefore add in app.jsx
    <div className="bg-[url('./src/assets/bgImage1.png')] bg-center">
      
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to="/login" />}/>

      </Routes>
    </div>
  )
}

export default App

// if user is not authenticated he/she should go to login page,
// if authenticated go to profile or home page not to login page