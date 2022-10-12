import { states } from "./initialState";
import * as CONST from "./constants";

const reducers = (state = states, action) => {
  const { type, payload } = action;
  switch (type) {
    case CONST.SET_AUTH:
      return {
        ...state,
        access_token: payload.access_token,
        username: payload.username,
      };
    case CONST.CLEAR_AUTH:
      return {
        ...state,
        access_token: "",
        username: "",
      };
    case CONST.SET_CARTITEMS:
      return {
        ...state,
        cartItems: [...payload.cartItems],
      };
    case CONST.SET_ORDERITEMS:
      return {
        ...state,
        orderItems: [...payload.orderItems],
      };
    default:
      return state;
  }
};

export default reducers;
