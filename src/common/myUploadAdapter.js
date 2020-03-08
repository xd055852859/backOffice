import * as qiniu from 'qiniu-js';
export default class MyUploadAdapter {
  constructor(loader, domain, uptoken) {
    this.loader = loader;
    this.domain = domain;
    this.uptoken = uptoken;
  }
  upload() {
    let loader = this.loader;
    let uptoken = this.uptoken;
    let domain = this.domain;
    return new Promise((resolve, reject) => {
      let putExtra = {
        // 文件原文件名
        fname: "",
        // 自定义变量
        params: {},
        // 限制上传文件类型
        mimeType: ["image/png", "image/jpeg"],
      };
      let config = {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 5,
        region: qiniu.region.z0
      };
      let observer = {
        next(res) {},
        error(err) {
          console.log(err);
        },
        complete(res) {
          console.log("进来了", domain + res.key)
          resolve({
            default: domain + res.key
          });
        }
      }
      // 上传
      let file = loader.file;
      console.log("zzzz", loader);
      // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "xx"}
      Promise.resolve(file).then(function (result) {
        console.log("file", result);
        let observable = qiniu.upload(result, new Date().getTime() + "_backOffice", uptoken, putExtra, config);
        // 上传开始
        observable.subscribe(observer);
      })

    });
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}
