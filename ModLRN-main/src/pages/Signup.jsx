"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"

function Signup({ setUser }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [authMethod, setAuthMethod] = useState("email") // "email" or "phone"
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

  // OAuth related states
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authProvider, setAuthProvider] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [accountSelectionOpen, setAccountSelectionOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Mock accounts for demonstration
  const mockGoogleAccounts = [
    { id: 1, name: "Alex Johnson", email: "alex.johnson@gmail.com", avatar: "A" },
    { id: 2, name: "Sam Wilson", email: "sam.wilson@gmail.com", avatar: "S" },
  ]

  const mockGithubAccounts = [
    { id: 1, name: "Alex Johnson", email: "alexj", avatar: "A" },
    { id: 2, name: "Sam Wilson", email: "samwilson", avatar: "S" },
  ]

    const handleSubmit = (e) => {
        e.preventDefault()

    if (authMethod === "email") {
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        
        // Get first part of email as default name if not provided
      const displayName = name || email.split("@")[0]
        setUser({ email, name: displayName })
      navigate("/dashboard")
    } else if (authMethod === "phone" && otpSent && otp) {
      // Verify OTP
      // In a real app, you would verify the OTP with your backend
      if (otp === "123456") {
        // Dummy verification
        setUser({ phone: phoneNumber, name: name || "User" })
        navigate("/dashboard")
      } else {
        setError("Invalid OTP. Please try again.")
      }
    }
  }

  const handleSendOTP = (e) => {
    e.preventDefault()
    if (phoneNumber.length >= 10) {
      // In a real app, you would send an OTP to the phone number
      setOtpSent(true)
      setError("") // Clear any previous errors
      alert("OTP sent to your phone: 123456")
    } else {
      setError("Please enter a valid phone number")
    }
  }

  const handleGoogleSignIn = () => {
    // In a real app, we would redirect to Google OAuth URL
    // const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile`;
    // window.location.href = googleOAuthURL;

    // For demo purposes, show account selection dialog
    setAuthModalOpen(true)
    setAuthProvider("google")
    setAccountSelectionOpen(true)
  }

  const handleGithubSignIn = () => {
    // In a real app, we would redirect to GitHub OAuth URL
    // const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    // window.location.href = githubOAuthURL;

    // For demo purposes, show account selection dialog
    setAuthModalOpen(true)
    setAuthProvider("github")
    setAccountSelectionOpen(true)
  }

  const handleAccountSelect = (account) => {
    setSelectedAccount(account)
    setAccountSelectionOpen(false)
    setAuthLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setUser({
        email: account.email,
        name: account.name,
        avatar: account.avatar,
      })

      setAuthLoading(false)
      setAuthModalOpen(false)
      navigate("/dashboard")
    }, 1500)
  }

  const handleUseAnotherAccount = () => {
    // In a real app, this would redirect to the provider's login page
    // For demo, we'll simulate a new account login
    setAccountSelectionOpen(false)
    setAuthLoading(true)

    setTimeout(() => {
      const newAccount = {
        name: "New User",
        email: authProvider === "google" ? "new.user@gmail.com" : "newuser",
        avatar: "N",
      }

      setUser({
        email: newAccount.email,
        name: newAccount.name,
        avatar: newAccount.avatar,
      })

      setAuthLoading(false)
      setAuthModalOpen(false)
      navigate("/dashboard")
    }, 1500)
    }

    return (
        <>
            <AnimatedBackground />
            <div className="min-h-screen flex items-center justify-center px-4 py-16 border border-gray-700">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8 rounded-2xl neon-border shadow-xl backdrop-blur-xl border-1">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
                            <p className="text-purple-200">Join the learning revolution</p>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-500/20 border border-red-500/30 text-red-100 p-3 rounded-lg mb-6"
                            >
                                {error}
                            </motion.div>
                        )}

            <div className="mb-6 flex justify-center space-x-2">
              <button
                className={`px-4 py-2 rounded-lg transition ${authMethod === "email" ? "bg-purple-600 text-white" : "bg-purple-900/30 text-purple-300"}`}
                onClick={() => {
                  setAuthMethod("email")
                  setOtpSent(false)
                  setError("")
                }}
              >
                Email Signup
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition ${authMethod === "phone" ? "bg-purple-600 text-white" : "bg-purple-900/30 text-purple-300"}`}
                onClick={() => {
                  setAuthMethod("phone")
                  setOtpSent(false)
                  setError("")
                }}
              >
                Phone Signup
              </button>
            </div>

            {authMethod === "email" ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    placeholder="Enter your name"
                                />
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    placeholder="Create a password"
                                />
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    placeholder="Confirm your password"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <button type="submit" className="w-full btn-primary py-4 text-lg font-medium">
                                    Create Account
                                </button>
                </motion.div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!otpSent ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Enter your name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-medium text-purple-200 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="w-full btn-primary py-4 text-lg font-medium"
                      >
                        Send OTP
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="otp" className="block text-sm font-medium text-purple-200 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Enter the 6-digit OTP"
                        maxLength={6}
                      />
                      <p className="text-sm text-purple-300 mt-2">OTP sent to {phoneNumber}</p>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <button type="submit" className="w-full btn-primary py-4 text-lg font-medium">
                        Verify & Create Account
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="w-full py-2 text-sm font-medium text-purple-300 hover:text-purple-200"
                      >
                        Resend OTP
                      </button>
                    </motion.div>
                  </>
                )}
              </form>
            )}

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-900/20 text-purple-200">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-lg border border-purple-500/30 bg-purple-900/20 text-purple-200 hover:bg-purple-900/40 transition"
                >
                  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubSignIn}
                  className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-lg border border-purple-500/30 bg-purple-900/20 text-purple-200 hover:bg-purple-900/40 transition"
                >
                  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.165 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>
            </div>

            <p className="text-center text-purple-200 mt-6">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                        Log in
                                    </a>
                                </p>
          </div>
                            </motion.div>
      </div>

      {/* OAuth Account Selection Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full border border-gray-700 shadow-xl">
            {accountSelectionOpen ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  {authProvider === "google" ? (
                    <div className="flex items-center">
                      <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                          fill="#4285F4"
                        />
                      </svg>
                      <span className="text-xl font-medium text-white">Sign up with Google</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.165 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                          fill="white"
                        />
                      </svg>
                      <span className="text-xl font-medium text-white">Sign up with GitHub</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">Choose an account</h3>
                <p className="text-gray-300 mb-6">to continue to ModLRN</p>

                <div className="space-y-4 mb-6">
                  {(authProvider === "google" ? mockGoogleAccounts : mockGithubAccounts).map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleAccountSelect(account)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                        {account.avatar}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{account.name}</p>
                        <p className="text-gray-400 text-sm">{account.email}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleUseAnotherAccount}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Use another account</p>
                  </div>
                </button>

                <div className="mt-8 text-center text-xs text-gray-400">
                  <p>
                    Before using this app, you can review ModLRN's{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      privacy policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      terms of service
                    </a>
                    .
                  </p>
            </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {selectedAccount?.avatar || "?"}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedAccount?.name || "User"}</h3>
                <p className="text-gray-400 mb-6">{selectedAccount?.email || "user@example.com"}</p>

                {authLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-white">Signing up...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(false)}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
        </>
    )
}

export default Signup

