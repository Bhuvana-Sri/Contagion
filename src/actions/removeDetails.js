export const removeDetails = (details) => (dispatch) => {
  dispatch({
    type: "REMOVE_DETAILS",
    payload: details,
  });
};
