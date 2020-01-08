

// 封装一个axios

import axios from "axios";

export function request(config) {
  // 创建一个axios实例
  const instance = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1",
    timeout: 5000
  });
  // axios拦截器
  // 请求拦截的作用
  instance.interceptors.request.use(
    config => {
      return config;
      // 1.比如config种的一些信息不符合服务器的要求

      // 2.比如每次发送请求时，都希望在界面中显示一个请求的图标

      // 3.某些网络请求(比如登录(token))，必须携带一些特殊的信息
    },
    err => {
      console.log(err);
    }
  );
  // 响应式的请求
  instance.interceptors.response.use(
    res => {
      return res.data;
      //这个是直接拿里面的数据结果进行拦截就行了
    },
    err => {
      console.log(err);
    }
  );
  // 发送真正的网络请求
  return instance(config); // 返回的就是一个promise
  // 为什么可以这样子: create函数里面内部返回的就是promise函数
  // 可以直接在外面使用.then函数进行数据的获取
}
