import { Button, Modal, Form } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ContextData } from '../../App';
import { postData } from '../../apiService/apiService';

function ChangePassword() {
  const { changePasswordModal, setChangePasswordModal } = useContext(ContextData);
  const handleClose = () => {
    setChangePasswordModal(false);
  };

  const initialValues = { oldPassword: '', newPassword: '', confirmPassword: '' };
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('newPassword')], 'Confirm password should match new password'),
  });

  const handleSubmit = async (values, { setSubmitting ,resetForm}) => {
    try {
      const responseSend = await postData(`user/change-password`, values);
      if (responseSend) {
        toast.success('Password changed');
        setChangePasswordModal(false);
        resetForm()
      }
    } catch (error) {
      toast.error(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Modal show={changePasswordModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="oldPassword">
                  <Form.Label>Old password</Form.Label>
                  <Field
                    type="password"
                    name="oldPassword"
                    placeholder="Enter old password"
                    className="form-control"
                  />
                  <ErrorMessage name="oldPassword" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Field
                    type="text"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="form-control"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-danger" />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter new password again"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
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

export default ChangePassword;