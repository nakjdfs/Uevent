import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CalendarService from "../../API/CalendarsService";
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationPanel = ({}) => {
    const [name, setName] = useState("");
    const [public_, setPublic] = useState(true);
    const [error, setError] = useState();
    const [showComfForm, setShowComfForm] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await CalendarService.createCalendar(name, !public_);
            window.location.reload();
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }
    
    return (
        <div>
            {(showForm) && (
            <div>
                <Paper elevation={2} sx={
                    { 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                        mt: 10, 
                        mb: 0.5,
                        ml: "24px",
                        mr: "24px",
                        borderRadius: 2, 
                        border: "hidden", 
                        alignContent: "center" 
                    }
                } onClick={() => setShowForm(true)}>
                    <AddIcon/>
                </Paper>

                <Container
                    component="main"
                    maxWidth="sm"
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: showForm ? 'block' : 'none'  // Conditional display
                    }}
                >
                    <Paper elevation={4} sx={{ p: 4, mt: 15 }} style={{ textAlign: "center" }}>
                        <Typography variant="h2">Add calendar</Typography>

                        <form method="post"
                            className="calendar_form"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                width: "100%",
                                justify: "center",
                                marginTop: "40px",
                            }}
                            onSubmit={(e) => handleSubmit(e)}>
                            <TextField
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                label="Name"
                                variant="outlined"
                                required
                            />

                            <FormControlLabel control={<Checkbox checked={public_} onChange={(e) => setPublic(e.target.checked)} />} label="Private" />


                            {error && <Alert severity="error">{error}</Alert>}

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="contained" type="submit" style={{width: "100%"}}>
                                    Create
                                </Button>
                                <Fab color="error" aria-label="edit" sx={{ position: 'absolute', top: 26, right: 26, height: 44, width: 44, mt: 15, mr: 2 }} onClick={() => {setShowForm(false)}}>
                                        <CloseIcon />
                                </Fab>
                            </div>
                        </form>
                    </Paper>
                </Container>
            </div>)}
        </div>
    )
}

export default ConfirmationPanel;