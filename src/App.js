import React from 'react'
import LoginRegister from './Components/LoginRegister/LoginRegister'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path="/login" element={<LoginRegister />} />
       <Route path="/register" element={<LoginRegister />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App