

import React, { useContext } from "react";
import Birthdays from "./Birthdays";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Favorites from "./Favorites";
import { store } from "../store/store";
import Box from "@mui/material/Box";


export default function BirthdayTabs() {
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const favorites = state?.favorites;
  const birthdays = state?.birthdays;

  const [currentTab, setTab] = React.useState("birthdays");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };




  return (
    <React.Fragment>
              {(birthdays?.length > 0 || favorites?.length > 0) && (
                <TabContext value={currentTab}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange}>
                      <Tab label="Birthdays" value="birthdays" />
                      <Tab label="Favorites" value="favorites" />
                    </TabList>
                  </Box>
                  <TabPanel value="birthdays" sx={{ padding: 0 }}>
                    {birthdays?.length > 0 && (
                      <Birthdays birthdays={birthdays} />
                    )}
                  </TabPanel>
                  <TabPanel value="favorites" sx={{ padding: 0 }}>
                    <Favorites favorites={favorites} birthdays={birthdays} />
                  </TabPanel>
                </TabContext>
              )}
            </React.Fragment>
  );
}
