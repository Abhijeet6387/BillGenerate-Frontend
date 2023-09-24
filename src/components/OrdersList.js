import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filterOrders, setFilterOrders] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("all");
  const [loading, setLoading] = useState(true);

  const customerEmails = [
    ...new Set(orders.map((order) => order.customerEmail)),
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/allorders`)
      .then((res) => {
        setOrders(res?.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(true);
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleChangeEmail = (e) => {
    setSelectedEmail(e.target.value);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/allorders/customer?email=${selectedEmail}`
      )
      .then((res) => {
        setFilterOrders(res?.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(true);
        console.error("Error fetching orders:", error);
      });
  }, [selectedEmail]);

  // console.log(orders, selectedEmail.length);

  return (
    <div className="container">
      <Container>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: "bold",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          All Orders
        </Typography>

        <Paper sx={{ padding: "10px 10px 10px 10px" }}>
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel id="cus_email">Customer's Email</InputLabel>
            <Select
              labelId="cus_email"
              id="cus_email"
              value={selectedEmail}
              label="Customer's Email"
              onChange={handleChangeEmail}
            >
              <MenuItem value="all">All</MenuItem>
              {customerEmails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading ? (
            <div className="loading-container">
              <CircularProgress />
            </div>
          ) : (
            <>
              {filterOrders.length !== 0 ? (
                <>
                  <Grid container spacing={2}>
                    {filterOrders.map((order) => (
                      <Grid item key={order._id} xs={12} sm={6} md={4}>
                        <Card sx={{ border: "1px solid black" }}>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              Order ID: {order._id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Customer Name: {order.customerName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Customer Email: {order.customerEmail}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Total Amount: Rs. {order.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Tip: Rs. {order.tip.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    {orders.map((order) => (
                      <Grid item key={order._id} xs={12} sm={6} md={4}>
                        <Card sx={{ border: "1px solid black" }}>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              Order ID: {order._id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Customer Name: {order.customerName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Customer Email: {order.customerEmail}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Total Amount: Rs. {order.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Tip: Rs. {order.tip.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<ArrowBackIosIcon />}
              sx={{ mt: 2, textTransform: "unset", mr: 1 }}
              onClick={() => navigate("/menu")}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2, textTransform: "unset", ml: 1 }}
              disabled={selectedEmail === "all"}
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => navigate("/bill", { state: filterOrders })}
            >
              Create Bill
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default OrdersList;
