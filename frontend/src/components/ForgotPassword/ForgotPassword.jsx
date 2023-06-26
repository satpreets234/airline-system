import React from 'react'
import {Formik,Field,ErrorMessage} from 'formik';
import {Form,} from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { postData } from '../../apiService/apiService';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
function ForgotPassword() {
    const initialValues={email:''};
    const validationSchema=Yup.object().shape({
        email:Yup.string().required('email is required').email('Please provide valid mail')
    })
    const handleSubmit = async(values,{setSubmitting,resetForm}) =>{
        try {
            const responseSend = await postData(`user/reset-password-request`, values);
            if (responseSend) {
              toast.success('Password link sent to your mail id');
              resetForm()
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
                <Form.Group controlId='email'>
                    <Form.Label style={{color:'white'}}>Email</Form.Label>
                    <Field  type="text"
                    name="email"
                    placeholder="Enter Email here"
                    className="form-control"/>
                    <ErrorMessage name="email" component="div" className="text-danger"/>
                </Form.Group>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  style={{ marginTop: '20px' }}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Mail'}
                </button>
            </Form>
        )}
        </Formik> 
        
    </div>
    <Footer/>
    </div>
  )
}

export default ForgotPassword