import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {  TextField } from "@mui/material";

interface BirthdaysProps {
  birthdays?: Array<any>;
  updateBirthdays?: Function | any;
  addFavorite?: Function | any;
  removeFavorite?: Function | any;
}

function renderRow(props: ListChildComponentProps) {
  const { index, style, data } = props;
  const value = data.data[index];
  const text = value?.text;

  const handleToggle = () => {
    data.favourite(value, index);
  };

  return (
    <ListItem
      style={style}
      component="div"
      key={index + "birthday"}
      disablePadding
      onClick={handleToggle}
    >
  
      <ListItemButton role={undefined} dense>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={value?.favorite || false}
          tabIndex={-1}
          disableRipple
          checkedIcon={<Favorite />}
          icon={<FavoriteBorder />}
        />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
      

    </ListItem>
  );
}

export default function Birthdays({
  birthdays,
  updateBirthdays,
  addFavorite,
  removeFavorite,
}: BirthdaysProps) {
  const [data, setData] = React.useState(birthdays);

  const favourite = (value: any, index: number) => {
    if (data && updateBirthdays) {
      const birthdayList = [...data];
      const selected = birthdayList[index];
      selected["favorite"] = selected.favorite ? false : true;

      if (selected.favorite) {
        ///add to favorites list as selection changes per day
        addFavorite(selected);
      } else {
        removeFavorite(selected);
      }

      updateBirthdays(birthdayList);
      //update ui with favorited birthdays
    }
  };

  ///search filter
  const searchFilter = (event: any) => {
    const inputValue = event.target.value;
    if (data ) {
      let results = [...data];
      if (inputValue && inputValue?.length > 0) {
          results = results.filter((data) =>  data?.text.toLowerCase().includes(inputValue.toLowerCase()));
          setData(results)
      }
      else{
        setData(birthdays)
      }
    }
    
  };

  return (
    <div className="w-full">
      <div className="mb-4 mt-4">
        <TextField
          fullWidth
          hiddenLabel
          variant="filled"
          onChange={searchFilter}
          placeholder="Search..."
        />
      </div>

      <FixedSizeList
        height={400}
        width="100%"
        itemSize={50}
        itemCount={data ? data.length : 0}
        overscanCount={5}
        itemData={{
          data,
          favourite,
        }}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
