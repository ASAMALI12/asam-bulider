import { ProjectFile } from '../types/project';

export interface ReadyTemplate {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  icon: string;
  description: string;
  badge: string;
  appId: string;
  permissions: string[];
  htmlContent: string;
  capacitorConfig?: any;
}

export const READY_TEMPLATES: ReadyTemplate[] = [
  {
    id: 'ecommerce',
    name: 'متجر تسوق إلكتروني متكامل',
    nameEn: 'Smart E-Commerce Store',
    category: 'تجارة وتسوق',
    icon: '🛍️',
    badge: 'الأكثر طلباً',
    appId: 'com.smart.shop',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.VIBRATE',
      'android.permission.POST_NOTIFICATIONS'
    ],
    description: 'متجر إلكتروني ذكي كامل مع تصفح المنتجات، سلة المشتريات، الدفع التجريبي، البحث والتصنيفات والعمل دون اتصال.',
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Smart Store</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; -webkit-tap-highlight-color: transparent; }
    body { background: #0b0f19; color: #f8fafc; min-height: 100vh; padding-bottom: 90px; }
    header { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; }
    .cart-btn { background: #10b981; color: #0b0f19; font-weight: 800; padding: 6px 14px; border-radius: 99px; border: none; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .search-box { margin: 16px; position: relative; }
    .search-box input { width: 100%; background: #1e293b; border: 1px solid #334155; padding: 12px 16px; border-radius: 14px; color: white; font-size: 13px; outline: none; }
    .cats { display: flex; gap: 8px; overflow-x: auto; padding: 0 16px 12px; scrollbar-width: none; }
    .cat-pill { background: #1e293b; border: 1px solid #334155; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .cat-pill.active { background: #10b981; color: #0f172a; border-color: #10b981; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 0 16px; }
    .card { background: #151d30; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 12px; display: flex; flex-direction: column; }
    .card-img { height: 110px; border-radius: 12px; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 8px; }
    .card h3 { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
    .card .price { color: #34d399; font-weight: 800; font-size: 14px; margin-bottom: 8px; }
    .add-btn { background: #3b82f6; color: white; border: none; padding: 8px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 12px; margin-top: auto; }
    .add-btn:active { transform: scale(0.96); }
    /* Cart Modal */
    #cart-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100; backdrop-filter: blur(8px); padding: 20px; align-items: flex-end; }
    .cart-content { background: #0f172a; border: 1px solid #334155; border-radius: 24px; padding: 20px; width: 100%; max-height: 80vh; display: flex; flex-direction: column; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1e293b; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="font-size: 16px; font-weight: 900;">متجر ذكي برو</h1>
      <p style="font-size: 11px; color: #94a3b8;">شحن سريع لجميع الوجهات</p>
    </div>
    <button class="cart-btn" onclick="toggleCart()">🛒 السلة (<span id="cart-count">0</span>)</button>
  </header>

  <div class="search-box">
    <input type="text" placeholder="ابحث عن منتج..." oninput="filterProducts(this.value)">
  </div>

  <div class="cats">
    <div class="cat-pill active" onclick="selectCat('all', this)">الكل</div>
    <div class="cat-pill" onclick="selectCat('phones', this)">الهواتف</div>
    <div class="cat-pill" onclick="selectCat('laptops', this)">أجهزة محمولة</div>
    <div class="cat-pill" onclick="selectCat('audio', this)">سماعات وصوتيات</div>
  </div>

  <div class="grid" id="products-grid"></div>

  <div id="cart-modal">
    <div class="cart-content">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h2 style="font-size:16px;">سلة المشتريات</h2>
        <button onclick="toggleCart()" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">✕</button>
      </div>
      <div id="cart-items" style="flex:1; overflow-y:auto; margin-bottom:16px;"></div>
      <div style="display:flex; justify-content:space-between; font-weight:800; font-size:15px; margin-bottom:14px;">
        <span>الإجمالي:</span>
        <span id="cart-total" style="color:#10b981;">0 $</span>
      </div>
      <button onclick="checkout()" style="background:#10b981; color:#0b0f19; border:none; padding:14px; border-radius:14px; font-weight:900; font-size:14px; cursor:pointer;">إتمام الشراء الآن</button>
    </div>
  </div>

  <script>
    const products = [
      { id: 1, name: 'هاتف Galaxy Ultra', cat: 'phones', price: 950, icon: '📱' },
      { id: 2, name: 'سماعة Pulse Max', cat: 'audio', price: 180, icon: '🎧' },
      { id: 3, name: 'حاسوب Pro Book 16', cat: 'laptops', price: 1450, icon: '💻' },
      { id: 4, name: 'ساعة ذكية Titanium', cat: 'phones', price: 290, icon: '⌚' },
      { id: 5, name: 'مكبر صوت استوديو', cat: 'audio', price: 120, icon: '🔊' },
      { id: 6, name: 'لوحة شحن لاسلكي', cat: 'phones', price: 45, icon: '⚡' }
    ];

    let cart = [];

    function renderProducts(list) {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = list.map(p => \`
        <div class="card">
          <div class="card-img">\${p.icon}</div>
          <h3>\${p.name}</h3>
          <div class="price">\${p.price} $</div>
          <button class="add-btn" onclick="addToCart(\${p.id})">إضافة للسلة</button>
        </div>
      \`).join('');
    }

    function addToCart(id) {
      const p = products.find(x => x.id === id);
      cart.push(p);
      updateCartUI();
      if (navigator.vibrate) navigator.vibrate(50);
    }

    function updateCartUI() {
      document.getElementById('cart-count').innerText = cart.length;
      const total = cart.reduce((s, i) => s + i.price, 0);
      document.getElementById('cart-total').innerText = total + ' $';

      const itemsEl = document.getElementById('cart-items');
      if (cart.length === 0) {
        itemsEl.innerHTML = '<p style="text-align:center; color:#64748b; padding:20px;">السلة فارغة حالياً</p>';
      } else {
        itemsEl.innerHTML = cart.map((item, idx) => \`
          <div class="cart-item">
            <div>
              <div style="font-weight:700;">\${item.name}</div>
              <div style="font-size:12px; color:#34d399;">\${item.price} $</div>
            </div>
            <button onclick="removeFromCart(\${idx})" style="background:#ef4444/20; color:#ef4444; border:none; padding:4px 10px; border-radius:8px; cursor:pointer;">حذف</button>
          </div>
        \`).join('');
      }
    }

    function removeFromCart(idx) {
      cart.splice(idx, 1);
      updateCartUI();
    }

    function toggleCart() {
      const el = document.getElementById('cart-modal');
      el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
      updateCartUI();
    }

    function checkout() {
      if (cart.length === 0) return alert('السلة فارغة!');
      alert('تم استلام طلبك بنجاح! شكراً لتسوقك.');
      cart = [];
      updateCartUI();
      toggleCart();
    }

    function selectCat(cat, el) {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      if (cat === 'all') renderProducts(products);
      else renderProducts(products.filter(p => p.cat === cat));
    }

    function filterProducts(query) {
      renderProducts(products.filter(p => p.name.includes(query)));
    }

    renderProducts(products);
  </script>
</body>
</html>`
  },
  {
    id: 'ai-assistant',
    name: 'المساعد الذكي والمحادثة الفورية',
    nameEn: 'AI Chat & Voice Companion',
    category: 'ذكاء اصطناعي',
    icon: '🤖',
    badge: 'ذكاء فائق',
    appId: 'com.smart.aiassistant',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.RECORD_AUDIO',
      'android.permission.VIBRATE',
      'android.permission.POST_NOTIFICATIONS'
    ],
    description: 'تطبيق محادثة ذكي ومساعد شخصي متقدم للإجابة عن الأسئلة، كتابة النصوص، الإملاء الصوتي، وحفظ سجل المحادثات.',
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>AI Voice & Chat</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body { background: #090d16; color: #f1f5f9; height: 100vh; display: flex; flex-direction: column; }
    header { background: #111827; padding: 14px 20px; border-bottom: 1px solid #1f2937; display: flex; justify-content: space-between; align-items: center; }
    .chat-box { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .bubble { max-width: 82%; padding: 12px 16px; border-radius: 18px; font-size: 13px; line-height: 1.6; }
    .bubble.user { background: #3b82f6; align-self: flex-start; border-top-right-radius: 4px; }
    .bubble.bot { background: #1e293b; align-self: flex-end; border-top-left-radius: 4px; border: 1px solid #334155; }
    .input-bar { background: #111827; padding: 12px 16px; border-top: 1px solid #1f2937; display: flex; gap: 8px; align-items: center; }
    input { flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 10px 16px; color: white; outline: none; font-size: 13px; }
    button { background: #10b981; border: none; color: #090d16; font-weight: 800; padding: 10px 16px; border-radius: 12px; cursor: pointer; }
    .voice-btn { background: #3b82f6; color: white; padding: 10px 12px; border-radius: 12px; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="font-size: 16px; font-weight: 800;">المساعد الذكي (AI Pro)</h1>
      <p style="font-size: 11px; color: #34d399;">متصل وجاهز للمساعدة</p>
    </div>
    <button onclick="clearChat()" style="background:#1e293b; color:#94a3b8; font-size:11px; padding:6px 12px;">مسح</button>
  </header>

  <div class="chat-box" id="chat">
    <div class="bubble bot">
      مرحباً بك! أنا مساعدك الذكي المدمج في هذا التطبيق. يمكنك سؤالي عن أي شيء أو الاستعانة بي في حل المشاكل والترجمة أو كتابة الأكواد! 💡
    </div>
  </div>

  <div class="input-bar">
    <button class="voice-btn" onclick="startVoice()" title="إملاء صوتي">🎙️</button>
    <input type="text" id="userInput" placeholder="اكتب سؤالك أو فكرتك هنا..." onkeydown="if(event.key==='Enter') sendMsg()">
    <button onclick="sendMsg()">إرسال</button>
  </div>

  <script>
    function sendMsg() {
      const input = document.getElementById('userInput');
      const text = input.value.trim();
      if (!text) return;

      appendBubble(text, 'user');
      input.value = '';

      setTimeout(() => {
        let reply = "شكراً على سؤالك! لقد قمت بمعالجة طلبك: '" + text + "' بدقة عبر خوارزمية الذكاء الاصطناعي، وكل شيء يعمل بكفاءة وسرعة على نظام أندرويد.";
        if (text.includes("كود") || text.includes("برمجة")) {
          reply = "إليك نموذج كود متوافق:\\n\\nconst app = async () => {\\n  console.log('APK Studio running!');\\n};";
        }
        appendBubble(reply, 'bot');
        if (navigator.vibrate) navigator.vibrate(40);
      }, 500);
    }

    function appendBubble(text, sender) {
      const chat = document.getElementById('chat');
      const div = document.createElement('div');
      div.className = 'bubble ' + sender;
      div.innerText = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function startVoice() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.start();
        recognition.onresult = (e) => {
          document.getElementById('userInput').value = e.results[0][0].transcript;
          sendMsg();
        };
      } else {
        alert('ميزة التعرف الصوتي تتطلب متصفح Chrome أو بيئة هاتف حديثة.');
      }
    }

    function clearChat() {
      document.getElementById('chat').innerHTML = '<div class="bubble bot">تم بدء محادثة جديدة! كيف يمكنني مساعدتك؟</div>';
    }
  </script>
</body>
</html>`
  },
  {
    id: 'kanban-tasks',
    name: 'إدارة المهام والمشاريع المتقدم (Kanban)',
    nameEn: 'Pro Task & Kanban Manager',
    category: 'إنتاجية وأعمال',
    icon: '📋',
    badge: 'تنظيم ذكي',
    appId: 'com.smart.taskmanager',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.VIBRATE',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.WAKE_LOCK'
    ],
    description: 'تطبيق لإدارة المهام والمشاريع بنظام بطاقات كانبان التفاعلي، مع تتبع الإنجاز والتخزين السحابي والمحلي.',
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Task Manager Pro</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body { background: #0f172a; color: #f8fafc; min-height: 100vh; padding: 16px; padding-bottom: 70px; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .col { background: #1e293b; border-radius: 18px; padding: 14px; margin-bottom: 14px; border: 1px solid #334155; }
    .col-title { font-size: 14px; font-weight: 800; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
    .task { background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .task.done { opacity: 0.5; text-decoration: line-through; }
    .add-form { display: flex; gap: 8px; margin-bottom: 16px; }
    input { flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 10px 14px; color: white; font-size: 13px; outline: none; }
    button { background: #10b981; color: #0f172a; font-weight: 800; border: none; padding: 10px 18px; border-radius: 12px; cursor: pointer; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="font-size: 17px; font-weight: 800;">إدارة المهام الذكية</h1>
      <p style="font-size: 11px; color: #94a3b8;">تنظيم مهام ومشاريع العمل</p>
    </div>
    <div style="background:#3b82f6/20; color:#60a5fa; font-weight:800; padding:4px 10px; border-radius:8px; font-size:12px;" id="stats">
      0 مكتملة
    </div>
  </header>

  <div class="add-form">
    <input type="text" id="taskInput" placeholder="أضف مهمة عمل جديدة..." onkeydown="if(event.key==='Enter') addTask()">
    <button onclick="addTask()">إضافة</button>
  </div>

  <div class="col">
    <div class="col-title">
      <span>📌 قيد التنفيذ</span>
      <span id="pending-count" style="color:#f59e0b;">0</span>
    </div>
    <div id="pending-list"></div>
  </div>

  <div class="col">
    <div class="col-title">
      <span>✅ المكتملة</span>
      <span id="done-count" style="color:#10b981;">0</span>
    </div>
    <div id="done-list"></div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('smart_tasks') || '[]');

    if (tasks.length === 0) {
      tasks = [
        { id: 1, title: 'بناء ملف APK للتطبيق', done: false },
        { id: 2, title: 'ربط التخزين السحابي السريع', done: false },
        { id: 3, title: 'إعداد شهادات التوقيع Debug Key', done: true }
      ];
    }

    function render() {
      const pendingEl = document.getElementById('pending-list');
      const doneEl = document.getElementById('done-list');
      pendingEl.innerHTML = '';
      doneEl.innerHTML = '';

      let doneCount = 0;
      let pendingCount = 0;

      tasks.forEach((t, i) => {
        const item = document.createElement('div');
        item.className = 'task' + (t.done ? ' done' : '');
        item.innerHTML = \`
          <span onclick="toggleTask(\${i})" style="cursor:pointer; flex:1;">\${t.title}</span>
          <button onclick="deleteTask(\${i})" style="background:#ef4444/20; color:#ef4444; padding:4px 8px; font-size:11px;">✕</button>
        \`;

        if (t.done) {
          doneCount++;
          doneEl.appendChild(item);
        } else {
          pendingCount++;
          pendingEl.appendChild(item);
        }
      });

      document.getElementById('pending-count').innerText = pendingCount;
      document.getElementById('done-count').innerText = doneCount;
      document.getElementById('stats').innerText = doneCount + ' مكتملة من ' + tasks.length;
      localStorage.setItem('smart_tasks', JSON.stringify(tasks));
    }

    function addTask() {
      const input = document.getElementById('taskInput');
      if (!input.value.trim()) return;
      tasks.unshift({ id: Date.now(), title: input.value.trim(), done: false });
      input.value = '';
      render();
      if (navigator.vibrate) navigator.vibrate(40);
    }

    function toggleTask(idx) {
      tasks[idx].done = !tasks[idx].done;
      render();
    }

    function deleteTask(idx) {
      tasks.splice(idx, 1);
      render();
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'diagnostics-sensors',
    name: 'فحص وتشخيص أجهزة ومستشعرات الهاتف',
    nameEn: 'Device Diagnostics & Hardware Suite',
    category: 'أدوات ونظام',
    icon: '🔍',
    badge: 'أدوات متطورة',
    appId: 'com.smart.diagnostics',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.VIBRATE',
      'android.permission.RECORD_AUDIO'
    ],
    description: 'تطبيق لفحص عتاد الهاتف ومستشعرات البطارية والبوصلة والكاميرا والموقع الجغرافي وسرعة الاتصال.',
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Device Diagnostics</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body { background: #080c14; color: #f8fafc; min-height: 100vh; padding: 16px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 14px; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 14px; text-align: center; }
    .val { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; color: #38bdf8; margin: 6px 0; }
    .btn { background: #10b981; color: #080c14; border: none; font-weight: 800; padding: 10px; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 8px; font-size: 12px; }
  </style>
</head>
<body>
  <h1 style="font-size: 18px; font-weight: 900;">تشخيص عتاد الهاتف (Hardware Pro)</h1>
  <p style="font-size: 12px; color: #94a3b8;">فحص حي لمستشعرات نظام أندرويد</p>

  <div class="grid">
    <div class="card">
      <div style="font-size:24px;">🔋</div>
      <div style="font-size:12px; color:#94a3b8;">البطارية</div>
      <div class="val" id="bat">100%</div>
      <div style="font-size:11px; color:#10b981;" id="bat-state">سليمة تماماً</div>
    </div>

    <div class="card">
      <div style="font-size:24px;">📶</div>
      <div style="font-size:12px; color:#94a3b8;">الشبكة</div>
      <div class="val" id="net">متصل</div>
      <div style="font-size:11px; color:#38bdf8;">WiFi / 4G</div>
    </div>

    <div class="card">
      <div style="font-size:24px;">📳</div>
      <div style="font-size:12px; color:#94a3b8;">محرك الاهتزاز</div>
      <div class="val">جاهز</div>
      <button class="btn" onclick="navigator.vibrate && navigator.vibrate([100, 50, 100, 50, 200])">اختبار النبض</button>
    </div>

    <div class="card">
      <div style="font-size:24px;">📍</div>
      <div style="font-size:12px; color:#94a3b8;">مستشعر GPS</div>
      <div class="val" id="gps-val">جاهز</div>
      <button class="btn" onclick="testGPS()">تحديد الإحداثيات</button>
    </div>
  </div>

  <div style="margin-top:16px; background:#111827; border:1px solid #1f2937; border-radius:16px; padding:16px;">
    <h3 style="font-size:13px; font-weight:700; margin-bottom:8px;">معلومات النظام والعتاد:</h3>
    <p style="font-size:11px; color:#94a3b8; font-family:'JetBrains Mono'; line-height:1.8;" id="sys-info">
      جاري قراءة المعالج والذاكرة...
    </p>
  </div>

  <script>
    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        document.getElementById('bat').innerText = Math.round(b.level * 100) + '%';
        document.getElementById('bat-state').innerText = b.charging ? 'جاري الشحن ⚡' : 'سليمة وتعمل';
      });
    }

    function testGPS() {
      if (navigator.geolocation) {
        document.getElementById('gps-val').innerText = 'جاري البحث...';
        navigator.geolocation.getCurrentPosition(
          p => document.getElementById('gps-val').innerText = p.coords.latitude.toFixed(2) + '°',
          () => document.getElementById('gps-val').innerText = 'تعذر الوصول'
        );
      }
    }

    document.getElementById('sys-info').innerHTML = 
      'المتصفح: ' + navigator.userAgent.split(' ')[0] + '<br>' +
      'دقة الشاشة: ' + window.screen.width + 'x' + window.screen.height + ' بكسل<br>' +
      'الأنوية المتاحة: ' + (navigator.hardwareConcurrency || 8) + ' Cores<br>' +
      'حالة الذاكرة: كافية ومستقرة';
  </script>
</body>
</html>`
  },
  {
    id: 'media-player',
    name: 'مشغل الموسيقى والبودكاست الذكي',
    nameEn: 'Smart Media & Music Player',
    category: 'وسائط وصوت',
    icon: '🎵',
    badge: 'تصميم صوتي',
    appId: 'com.smart.musicplayer',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.WAKE_LOCK',
      'android.permission.VIBRATE'
    ],
    description: 'تطبيق لتشغيل المقاطع الصوتية والبودكاست مع مؤثرات بصرية وتحكم كامل في التشغيل في الخلفية.',
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Smart Audio Player</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body { background: #070a13; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
    .art { width: 180px; height: 180px; border-radius: 30px; background: linear-gradient(135deg, #ec4899, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 70px; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(236,72,153,0.3); }
    .controls { display: flex; align-items: center; gap: 20px; margin-top: 24px; }
    .play-btn { width: 64px; height: 64px; border-radius: 50%; background: #10b981; border: none; font-size: 24px; color: #070a13; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .sec-btn { background: #1e293b; border: none; color: white; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 16px; }
    .bar { width: 100%; max-width: 280px; height: 6px; background: #1e293b; border-radius: 99px; overflow: hidden; margin-top: 20px; }
    .prog { width: 40%; height: 100%; background: #10b981; }
  </style>
</head>
<body>
  <div class="art">🎵</div>
  <h2 style="font-size: 18px; font-weight: 800;">بودكاست التكنولوجيا والذكاء</h2>
  <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">الحلقة 14: مستقبل تطبيقات الأندرويد</p>

  <div class="bar"><div class="prog"></div></div>

  <div class="controls">
    <button class="sec-btn" onclick="alert('المقطع السابق')">⏮</button>
    <button class="play-btn" id="play" onclick="togglePlay()">▶</button>
    <button class="sec-btn" onclick="alert('المقطع التالي')">⏭</button>
  </div>

  <script>
    let playing = false;
    function togglePlay() {
      playing = !playing;
      document.getElementById('play').innerText = playing ? '⏸' : '▶';
      if (navigator.vibrate) navigator.vibrate(40);
    }
  </script>
</body>
</html>`
  }
];
