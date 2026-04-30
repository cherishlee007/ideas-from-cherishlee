App({
  onLaunch() {
    // Initialize WeChat Cloud - replace with your actual env ID
    wx.cloud.init({
      env: 'cloud1-1gag4ck977a850c8',
      traceUser: true
    });

    const favorites = wx.getStorageSync('favorites') || [];
    this.globalData.favorites = favorites;

    const userInfo = wx.getStorageSync('userInfo') || null;
    this.globalData.userInfo = userInfo;
  },

  globalData: {
    userInfo: null,
    favorites: []
  }
})