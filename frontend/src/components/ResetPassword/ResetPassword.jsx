import React from 'react'
import {Formik,Field,ErrorMessage} from 'formik';
import {Form,} from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { postData } from '../../apiService/apiService';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
function ResetPassword() {
    const initialValues={newPassword:'',confirmPassword:''};
    const validationSchema=Yup.object().shape({
        newPassword:Yup.string().required('password is required'),
        confirmPassword:Yup.string().required('password is required').oneOf([Yup.ref('newPassword')],
        "Both passwords should match each other"),

    })
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // const token = searchParams.get('token');
    // const id = searchParams.get('id');
  const navigate=useNavigate();
    const handleSubmit = async(values,{setSubmitting,resetForm}) =>{
        try {
             const token = searchParams.get('token');
                const id = searchParams.get('id');
            const payload={...values,userId:id,token}
            const responseSend = await postData(`user/reset-password`, payload);
            if (responseSend) {
              toast.success('Password Reset Successfull');
              navigate('/login')
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
          setSubmitting(false);
    }
  return (
    <div>
        <NavBar/>
    <div style={{backgroundColor:'black'}} className='center'>
       <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({isSubmitting,isValid,handleSubmit})=>(
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='newPassword'>
                    <Form.Label style={{color:'white'}}>New Password</Form.Label>
                    <Field  type="text"
                    name="newPassword"
                    placeholder="Enter password here"
                    className="form-control"/>
                    <ErrorMessage name="newPassword" component="div" className="text-danger"/>
                </Form.Group>
                <Form.Group controlId='confirmPassword'>
                    <Form.Label style={{color:'white'}}>Confirm Password</Form.Label>
                    <Field  type="text"
                    name="confirmPassword"
                    placeholder="Confirm Password here"
                    className="form-control"/>
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger"/>
                </Form.Group>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  style={{ marginTop: '20px' }}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </button>
            </Form>
        )}
        </Formik> 
        
    </div>
    <Footer/>
    </div>
  )
}

export default ResetPassword