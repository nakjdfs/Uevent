import { Paper, Box, Typography, Icon, IconButton, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContextProvider } from "../ContextProvider";
import { Link } from "react-router-dom";
// import "./Calendars.css";

const CompanyItem = (props) => {
    return (
        <Paper elevation={2} sx={{ mb: 0.5, borderRadius: 2, border: "hidden", backgroundColor: 'inherit' }}>
            <div className="calendar-item-container">
                <Link to={`/company/${props.calendar.id}`} style={{textDecoration: 'none'}}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <div className="calendar-info" style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: '60px', height: '60px', margin: '5px' }}
                            alt="logo"
                            src={`https://localhost:3001/api/companies/${props.calendar.id}/logo`}
                        />
                        <Typography
                            variant="h6"
                            color={'textPrimary'}
                            style={{ textDecoration: 'none', padding: '1px', marginTop: '5px', marginBottom: '5px', width: '100%', marginLeft: '10px' }}
                        >
                        {props.calendar.name}
                        </Typography>
                    </div>
                </Box>
                </Link>
            </div>
        </Paper>
    )
}

export default CompanyItem;