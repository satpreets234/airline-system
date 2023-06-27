import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { initPayment, tokenCheck } from '../../common/checkAuth';
import { useNavigate } from 'react-router-dom';
import { AiOutlineFilePdf } from 'react-icons/ai'
import swal from 'sweetalert';
import { fetchDataWithToken } from '../../apiService/apiService';
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAuth() {
      const authcheck = await tokenCheck();
      if (!authcheck) {
        navigate('/login');
      } else {
        navigate('/allbookings');
      }
    }
    checkAuth();
  }, []);
  const handleUserSearch = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const queryData = await axios.get(
        `http://localhost:8540/api/booking`,
        // {
        //   isActive: query?.active,
        //   isVerified: query?.verified,
        //   email: query?.email,
        //   sortBy: query?.sort,
        //   pageNo: pageNo, // Add pageNo parameter
        //   rowsPerPage: 5,
        // },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (queryData.status === 200) {
        console.log(29);
        setBookings(queryData.data);
      }
    } catch (error) {
      console.log(error);
      setBookings();
    }
  };
  const [bookingManagementQuery,setBookingManagementQuery]=useState({});
  const [pageNo,setPageNo]=useState(0);
  useEffect(() => {
    // Call the handleUserSearch function with the initial query
    handleUserSearch(bookingManagementQuery);
  }, [pageNo,bookingManagementQuery]); // Execute the effect whenever the pageNo changes

  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8540/api/booking', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedBookings = await Promise.all(
          response.data.map(async (booking) => {
            const bookingDetails = await fetchDataWithToken(`booking/booking-pdf/${booking._id}`);
            return { ...booking, pdfLink: bookingDetails.filePath };
          })
        );
        setBookings(updatedBookings);
      } catch (error) {
        toast.error(error);
      }
    }

    fetchBookings();
  }, [refresh]);

  const deleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const bookingDelete = await axios.delete(`http://localhost:8540/api/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (bookingDelete.status === 200) {
        toast.success('Booking deleted successfully!');
        setRefresh(!refresh);
      }
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };

  const tableCellStyle = {
    padding: '10px'
  };

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '20px' }}>
        <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
          All Bookings
        </Typography>
        {bookings && bookings.length > 0 ? (
          <>
          <Table>
            <TableHead style={{ backgroundColor: '#184f74' }}>
              <TableRow>
                <TableCell style={tableCellStyle}>Booking ID</TableCell>
                <TableCell style={tableCellStyle}>User ID</TableCell>
                <TableCell style={tableCellStyle}>Flight ID</TableCell>
                <TableCell style={tableCellStyle}>Origin</TableCell>
                <TableCell style={tableCellStyle}>Destination</TableCell>
                <TableCell style={tableCellStyle}>Seat Type</TableCell>
                <TableCell style={tableCellStyle}>Seat Count</TableCell>
                <TableCell style={tableCellStyle}>Completed Payment</TableCell>
                <TableCell style={tableCellStyle}>Price</TableCell>
                <TableCell style={tableCellStyle}>Currency</TableCell>
                <TableCell style={tableCellStyle}>Change Status</TableCell>
                <TableCell style={tableCellStyle}>Download Pdf</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell style={tableCellStyle}>{booking?._id}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.userId?.email}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.flightId?.flightName}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.origin}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.destination}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.seatDetails?.seatType}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.seatDetails?.seatCount}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.completedPayment ? 'Yes' : <Button onClick={() => { initPayment(booking?.transactionId?.data,booking) }} style={{
                    cursor: 'pointer',
                    backgroundColor: 'green',
                    padding: '8px',
                    color: '#fff',
                    borderRadius: '4px',
                    textAlign: 'center',
                    width: '70px'
                  }}> Payment</Button>}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.amount?.price / 100}</TableCell>
                  <TableCell style={tableCellStyle}>{booking?.amount?.currency}</TableCell>
                  <TableCell style={tableCellStyle}>
                    <div
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'red',
                        padding: '8px',
                        color: '#fff',
                        borderRadius: '4px',
                        textAlign: 'center',
                        width: '70px'
                      }}
                      onClick={() => {
                        swal({
                          title: 'Are you sure?',
                          text: 'Once deleted, you will not be able to recover this item!',
                          icon: 'warning',
                          buttons: ['Cancel', 'Delete'],
                          dangerMode: true,
                        }).then((confirmDelete) => {
                          if (confirmDelete) {
                            deleteBooking(booking?._id);
                            setRefresh(!refresh);
                          }
                        });
                      }}
                    >
                      Delete
                    </div>
                  </TableCell>
                  {booking.pdfLink?<TableCell style={tableCellStyle}> <a download={true} href={`http://localhost:8540/${booking.pdfLink}`} target="_blank" rel="noopener noreferrer">
                    <AiOutlineFilePdf />
                  </a></TableCell>:'No Pdf Invoice'}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(10 / 5)}
              page={pageNo}
              // onChange={handlePageChange}
              rowsPerPage={5}
            />
          </Stack>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h5">No Bookings Yet</Typography>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default BookingsPage;