import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "../styles/Menu.css";

function CreateOrder() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState(0);

  const location = useLocation();
  const selectedItems = location.state || [];

  useEffect(() => {
    const fetchItemDetails = async () => {
      const itemDetailsPromises = selectedItems.map(async (itemId) => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/menu/allmenu/${itemId}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching item details:", error);
          return null;
        }
      });

      const itemDetails = await Promise.all(itemDetailsPromises);
      const filteredItems = itemDetails
        .filter((item) => item !== null)
        .map((item) => ({ name: item.name, price: item.price }));

      setItems(filteredItems);
      setLoading(false);
    };

    fetchItemDetails();
  }, [selectedItems]);

  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item?.price;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      customerName === "" ||
      customerEmail === "" ||
      !totalAmount ||
      items.length === 0
    ) {
      alert("Please fill all the details..");
    }
    setLoading(true);
    const order = {
      items,
      customerName,
      customerEmail,
      totalAmount,
      tip: parseInt(tip),
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/create-order`,
        order
      )
      .then((res) => {
        console.log(res.data);
        alert("Order placed successfully");
        setLoading(false);
        navigate("/orders");
      })
      .catch((err) => {
        console.log(err);
        alert("Sorry, order could'nt be placed");
      });
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{ padding: "20px 20px 20px 20px", width: "50%", height: "100%" }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          New Order
        </Typography>
        {loading ? (
          <>
            <div className="loading-container">
              <CircularProgress />
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Customer Name"
                fullWidth
                variant="outlined"
                margin="normal"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <TextField
                label="Customer Email"
                fullWidth
                variant="outlined"
                margin="normal"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
              <TextField
                label="Total Amount"
                fullWidth
                variant="outlined"
                margin="normal"
                type="number"
                value={totalAmount}
                required
              />
              <TextField
                label="Tip"
                fullWidth
                variant="outlined"
                margin="normal"
                type="number"
                value={tip}
                onChange={(e) => setTip(e.target.value)}
              />
              <div>
                Selected Items :
                {items.map((item, index) => (
                  <div key={index}>
                    {item.name} - Rs. {item.price.toFixed(2)}
                  </div>
                ))}
              </div>
              <div className="button-group">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosIcon />}
                  sx={{
                    textTransform: "unset",
                    mt: 2,
                    float: "left",
                  }}
                  onClick={() => navigate("/")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={selectedItems.length === 0}
                  endIcon={<RestaurantMenuIcon />}
                  sx={{ mt: 2, textTransform: "unset", float: "right" }}
                >
                  {loading ? "Wait.." : "Place Order"}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

export default CreateOrder;
