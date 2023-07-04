import axios from "axios";
const API_CART_URL =
  // "http://localhost:8080/user/cart";
  "https://salmon-shopping-website-e05c875d1abf.herokuapp.com/user/cart";

class CartService {
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_CART_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

  post(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      `${API_CART_URL}/${_id}`,
      {}, //POST、PUT、PATCH 就算沒有要傳遞的數據，仍然需要使用 {} 作為請求主體的內容
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  patch(_id, newQuantity, newTotalAmount) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      `${API_CART_URL}/${_id}`,
      { productQuantity: newQuantity, productTotalAmount: newTotalAmount },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  delete(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(`${API_CART_URL}/${_id}`, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new CartService();
