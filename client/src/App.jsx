import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupForm from './components/auth/SignupForm'
import LoginForm from './components/auth/LoginForm'
import ForgotPasswordForm from './components/auth/ForgotPasswordForm'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      </Routes>
    </Router>
  )
}

export default App
