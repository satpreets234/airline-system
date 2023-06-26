import React, { useEffect, useState } from "react";
import { Navigate, Redirect, Route } from "react-router-dom";
import axios from 'axios';
function ProtectedRoute({ ...restOfProps }) {
    const [validToken,setValidToken] =useState(false);
    useEffect(() => {
        const tokenCheck =async () =>{
            try {
                const token = localStorage.getItem("token");
            console.log("this", token);
              const authData =await axios.get('http://localhost:8540/api/user/profile-data',{},{
                headers: `Bearer ${token}`
              });
              if(authData.status==200){
                setValidToken(true)
              }
            } catch (error) {
                setValidToken(false);
                console.log(error);
            }
            
        }
       tokenCheck()
    }, [])
    
  

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        validToken ? <props.element {...props} /> : <Navigate to="/login" />
      }
    />
  );
}

export default ProtectedRoute;