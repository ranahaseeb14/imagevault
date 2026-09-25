import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Profile from './pages/Profile'
// import Upload from './pages/Upload'
import UploadPage from './pages/UploadPage'
import Dashboard from './pages/Dashboard'
import { Toaster, toast } from 'react-hot-toast'
import Navbar from './components/Navbar'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#14171c]">
                <Toaster />
                <Navbar />
                <Routes>
                    <Route path='/' element={<UploadPage />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
