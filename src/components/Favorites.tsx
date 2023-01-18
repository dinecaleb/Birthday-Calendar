import React, { useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import _ from "lodash";
import { List, ListSubheader } from "@mui/material";
import { store } from "../store/store";
import dayjs from "dayjs";

interface FavoritesProps {
  updateBirthdays?: Function | any;
  favorites?: Array<any>;

}

export default function Favorites() {

  const globalState = useContext(store);
  const {  state,dispatch } = globalState;
  const favorites = state?.favorites;


  const addFavorite = (birthday: any) => {
    dispatch({ type: 'addFavorite',value:birthday })
  };

  const removeFavorite = (birthday: any) => {
    dispatch({ type: 'removeFavorite',value:birthday })
  };

  const favs = _.groupBy(favorites, (birthday) => birthday.date); ///group by birthday


  const favourite = (value: any, index: number) => {
    if (favorites) {
      const birthdayList = [...favorites];
      const selected = birthdayList.find((fav)=> fav?.text === value?.text);

      if(selected){
        selected["favorite"] = selected.favorite ? false : true;

      }
      
      if (selected.favorite) {
        ///add to favorites list as selection changes per day
        addFavorite(selected);
      } else {
        removeFavorite(selected);
      }

    }
  };

  const handleToggle = (value: any, index: number) => {
    favourite(value, index);
  };

  return (
    <div className="w-full overflow-auto max-h-[500px]">
      {favs && Object.keys(favs).length > 0 ? (
        <List>
          {Object.keys(favs).map((key, index) => {
            const favouritesByDate = favs[key];
            const date =  dayjs(key);
            const subheaderDate = date.format("MMMM") + " " + date.date();
            return (
              <React.Fragment key={index + "favouriteDate"}>
                <ListSubheader>{subheaderDate}</ListSubheader>
                {favouritesByDate &&
                  favouritesByDate.map((value,favIndex) => {
                    return (
                      <ListItem
                        component="div"
                        key={favIndex + "favourites"}
                        disablePadding
                        onClick={() => handleToggle(value, index)}
                      >
                        <ListItemButton role={undefined} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={value?.favorite || false}
                              disableRipple
                              checkedIcon={<Favorite />}
                              icon={<FavoriteBorder />}
                            />
                          </ListItemIcon>
                          <ListItemText primary={value?.text} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
              
              </React.Fragment>
            );
          })}
        </List>
      ):
      <p className="text-lg mt-4 mb-4 ">You have no favorites at the moment. Select some favorites!</p>
      }
    </div>
  );
}
