import React, { useContext, useEffect, useState } from 'react';
import { ContextData } from '../../App';
import './Profile.css';
import { fetchDataWithToken, postData } from '../../apiService/apiService';
import { toast } from 'react-toastify';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { Button } from 'react-bootstrap';
import userImage from '../../assets/airplane.png';
import ChangePassword from '../Modal/ChangePassword';
import { tokenCheck } from '../../common/checkAuth';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../Modal/ProfileModal';

function Profile() {
  const { user, setUser, setChangePasswordModal,profileModal,setProfileModal } = useContext(ContextData);
  const navigate = useNavigate();

  async function getUserData() {
    try {
      const userData = await fetchDataWithToken('user/profile-data');
      setUser(userData);
    } catch (error) {
      toast.error(error.message);
    }
  }



  
  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck();
      if (!authcheck) {
        navigate('/login');
      }
    }
    checkAuth();
  }, []);
const [responseState,setResponseState] =useState(false)
  useEffect(() => {
    getUserData();
    console.log(1);
  }, [responseState]);

  return (
    <>
      <NavBar />
      <div className="d-flex">
        <div style={styles.container}>
          <h1 style={styles.heading}>Welcome, {user?.companyName || user?.email}</h1>
          <div style={{ display: 'flex' }}>
            <div>
              <p style={styles.text}>Email: {user?.email}</p>
              <p style={styles.text}>User Type: {user?.userType}</p>
              {user?.companyCode && <p style={styles.text}>Company Code: {user?.companyCode}</p>}
            </div>
            {/* Add more profile information here */}
            <div  style={{ marginLeft: '10px', marginTop: '20px' }}>
              <img
                width={40}
                style={styles.heading}
                src={`http://localhost:8540/uploads/images/${user?.userImage}`}
              />
             
            </div>
          </div>
        </div>
        <ChangePassword />
        <ProfileModal responseState={responseState} setResponseState={setResponseState} userData={user}/>
        <div style={{ marginLeft: '60px' }}>
          <img src={userImage} alt="Not found" />
        </div>
      </div>
      <Button onClick={() => setChangePasswordModal(true)} style={{ marginLeft: '40px' }}>
        Change password
      </Button>
      <Button onClick={() => setProfileModal(true)} style={{ marginLeft: '40px' }}>
        Update Profile
      </Button>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px 123px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '5px',
  },
};

export default Profile;