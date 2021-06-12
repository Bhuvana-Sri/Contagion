export const storeDetails = (details) => (dispatch) => {
  dispatch({
    type: "STORE_DETAILS",
    payload: details,
  });
};
