if (localStorage.getItem('food.auth') === '1' && !location.pathname.endsWith('/onboarding.html')) {
  const onboardingUser = localStorage.getItem('food.currentUser');
  const onboardingKey = onboardingUser ? 'food.user.' + encodeURIComponent(onboardingUser) + '.onboardingComplete' : '';
  let onboardingState = onboardingKey ? localStorage.getItem(onboardingKey) : '';
  let onboardingProfile = null;
  try { onboardingProfile = onboardingUser ? JSON.parse(localStorage.getItem('food.user.' + encodeURIComponent(onboardingUser) + '.profile') || 'null') : null; } catch {}
  const hasCompletedProfile = Boolean(onboardingProfile && onboardingProfile.name && ['男', '女'].includes(onboardingProfile.gender) && Number(onboardingProfile.age) > 0 && Number(onboardingProfile.height) > 0 && Number(onboardingProfile.weight) > 0 && onboardingProfile.goal && onboardingProfile.activity);
  if (onboardingKey && onboardingState === null) {
    onboardingState = hasCompletedProfile ? '2' : '0';
    localStorage.setItem(onboardingKey, onboardingState);
  }
  if (onboardingState === '1') {
    if (hasCompletedProfile) {
      onboardingState = '2';
      localStorage.setItem(onboardingKey, onboardingState);
    }
  }
  const onProfilePage = location.pathname.endsWith('/profile.html');
  if (onboardingState === '0') location.replace('onboarding.html');
  if (onboardingState === '1' && !onProfilePage) location.replace('profile.html?setup=1');
}

