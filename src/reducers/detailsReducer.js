export default (state = {}, action) => {
  switch (action.type) {
    case "STORE_DETAILS":
      return action.payload;
    default:
      return state;
  }
};
