import axios from "axios";
const API_SELLER_URL =
  "http://localhost:8080/seller" ||
  "https://salmon-shopping-website-e05c875d1abf.herokuapp.com/seller";

class SellerService {
  postImage(formData) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(`${API_SELLER_URL}/image`, formData, {
      headers: {
        Authorization: token,
      },
    });
  }

  getImages() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(`${API_SELLER_URL}/image`, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 取得賣家的所有商品
  getSellerAllProducts(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_SELLER_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 取得賣家的單筆商品資料
  getSellerProduct(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(`${API_SELLER_URL}/${_id}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 取得賣家所有的訂單資料
  getSellerAllOrder() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(`${API_SELLER_URL}/order`, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 新增商品
  post(photo, name, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_SELLER_URL,
      { photo, name, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 更新商品資料
  put(id, photo, name, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.put(
      `${API_SELLER_URL}/edit/${id}`,
      { photo, name, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  deleteProdutct(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(`${API_SELLER_URL}/edit/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  delete(orderID) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(`${API_SELLER_URL}/order/${orderID}`, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new SellerService();
