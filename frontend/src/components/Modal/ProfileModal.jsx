import { Button, Modal, Form } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ContextData } from '../../App';
import { postData } from '../../apiService/apiService';

function ProfileModal({ userData ,responseState,setResponseState}) {
  const { profileModal, setProfileModal } = useContext(ContextData);
  const handleClose = () => {
    setProfileModal(false);
  };

  const [selectedImage, setSelectedImage] = useState(null); // State for storing the selected image
  const [selectedImage1, setSelectedImage1] = useState(null); 
  const initialValues = { email: userData.email, profileImage: '' };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Please provide valid'),
    profileImage: Yup.string(),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // If a file is selected
      setSelectedImage1(file)
      setSelectedImage(URL.createObjectURL(file)); // Set the selected image preview
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
        console.log(values);
        const formData=new FormData();
        formData.append("email",values.email);
        formData.append("profileImage",selectedImage1);
        console.log(formData);
      const responseSend = await postData(`user/profile-data`, formData);
      if (responseSend) {
        toast.success('Profile updated ');
        setProfileModal(false);
        resetForm();
        setResponseState(!responseState)
      }
    } catch (error) {
      toast.error(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Modal show={profileModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email here..."
                    className="form-control"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="profileImage">
                  <Form.Label>Image</Form.Label>
                  <div>
                    {selectedImage && (
                      <div>
                        <img src={selectedImage} alt="Selected Image" style={{ width: '100px' }} />
                      </div>
                    )}
                    {!selectedImage && (
                      <img
                        style={{ width: '20%' }}
                        src={`http://localhost:8540/uploads/images/${userData?.userImage}`}
                        alt="Profile Image"
                      />
                    )}
                  </div>
                  <Field
                    type="file"
                    name="profileImage"
                    className="form-control"
                    
                    onChange={handleImageChange}
                  />
                  <ErrorMessage name="profileImage" component="div" className="text-danger" />
                </Form.Group>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  style={{ marginTop: '20px' }}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Submitting...' : 'Change Password'}
                </button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfileModal;