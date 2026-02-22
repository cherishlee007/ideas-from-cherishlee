const { tutors } = require('../../data/tutors.js');

Page({
  data: {
    leftColumn: [],
    rightColumn: []
  },

  onLoad() {
    this.loadTutors();
  },

  loadTutors() {
    const leftColumn = [];
    const rightColumn = [];
    
    tutors.forEach((tutor, index) => {
      if (index % 2 === 0) {
        leftColumn.push(tutor);
      } else {
        rightColumn.push(tutor);
      }
    });
    
    this.setData({
      leftColumn,
      rightColumn
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
})