// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 自动匹配当前环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 接收前端传的pdfFileID
    const { pdfFileID } = event;
    // 云函数用管理员权限获取临时链接
    const res = await cloud.getTempFileURL({
      fileList: [pdfFileID]
    });
    return {
      success: true,
      tempUrl: res.fileList[0].tempFileURL
    };
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    };
  }
};