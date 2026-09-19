const FOOD_APP = {
  defaults: {
    profile: { name: '林溪', gender: '女', age: 28, height: 171, weight: 62.5, bodyFat: 22.4, goal: '紧致塑形', activity: '中等活动' },
    water: { total: 1260, target: 2000, cupSize: 200, cupType: '玻璃杯' },
    plan: [
      { id: 'oat', meal: '早餐', name: '燕麦酸奶莓果碗', calories: 420, grams: 320, protein: 24, carbs: 52, image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80' },
      { id: 'chicken', meal: '午餐', name: '香煎鸡胸糙米碗', calories: 580, grams: 460, protein: 46, carbs: 67, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80' },
      { id: 'soup', meal: '晚餐', name: '虾仁菌菇暖汤', calories: 390, grams: 420, protein: 32, carbs: 29, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80' }
    ],
    exercises: [
      { id: 1, name: '晨间拉伸', duration: 10, place: '居家', done: true },
      { id: 2, name: '轻松慢跑', duration: 30, place: '户外', done: false },
      { id: 3, name: '睡前放松', duration: 8, place: '居家', done: false }
    ],
    workoutPlan: ['pilates-core', 'rope', 'stretch'],
    workoutHistory: [
      { id: 101, workoutId: 'pilates-core', name: '普拉提核心', seconds: 1320, calories: 81, date: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: 102, workoutId: 'rope', name: '跳绳燃脂', seconds: 900, calories: 180, date: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 103, workoutId: 'stretch', name: '全身拉伸', seconds: 720, calories: 33, date: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: 104, workoutId: 'dumbbell', name: '哑铃循环', seconds: 1200, calories: 138, date: new Date(Date.now() - 12 * 86400000).toISOString() },
      { id: 105, workoutId: 'run', name: '户外慢跑', seconds: 1800, calories: 285, date: new Date(Date.now() - 28 * 86400000).toISOString() },
      { id: 106, workoutId: 'glute', name: '臀腿塑形', seconds: 1440, calories: 145, date: new Date(Date.now() - 88 * 86400000).toISOString() }
    ],
    ingredientLogs: {}
  },
  recipes: [
    { id:'oat', meal:'早餐', name:'燕麦酸奶莓果碗', calories:420, grams:320, protein:24, carbs:52, time:10, fit:'控糖、通勤早餐', tags:['高纤维','均衡碳水'], image:'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80', ingredients:['燕麦 45 g','无糖酸奶 180 g','蓝莓 60 g','水煮蛋 1 个'], steps:['燕麦用热水浸泡 5 分钟。','加入无糖酸奶，铺上蓝莓。','搭配一枚水煮蛋，食用前拌匀。'] },
    { id:'chicken', meal:'午餐', name:'香煎鸡胸糙米碗', calories:580, grams:460, protein:46, carbs:67, time:25, fit:'减脂、力量训练日', tags:['高蛋白','少油'], image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', ingredients:['鸡胸肉 160 g','糙米饭 150 g','西兰花 120 g','橄榄油 5 g'], steps:['鸡胸肉用黑胡椒和少量盐腌制。','平底锅刷油，两面各煎约 4 分钟。','糙米和焯熟西兰花装碗，放入切片鸡胸。'] },
    { id:'soup', meal:'晚餐', name:'虾仁菌菇暖汤', calories:390, grams:420, protein:32, carbs:29, time:20, fit:'晚间轻食、控脂', tags:['低脂','少盐'], image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', ingredients:['虾仁 120 g','混合菌菇 150 g','嫩豆腐 100 g','青菜 80 g'], steps:['菌菇入锅煸出香味，加水煮沸。','加入豆腐与虾仁煮 4 分钟。','放青菜，以胡椒和少量盐调味。'] },
    { id:'avocado', meal:'早餐', name:'牛油果全麦吐司', calories:365, grams:245, protein:18, carbs:38, time:12, fit:'需要饱腹感的人群', tags:['优质脂肪','高纤维'], image:'https://images.unsplash.com/photo-1603046891744-76e6300f82ef?auto=format&fit=crop&w=900&q=80', ingredients:['全麦吐司 2 片','牛油果 1/2 个','鸡蛋 1 个','番茄 50 g'], steps:['吐司烘烤至表面微脆。','牛油果压泥铺在吐司上。','加入水波蛋和番茄，以黑胡椒调味。'] },
    { id:'salmon', meal:'午餐', name:'香草三文鱼时蔬盘', calories:520, grams:390, protein:39, carbs:34, time:30, fit:'增肌、补充优质脂肪', tags:['Omega-3','高蛋白'], image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80', ingredients:['三文鱼 150 g','小土豆 120 g','芦笋 100 g','柠檬 1/4 个'], steps:['三文鱼用香草、黑胡椒腌制。','与小土豆一同入烤箱烤 18 分钟。','加入焯熟芦笋，食用前挤柠檬汁。'] },
    { id:'tofu', meal:'晚餐', name:'番茄豆腐杂蔬煲', calories:348, grams:440, protein:25, carbs:31, time:22, fit:'素食、晚餐控热量', tags:['植物蛋白','轻负担'], image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', ingredients:['北豆腐 180 g','番茄 180 g','杂蔬 150 g','生抽 5 ml'], steps:['番茄切块炒软，加入少量清水。','放入豆腐与杂蔬炖煮 10 分钟。','以少量生抽调味，撒葱花即可。'] }
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
  get(key) {
    const value = localStorage.getItem(`food.${key}`);
    if (value) return JSON.parse(value);
    if (key === 'workoutPlan') return this.get('profile').gender === '男' ? ['pullup', 'dumbbell', 'rope'] : ['pilates-core', 'glute', 'rope'];
    return structuredClone(this.defaults[key]);
  },
  set(key, value) { localStorage.setItem(`food.${key}`, JSON.stringify(value)); },
  targets(profile = this.get('profile')) {
    const sexOffset = profile.gender === '男' ? 5 : -161;
    const bmr = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + sexOffset);
    const factor = profile.activity === '高强度活动' ? 1.7 : profile.activity === '中等活动' ? 1.5 : 1.3;
    const calories = Math.round(bmr * factor - (profile.goal === '增肌' ? -180 : profile.goal === '减脂' ? 280 : 100));
    return { calories, protein: Math.round(profile.weight * (profile.goal === '增肌' ? 1.8 : 1.55)), carbs: Math.round(calories * .46 / 4), fat: Math.round(calories * .27 / 9), bmi: (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) };
  },
  toast(message) {
    let node = document.querySelector('.toast');
    if (!node) { node = document.createElement('div'); node.className = 'toast'; document.body.appendChild(node); }
    node.textContent = message; node.classList.add('show'); clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
  },
  addToPlan(item) {
    const plan = this.get('plan');
    const normalized = { ...item, id: item.id || `custom-${Date.now()}` };
    plan.push(normalized); this.set('plan', plan); this.toast(`${normalized.name} 已加入完整计划`);
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

function shell(active = 'home') {
  const items = [
    ['home', 'index.html', 'house', '今日概览'],
    ['meal', 'meal-plan.html', 'utensils', '饮食计划'],
    ['daily', 'daily-plan.html', 'calendar-days', '完整日计划'],
    ['recipes', 'recipes.html', 'book-open', '食谱库'],
    ['exercise', 'exercise.html', 'dumbbell', '运动塑形'],
    ['profile', 'profile.html', 'user-round-cog', '个人资料']
  ];
  const side = document.querySelector('[data-shell]');
  if (!side) return;
  side.innerHTML = `<a class="brand" href="index.html"><span class="brand-mark">轻</span><span><strong>轻盈计划</strong><small>YOUR DAILY BALANCE</small></span></a><nav class="nav">${items.map(([id, href, icon, label]) => `<a class="${id === active ? 'active' : ''}" href="${href}"><i data-lucide="${icon}"></i><span>${label}</span></a>`).join('')}</nav><div class="side-note"><strong>今天也要照顾自己</strong><span>持续记录，让每一次选择都有回应。</span></div>`;
}

function initCommon(active = 'home') {
  shell(active);
  const profile = FOOD_APP.get('profile');
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = profile.name);
  document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent = profile.name.slice(0, 1));
  if (window.lucide) window.lucide.createIcons();
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal-backdrop').classList.remove('open')));
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); }));
  initAssistant();
}

function initAssistant() {
  if (document.querySelector('.ai-fab')) return;
  document.body.insertAdjacentHTML('beforeend', `<button class="ai-fab" type="button" title="AI 营养助手" aria-label="打开 AI 营养助手"><i data-lucide="sparkles"></i></button><section class="ai-panel" aria-label="AI 营养助手"><header class="ai-panel-head"><div><strong>AI 营养助手</strong><span>简洁询问 · 结合今日计划回答</span></div><button class="icon-btn" type="button" data-ai-close title="关闭"><i data-lucide="x"></i></button></header><div class="ai-messages"><div class="ai-message assistant">想调整饮食、查询热量或安排运动？直接问我。</div></div><form class="ai-compose"><input type="text" aria-label="向 AI 提问" placeholder="例如：晚餐怎么补蛋白质？"><button type="submit" aria-label="发送"><i data-lucide="send"></i></button></form></section>`);
  const panel=document.querySelector('.ai-panel'),fab=document.querySelector('.ai-fab'),messages=panel.querySelector('.ai-messages'),input=panel.querySelector('input'),panelHead=panel.querySelector('.ai-panel-head');
  const restorePosition=(el,key)=>{try{const pos=JSON.parse(localStorage.getItem(key));if(!pos)return;el.style.left=`${Math.min(pos.left,innerWidth-el.offsetWidth-8)}px`;el.style.top=`${Math.min(pos.top,innerHeight-el.offsetHeight-8)}px`;el.style.right='auto';el.style.bottom='auto'}catch{}};
  restorePosition(fab,'food.aiFabPosition');
  const makeDraggable=(el,handle,key)=>{let startX=0,startY=0,startLeft=0,startTop=0,moved=false;handle.addEventListener('pointerdown',event=>{const interactive=event.target.closest('button,input');if(interactive&&interactive!==handle)return;const rect=el.getBoundingClientRect();startX=event.clientX;startY=event.clientY;startLeft=rect.left;startTop=rect.top;moved=false;el.classList.add('dragging');handle.setPointerCapture(event.pointerId)});handle.addEventListener('pointermove',event=>{if(!handle.hasPointerCapture(event.pointerId))return;const dx=event.clientX-startX,dy=event.clientY-startY;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;const left=Math.max(8,Math.min(innerWidth-el.offsetWidth-8,startLeft+dx)),top=Math.max(8,Math.min(innerHeight-el.offsetHeight-8,startTop+dy));el.style.left=`${left}px`;el.style.top=`${top}px`;el.style.right='auto';el.style.bottom='auto';event.preventDefault()});handle.addEventListener('pointerup',event=>{if(!handle.hasPointerCapture(event.pointerId))return;handle.releasePointerCapture(event.pointerId);el.classList.remove('dragging');const rect=el.getBoundingClientRect();localStorage.setItem(key,JSON.stringify({left:rect.left,top:rect.top}));if(el===fab&&moved){fab.dataset.justDragged='1';setTimeout(()=>delete fab.dataset.justDragged,80)}})};
  makeDraggable(fab,fab,'food.aiFabPosition');
  makeDraggable(panel,panelHead,'food.aiPanelPosition');
  const open=()=>{panel.classList.add('open');input.focus()};
  fab.onclick=()=>{if(fab.dataset.justDragged)return;if(panel.classList.contains('open'))panel.classList.remove('open');else{panel.classList.add('open');restorePosition(panel,'food.aiPanelPosition');input.focus()}};panel.querySelector('[data-ai-close]').onclick=()=>panel.classList.remove('open');
  document.querySelectorAll('[data-ai-open]').forEach(button=>button.addEventListener('click',open));
  panel.querySelector('form').onsubmit=e=>{e.preventDefault();const question=input.value.trim();if(!question)return;messages.insertAdjacentHTML('beforeend',`<div class="ai-message user"></div>`);messages.lastElementChild.textContent=question;input.value='';const reply=document.createElement('div');reply.className='ai-message assistant';reply.textContent='正在结合你的身体数据和今日记录分析…';messages.appendChild(reply);messages.scrollTop=messages.scrollHeight;setTimeout(()=>{const target=FOOD_APP.targets(),plan=FOOD_APP.get('plan'),cal=plan.reduce((sum,item)=>sum+Number(item.calories||0),0);reply.textContent=`你今日计划约 ${cal} kcal，目标约 ${target.calories} kcal。建议优先补足优质蛋白和蔬菜，并根据饥饿程度调整主食份量。`;messages.scrollTop=messages.scrollHeight},650)};
  if(window.lucide)window.lucide.createIcons();
  window.addEventListener('resize',()=>{[fab,panel].forEach(el=>{const rect=el.getBoundingClientRect();if(rect.right>innerWidth||rect.bottom>innerHeight){el.style.left=`${Math.max(8,Math.min(rect.left,innerWidth-el.offsetWidth-8))}px`;el.style.top=`${Math.max(8,Math.min(rect.top,innerHeight-el.offsetHeight-8))}px`;el.style.right='auto';el.style.bottom='auto'}})});
}

function showDailyReminder() {
  if (sessionStorage.getItem('food.reminderShown')) return;
  sessionStorage.setItem('food.reminderShown', '1');
  const plan = FOOD_APP.get('plan');
  const total = plan.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  setTimeout(() => {
    const modal = document.getElementById('dailyReminder');
    if (!modal) return;
    modal.querySelector('[data-reminder-text]').textContent = `今日计划 ${plan.length} 餐，约 ${total} kcal。午餐后记得散步 10 分钟，当前饮水目标还差 ${Math.max(0, FOOD_APP.get('water').target - FOOD_APP.get('water').total)} ml。`;
    modal.classList.add('open');
  }, 450);
}
