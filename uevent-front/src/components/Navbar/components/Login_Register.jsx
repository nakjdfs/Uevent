import React from "react";
import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login_Register = () => {
    return (
        <React.Fragment>
            <Paper sx={{
                p: 1,
                marginBottom: 0.2,
                marginLeft: 2,
                marginRight: 2,
                typography: 'body1',
                borderRadius: 3,
                width: "fit-content",
                display: 'flex',
                border: "solid",
                borderWidth: "1px",
                borderColor: "lightgray",
                backgroundColor: "#282828",
                '& > :not(style) ~ :not(style)': {
                    ml: 1,
                },
                '& > :not(style)': {
                    borderRight: '1px solid #ddd',
                    ':last-child': {
                        borderRight: 'none',
                    },
                },
            }}>
                
            </Paper>
        </React.Fragment>
    )
}

export default Login_Register;
