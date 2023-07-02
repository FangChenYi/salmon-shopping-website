import axios from "axios";
const API_USER_URL =
  "http://localhost:8080/user" ||
  "https://salmon-shopping-website-e05c875d1abf.herokuapp.com/user";

class AuthService {
  getUser(email) {
    return axios.get(`${API_USER_URL}/${email}`);
  }

  register(username, email, password) {
    return axios.post(API_USER_URL + "/register", {
      username,
      email,
      password,
    });
  }

  login(email, password) {
    return axios.post(API_USER_URL + "/login", {
      email,
      password,
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const userJson = localStorage.getItem("user");
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new AuthService();
