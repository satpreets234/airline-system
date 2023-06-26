import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { tokenCheck } from '../../common/checkAuth';
import { fetchDataWithToken } from '../../apiService/apiService';
import { toast } from 'react-toastify';
import CompanyCard from '../CompanyCard/CompanyCard';
import {ContextData} from '../../App'
import ReviewModal from '../Modal/ReviewModal';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';
function CompanyReview() {
    const [companyArray, setCompanyArray] = useState([]);
    const {companyId,setCompanyId,reviewModal,setReviewModal} =useContext(ContextData)
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck();
      if (!authcheck) {
        navigate('/login');
      } else {
        try {
        const fetchCompanies= await fetchDataWithToken('user/companies');
            setCompanyArray(fetchCompanies);
        } catch (error) {
            toast.error(error.message);
        }
        
      }
    }
    checkAuth();
  }, [reviewModal]);
  
  return (
    <>
    <NavBar/>
    <h2 style={{marginLeft:'40px'}}>All flights</h2>
    <div className='d-flex' style={{margin:'10px'}}>
        {
            companyArray.map((company)=>{
                return <CompanyCard companyId={companyId} setCompanyId={setCompanyId} setReviewModal={setReviewModal} company={company}/>
            })
        }
        <ReviewModal/>
    </div>
    <Footer/>
    </>
  )
}

export default CompanyReview