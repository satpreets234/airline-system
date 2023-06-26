import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { initPayment } from '../../common/checkAuth';
import { fetchDataWithoutToken } from '../../apiService/apiService';
import { toast } from 'react-toastify';

function EmailCompletionPayment() {
  const [transactionData,setTransactionData]= useState({})
   const [params,setParams]=useState(useParams())

    const completePayment = async(transactionData) =>{
        try {
            console.log(transactionData,'88');
            initPayment(transactionData)
        } catch (error) {
            
        }
    }
//    const getPaymentData = async (id) =>{
//     try {
//         const transactionDetails =await fetchDataWithoutToken(`booking/with-toke/${id}`);
//        setTransactionData(transactionDetails)
//        console.log(transactionData);
//        console.log(11); 
//     } catch (error) {
//         toast.error(error.message)
//     }
        
//    }
//    useEffect(()=>{
//     // console.log(data,'lofi');
//         // initPayment(data)
//         async function useunction(){

//        await getPaymentData(params?.id)
//         console.log(transactionData);
//        await completePayment(transactionData)
//     }
//     useunction()
//    },[])
useEffect(() => {
    const useunction = async () => {
      try {
        const transactionDetails = await fetchDataWithoutToken(`booking/with-toke/${params.id}`);
        setTransactionData(transactionDetails);
        console.log(transactionDetails); // Verify if the transaction details are logged correctly.
        completePayment(transactionDetails?.transactionId?.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    useunction();
  }, []);
  return (
    <div>
        Payment Completion page
    </div>
  )
}

export default EmailCompletionPayment