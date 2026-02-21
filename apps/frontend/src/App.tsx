import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState } from 'react'
import ProtectedRoute from '@/components/protectedRoute';
import Login from '@/views/login';
import Dashboard from '@/views/dashboard';
import Questions from '@/views/questions';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
   <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Routes Group */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
