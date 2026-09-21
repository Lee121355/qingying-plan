const FOOD_AUTH = {
  scopedKey(username, key) { return `food.user.${encodeURIComponent(username)}.${key}`; },
  accounts() {
    let accounts = {};
    try { accounts = JSON.parse(localStorage.getItem('food.accounts') || '{}') || {}; } catch {}
    try {
      const legacy = JSON.parse(localStorage.getItem('food.account') || 'null');
      if (legacy?.username && !accounts[legacy.username]) {
        let name = legacy.username;
        try { name = JSON.parse(localStorage.getItem('food.profile') || 'null')?.name || name; } catch {}
        accounts[legacy.username] = { username: legacy.username, password: legacy.password, name };
        localStorage.setItem('food.accounts', JSON.stringify(accounts));
      }
    } catch {}
    return accounts;
  },
  save(accounts) { localStorage.setItem('food.accounts', JSON.stringify(accounts)); },
  initializeBlank(username) {
    const marker = this.scopedKey(username, 'initialized');
    if (localStorage.getItem(marker) === '1') return;
    const profile = { name: '', gender: '', age: '', height: '', weight: '', bodyFat: '', goal: '', activity: '' };
    localStorage.setItem(this.scopedKey(username, 'profile'), JSON.stringify(profile));
    localStorage.setItem(marker, '1');
  },
  profileComplete(username) {
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem(this.scopedKey(username, 'profile')) || 'null'); } catch {}
    return Boolean(profile && profile.name && ['男', '女'].includes(profile.gender) && Number(profile.age) > 0 && Number(profile.height) > 0 && Number(profile.weight) > 0 && profile.goal && profile.activity);
  },
  onboardingState(username) {
    const key = this.scopedKey(username, 'onboardingComplete');
    let state = localStorage.getItem(key);
    if (state === null) {
      state = this.profileComplete(username) ? '2' : '0';
      localStorage.setItem(key, state);
    } else if (state === '1' && this.profileComplete(username)) {
      // In older versions, "1" meant the entire onboarding flow was complete.
      state = '2';
      localStorage.setItem(key, state);
    }
    return state;
  },
  activate(account) {
    localStorage.setItem('food.currentUser', account.username);
    localStorage.setItem('food.account', JSON.stringify({ username: account.username, password: account.password }));
    localStorage.setItem('food.auth', '1');
    sessionStorage.removeItem(`food.reminderShown.${encodeURIComponent(account.username)}`);
  },
  register(username, password, name) {
    const accounts = this.accounts();
    if (accounts[username]) return { ok: false, message: '该用户名已注册，请直接登录。' };
    const account = { username, password, name: name || username };
    accounts[username] = account;
    this.save(accounts);
    this.initializeBlank(username);
    localStorage.setItem(this.scopedKey(username, 'onboardingComplete'), '0');
    this.activate(account);
    return { ok: true, next: 'onboarding.html' };
  },
  login(username, password) {
    const accounts = this.accounts();
    let account = accounts[username];
    if (account && account.password !== password) return { ok: false, message: '用户名或密码不正确。' };
    if (!account) {
      account = { username, password, name: username };
      accounts[username] = account;
      this.save(accounts);
    }
    this.initializeBlank(username);
    const state = this.onboardingState(username);
    this.activate(account);
    return { ok: true, next: state === '0' ? 'onboarding.html' : state === '1' ? 'profile.html?setup=1' : 'index.html' };
  },
  guest() {
    this.initializeBlank('guest');
    const state = this.onboardingState('guest');
    localStorage.setItem('food.currentUser', 'guest');
    localStorage.setItem('food.auth', '1');
    sessionStorage.removeItem('food.reminderShown.guest');
    return { ok: true, next: state === '0' ? 'onboarding.html' : state === '1' ? 'profile.html?setup=1' : 'index.html' };
  }
};
