const { tutors } = require('../../data/tutors.js');

Page({
  data: {
    tutor: null,
    isFavorited: false
  },

  onLoad(options) {
    const id = parseInt(options.id);
    const tutor = tutors.find(t => t.id === id);
    
    if (tutor) {
      this.setData({ tutor });
      this.checkFavorite(id);
    }
  },

  onShow() {
    // Refresh favorite status when returning to page
    if (this.data.tutor) {
      this.checkFavorite(this.data.tutor.id);
    }
  },

  checkFavorite(id) {
    const app = getApp();
    const isFavorited = app.globalData.favorites.includes(id);
    this.setData({ isFavorited });
  },

  toggleFavorite() {
    const app = getApp();
    const tutorId = this.data.tutor.id;
    let favorites = app.globalData.favorites;
    
    if (this.data.isFavorited) {
      // Remove from favorites
      favorites = favorites.filter(id => id !== tutorId);
      wx.showToast({
        title: 'Removed from favorites',
        icon: 'success'
      });
    } else {
      // Add to favorites
      favorites.push(tutorId);
      wx.showToast({
        title: 'Added to favorites',
        icon: 'success'
      });
    }
    
    app.globalData.favorites = favorites;
    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorited: !this.data.isFavorited });
  },

  goToConsult() {
    wx.navigateTo({
      url: '/pages/consult/consult'
    });
  }
})