"use client"

import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import Assessment from "./pages/Assessment"
import Results from "./pages/Results"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"

function App() {
    console.log("App Function Called");
    const [user, setUser] = useState(null)

    return (
        <Router>
            <div className="min-h-screen bg-background-dark relative overflow-hidden">
                <div className="animated-bg" />
                <Navbar user={user} setUser={setUser} />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/signup" element={<Signup setUser={setUser} />} />
                        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                        <Route path="/assessment" element={user ? <Assessment user={user} /> : <Navigate to="/login" />} />
                        <Route path="/results" element={user ? <Results user={user} /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    )
}

export default App

