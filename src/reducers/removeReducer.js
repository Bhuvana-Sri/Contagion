export default (state = {}, action) => {
  switch (action.type) {
    case "REMOVE_DETAILS":
      return action.payload;
    default:
      return state;
  }
};
