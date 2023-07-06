import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { postData } from '../apiService/apiService';
import { toast } from 'react-toastify';

// Register fonts for pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

export const initPayment = async(data,bookingDetails) => {
  console.log(data, 6666);
  const generatePDF = () => {
    const documentDefinition = {
      content: [
        { text: 'Booking Details', style: 'header' },
        { text: '--------------------------\n\n', style: 'subheader' },
        { text: `Booking ID: ${bookingDetails._id}` },
        { text: `Flight Name: ${bookingDetails.flightId.flightName}` },
        { text: `Passenger Name: ${bookingDetails.userId.email}` },
        { text: `Departure: ${bookingDetails.flightId.departureTime}` },
        { text: `Arrival: ${bookingDetails.flightId.arrivalTime}` },
        { text: `Date: ${bookingDetails.flightId.scheduledDate}` },
        { text: `Price: ${bookingDetails.amount.price/100} ${bookingDetails.amount.currency}` },
        // Add more booking details as needed
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20], // top, right, bottom, left
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10], // top, right, bottom, left
        },
      },
    };

    // Generate the PDF document
    // Download the PDF
    const pdfDoc = pdfMake.createPdf(documentDefinition);
    const uploadPDFToBackend = async(pdfData) => {
        try {
            console.log(pdfData,'1233');
            const data= await postData('booking/upload-pdf',{pdfData,bookingId:bookingDetails._id});
            console.log(data);
            toast.success(123)
        } catch (error) {
            toast.error(error.message)
        }
       
      };
    // Get the data URL of the PDF
    pdfDoc.getBase64((data) => {
      // Send the data URL to the backend
      console.log(63);
      uploadPDFToBackend(data);
    });
  };
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
          generatePDF()
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