import React, { useContext } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import dayjs, { Dayjs } from "dayjs";
import { fetchBirthdays } from "../api/birthday";
import BirthdaysLoading from "./BirthdaysLoading";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import { LinearProgress } from "@mui/material";
import { store } from "../store/store";
import BirthdayTabs from "./BirthdayTabs";

function Calendar() {
  const tileSize = "45px";

  const CustomPicker = styled(CalendarPicker)(({ theme }) => ({
    "&.MuiCalendarPicker-root": {
      width: "auto",
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

  const globalState = useContext(store);
  const { dispatch, state } = globalState;


  const [selectedDate, setDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );

  const loading = state?.loading;
  const favorites = state?.favorites;



  React.useEffect(() => {
    selectDate(dayjs(new Date()));
  }, []);

  const updateBirthdays = (birthdays: Array<any>) => {
    dispatch({ type: "updateBirthdays", value: birthdays });
  };

  const selectDate = async (newDate: any) => {
    const selected = dayjs(newDate);
    if (selected) {
      setDate(newDate);
      dispatch({ type: "updateLoading", value: true });

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
            (fav: any) =>
              fav?.text === birthday?.text && fav?.month === birthday?.month
          );

          if (favExist) {
            birthday["favorite"] = true;
          } else {
            birthday["favorite"] = false;
          }
        });

        updateBirthdays(newBirthdays);
      }
      dispatch({ type: "updateLoading", value: false });
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
            <BirthdayTabs/>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
