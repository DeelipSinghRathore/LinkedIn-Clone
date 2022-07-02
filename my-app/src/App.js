import './App.css';
import React from 'react';
import Login from './components/Login';
import Header from './components/Header';
import { useEffect } from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserAuth } from './actions';
import { connect } from 'react-redux';
import Main from './components/Main';
import { useState } from 'react';
import LeftSide from './components/LeftSide';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import PostModal from './components/PostModal';
function App(props) {
  const[currentUser,setcurrentUser] = useState(null); 
  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
       if(user){
        setcurrentUser(currentUser);
       }
       else{
        console.log("user is null")
       }
    })
  }, [])
  
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login user = {currentUser}/>} />
          <Route
            path='/home'
            element={
              <React.Fragment>
                <React.Fragment>
                <Header  user = {currentUser} />
              </React.Fragment>
              <React.Fragment>
              <Home  user = {currentUser} />
            </React.Fragment>
              </React.Fragment>
            }
          />
        </Routes>
      </Router>
      {/* <PostModal/> */}
      
    </div>
  );
}

const mapStateToProps = (state)=>{
  return {};
};
const mapDispatchToProps=(dispatch)=>({
 // getUserAuth: () => dispatch(getUserAuth()),
}
)

export default connect(mapStateToProps,mapDispatchToProps)(App);
