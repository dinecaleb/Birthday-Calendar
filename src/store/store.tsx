import dayjs from "dayjs";
import moment from "moment";
import React, { createContext, useReducer } from "react";

const initialState: any = {
  birthdays: [],
  favorites: [],
  loading: false,
  selectedDate: dayjs(new Date()),
};
const store = createContext(initialState);
const { Provider } = store;

interface StateProviderProps {
  children: any;
}
const StateProvider = ({ children }: StateProviderProps) => {
  let newState = { ...initialState };
  const [state, dispatch] = useReducer((state: any, action: any) => {
    newState = { ...state };
    switch (action.type) {
      case "addFavorite":
        let addFavs = [...state?.favorites];
        addFavs.push(action.value);


        ///SORT BY DATE
        addFavs = addFavs.sort((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1))


        newState["favorites"] = addFavs;
        return newState;
      case "removeFavorite":
        let removeFavs = [...state?.favorites];

        const favExist = removeFavs.find(
          (fav: any) =>
            fav?.text === action.value?.text &&
            fav?.month === action.value?.month
        );

        if (favExist) {
          const index = removeFavs.indexOf(favExist);
          removeFavs.splice(index, 1);
        }
        newState["favorites"] = removeFavs;
        return newState;
      case "updateBirthdays":
        newState["birthdays"] = action.value;
        return newState;
      case "updateFavorites":
        newState["favorites"] = action.value;
        return newState;
      case "updateLoading":
        newState["loading"] = action.value;
        return newState;
      default:
        throw new Error();
    }
  }, newState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
