import { Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import UnauthenticatedRoute from './Router/UnauthenticatedRoute'
import PrivateRoute from './Router/PrivateRoute'
import ErrorComponent from './components/ErrorComponent'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<UnauthenticatedRoute element={<Login />} />} />
      <Route path='/register' element={<UnauthenticatedRoute element={<Register />} />} />

      <Route path="/*" element={<ErrorComponent errorType="notFound" />} />
      <Route path="/unauthorized" element={<ErrorComponent errorType="unauthorized" />} />
      <Route path="/500" element={<ErrorComponent errorType="serverError" />} />

      <Route element={<PrivateRoute role={["admin"]} />}>

        <Route path='/dashboard' element={<Dashboard />} />

      </Route>

    </Routes>
  )
}

export default App