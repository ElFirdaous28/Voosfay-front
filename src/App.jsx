import { Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import UnauthenticatedRoute from './Router/UnauthenticatedRoute'
import PrivateRoute from './Router/PrivateRoute'
import ErrorComponent from './components/ErrorComponent'
import ProfileRatings from './pages/profile/ProfileRatings'
import ProfileSettings from './pages/profile/ProfileSettings'
import SearchRides from './pages/Rides/SearchRides'
import RideDetails from './pages/Rides/RideDetails'
import AddRide from './pages/Rides/AddRide'
import NotificationProvider from './components/NotificationProvider'
import EditRide from './pages/Rides/EditRide'

function App() {

  return (
    <>
      <NotificationProvider />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UnauthenticatedRoute element={<Login />} />} />
        <Route path='/register' element={<UnauthenticatedRoute element={<Register />} />} />
        <Route path='/505' element={<ErrorComponent />} />

        {/* profile routes */}
        <Route path="/profile/ratings/:userId" element={<ProfileRatings />} />
        <Route path="/profile/settings/:userId" element={<ProfileSettings />} />

        {/* ride routes */}
        <Route path='rides' element={<SearchRides />} />
        <Route path='ride-details/:id' element={<RideDetails />} />
        <Route path='offer-ride' element={<AddRide />} />
        <Route path='edit-ride/:id' element={<EditRide />} />

        <Route element={<PrivateRoute role={["admin"]} />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>


        {/* user routes */}
        <Route element={<PrivateRoute role={["user"]} />}>
          <Route path='/search-rides' element={<SearchRides errorType='serverError' />} />
        </Route>

      </Routes>
    </>
  )
}

export default App