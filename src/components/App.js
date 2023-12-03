import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { Home, Login, Test, Register, Settings, UserProfile } from '../pages';
import { Loader, Navbar } from "./";
const Page404 = () => {
  return <h1>Error 404 - No Page Found!</h1>
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth.user ? children : <Navigate to="/login" />;
}


function App() {

  const auth = useAuth();
  console.log('auth', auth);
  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/logout' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/settings' element={<PrivateRoute> <Settings /> </PrivateRoute>} />
          <Route exact path='/user/:userId' element={<PrivateRoute> <UserProfile /> </PrivateRoute>} />
          <Route exact path='/test' element={<Test />} />
          <Route exact path='/*' element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
