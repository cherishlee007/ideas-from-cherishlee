// Cloud Function: importTutors
// 功能：向tutors集合导入家教种子数据（自动去重，支持清空旧数据）
// 部署方式：右键 "cloudfunctions/importTutors" > "Upload and deploy"
// 测试方式：云控制台 > 云函数 > importTutors > 测试（可传参数 { "clearOldData": true } 清空旧数据后导入）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command; // 引入数据库操作符，用于条件查询/删除

// 优化1：改为中文数据，适配中文用户场景，补充字段注释
const tutors = [
  {
    name: "张伟", // 家教姓名
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", // 头像URL
    university: "清华大学", // 毕业/就读院校
    subject: "数学", // 授课科目
    grade: "高中", // 适配年级
    availableTime: "周末、工作日晚上", // 可授课时间
    feeRange: "200-300元/小时", // 价格区间
    features: "3年教学经验，耐心细致，擅长考前冲刺", // 优势特点
    rating: 4.9, // 评分
    totalReviews: 28 // 评价总数
  },
  {
    name: "李明",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    university: "北京大学",
    subject: "物理",
    grade: "初中、高中",
    availableTime: "时间灵活",
    feeRange: "180-250元/小时",
    features: "竞赛获奖，讲解清晰，互动式教学",
    rating: 4.8,
    totalReviews: 35
  }
];

exports.main = async (event, context) => {
  const results = [];
  const { clearOldData = false } = event; // 优化2：接收外部参数，控制是否清空旧数据

  try {
    // 优化3：清空旧数据（若参数指定）
    if (clearOldData) {
      await db.collection('tutors').where({}).remove();
      console.log('已清空tutors集合的旧数据'); // 优化4：添加云端日志，便于调试
    }

    // 优化5：遍历导入，先查询是否存在同名数据（去重），避免重复导入
    for (const tutor of tutors) {
      try {
        // 先查询是否已有同名的家教数据
        const existRes = await db.collection('tutors')
          .where({ name: tutor.name })
          .get();

        if (existRes.data.length > 0) {
          // 已存在，跳过导入
          results.push({ 
            success: false, 
            name: tutor.name, 
            error: "该家教数据已存在，跳过导入" 
          });
          continue;
        }

        // 不存在，执行添加
        const addRes = await db.collection('tutors').add({ data: tutor });
        results.push({ 
          success: true, 
          id: addRes._id, 
          name: tutor.name 
        });
        console.log(`成功导入家教数据：${tutor.name}，ID：${addRes._id}`);

      } catch (err) {
        results.push({ 
          success: false, 
          name: tutor.name, 
          error: err.message 
        });
        console.error(`导入家教数据失败：${tutor.name}，错误：${err.message}`);
      }
    }

    return {
      message: '数据导入完成',
      successCount: results.filter(item => item.success).length, // 新增：统计成功数量
      failCount: results.filter(item => !item.success).length, // 新增：统计失败数量
      results
    };

  } catch (globalErr) {
    // 捕获全局异常（如清空数据失败）
    return {
      message: '数据导入过程中出现全局错误',
      error: globalErr.message,
      results
    };
  }
};