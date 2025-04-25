import { Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import UnauthenticatedRoute from './Router/UnauthenticatedRoute'
import PrivateRoute from './Router/PrivateRoute'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<UnauthenticatedRoute element={<Login />} />} />
      <Route path='/register' element={<UnauthenticatedRoute element={<Register />} />} />
      <Route element={<PrivateRoute role={["admin"]} />}>

        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard2' element={<Dashboard />} />

      </Route>

    </Routes>
  )
}

export default App