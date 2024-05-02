import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserFromLocalStorage, logout } from "../store/store"; 
import UsersService from '@/API/UserService';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [calendarId, setCalendarId] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [calendarsList, setCalendarsList] = useState([]);
  const [sideMenuNeedRedraw, setSideMenuNeedRedraw] = useState(false);
  const [userData, setUserData] = useState({ role: "Guest" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = getUserFromLocalStorage();
        if (data) {
          const token = data.token;
          if (token) {
            const response = await UsersService.WhoAmI(token);
            setUserData(response);
          }
          else {
            setUserData({ role: "Guest"});
          }
        }
      } catch (error) {
        logout();
        console.error('Ошибка при получении данных о пользователе:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <Context.Provider value={
      {
        calendarId, setCalendarId,
        calendarData, setCalendarData,
        calendarsList, setCalendarsList,
        sideMenuNeedRedraw, setSideMenuNeedRedraw,
        userData, setUserData
      }
    }>
      {children}
    </Context.Provider>
  );
};

export const useContextProvider = () => useContext(Context);