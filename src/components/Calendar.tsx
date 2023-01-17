import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import dayjs, { Dayjs } from "dayjs";
import { fetchBirthdays } from "../api/birthday";
import Birthdays from "./Birthdays";
import BirthdaysLoading from "./BirthdaysLoading";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Favorites from "./Favorites";

function Calendar() {
  const tileSize = "50px";

  const CustomPicker = styled(CalendarPicker)(({ theme }) => ({
    "&.MuiCalendarPicker-root": {
      width: 'auto',
      maxHeight: "400px",
      height: "400px",
    },
    "& .MuiCalendarPicker-viewTransitionContainer": {
      "& .css-sf5t6v-PrivatePickersSlideTransition-root-MuiDayPicker-slideTransition":
        {
          height: "auto",
        },
      "& .MuiDayPicker-header": {
        "& .MuiDayPicker-weekDayLabel": {
          height: tileSize,
          width: tileSize,
          color: "#000",
        },
      },
    },
    "& .MuiDayPicker-weekContainer": {
      "& .MuiPickersDay-root": {
        height: tileSize,
        width: tileSize,
      },
    },
  }));

  const [selectedDate, setDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [loading, setLoading] = React.useState(false);
  const [favorites, setFavorites] = React.useState<Array<any>>([]);
  const [birthdays, setBirthdays] = React.useState<Array<any>>([]);

  const [currentTab, setTab] = React.useState("birthdays");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  React.useEffect(() => {
    selectDate(dayjs(new Date()));
  }, []);

  ///keep track of selected favourites for each day
  const addFavorite = (birthday: any) => {
    const favs = [...favorites];

    favs.push(birthday);
    setFavorites(favs);
  };

  const removeFavorite = (birthday: any) => {
    const favs = [...favorites];
    const index = favs.indexOf(birthday);

   favs.splice(index, 1);

   setFavorites(favs);
  };

  const updateBirthdays = (birthdays:Array<any>)=>{
    setBirthdays(birthdays);
  }


  const updateFavorites = (birthdays:Array<any>)=>{
    setFavorites(birthdays);
  }

  const selectDate = async (newDate: any) => {
    const selected = dayjs(newDate);
    if (selected) {
      setDate(newDate);
      setLoading(true);
      const month = selected.month() + 1;
      const date = selected.date();

      const birthdays = await fetchBirthdays(month, date);

      if (birthdays && birthdays?.length > 0) {
        const newBirthdays = [...birthdays];
        newBirthdays.forEach((birthday) => {
          /// correct previous fav state
          birthday["date"] = selected.format("MMMM") + " " + date;
          birthday["favorite"] = true;

          ///check if already favorited
          const favExist = favorites.find(
            (fav) =>
              fav?.text === birthday?.text && fav?.month === birthday?.month
          );

          if (favExist) {
            birthday["favorite"] = true;
          } else {
            birthday["favorite"] = false;
          }
        });

        setBirthdays(newBirthdays);
      }
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className=" text-3xl mb-4 font-bold ">Birthday Calendar</p>
          <p className=" text-xl mb-4 font-normal ">
            Select a date to view birthdays
          </p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CustomPicker
              date={selectedDate}
              onChange={selectDate}
              loading={loading}
              renderLoading={() => (
                <Box sx={{ textAlign: "center" }}>
                  <LinearProgress />
                  <p className="text-lg mt-4 mb-4 ">Loading Birthdays...</p>
                </Box>
              )}
            />
          </LocalizationProvider>
        </div>
        <div>
          {loading ? (
            <BirthdaysLoading />
          ) : (
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
                      <Birthdays
                        birthdays={birthdays}
                        updateBirthdays={updateBirthdays}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                      />
                    )}
                  </TabPanel>
                  <TabPanel value="favorites" sx={{ padding: 0 }}>
                    <Favorites
                      favorites={favorites}
                      addFavorite={addFavorite}
                      removeFavorite={removeFavorite}
                      updateBirthdays={updateBirthdays}
                      birthdays={birthdays}
                    />
                  </TabPanel>
                </TabContext>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
