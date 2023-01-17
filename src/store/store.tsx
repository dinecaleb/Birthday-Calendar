import dayjs from "dayjs";
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
    let newState = {...initialState};
  const [state, dispatch] = useReducer((state: any, action: any) => {
     newState = { ...state };
    switch (action.type) {
      case "addFavorite":
        let addFavs = [...state?.favorites];
        addFavs.push(action.value);
        newState["favorites"] = addFavs;
        return newState;
      case "removeFavorite":
        let removeFavs = [...state?.favorites];
        const index = removeFavs.indexOf(action.value);

        removeFavs.splice(index, 1);
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
