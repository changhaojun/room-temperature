import axios from 'axios';
import {
    Message,
    Notification
} from 'element-ui';
import convert from './convert.js'; //返回结果转为中文提示
const Axios = axios.create({
    // baseURL: 'http://121.42.253.149:18859/app/mock/31/v1/',
    // baseURL: 'http://192.168.1.78:7001/v1',
    baseURL: 'http://121.42.253.149:17748/v1/',
    timeout: 30000,
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

Axios.interceptors.request.use(
    (config) => {
        if (config.method === 'get') {
            config.params = config.data;
        }

        if (sessionStorage.actk) {
            config.headers.common.actk = sessionStorage.getItem('actk');
        }

        return config;
    },
    (error) => {
        Message({
            showClose: true,
            message: error,
            type: 'error.data.error.message',
        });
        return Promise.reject(error);
    },
);

Axios.interceptors.response.use(
    res => {
        if (!res.data.code) {
            Message({
                showClose: true,
                message: '请求超时，请重新请求',
                type: 'error'
            });
            return Promise.reject(res.data);
        } else if (res.data.code === 423) {
            res.data.message = convert(res.data.message);
            Message({
                showClose: true,
                message: '存在重复采集器',
                type: 'error'
            });
            Notification({
                title: '提示',
                message: res.data.result.rows.join(",") + "采集器重复",
                duration: 0,
                type: 'warning',
                position: 'bottom-right'
            });
            return Promise.reject(res.data);
        } else if (res.data.code === 424) {

        } else if (res.data.code === 201) {

        } else if (res.data.code !== 200) {
            res.data.message = convert(res.data.message);
            Message({
                showClose: true,
                message: res.data.errMsg ? res.data.errMsg : res.data.message,
                type: 'error'
            });
            return Promise.reject(res.data);
        }
        res.data.message = convert(res.data.message);
        return res.data;

    });
export default Axios;
