import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function BillDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const orders = location.state || [];
  const customerEmail = orders[0]?.customerEmail;
  const [billdetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/orders/get-bill?email=${customerEmail}`
        );

        console.log(response);
        setLoading(false);
        setBillDetails(response?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [customerEmail]);

  const generatePDF = (billdetails) => {
    const doc = new jsPDF();

    // Add the Bill No and Download button
    doc.setFontSize(10);
    doc.text(`Bill No: ${billdetails?.billNo?.slice(0, 8)}`, 20, 10);

    // User Details
    doc.setFontSize(10);
    doc.text(`Email: ${billdetails?.userDetails?.email}`, 20, 20);

    // Orders
    let y = 30;
    billdetails?.orders.forEach((order, index) => {
      doc.setFontSize(10);
      doc.text(`Order No. ${index + 1}`, 20, y);
      y += 10;

      order.items.forEach((item) => {
        doc.setFontSize(10);
        doc.text(`Item: ${item.name} - Rs. ${item.price.toFixed(2)}`, 30, y);
        y += 10;
      });

      doc.setFontSize(10);
      doc.text(`Tip: Rs. ${order.tip.toFixed(2)}`, 30, y);
      y += 10;
    });

    // Net Total
    doc.setFontSize(14);
    doc.text(
      `Net Total: Rs. ${billdetails?.amountToBePaid.toFixed(2)}`,
      20,
      y + 10
    );

    // Save the PDF
    doc.save(`bill_${billdetails?.billNo?.slice(0, 8)}.pdf`);
  };

  const handleDownload = () => {
    generatePDF(billdetails);
  };

  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10,
          paddingTop: 10,
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ mt: 3 }} />
          </div>
        ) : (
          <Card
            sx={{
              ml: 3,
              mr: 3,
              width: "auto",
              height: "70vh",
              overflow: "auto",
              padding: "20px 20px 20px 20px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: 2,
                fontWeight: "bold",
                float: "left",
                fontSize: "16px",
              }}
            >
              Bill No : {billdetails?.billNo?.slice(0, 8)}
            </Typography>{" "}
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              size="small"
              onClick={() => handleDownload(billdetails)}
              sx={{
                textTransform: "unset",
                borderRadius: "50px",
                ml: 2,
                mb: 0.5,
              }}
            >
              Download
            </Button>
            <List>
              <ListItem sx={{ padding: 0 }}>
                <ListItemText
                  primary={`Name: ${billdetails?.userDetails?.name}`}
                />
              </ListItem>
              <ListItem sx={{ padding: 0 }}>
                <ListItemText
                  primary={`Email: ${billdetails?.userDetails?.email}`}
                />
              </ListItem>
            </List>
            {orders.map((order, index) => (
              <div key={order._id} sx={{ marginTop: 2 }}>
                <List>
                  <ListItem sx={{ padding: 0 }}>
                    <ListItemText primary={`Order No. ${index + 1}`} />
                  </ListItem>
                  {order.items.map((item) => (
                    <ListItem key={item._id} sx={{ padding: 0 }}>
                      <ListItemText
                        primary={`Item: ${item.name} - Rs. ${item.price.toFixed(
                          2
                        )}`}
                      />
                    </ListItem>
                  ))}
                  <ListItem sx={{ padding: 0 }}>
                    <ListItemText
                      primary={`Tip: Rs. ${order.tip.toFixed(2)}`}
                    />
                  </ListItem>
                </List>
              </div>
            ))}
            <Typography variant="h6" sx={{ marginTop: 2, fontWeight: "bold" }}>
              Net Total: Rs. {billdetails?.amountToBePaid.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              onClick={() => navigate("/orders")}
              sx={{
                textTransform: "unset",
                mt: 1,
                borderRadius: "50px",
                bottom: 0,
              }}
            >
              Back
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}

export default BillDetails;
