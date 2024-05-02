import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import CompanyItem from "./CompanyItem";

const CompaniesList = ({companies}) => {
    return (
        <Container sx={{ paddingTop: "40px"}}>
            {((companies) && (companies.length)) ? (
                companies.map((company) => (
                    <CompanyItem
                        key={`${company.id}`}
                        calendar={company}
                    />
                ))
            ) : (
                <Typography variant="h3" align="center" color="colorSecondary" marginTop={"90px"}>There are no calendars</Typography>
            )}
        </Container>
    );
}

export default CompaniesList;