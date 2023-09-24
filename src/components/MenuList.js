import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Checkbox,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import "../styles/Menu.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
function MenuList() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/menu/allmenu`);
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleMenuItemSelect = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleAddItem = () => {
    console.log(itemName, itemPrice, itemDesc);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/menu/create-menu`, {
        name: itemName,
        price: parseInt(itemPrice),
        description: itemDesc,
      })
      .then((res) => {
        console.log(res?.data);
        alert("Item added");
        setOpenDialog(false);
        fetchMenuItems();
      })
      .catch((err) => console.log(err));
  };
  const handleRemove = (itemId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/menu/allmenu/${itemId}/delete`
      )
      .then((res) => {
        console.log(res?.data);
        alert("Item removed from menu");
        fetchMenuItems();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h5"
          className="heading"
          sx={{
            color: "white",
            fontWeight: "bold",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          Menu Items{" "}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{
            textTransform: "unset",
            ml: 2,
            mt: 5,
            mb: 5,
            borderRadius: "50px",
          }}
          onClick={() => setOpenDialog(true)}
        >
          Add Items
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ipsam
              natus voluptatibus impedit est officiis? Ducimus cumque quaerat
              magni laborum accusantium voluptas illum nihil. Quo iste est
              perferendis quibusdam. Voluptas.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Item name"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              required
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              type="number"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="desc"
              label="Description"
              required
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              sx={{ textTransform: "unset" }}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button sx={{ textTransform: "unset" }} onClick={handleAddItem}>
              Add{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Container
            sx={{
              width: "50%",
              paddingTop: 1,
              paddingBottom: 1,
              overflow: "auto",
            }}
          >
            <Paper
              sx={{
                background: "transparent",
                height: "70vh",
                overflow: "auto",
              }}
            >
              {menuItems.map((menuItem) => (
                <Accordion key={menuItem._id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ mb: 1 }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Checkbox
                      sx={{ mb: 1 }}
                      checked={selectedItems.includes(menuItem._id)}
                      onChange={() => handleMenuItemSelect(menuItem._id)}
                    />
                    <Typography sx={{ mb: 1, mt: 1 }}>
                      {menuItem.name}{" "}
                    </Typography>
                    <Typography
                      sx={{ mt: 1, mb: 1, mr: 3 }}
                      style={{ marginLeft: "auto" }}
                    >
                      Rs. {menuItem.price.toFixed(2)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {menuItem.description ? (
                      <Typography variant="body2" color="textSecondary">
                        {menuItem.description}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No description available.
                      </Typography>
                    )}

                    <IconButton
                      onClick={() => handleRemove(menuItem?._id)}
                      color="error"
                      sx={{ float: "right", mb: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>

            <div className="button-group">
              <Button
                variant="contained"
                color="inherit"
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
                variant="contained"
                endIcon={<ArrowForwardIosIcon />}
                disabled={selectedItems.length === 0}
                sx={{ textTransform: "unset", mt: 2, float: "right" }}
                onClick={() =>
                  navigate("/orders/new", { state: selectedItems })
                }
              >
                Place Order
              </Button>
            </div>
          </Container>
        </>
      )}
    </div>
  );
}

export default MenuList;
