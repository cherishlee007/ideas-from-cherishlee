Page({
  data: {
    tutor: null,
    isFavorited: false
  },

  onLoad(options) {
    const id = options.id;
    const db = wx.cloud.database();

    db.collection('tutors').doc(id).get({
      success: (res) => {
        this.setData({ tutor: res.data });
        this.checkFavorite(id);
      },
      fail: (err) => {
        console.error('Failed to load tutor:', err);
        wx.showToast({ title: 'Load failed', icon: 'none' });
      }
    });
  },

  onShow() {
    if (this.data.tutor) {
      this.checkFavorite(this.data.tutor._id);
    }
  },

  checkFavorite(id) {
    const app = getApp();
    const isFavorited = app.globalData.favorites.includes(id);
    this.setData({ isFavorited });
  },

  toggleFavorite() {
    const app = getApp();
    const tutorId = this.data.tutor._id;
    let favorites = app.globalData.favorites;

    if (this.data.isFavorited) {
      favorites = favorites.filter(id => id !== tutorId);
      wx.showToast({ title: 'Removed from favorites', icon: 'success' });
    } else {
      favorites.push(tutorId);
      wx.showToast({ title: 'Added to favorites', icon: 'success' });
    }

    app.globalData.favorites = favorites;
    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorited: !this.data.isFavorited });
  },

  goToConsult() {
    wx.navigateTo({ url: '/pages/consult/consult' });
  },

  async viewPdf() {
  const { pdfFileID } = this.data.tutor;
  console.log('获取的pdfFileID：', pdfFileID); // 检查是否拿到正确的fileID
  
  if (!pdfFileID) {
    wx.showToast({ title: '暂无PDF资料', icon: 'none' });
    return;
  }

  wx.showLoading({ title: '加载中...' });
  try {
    const cloudRes = await wx.cloud.callFunction({
      name: 'getPdfUrl', // 确认云函数名和部署的一致
      data: { pdfFileID }
    });
    console.log('云函数返回结果：', cloudRes); // 检查云函数是否返回数据

    if (!cloudRes.result.success) {
      wx.showToast({ title: 'PDF加载失败', icon: 'none' });
      return;
    }

    console.log('PDF临时链接：', cloudRes.result.tempUrl); // 检查临时链接是否生成
    await wx.openDocument({
      filePath: cloudRes.result.tempUrl,
      fileType: 'pdf',
      success: () => {
        console.log('PDF打开成功');
      },
      fail: (err) => {
        console.log('打开PDF失败：', err); // 检查打开环节的错误
      }
    });
  } catch (err) {
    console.log('调用云函数失败：', err); // 检查云函数调用环节的错误
    wx.showToast({ title: '出错了', icon: 'none' });
  } finally {
    wx.hideLoading();
  }
}
  
  
})
