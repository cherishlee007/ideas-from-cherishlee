App({
  onLaunch() {
    // Load favorites from local storage
    const favorites = wx.getStorageSync('favorites') || [];
    this.globalData.favorites = favorites;
    
    // Load user info
    const userInfo = wx.getStorageSync('userInfo') || null;
    this.globalData.userInfo = userInfo;
  },
  
  globalData: {
    userInfo: null,
    favorites: []
  }
})