// import { BrowserRouter as Router, Routes, Route } from 'react-router';
// import { useState } from 'react'
// import ProtectedRoute from '@/components/protectedRoute';
// import Login from '@/views/login';
import Dashboard from '@/views/dashboard';
// import Questions from '@/views/questions';

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="flex flex-col w-full h-screen">
      <h1>Nummus Budget</h1>
      <p>Welcome to the Nummus Budget app! This is a simple budgeting tool built with a Node.js backend and a React frontend. Use the navigation links to explore the dashboard and manage your budget.</p>
      <Dashboard />
    </div>
  //  <Router>
  //     <Routes>
  //       <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

  //       <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
  //         <Route path="/dashboard" element={<Dashboard />} />
  //         <Route path="/questions" element={<Questions />} />
  //       </Route>
  //     </Routes>
  //   </Router>
  )
}

export default App
