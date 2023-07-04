import axios from "axios";
const API_ORDER_URL =
  // "http://localhost:8080/user/order";
  "https://salmon-shopping-website-e05c875d1abf.herokuapp.com/user/order";

class OrderService {
  get() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(`${API_ORDER_URL}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  post(sellerID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      `${API_ORDER_URL}/${sellerID}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new OrderService();
