import axios from "axios";

const api = axios.create({
  //customizing the axios
  baseURL: "http://localhost:8000", //adding common baseurl
});

const token = "ahgsguahs";

api.interceptors.request.use(
  //using interceptor to tap something before req or res
  (config) => {
    config.headers["AuthToken"] = "Token" + token; //adding a header in req
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      //performing repitative error response here which was in main code
      // error came from server
      err.message = `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`;
    }

    return Promise.reject(err);
  }
);

export default api;
