Page({
  data: {
    leftColumn: [],
    rightColumn: [],
    loading: false
  },

  onLoad() {
    this.loadTutors();
  },

  loadTutors() {
    this.setData({ loading: true });
    const db = wx.cloud.database();

    db.collection('tutors').get({
      success: (res) => {
        const tutors = res.data;
        const leftColumn = [];
        const rightColumn = [];

        tutors.forEach((tutor, index) => {
          if (index % 2 === 0) {
            leftColumn.push(tutor);
          } else {
            rightColumn.push(tutor);
          }
        });

        this.setData({ leftColumn, rightColumn, loading: false });
      },
      fail: (err) => {
        console.error('Failed to load tutors:', err);
        this.setData({ loading: false });
        wx.showToast({ title: 'Load failed', icon: 'none' });
      }
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
})