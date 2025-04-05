"use client"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function Navbar({ user, setUser }) {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        setUser(null)
        navigate("/")
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                scrolled ? "glass-card backdrop-blur-lg" : "bg-transparent"
            }`}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-pink-200 via-purple-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-between"
                    whileHover={{ scale: 1.05 }}
                >
                    <Link to="/" className="ml-6">
                        %AI
                    </Link>
                </motion.h1>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-purple-200 hover:text-white transition duration-300">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn-primary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-primary">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary">
                                SignUp
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar

