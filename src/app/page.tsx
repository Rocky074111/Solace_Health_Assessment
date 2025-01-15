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
  TablePagination,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log("Fetching advocates...");
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

  const handleReset = () => {
    setSearchValue("");
    setFilteredAdvocates(advocates);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page change
  };

  // Calculate rows to display based on pagination settings
  const paginatedAdvocates = filteredAdvocates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      {!isMobile && <div>
          <TableContainer component={Paper}>
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
                {paginatedAdvocates.length > 0 ? (
                  paginatedAdvocates.map((advocate, index) => (
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAdvocates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      }
      {isMobile && (
        <Grid container sx={{ mt: 2 }}>
          {paginatedAdvocates.map((advocate, index) => (
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
