import { useEffect, useState } from "react";
import { Typography, Button, Container, Paper, Box, Grid } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchIcon from "@mui/icons-material/Search";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
      <div className="home">
        <Container component="main" maxWidth="sm">
          <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
            <Typography variant="h4" sx={{ paddingTop: 3, paddingBottom: 1 }}>
              <span style={{ fontWeight: "bold", color: "white" }}>
                Hi, Welcome back!
              </span>{" "}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                paddingTop: 1,
                paddingBottom: 1,
                color: "white",
                fontFamily: "cursive",
              }}
              paragraph
            >
              "Indulge Your Senses: Welcome to Our Culinary Adventure!
            </Typography>
            <Box className="button-group">
              <Button
                className="button"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{
                  marginRight: 2,
                  marginLeft: 2,
                  marginBottom: 4,
                  textTransform: "unset",
                }}
                href="/menu"
              >
                Search Menu
              </Button>
              <Button
                className="button"
                variant="contained"
                startIcon={<RestaurantMenuIcon />}
                sx={{
                  marginRight: 2,
                  marginLeft: 2,
                  marginBottom: 4,
                  textTransform: "unset",
                }}
                href="/orders"
              >
                Orders
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Home;
