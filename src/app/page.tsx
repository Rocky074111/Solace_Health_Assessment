"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is mobile size

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(searchValue.toLowerCase())
        ) ||
        advocate.phoneNumber.toString().includes(searchValue) ||
        advocate.yearsOfExperience.toString().includes(searchValue)
      );
    });
    setFilteredAdvocates(filtered);
  }, [searchValue, advocates]);

  // const onChange = (e) => {
  //   const searchTerm = e.target.value;
  //   document.getElementById("search-term").innerHTML = searchTerm;

  //   console.log("filtering advocates...");
  //   const filteredAdvocates = advocates.filter((advocate) => {
  //     return (
  //       advocate.firstName.includes(searchTerm) ||
  //       advocate.lastName.includes(searchTerm) ||
  //       advocate.city.includes(searchTerm) ||
  //       advocate.degree.includes(searchTerm) ||
  //       advocate.specialties.includes(searchTerm) ||
  //       advocate.yearsOfExperience.toString().includes(searchTerm)
  //     );
  //   });

  //   setFilteredAdvocates(filteredAdvocates);
  // };

  const handleReset = () => {
    setSearchValue("");
    setFilteredAdvocates(advocates);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Solace Advocates
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleReset}
          sx={{
            flexShrink: 0,
            alignSelf: { xs: "center", md: "unset" },
          }}
        >
          Reset Search
        </Button>
      </Box>
      {!isMobile && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Specialties</TableCell>
              <TableCell>Years of Experience</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvocates.length > 0 ? (
              filteredAdvocates.map((advocate, index) => (
                <TableRow key={index}>
                  <TableCell>{advocate.firstName}</TableCell>
                  <TableCell>{advocate.lastName}</TableCell>
                  <TableCell>{advocate.city}</TableCell>
                  <TableCell>{advocate.degree}</TableCell>
                  <TableCell>
                    {advocate.specialties.map((s, i) => (
                      <Typography key={i} variant="body2">
                        {s}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>{advocate.yearsOfExperience.toString()}</TableCell>
                  <TableCell>{advocate.phoneNumber.toString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      }
      {isMobile && (
        <Grid container  sx={{ mt: 2 }}>
          {filteredAdvocates.map((advocate, index) => (
            <Grid
              item
              xs={12}
              key={index}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6">
                {advocate.firstName} {advocate.lastName}
              </Typography>
              <Typography variant="body2">City: {advocate.city}</Typography>
              <Typography variant="body2">Degree: {advocate.degree}</Typography>
              <Typography variant="body2">
                Specialties: {advocate.specialties.join(", ")}
              </Typography>
              <Typography variant="body2">
                Experience: {advocate.yearsOfExperience.toString()} years
              </Typography>
              <Typography variant="body2">
                Phone: {advocate.phoneNumber.toString()}
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}