const FOOD_APP = {
  defaults: {
    profile: { name: '', gender: '', age: '', height: '', weight: '', bodyFat: '', goal: '', activity: '' },
    water: { total: 0, target: 2000, cupSize: 200, cupType: '玻璃杯', date: '' },
    plan: [],
    exercises: [],
    workoutPlan: [],
    workoutHistory: [],
    ingredientLogs: {},
    ingredientLogDate: '',
    mealCheckins: {},
    nutritionHistory: [],
    assistantHistory: [],
    checkin: '',
    checkinQuoteIndex: null
  },
  recipes: [
    { id:'oat-milk-egg', meal:'早餐', name:'燕麦牛奶鸡蛋早餐', calories:438, grams:390, protein:23, carbs:55, time:12, fit:'通勤早餐、需要稳定饱腹感', tags:['高纤维','易准备'], image:'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80', ingredients:['即食燕麦 45 g','低脂牛奶 250 ml','鸡蛋 1 个','香蕉 60 g'], steps:['鸡蛋放入冷水锅，水开后转中火煮 8 分钟，捞出浸冷水备用。','燕麦倒入小锅，加入牛奶后用中小火加热，期间持续搅拌防止粘底。','煮约 4 分钟，看到燕麦变软、牛奶略微浓稠时关火。','香蕉切片铺在燕麦上，不额外加糖；需要甜味可用熟香蕉压泥拌入。','鸡蛋去壳对半切开，与燕麦一起食用。牛奶冒小泡即可，不要长时间沸腾。'] },
    { id:'egg-toast-milk', meal:'早餐', name:'鸡蛋全麦吐司配牛奶', calories:410, grams:360, protein:25, carbs:42, time:10, fit:'学生、上班族的快速早餐', tags:['日常食材','高蛋白'], image:'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80', ingredients:['全麦吐司 2 片','鸡蛋 2 个','低脂牛奶 200 ml','番茄 80 g'], steps:['番茄洗净切片，鸡蛋打入碗中，加一汤匙清水搅匀。','不粘锅小火预热，刷约 2 g 食用油，倒入蛋液。','待底部凝固后从边缘向中间推拢，蛋液刚完全凝固时关火，避免炒老。','吐司用烤箱或平底锅烘 2 至 3 分钟，表面微脆即可。','将鸡蛋与番茄夹入吐司，牛奶温热至不烫口，一起食用。'] },
    { id:'tomato-egg-noodles', meal:'午餐', name:'番茄鸡蛋面', calories:520, grams:480, protein:24, carbs:72, time:20, fit:'快速午餐、运动后的均衡正餐', tags:['一锅完成','家常'], image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', ingredients:['鲜面条 120 g','鸡蛋 2 个','番茄 200 g','青菜 100 g','食用油 5 g'], steps:['番茄顶部划十字，用热水烫 30 秒后去皮切块；青菜洗净沥水。','鸡蛋打散。不粘锅中火加 3 g 油，倒入蛋液炒至八成熟，盛出备用。','原锅加剩余油和番茄，中火翻炒 3 至 4 分钟，压出汤汁。','加入 450 ml 热水煮开，放入面条并用筷子拨散，按包装时间煮至无硬芯。','放入青菜和炒蛋再煮 1 分钟，加少量盐与白胡椒调味。','先尝汤再补盐，面条能轻松夹断且中心无白点即可出锅。'] },
    { id:'broccoli-chicken-rice', meal:'午餐', name:'西兰花鸡胸肉米饭', calories:575, grams:500, protein:46, carbs:64, time:28, fit:'减脂期、力量训练日', tags:['高蛋白','少油'], image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', ingredients:['鸡胸肉 160 g','米饭 150 g','西兰花 180 g','食用油 5 g','生抽 5 ml'], steps:['鸡胸肉横切成约 1 cm 厚片，用生抽、黑胡椒和一汤匙清水抓匀，腌 10 分钟。','西兰花切小朵，在淡盐水中浸泡后冲净；沸水焯 90 秒，捞出沥干。','不粘锅中火预热，刷油后铺入鸡胸肉，保持单层不要堆叠。','第一面煎约 3 分钟，边缘变白后翻面，再煎 2 至 3 分钟。','取最厚一片切开，中心完全变白且仍有汁水即熟；静置 2 分钟后切条。','米饭、西兰花和鸡胸肉分区装盘，可淋少量锅中原汁，不再额外加油。'] },
    { id:'tomato-egg-rice', meal:'午餐', name:'番茄炒蛋配米饭', calories:560, grams:500, protein:24, carbs:70, time:18, fit:'家庭午餐、食欲较差时', tags:['家常','酸甜开胃'], image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', ingredients:['番茄 250 g','鸡蛋 2 个','米饭 150 g','青菜 100 g','食用油 6 g'], steps:['番茄去蒂切成小块；鸡蛋打散，加入一汤匙清水使口感更嫩。','锅中加一半油，中火烧热后倒入蛋液，快速推炒至八成熟后盛出。','原锅放剩余油和番茄，加两汤匙水，中火炒至番茄软化出汁。','倒回鸡蛋，轻轻翻匀 30 秒，用少量盐调味后立即关火。','青菜用沸水焯 1 分钟，捞出沥水。','米饭控制在一小碗，与番茄炒蛋和青菜一起装盘，汤汁浸到米饭即可。'] },
    { id:'beef-potato-greens', meal:'晚餐', name:'土豆炖牛肉配青菜', calories:610, grams:560, protein:42, carbs:58, time:55, fit:'周末备餐、需要补充铁元素', tags:['家常炖菜','饱腹'], image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80', ingredients:['牛腱肉 160 g','土豆 180 g','胡萝卜 80 g','青菜 120 g','生抽 8 ml'], steps:['牛肉切 2.5 cm 方块，冷水下锅；水开后撇去浮沫，捞出冲净。','土豆和胡萝卜去皮切滚刀块，土豆先泡清水防止变色。','锅中放牛肉、姜片和 700 ml 热水，大火煮开后转小火加盖炖 30 分钟。','加入胡萝卜、土豆和生抽，继续小火炖 15 至 20 分钟。','用筷子能轻松插入牛肉和土豆时，开盖中火收汁 2 分钟；最后尝味再决定是否加盐。','青菜另用沸水焯熟，与炖牛肉分开装盘，避免吸入过多汤汁和油脂。'] },
    { id:'shrimp-mushroom-tofu-soup', meal:'晚餐', name:'虾仁菌菇豆腐汤', calories:385, grams:520, protein:38, carbs:24, time:22, fit:'晚间轻食、控脂期', tags:['低脂','少盐'], image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', ingredients:['虾仁 120 g','嫩豆腐 150 g','菌菇 150 g','青菜 100 g','食用油 3 g'], steps:['虾仁去虾线后擦干，加白胡椒抓匀；豆腐切 2 cm 块，菌菇去根撕开。','锅中小火加油，放菌菇翻炒约 2 分钟，闻到香味且菌菇略出水。','加入 500 ml 热水，大火煮开后转中火，放豆腐煮 3 分钟。','放入虾仁，保持汤面微沸，煮 2 至 3 分钟至虾仁弯曲变粉。','加入青菜再煮 1 分钟，少量盐和白胡椒调味。','虾仁完全不透明即可关火，避免久煮使口感变硬。'] },
    { id:'tomato-tofu-greens', meal:'晚餐', name:'番茄豆腐青菜煲', calories:360, grams:520, protein:24, carbs:32, time:25, fit:'清淡晚餐、素食搭配', tags:['植物蛋白','一锅完成'], image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', ingredients:['北豆腐 200 g','番茄 220 g','青菜 150 g','菌菇 100 g','生抽 5 ml'], steps:['北豆腐切成 2 cm 厚块，用厨房纸吸去表面水分；番茄切小块。','砂锅或深锅刷少量油，中小火把豆腐两面各煎约 2 分钟，定型后盛出。','原锅放番茄，中火炒至软烂出汁，再加入菌菇翻炒 1 分钟。','加 300 ml 热水和生抽，放回豆腐，小火加盖煮 8 分钟。','加入青菜，开盖煮 1 至 2 分钟至菜叶变软。','轻轻晃锅混合，尝味后再少量补盐，保留适量汤汁即可。'] },
    { id:'pepper-pork-rice', meal:'午餐', name:'青椒肉丝配米饭', calories:590, grams:500, protein:36, carbs:68, time:25, fit:'家庭午餐、均衡正餐', tags:['家常','优质蛋白'], image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', ingredients:['猪里脊 140 g','青椒 150 g','米饭 150 g','食用油 6 g','生抽 6 ml'], steps:['里脊逆纹切细丝，加生抽、一汤匙清水和少量淀粉抓匀，腌 10 分钟。','青椒去籽切丝，锅中不放油先中火煸 1 分钟，盛出备用。','锅内加油，中火烧至温热，放肉丝快速划散。','肉丝表面全部变白后继续翻炒约 1 分钟，倒入青椒。','大火翻炒 30 至 45 秒，尝味后少量补盐，肉丝完全熟透即可关火。','搭配一小碗米饭，盘中再补一份凉拌或焯水蔬菜更均衡。'] },
    { id:'egg-vegetable-fried-rice', meal:'午餐', name:'鸡蛋蔬菜炒饭', calories:535, grams:430, protein:22, carbs:70, time:16, fit:'处理剩饭、快速工作餐', tags:['快手','蔬菜丰富'], image:'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80', ingredients:['米饭 180 g','鸡蛋 2 个','杂蔬 180 g','食用油 5 g','生抽 5 ml'], steps:['冷米饭提前打散；胡萝卜、青豆等杂蔬切成相近大小，较硬的蔬菜先焯 1 分钟。','鸡蛋打散，锅中加一半油，中火炒至七成熟后盛出。','原锅加剩余油，放杂蔬中火翻炒 2 至 3 分钟。','倒入米饭，用锅铲压散后转大火快速翻炒，让米粒均匀受热。','加入鸡蛋和生抽翻匀 1 分钟，米粒松散、锅中无明显水汽时关火。','起锅前尝味，不另外加入火腿肠等高盐加工肉。'] },
    { id:'seaweed-egg-corn', meal:'晚餐', name:'紫菜蛋花汤配玉米', calories:405, grams:540, protein:23, carbs:55, time:18, fit:'清淡晚餐、恢复日', tags:['少油','易消化'], image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', ingredients:['鸡蛋 2 个','紫菜 5 g','玉米 180 g','嫩豆腐 100 g','青菜 80 g'], steps:['玉米洗净切段，冷水入锅，水开后转中火煮 12 至 15 分钟。','另取汤锅加入 450 ml 清水，放豆腐小火煮 3 分钟。','鸡蛋充分打散；汤保持微沸时用筷子沿锅边缓慢淋入蛋液。','等待 10 秒再轻推蛋花，加入撕碎的紫菜和青菜。','再煮 1 分钟，滴少量香油并用少量盐调味。','玉米能被筷子轻松戳入即熟，与汤一起食用，作为本餐主食。'] },
    { id:'avocado-egg-toast', meal:'早餐', name:'牛油果鸡蛋全麦吐司', calories:420, grams:330, protein:21, carbs:40, time:15, fit:'需要较强饱腹感的早餐', tags:['优质脂肪','高纤维'], image:'avocado-toast-reference.jpg', ingredients:['全麦吐司 2 片','牛油果 70 g','鸡蛋 1 个','番茄 80 g','低脂牛奶 150 ml'], steps:['鸡蛋放入沸水中煮 8 分钟，捞出浸冷水后去壳切片。','牛油果切开去核，取果肉压成粗泥，挤少量柠檬汁防止氧化。','吐司用烤箱 180°C 烤 3 至 4 分钟，或用干锅小火烘至表面微脆。','把牛油果泥均匀抹在吐司上，铺鸡蛋片和番茄片。','撒黑胡椒即可，不额外加沙拉酱；搭配温牛奶完成一餐。'] }
  ],
  workouts: [
    { id:'bench', name:'杠铃卧推', group:'男生', icon:'weight', minutes:25, met:6.0, focus:'胸部与上肢力量', level:'进阶' },
    { id:'pullup', name:'引体向上', group:'男生', icon:'arrow-up-to-line', minutes:15, met:8.0, focus:'背部与握力', level:'进阶' },
    { id:'deadlift', name:'硬拉训练', group:'男生', icon:'bar-chart-3', minutes:25, met:6.0, focus:'后链与核心力量', level:'进阶' },
    { id:'pushup', name:'俯卧撑组合', group:'男生', icon:'move-horizontal', minutes:15, met:8.0, focus:'胸肩与核心', level:'基础' },
    { id:'pilates-core', name:'普拉提核心', group:'女生', icon:'sparkles', minutes:20, met:3.5, focus:'核心稳定与体态', level:'基础' },
    { id:'abs', name:'马甲线训练', group:'女生', icon:'activity', minutes:18, met:5.0, focus:'腹部与腰线塑形', level:'进阶' },
    { id:'glute', name:'臀腿塑形', group:'女生', icon:'move-up-right', minutes:22, met:5.5, focus:'臀腿激活与塑形', level:'基础' },
    { id:'yoga-flow', name:'瑜伽流动', group:'女生', icon:'flower-2', minutes:25, met:3.0, focus:'柔韧与身体线条', level:'舒缓' },
    { id:'rope', name:'跳绳燃脂', group:'通用', icon:'waves', minutes:15, met:11.0, focus:'心肺与全身燃脂', level:'进阶' },
    { id:'dumbbell', name:'哑铃循环', group:'通用', icon:'dumbbell', minutes:20, met:6.0, focus:'全身力量与塑形', level:'基础' },
    { id:'run', name:'户外慢跑', group:'通用', icon:'footprints', minutes:30, met:7.0, focus:'心肺耐力', level:'基础' },
    { id:'stretch', name:'全身拉伸', group:'通用', icon:'accessibility', minutes:12, met:2.5, focus:'恢复与放松', level:'舒缓' }
  ],
  ingredients: [
    { id:'avocado-food', name:'牛油果', group:'优质脂肪', icon:'leaf', kcal:160, protein:2, carbs:9, fat:15, fiber:7 },
    { id:'chicken-food', name:'鸡胸肉', group:'优质蛋白', icon:'drumstick', kcal:165, protein:31, carbs:0, fat:3.6, fiber:0 },
    { id:'salmon-food', name:'三文鱼', group:'鱼虾海鲜', icon:'fish', kcal:208, protein:20, carbs:0, fat:13, fiber:0 },
    { id:'cod-food', name:'鳕鱼', group:'鱼虾海鲜', icon:'fish', kcal:82, protein:18, carbs:0, fat:.7, fiber:0 },
    { id:'shrimp-food', name:'虾仁', group:'鱼虾海鲜', icon:'waves', kcal:99, protein:24, carbs:.2, fat:.3, fiber:0 },
    { id:'egg-food', name:'鸡蛋', group:'优质蛋白', icon:'egg', kcal:143, protein:13, carbs:.7, fat:9.5, fiber:0 },
    { id:'beef-food', name:'瘦牛肉', group:'优质蛋白', icon:'beef', kcal:170, protein:26, carbs:0, fat:7, fiber:0 },
    { id:'tofu-food', name:'北豆腐', group:'植物蛋白', icon:'box', kcal:116, protein:12, carbs:4, fat:7, fiber:.4 },
    { id:'milk-food', name:'低脂牛奶', group:'乳制品', icon:'milk', kcal:46, protein:3.4, carbs:5, fat:1.5, fiber:0 },
    { id:'yogurt-food', name:'无糖酸奶', group:'乳制品', icon:'cup-soda', kcal:63, protein:5, carbs:7, fat:1.6, fiber:0 },
    { id:'oats-food', name:'燕麦片', group:'全谷主食', icon:'wheat', kcal:379, protein:13, carbs:68, fat:6.5, fiber:10 },
    { id:'brownrice-food', name:'糙米饭', group:'全谷主食', icon:'cooking-pot', kcal:111, protein:2.6, carbs:23, fat:.9, fiber:1.8 },
    { id:'corn-food', name:'玉米', group:'全谷主食', icon:'wheat', kcal:112, protein:4, carbs:22, fat:1.2, fiber:2.7 },
    { id:'sweetpotato-food', name:'红薯', group:'薯类主食', icon:'sprout', kcal:86, protein:1.6, carbs:20, fat:.1, fiber:3 },
    { id:'quinoa-food', name:'藜麦', group:'全谷主食', icon:'wheat', kcal:120, protein:4.4, carbs:21, fat:1.9, fiber:2.8 },
    { id:'chia-food', name:'奇亚籽', group:'坚果种子', icon:'circle-dot', kcal:486, protein:17, carbs:42, fat:31, fiber:34 },
    { id:'almond-food', name:'杏仁', group:'坚果种子', icon:'circle-dot', kcal:579, protein:21, carbs:22, fat:50, fiber:12.5 },
    { id:'broccoli-food', name:'西兰花', group:'蔬菜', icon:'trees', kcal:34, protein:2.8, carbs:7, fat:.4, fiber:2.6 },
    { id:'spinach-food', name:'菠菜', group:'蔬菜', icon:'leaf', kcal:23, protein:2.9, carbs:3.6, fat:.4, fiber:2.2 },
    { id:'tomato-food', name:'番茄', group:'蔬菜', icon:'circle', kcal:18, protein:.9, carbs:3.9, fat:.2, fiber:1.2 },
    { id:'blueberry-food', name:'蓝莓', group:'水果', icon:'cherry', kcal:57, protein:.7, carbs:14, fat:.3, fiber:2.4 },
    { id:'apple-food', name:'苹果', group:'水果', icon:'apple', kcal:52, protein:.3, carbs:14, fat:.2, fiber:2.4 },
    { id:'banana-food', name:'香蕉', group:'水果', icon:'banana', kcal:89, protein:1.1, carbs:23, fat:.3, fiber:2.6 },
    { id:'oliveoil-food', name:'橄榄油', group:'优质脂肪', icon:'droplets', kcal:884, protein:0, carbs:0, fat:100, fiber:0 },
    { id:'tuna-food', name:'金枪鱼', group:'鱼虾海鲜', icon:'fish', kcal:132, protein:29, carbs:0, fat:1, fiber:0 },
    { id:'soy-food', name:'毛豆', group:'植物蛋白', icon:'sprout', kcal:121, protein:12, carbs:9, fat:5, fiber:5 },
    { id:'soymilk-food', name:'无糖豆浆', group:'植物蛋白', icon:'cup-soda', kcal:31, protein:3, carbs:1.2, fat:1.6, fiber:.8 },
    { id:'greek-food', name:'希腊酸奶', group:'乳制品', icon:'cup-soda', kcal:73, protein:10, carbs:4, fat:2, fiber:0 },
    { id:'toast-food', name:'全麦面包', group:'全谷主食', icon:'sandwich', kcal:247, protein:13, carbs:41, fat:4.2, fiber:7 },
    { id:'buckwheat-food', name:'荞麦面', group:'全谷主食', icon:'wheat', kcal:99, protein:5, carbs:21, fat:.1, fiber:1.4 },
    { id:'cucumber-food', name:'黄瓜', group:'蔬菜', icon:'leaf', kcal:15, protein:.7, carbs:3.6, fat:.1, fiber:.5 },
    { id:'lettuce-food', name:'生菜', group:'蔬菜', icon:'leaf', kcal:15, protein:1.4, carbs:2.9, fat:.2, fiber:1.3 },
    { id:'mushroom-food', name:'菌菇', group:'蔬菜', icon:'trees', kcal:22, protein:3.1, carbs:3.3, fat:.3, fiber:1 },
    { id:'kiwi-food', name:'猕猴桃', group:'水果', icon:'circle-dot', kcal:61, protein:1.1, carbs:15, fat:.5, fiber:3 },
    { id:'grapefruit-food', name:'西柚', group:'水果', icon:'circle', kcal:42, protein:.8, carbs:11, fat:.1, fiber:1.6 },
    { id:'walnut-food', name:'核桃', group:'坚果种子', icon:'circle-dot', kcal:654, protein:15, carbs:14, fat:65, fiber:6.7 }
  ],
  dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },
  startOfWeek(date = new Date()) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
  },
  weekDates(date = new Date()) {
    const start = this.startOfWeek(date);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return this.dateKey(day);
    });
  },
  userId() {
    let id = localStorage.getItem('food.currentUser');
    if (id) return id;
    try { id = JSON.parse(localStorage.getItem('food.account') || 'null')?.username; } catch {}
    id = id || 'guest';
    localStorage.setItem('food.currentUser', id);
    return id;
  },
  userKey(key, id = this.userId()) { return `food.user.${encodeURIComponent(id)}.${key}`; },
  ensureUser() {
    const id = this.userId(), marker = this.userKey('initialized', id);
    if (localStorage.getItem(marker) === '1') return;
    let legacyAccount = null;
    try { legacyAccount = JSON.parse(localStorage.getItem('food.account') || 'null'); } catch {}
    const migrateLegacy = legacyAccount?.username === id || (id === 'guest' && !legacyAccount);
    if (migrateLegacy) {
      Object.keys(this.defaults).forEach(key => {
        const legacy = localStorage.getItem(`food.${key}`);
        if (legacy !== null) localStorage.setItem(this.userKey(key, id), legacy);
      });
      if (localStorage.getItem(this.userKey('ingredientLogs', id)) && !localStorage.getItem(this.userKey('ingredientLogDate', id))) {
        localStorage.setItem(this.userKey('ingredientLogDate', id), JSON.stringify(this.dateKey()));
      }
    }
    localStorage.setItem(marker, '1');
  },
  get(key) {
    this.ensureUser();
    if (key === 'ingredientLogs') {
      const savedDate = this.read('ingredientLogDate');
      if (savedDate && savedDate !== this.dateKey()) return {};
    }
    const value = localStorage.getItem(this.userKey(key));
    if (key === 'water') {
      let water;
      try { water = value === null ? structuredClone(this.defaults.water) : JSON.parse(value); } catch { water = structuredClone(this.defaults.water); }
      water = { ...this.defaults.water, ...water };
      const today = this.dateKey();
      if (water.date !== today) {
        water.total = 0;
        water.date = today;
        localStorage.setItem(this.userKey('water'), JSON.stringify(water));
      }
      return water;
    }
    if (value !== null) {
      try {
        const parsed = JSON.parse(value);
        if (key === 'plan' && Array.isArray(parsed) && parsed.some(item => !Array.isArray(item.planDates))) {
          const dates = this.weekDates(), migrated = parsed.map(item => ({ ...item, planDates: Array.isArray(item.planDates) && item.planDates.length ? item.planDates : dates }));
          localStorage.setItem(this.userKey('plan'), JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {}
    }
    return structuredClone(this.defaults[key]);
  },
  read(key) {
    const value = localStorage.getItem(this.userKey(key));
    if (value === null) return structuredClone(this.defaults[key]);
    try { return JSON.parse(value); } catch { return structuredClone(this.defaults[key]); }
  },
  set(key, value) {
    this.ensureUser();
    localStorage.setItem(this.userKey(key), JSON.stringify(value));
    if (key === 'ingredientLogs') {
      localStorage.setItem(this.userKey('ingredientLogDate'), JSON.stringify(this.dateKey()));
      this.syncNutritionHistory(value);
    }
  },
  syncNutritionHistory(logs) {
    const totals = Object.entries(logs || {}).reduce((sum, [id, grams]) => {
      const food = this.ingredients.find(item => item.id === id), ratio = Number(grams) / 100;
      if (!food || !Number.isFinite(ratio)) return sum;
      sum.calories += food.kcal * ratio; sum.protein += food.protein * ratio; sum.carbs += food.carbs * ratio; sum.fat += food.fat * ratio; sum.fiber += food.fiber * ratio;
      return sum;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    const date = this.dateKey(), checkedIds = this.read('mealCheckins')[date] || [];
    this.planForDate(date).filter(item => checkedIds.includes(String(item.id))).forEach(item => {
      totals.calories += Number(item.calories) || 0;
      totals.protein += Number(item.protein) || 0;
      totals.carbs += Number(item.carbs) || 0;
      totals.fat += Number(item.fat) || 0;
      totals.fiber += Number(item.fiber) || 0;
    });
    const history = this.read('nutritionHistory').filter(item => item.date !== date);
    if (Object.values(totals).some(value => value > 0)) history.push({ date, ...Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.round(value * 10) / 10])) });
    history.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(this.userKey('nutritionHistory'), JSON.stringify(history));
  },
  toggleMealCheckin(id, date = this.dateKey()) {
    const checkins = this.get('mealCheckins'), key = String(id), current = Array.isArray(checkins[date]) ? checkins[date] : [];
    checkins[date] = current.includes(key) ? current.filter(item => item !== key) : [...current, key];
    this.set('mealCheckins', checkins);
    if (date === this.dateKey()) this.syncNutritionHistory(this.get('ingredientLogs'));
    return checkins[date].includes(key);
  },
  nutritionPeriods(targets = this.targets()) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const entries = this.get('nutritionHistory').map(item => ({ ...item, day: new Date(`${item.date}T00:00:00`) })).filter(item => !Number.isNaN(item.day.getTime()) && item.day <= today);
    const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
    const monday = date => { const start = new Date(date), day = (start.getDay() + 6) % 7; start.setDate(start.getDate() - day); start.setHours(0, 0, 0, 0); return start; };
    const monthStart = date => new Date(date.getFullYear(), date.getMonth(), 1);
    const yearStart = date => new Date(date.getFullYear(), 0, 1);
    const sameDay = (a, b) => a.getTime() === b.getTime();
    const sum = list => list.reduce((total, item) => {
      ['calories', 'protein', 'carbs', 'fat', 'fiber'].forEach(key => { total[key] += Number(item[key]) || 0; });
      return total;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    const roundNutrients = nutrients => Object.fromEntries(Object.entries(nutrients).map(([key, value]) => [key, Math.round(value * 10) / 10]));
    const formatRange = (start, end) => `${start.getMonth() + 1}/${start.getDate()} 至 ${end.getMonth() + 1}/${end.getDate()}`;
    const uniqueStarts = (current, selector) => {
      const starts = [current, ...entries.map(item => selector(item.day))];
      return [...new Map(starts.map(date => [this.dateKey(date), date])).values()].sort((a, b) => b - a).slice(0, 12);
    };
    const createRecord = (name, labels, bins, periodStart, periodEnd) => {
      const limit = periodEnd > today ? today : periodEnd;
      const periodEntries = entries.filter(item => item.day >= periodStart && item.day <= limit);
      const hasData = periodEntries.length > 0;
      let cumulative = 0;
      const values = [], goals = [], segments = [], recorded = [];
      bins.forEach(bin => {
        if (bin.start > limit) { values.push(cumulative); goals.push(hasData && targets.ready ? Math.round(targets.calories * ((bin.start - periodStart) / 86400000 + 1)) : 0); segments.push(0); recorded.push(false); return; }
        const binEnd = bin.end > limit ? limit : bin.end, list = periodEntries.filter(item => item.day >= bin.start && item.day <= binEnd), segment = sum(list).calories;
        cumulative += segment; values.push(Math.round(cumulative)); segments.push(Math.round(segment)); recorded.push(list.length > 0);
        goals.push(hasData && targets.ready ? Math.round(targets.calories * ((binEnd - periodStart) / 86400000 + 1)) : 0);
      });
      return { name, labels, values, goals, segments, recorded, hasData, nutrients: roundNutrients(sum(periodEntries)), days: Math.max(1, Math.floor((limit - periodStart) / 86400000) + 1) };
    };
    const currentWeek = monday(today), currentMonth = monthStart(today), currentYear = yearStart(today);
    const week = uniqueStarts(currentWeek, monday).map(start => {
      const end = addDays(start, 6), bins = Array.from({ length: 7 }, (_, index) => { const day = addDays(start, index); return { start: day, end: day }; });
      return createRecord(`${sameDay(start, currentWeek) ? '本周' : '周记录'} · ${formatRange(start, end)}`, ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], bins, start, end);
    });
    const month = uniqueStarts(currentMonth, monthStart).map(start => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0), count = Math.ceil(end.getDate() / 7);
      const bins = Array.from({ length: count }, (_, index) => ({ start: addDays(start, index * 7), end: addDays(start, Math.min(end.getDate() - 1, index * 7 + 6)) }));
      return createRecord(`${start.getFullYear()}年${start.getMonth() + 1}月`, bins.map((_, index) => `第${index + 1}周`), bins, start, end);
    });
    const year = uniqueStarts(currentYear, yearStart).map(start => {
      const end = new Date(start.getFullYear(), 11, 31), bins = Array.from({ length: 12 }, (_, index) => ({ start: new Date(start.getFullYear(), index, 1), end: new Date(start.getFullYear(), index + 1, 0) }));
      return createRecord(`${start.getFullYear()}年`, bins.map((_, index) => `${index + 1}月`), bins, start, end);
    });
    return { week, month, year };
  },
  targets(profile = this.get('profile')) {
    const weight = Number(profile.weight), height = Number(profile.height), age = Number(profile.age);
    const profileReady = ['男', '女'].includes(profile.gender) && ['减脂', '紧致塑形', '增肌', '维持健康'].includes(profile.goal) && ['低活动', '中等活动', '高强度活动'].includes(profile.activity);
    if (!(weight > 0 && height > 0 && age > 0 && profileReady)) return { calories: 0, protein: 0, carbs: 0, fat: 0, bmi: weight > 0 && height > 0 ? (weight / ((height / 100) ** 2)).toFixed(1) : '待完善', ready: false };
    const sexOffset = profile.gender === '男' ? 5 : -161;
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + sexOffset);
    const factor = profile.activity === '高强度活动' ? 1.7 : profile.activity === '中等活动' ? 1.5 : 1.3;
    const calories = Math.round(bmr * factor - (profile.goal === '增肌' ? -180 : profile.goal === '减脂' ? 280 : 100));
    return { calories, protein: Math.round(weight * (profile.goal === '增肌' ? 1.8 : 1.55)), carbs: Math.round(calories * .46 / 4), fat: Math.round(calories * .27 / 9), bmi: (weight / ((height / 100) ** 2)).toFixed(1), ready: true };
  },
  toast(message) {
    let node = document.querySelector('.toast');
    if (!node) { node = document.createElement('div'); node.className = 'toast'; document.body.appendChild(node); }
    node.textContent = message; node.classList.add('show'); clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
  },
  planForDate(date = this.dateKey()) {
    const currentWeek = this.weekDates();
    return this.get('plan').filter(item => {
      const planDates = Array.isArray(item.planDates) && item.planDates.length ? item.planDates : currentWeek;
      return planDates.includes(date);
    });
  },
  removePlanDate(id, date = this.dateKey()) {
    const currentWeek = this.weekDates();
    const plan = this.get('plan').reduce((items, item) => {
      if (String(item.id) !== String(id)) return [...items, item];
      const planDates = (Array.isArray(item.planDates) && item.planDates.length ? item.planDates : currentWeek).filter(day => day !== date);
      return planDates.length ? [...items, { ...item, planDates }] : items;
    }, []);
    this.set('plan', plan);
  },
  addToPlan(item, options = {}) {
    const plan = this.get('plan');
    const dates = options.dates || (options.date ? [options.date] : this.weekDates());
    const normalized = { ...item, id: item.id || `custom-${Date.now()}`, planDates: [...new Set(dates)] };
    const existing = plan.find(entry => String(entry.id) === String(normalized.id));
    if (existing) {
      existing.planDates = [...new Set([...(existing.planDates || this.weekDates()), ...normalized.planDates])];
      Object.assign(existing, normalized, { planDates: existing.planDates });
    } else {
      plan.push(normalized);
    }
    this.set('plan', plan);
    this.toast(`${normalized.name} 已加入饮食计划`);
    window.dispatchEvent(new CustomEvent('food:plan-updated'));
  },
  openRecipeDatabase() {
    if (!('indexedDB' in window)) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('qingying-recipes', 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.objectStoreNames.contains('recipes') ? request.transaction.objectStore('recipes') : db.createObjectStore('recipes', { keyPath: 'id' });
        if (!store.indexNames.contains('meal')) store.createIndex('meal', 'meal');
        this.recipes.forEach(recipe => store.put(recipe));
      };
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('recipes', 'readwrite');
        const store = transaction.objectStore('recipes');
        this.recipes.forEach(recipe => store.put(recipe));
        transaction.oncomplete = () => resolve(db);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  },
  async getRecipes() {
    try {
      const db = await this.openRecipeDatabase();
      if (!db) return this.recipes;
      const recipes = await new Promise((resolve, reject) => {
        const request = db.transaction('recipes').objectStore('recipes').getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      db.close();
      return recipes.length ? recipes : this.recipes;
    } catch {
      return this.recipes;
    }
  },
  localAssistantResponse(question) {
    const target = this.targets(), plan = this.planForDate(), calories = plan.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    const meal = question.includes('早餐') ? '早餐' : question.includes('午餐') ? '午餐' : question.includes('晚餐') ? '晚餐' : question.includes('加餐') ? '加餐' : '';
    const suggestions = this.recipes.filter(item => !meal || item.meal === meal).slice(0, 3).map(item => ({ id: item.id, meal: item.meal, name: item.name, calories: item.calories, grams: item.grams, protein: item.protein, carbs: item.carbs, image: item.image || 'app-icon.svg' }));
    if (!target.ready) return { reply: '请先完善性别、年龄、身高、体重、目标和活动量，我才能计算更准确的份量。当前可以先从主食、优质蛋白和蔬菜齐全的一餐开始。', suggestions };
    const calorieGap = target.calories - calories;
    const direction = calorieGap > 200 ? `当前计划还可补充约 ${calorieGap} kcal` : calorieGap < -200 ? `当前计划比目标高约 ${Math.abs(calorieGap)} kcal` : '当前计划热量接近目标';
    return { reply: `${direction}。建议优先检查全天蛋白质是否达到约 ${target.protein} g、碳水是否接近 ${target.carbs} g，再用蔬菜和清淡烹调完善搭配。结合你问的“${question}”，下面这些日常餐饮可以直接加入计划。`, suggestions };
  },
  lightMealAssistantResponse(question, history = []) {
    const profile = this.get('profile'), target = this.targets(profile), plan = this.planForDate();
    const previous = history.map(item => String(item?.content || '')).join('。');
    const userMemory = history.filter(item => item?.role === 'user').map(item => String(item.content || '')).join('。');
    const context = userMemory + '。' + question;
    const disclaimer = '本轻食方案仅为饮食搭配参考，不构成医疗、临床诊疗建议。患有基础疾病，请遵从医生或营养师专业指导。';
    const explicitMeal = question.includes('早餐') ? '早餐' : question.includes('午餐') ? '午餐' : question.includes('晚餐') ? '晚餐' : question.includes('加餐') ? '加餐' : '';
    const meal = explicitMeal || (new Date().getHours() < 10 ? '早餐' : new Date().getHours() < 15 ? '午餐' : '晚餐');
    const goalOptions = ['减脂', '维持体重', '增肌', '控糖', '养胃'];
    const statedGoal = goalOptions.find(item => question.includes(item)) || goalOptions.find(item => userMemory.includes(item));
    const goal = statedGoal || profile.goal || '';
    const budgetMatch = question.match(/(?:预算|不超过|控制在)[^0-9]{0,4}([0-9]+(?:[.][0-9]+)?)[ ]*元/);
    const budget = budgetMatch ? Number(budgetMatch[1]) : 0;
    const flavor = ['清淡', '酸甜', '咸香', '温热'].find(item => context.includes(item)) || '';
    const restrictionDefs = [
      { label: '蛋类', words: ['鸡蛋', '蛋类'], blocks: ['鸡蛋'] },
      { label: '乳制品', words: ['牛奶', '乳制品', '奶制品'], blocks: ['牛奶', '酸奶'] },
      { label: '坚果', words: ['坚果', '花生', '杏仁', '核桃'], blocks: ['坚果', '杏仁', '核桃'] },
      { label: '海鲜', words: ['海鲜', '虾', '虾仁'], blocks: ['虾', '鱼', '三文鱼', '鳕鱼', '金枪鱼'] },
      { label: '鱼类', words: ['鱼类', '鱼肉'], blocks: ['鱼', '三文鱼', '鳕鱼', '金枪鱼'] },
      { label: '大豆', words: ['大豆', '豆制品', '豆腐'], blocks: ['豆腐', '豆浆', '毛豆'] },
      { label: '牛肉', words: ['牛肉'], blocks: ['牛肉', '牛腱'] },
      { label: '猪肉', words: ['猪肉'], blocks: ['猪肉', '里脊'] },
      { label: '麸质', words: ['麸质', '小麦'], blocks: ['面包', '吐司', '面条', '燕麦'] }
    ];
    const restrictions = restrictionDefs.filter(item => item.words.some(word => ['不吃' + word, '不要' + word, '对' + word + '过敏', word + '过敏', '忌' + word, '不能吃' + word].some(phrase => context.includes(phrase))));
    const blockedWords = restrictions.flatMap(item => item.blocks);
    const recognized = this.ingredients.filter(item => context.includes(item.name));
    const gramsEntries = recognized.flatMap(item => {
      const match = question.match(new RegExp(item.name + '[^0-9]{0,4}([0-9]+(?:[.][0-9]+)?)[ ]*(?:g|克)', 'i'));
      return match ? [{ item, grams: Number(match[1]) }] : [];
    });
    const asksCalories = /热量|卡路里|大卡/.test(question);
    const asksReplacement = /替换|代替|换成/.test(question);
    const asksCompatibility = /能不能搭配|可以搭配|一起吃|搭不搭/.test(question);
    const asksAnalysis = /营养分析|营养怎么样|营养成分/.test(question);
    const asksRecommendation = /推荐|搭配|吃什么|吃啥|想吃|安排|补齐|方案|食谱|怎么做|做法/.test(question);

    if (asksCalories && recognized.length && !gramsEntries.length) {
      return { reply: '请告诉我这些食材大约各有多少克？我会按实际分量估算整餐热量。', suggestions: [] };
    }
    if ((asksCalories || asksAnalysis) && gramsEntries.length) {
      const totals = gramsEntries.reduce((sum, entry) => {
        const ratio = entry.grams / 100;
        sum.calories += entry.item.kcal * ratio;
        sum.protein += entry.item.protein * ratio;
        sum.carbs += entry.item.carbs * ratio;
        sum.fat += entry.item.fat * ratio;
        sum.fiber += entry.item.fiber * ratio;
        return sum;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
      const details = gramsEntries.map(entry => '- ' + entry.item.name + ' ' + entry.grams + '克：约 ' + Math.round(entry.item.kcal * entry.grams / 100) + ' kcal').join('\n');
      return { reply: ['【热量与营养估算】', details, '', '- 合计热量：约 ' + Math.round(totals.calories) + ' kcal', '- 蛋白质：约 ' + totals.protein.toFixed(1) + '克', '- 碳水：约 ' + totals.carbs.toFixed(1) + '克', '- 脂肪：约 ' + totals.fat.toFixed(1) + '克', '- 膳食纤维：约 ' + totals.fiber.toFixed(1) + '克', '', '【轻食建议】', '优先确保优质蛋白与蔬菜充足；烹调油每餐建议控制在 5克左右，酱汁单独少量使用。', '', disclaimer].join('\n'), suggestions: [] };
    }

    const replacementMap = {
      '鸡胸肉': '北豆腐、虾仁或瘦牛肉可提供相近的优质蛋白',
      '米饭': '糙米饭、玉米、红薯或藜麦更适合作为复合碳水',
      '牛奶': '无糖豆浆或无糖植物奶可替换，注意选择强化钙产品',
      '鸡蛋': '北豆腐或无糖希腊酸奶可补充蛋白质',
      '面包': '燕麦、红薯或玉米可替代精制面包',
      '沙拉酱': '无糖酸奶加柠檬汁，或少量橄榄油加黑胡椒更轻盈'
    };
    if (asksReplacement) {
      const source = Object.keys(replacementMap).find(item => context.includes(item));
      if (!source) return { reply: '你想替换哪一种食材？告诉我原食材即可，我会按蛋白质、碳水或脂肪功能给出等量轻食替换。', suggestions: [] };
      return { reply: ['【食材替换建议】', '- 原食材：' + source, '- 推荐替换：' + replacementMap[source], '', '替换时保留原餐的营养角色，不额外增加浓酱、糖或烹调油。' + (restrictions.length ? '\n已记录忌口：' + restrictions.map(item => item.label).join('、') + '，替换方案会完全规避。' : ''), '', disclaimer].join('\n'), suggestions: [] };
    }
    if (asksCompatibility || asksAnalysis) {
      if (recognized.length < 2) return { reply: '请再告诉我另一种想搭配的食材，我会从营养互补、分量和忌口三个方面判断。', suggestions: [] };
      const names = recognized.map(item => item.name).join('、');
      const proteinFood = recognized.some(item => item.protein >= 10), carbFood = recognized.some(item => item.carbs >= 15), fiberFood = recognized.some(item => item.fiber >= 2);
      return { reply: ['【搭配判断】', names + '可以搭配。', '', '【营养逻辑】', '- 优质蛋白：' + (proteinFood ? '当前组合已有较好来源' : '偏少，建议补鸡胸肉、鱼虾、鸡蛋或豆腐'), '- 复合碳水：' + (carbFood ? '当前分量可作为主食基础' : '建议补少量糙米、玉米或红薯'), '- 膳食纤维：' + (fiberFood ? '当前组合有所覆盖' : '建议再加 150至200克深色蔬菜'), '', '烹调优先蒸、煮、凉拌或空气炸，整餐用油控制在约 5克。', '', disclaimer].join('\n'), suggestions: [] };
    }

    if (/什么是轻食|轻食是什么/.test(question)) {
      return { reply: ['【轻食说明】', '轻食不是只吃沙拉，也不是极端节食。它强调控制烹调油和精制糖，用优质蛋白、复合碳水及充足蔬菜组成均衡餐盘。', '', '- 优质蛋白：鱼虾、鸡胸肉、鸡蛋、豆腐或无糖乳制品', '- 复合碳水：糙米、燕麦、玉米、红薯或全麦主食', '- 蔬菜：每餐约占餐盘的一半', '- 调味：少油、少盐，避免浓酱和油炸', '', disclaimer].join('\n'), suggestions: [] };
    }
    if (/复合碳水/.test(question) && /什么|哪些|举例|包括/.test(question)) {
      return { reply: ['【复合碳水选择】', '日常可选燕麦、糙米、藜麦、玉米、红薯、荞麦面和全麦面包。它们通常比精制米面提供更多膳食纤维，饱腹感也更稳定。', '', '控糖时仍要控制总量，建议与优质蛋白和蔬菜同餐搭配，不把粗粮当作可以无限吃的食物。', '', disclaimer].join('\n'), suggestions: [] };
    }
    if (/蛋白质/.test(question) && /多少|需求|需要|目标/.test(question)) {
      if (!Number(profile.weight)) return { reply: '请告诉我当前体重是多少公斤？我会结合目标估算每日蛋白质需求。', suggestions: [] };
      const proteinGoal = target.ready ? target.protein : Math.round(Number(profile.weight) * (goal === '增肌' ? 1.8 : 1.55));
      return { reply: ['【蛋白质参考】', '按你当前体重与目标估算，每日可参考约 ' + proteinGoal + '克蛋白质，建议分配到三餐，而不是集中在一餐。', '', '可优先选择鸡胸肉、鱼虾、鸡蛋、豆腐、无糖酸奶或低脂牛奶；实际需求还会受训练量和健康状况影响。', '', disclaimer].join('\n'), suggestions: [] };
    }
    if (/控糖/.test(question) && /怎么|如何|原则|注意/.test(question)) {
      return { reply: ['【日常控糖原则】', '- 主食优先燕麦、糙米、玉米、红薯等复合碳水，并控制分量', '- 每餐搭配蛋白质和非淀粉蔬菜，减少单独吃精制主食', '- 不喝含糖饮料，酱汁和加工食品注意隐藏糖', '- 水果保留完整果肉，避免果汁，分次适量食用', '', disclaimer].join('\n'), suggestions: [] };
    }

    if (!asksRecommendation) {
      return { reply: '我可以帮你做轻食推荐、食材替换、热量估算或营养分析。你现在最想解决哪一个问题？', suggestions: [] };
    }

    if (asksRecommendation && !goal) {
      return { reply: '这次轻食搭配最优先的目标是什么：减脂、维持体重、增肌、控糖还是养胃？', suggestions: [] };
    }

    const lightRecipeIds = ['oat-milk-egg', 'egg-toast-milk', 'broccoli-chicken-rice', 'shrimp-mushroom-tofu-soup', 'tomato-tofu-greens', 'seaweed-egg-corn', 'avocado-egg-toast', 'tomato-egg-noodles'];
    const availableNames = recognized.map(item => item.name);
    let candidates = this.recipes.filter(recipe => lightRecipeIds.includes(recipe.id) && recipe.meal === meal && !blockedWords.some(word => (recipe.name + recipe.ingredients.join('')).includes(word)));
    if (!candidates.length && !explicitMeal) candidates = this.recipes.filter(recipe => lightRecipeIds.includes(recipe.id) && !blockedWords.some(word => (recipe.name + recipe.ingredients.join('')).includes(word)));
    const unusedCandidates = candidates.filter(recipe => !previous.includes(recipe.name));
    if (unusedCandidates.length) candidates = unusedCandidates;
    const score = recipe => {
      const text = recipe.name + recipe.ingredients.join('');
      let value = availableNames.filter(name => text.includes(name)).length * 20;
      if (goal === '增肌' || /高蛋白|补蛋白/.test(question)) value += recipe.protein;
      if (goal === '减脂') value += recipe.protein * 1.5 - recipe.calories / 20;
      if (goal === '控糖') value += 60 - recipe.carbs;
      if (goal === '养胃' && /汤|燕麦|面/.test(recipe.name)) value += 25;
      if (budget > 0 && budget <= 25 && /鸡蛋|豆腐|燕麦|玉米/.test(text)) value += 22;
      if (flavor === '清淡' && /汤|豆腐|燕麦/.test(recipe.name)) value += 18;
      if (flavor === '酸甜' && /番茄/.test(text)) value += 18;
      if (flavor === '温热' && /汤|燕麦|面/.test(recipe.name)) value += 18;
      return value;
    };
    candidates.sort((a, b) => score(b) - score(a));
    if (!candidates.length) {
      return { reply: '我已记录你的忌口，但当前食谱中没有可安全匹配的方案。你可以接受豆制品作为这餐的蛋白质来源吗？', suggestions: [] };
    }
    const count = /三天|多天|一周/.test(question) ? 3 : Math.min(2, candidates.length);
    const selected = candidates.slice(0, count), primary = selected[0];
    const recipeText = primary.name + primary.ingredients.join('');
    const personsMatch = question.match(/(\d+)\s*人/), persons = personsMatch ? Math.max(1, Math.min(8, Number(personsMatch[1]))) : 1;
    const scaleIngredient = text => persons === 1 ? text : text.replace(/(\d+(?:\.\d+)?)/g, number => String(Math.round(Number(number) * persons * 10) / 10));
    const ingredients = primary.ingredients.map(scaleIngredient);
    const seasoningWords = ['油', '生抽', '盐', '胡椒', '酱'];
    const seasonings = ingredients.filter(item => seasoningWords.some(word => item.includes(word)));
    const foodIngredients = ingredients.filter(item => !seasoningWords.some(word => item.includes(word)));
    const mains = foodIngredients.slice(0, 2), sides = foodIngredients.slice(2);
    const calories = Math.round(primary.calories * persons);
    const planCalories = plan.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    const calorieNote = target.ready ? '你今天已计划约 ' + planCalories + ' kcal，日目标约 ' + target.calories + ' kcal。' : '';
    const conditionNote = (flavor ? '口味按“' + flavor + '”方向搭配。' : '') + (budget ? '预算参考 ' + budget + '元，优先使用日常易购食材。' : '');
    const restrictionNote = restrictions.length ? '已完全规避：' + restrictions.map(item => item.label).join('、') + '。' : '本轮暂未提供过敏或忌口信息。';
    const substitute = recipeText.includes('鸡胸肉') ? '鸡胸肉可等量换成去皮鱼肉或北豆腐。' : recipeText.includes('虾') ? '虾仁可换成鸡胸肉或北豆腐。' : recipeText.includes('鸡蛋') ? '鸡蛋可按忌口换成北豆腐或无糖希腊酸奶。' : '蛋白质食材可按相近重量在鱼肉、鸡胸肉和豆腐间替换。';
    const goalLogic = goal === '增肌' ? '提高优质蛋白供给，并保留适量复合碳水支持训练恢复。' : goal === '控糖' ? '控制主食分量，选择低 GI 复合碳水并搭配蛋白质减缓餐后波动。' : goal === '养胃' ? '采用温热、少油和较柔软的烹调方式，减少刺激性调味。' : goal === '维持体重' || goal === '维持健康' ? '用蛋白质、复合碳水和蔬菜组成均衡餐盘。' : '控制总热量，提高蛋白质和膳食纤维，增强饱腹感。';
    const reply = [
      '【轻食搭配方案】',
      '- 餐次：' + primary.meal,
      '- ' + primary.name + '｜制作难度：简单｜预估耗时：' + primary.time + '分钟｜参考热量：' + calories + ' kcal',
      '简单说明：' + (primary.fit || '清爽日常') + '，少油烹调。' + goalLogic + (conditionNote ? ' ' + conditionNote : '') + (calorieNote ? ' ' + calorieNote : ''),
      '',
      '【食材清单】',
      '- 主料：' + (mains.join('、') || '按食谱分量准备'),
      '- 辅料：' + (sides.join('、') || '时令蔬菜 150克'),
      '- 调味：' + (seasonings.join('、') || '食用油 3至5克、少量盐、黑胡椒') + '；不额外加糖',
      '',
      '【简易制作步骤】',
      ...primary.steps.slice(0, 5).map((step, index) => (index + 1) + '. ' + step),
      '',
      '【轻食营养小贴士】',
      '- 搭配逻辑：蛋白质约 ' + Math.round(primary.protein * persons) + '克，碳水约 ' + Math.round(primary.carbs * persons) + '克；' + goalLogic,
      '- 忌口提醒：' + restrictionNote,
      '- 食材替换：' + substitute,
      '- 分量调整：当前按 ' + persons + ' 人份估算；运动量较大可增加约 30至50克熟重主食，减脂期优先增加蔬菜而非酱汁。',
      '',
      disclaimer
    ].join('\n');
    const suggestions = selected.map(recipe => ({ id: recipe.id, meal: recipe.meal, name: recipe.name, calories: Math.round(recipe.calories * persons), grams: Math.round(recipe.grams * persons), protein: Math.round(recipe.protein * persons), carbs: Math.round(recipe.carbs * persons), image: recipe.image || 'app-icon.svg' }));
    return { reply, suggestions };
  },
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

function shell(active = 'home') {
  const items = [
    ['home', 'index.html', 'house', '今日概况'],
    ['meal', 'meal-plan.html', 'utensils', '餐饮计划'],
    ['daily', 'daily-plan.html', 'calendar-check', '完整日计划'],
    ['recipes', 'recipes.html', 'book-open', '食谱库']
  ];
  const side = document.querySelector('[data-shell]');
  if (!side) return;
  side.innerHTML = `<a class="brand" href="index.html" title="返回今日概览"><span class="brand-mark">轻</span><span><strong>轻盈计划</strong><small>每日健康管理</small></span></a><nav class="nav" aria-label="主要导航">${items.map(([id, href, icon, label]) => `<a class="${id === active ? 'active' : ''}" href="${href}" title="${label}"${id === active ? ' aria-current="page"' : ''}><i data-lucide="${icon}"></i><span>${label}</span></a>`).join('')}</nav><div class="side-note"><strong>今天也要照顾自己</strong><span>持续记录，让每一次选择都有回应。</span></div>`;
}

function initCommon(active = 'home') {
  document.body.dataset.page = active;
  shell(active);
  const profile = FOOD_APP.get('profile'), displayName = profile.name || '用户';
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let tools = topbar.querySelector(':scope > .top-actions');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'top-actions';
      [...topbar.children].slice(1).forEach(child => tools.appendChild(child));
      topbar.appendChild(tools);
    }
  }
  document.addEventListener('error', event => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target;
    if (image.dataset.fallbackApplied === '1') return;
    image.dataset.fallbackApplied = '1';
    image.classList.add('image-unavailable');
    image.closest('.food-image, .recipe-hero')?.classList.add('image-fallback');
    image.src = 'app-icon.svg';
  }, true);
  document.querySelectorAll('img').forEach(image => {
    if (image.complete && !image.naturalWidth) image.dispatchEvent(new Event('error'));
  });
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = displayName);
  document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent = displayName.slice(0, 1));
  if (window.lucide) window.lucide.createIcons();
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal-backdrop').classList.remove('open')));
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); }));
  loadAssistant();
}

