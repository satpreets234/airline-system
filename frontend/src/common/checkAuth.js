import axios from 'axios';
import { toast } from 'react-toastify';
export const tokenCheck = async () =>{
    try {
        const token = localStorage.getItem("token");
        if(!token){
            return false;
        }else{
            const authData =await axios.get('http://localhost:8540/api/user/profile-data',{
              headers: {authorization:`Bearer ${token}`}
            });
            if(authData.status==200){
              return true;
            }
          }
         } catch (error) {
             return false;
          }
}

export const Logout = () =>{
  try {
  localStorage.removeItem('token');
  return true;
  } catch (error) {
    return false;
  }
}

export const initPayment = (data) => {
  console.log(data, 6666);
  const options = {
    key: "rzp_test_hT8Bqf0A2QaCIE",
    amount: data.amount ,
    currency: data.currency,
    description: "Test Transaction",
    order_id: data.id,
    notes: {
      bookingId: data?.notes?.bookingId, // Replace with the actual booking ID
    },
    handler: async (response) => {
      try {
        const payload = {
          ...response,
          notes: {
            bookingId: data?.notes?.bookingId,
          },
        };
        const verifyUrl = "http://localhost:8540/api/payments/verify";
        const verifyResponse = await axios.post(verifyUrl, payload);
        if (verifyResponse.status == 200) {
          toast.success('Booking done successfully')
          window.location.href = '/allbookings';
        }
      } catch (error) {
        toast.error(error)
      }
    },
    theme: {
      color: "#3399cc",
    },
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};