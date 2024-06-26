import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab } from "@mui/material";
import { Link } from "react-router-dom";
import CalendarService from "../../API/CalendarsService";
import CalendarsList from "./CalendarsList";
import AddIcon from '@mui/icons-material/Add';
import AddCalendar from "./AddCalendar";
import "./Calendars.css";
import { useContextProvider } from "../ContextProvider";
import { getUserFromLocalStorage } from "../../store/store";

const CalendarsSideMenu = ({isOpen}) => {
    const { calendarData, calendarsList, setCalendarsList, sideMenuNeedRedraw} = useContextProvider();
    const [user, setUser] = useState(getUserFromLocalStorage());

    useEffect(() => {
        CalendarService.getAllCalendars().then((calendars_) => {
            if (calendars_.length !== 0) {
                setCalendarsList(calendars_);
            }
            else {
                // logout();
            }
        });
        setUser(getUserFromLocalStorage);
    }, [calendarData, sideMenuNeedRedraw]);

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ marginTop: "0px"}}>
            {(user) && (<AddCalendar />)}
            {calendarsList ? <CalendarsList calendars={calendarsList} /> : <Box>There is no calendars</Box>}
        </div>
    )
}
export default CalendarsSideMenu;