function showDailyReminder() {
  const reminderKey = `food.reminderShown.${encodeURIComponent(FOOD_APP.userId())}`;
  if (sessionStorage.getItem(reminderKey)) return;
  sessionStorage.setItem(reminderKey, '1');
  const plan = FOOD_APP.planForDate();
  const total = plan.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  setTimeout(() => {
    const modal = document.getElementById('dailyReminder');
    if (!modal) return;
    modal.querySelector('[data-reminder-text]').textContent = `今日计划 ${plan.length} 餐，约 ${total} kcal。午餐后记得散步 10 分钟，当前饮水目标还差 ${Math.max(0, FOOD_APP.get('water').target - FOOD_APP.get('water').total)} ml。`;
    modal.classList.add('open');
  }, 450);
}
function loadAssistant() {
  if (window.QingyingAssistant) { window.QingyingAssistant.init(); return; }
  if (document.querySelector('script[data-qy-ai-loader]')) return;
  const config = document.createElement('script');
  config.src = 'ai-config.js';
  config.onload = () => {
    const assistant = document.createElement('script');
    assistant.src = 'ai-assistant.js';
    assistant.dataset.qyAiLoader = '1';
    assistant.onload = () => window.QingyingAssistant?.init();
    document.head.appendChild(assistant);
  };
  document.head.appendChild(config);
}
