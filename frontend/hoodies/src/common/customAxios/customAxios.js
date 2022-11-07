import axios from "axios";
import { API_URL } from "../api/url";
import Swal from "sweetalert2";

const axios1 = axios.create({
  baseUrl: "",
});
let isTokenRefreshing = false;
let refreshSubscribers = [];
let newAccessToken = "";

const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.map((callback) => callback(accessToken));
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axios1.interceptors.response.use(
  (response) => {
    // const nowTime = moment(new Date()).format()
    // const loginDate = localStorage.getItem('expireDate')
    // console.log(moment.duration((nowTime).diff(loginDate).asMilliseconds()))
    return response;
  },
  async (error) => {
    const {
      config,
      response: { data },
    } = error;
    console.log(config, data);
    console.log(error);
    const code = data.status;
    const originalRequest = config;

    if (code === 403) {
      // if (error.response.data.message === "") {
      if (!isTokenRefreshing) {
        isTokenRefreshing = true;
        console.log("reissue 전");
        const token = localStorage.getItem("token");
        axios
          .get(API_URL + "user/reissue", { withCredentials: true })
          .then((response) => {
            console.log("reissue 정상");
            localStorage.setItem("token", response.data.accessToken);
            newAccessToken = response.data.accessToken;
            isTokenRefreshing = false;
            originalRequest.headers = {
              ...originalRequest.headers,
              accessToken: newAccessToken,
            };
            // return axios(originalRequest)
            onTokenRefreshed(newAccessToken);
          })
          .catch((err) => {
            console.log("reissue 마무리");
            Swal.fire({
              title: '세션이 만료되었습니다',
              icon: "warning"
            });
            localStorage.clear();
            window.location.href = "/login";
          });
      }
      const retryOriginalRequest = new Promise((resolve) => {
        addRefreshSubscriber((accessToken) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            accessToken: accessToken,
          };
          resolve(axios(originalRequest));
        });
      });
      return retryOriginalRequest;
      // }
    }
    return Promise.reject(error);
  }
);

export default axios1;
