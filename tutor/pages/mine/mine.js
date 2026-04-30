Page({
  data: {
    userInfo: null,
    favoriteTutors: []
  },

  onShow() {
    this.loadUserInfo();
    this.loadFavorites();
  },

  loadUserInfo() {
    const app = getApp();
    this.setData({ userInfo: app.globalData.userInfo });
  },

  handleLogin(e) {
    wx.getUserProfile({
      desc: 'Login to save favorites',
      success: (res) => {
        const userInfo = res.userInfo;
        const app = getApp();
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({ userInfo });
        wx.showToast({ title: 'Login successful', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: 'Login cancelled', icon: 'none' });
      }
    });
  },

  loadFavorites() {
    const app = getApp();
    const favoriteIds = app.globalData.favorites;

    if (favoriteIds.length === 0) {
      this.setData({ favoriteTutors: [] });
      return;
    }

    const db = wx.cloud.database();

    // Fetch all tutors, then filter by saved favorite IDs
    db.collection('tutors').get({
      success: (res) => {
        const favoriteTutors = res.data.filter(t => favoriteIds.includes(t._id));
        this.setData({ favoriteTutors });
      },
      fail: (err) => {
        console.error('Failed to load favorites:', err);
      }
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  goToConsult() {
    wx.navigateTo({ url: '/pages/consult/consult' });
  }
})