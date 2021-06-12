import { combineReducers } from "redux";
import detailsReducer from "./detailsReducer";
import removeReducer from "./removeReducer";

export default combineReducers({
  detailsReducer,
  removeReducer,
});
