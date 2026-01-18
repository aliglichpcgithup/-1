import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Moon, 
  Sun, 
  BookOpen, 
  Utensils, 
  Star, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Heart,
  Layout,
  X,
  ChefHat,
  Trash2,
  Bell,
  Soup,
  Coffee,
  Apple,
  Info
} from 'lucide-react';

const App = () => {
  const RAMADAN_START_DATE = new Date('2026-02-18T00:00:00');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [direction, setDirection] = useState(0);

  // Подробная база рецептов
  const recipeDetails = {
    'Овсянка с финиками и миндалем': {
      ing: 'Овсяные хлопья (50г), молоко или вода (200мл), 3-4 финика, горсть миндаля, щепотка корицы.',
      prep: 'Сварите овсянку до готовности. Добавьте нарезанные финики и дробленый миндаль. Корица поможет дольше сохранять чувство сытости.'
    },
    'Яичница с помидорами (Шакшука)': {
      ing: '2 яйца, 1 крупный томат, половина луковицы, специи (кумин, паприка), зелень.',
      prep: 'Обжарьте лук и томаты до мягкости. Сделайте углубления, разбейте туда яйца. Томите под крышкой 5 минут. Идеально с цельнозерновым хлебом.'
    },
    'Чечевичный суп (Мерджимек)': {
      ing: 'Красная чечевица (1 стакан), 1 луковица, 1 морковь, 1 ст.л. томатной пасты, лимон.',
      prep: 'Обжарьте овощи, добавьте чечевицу и воду. Варите 20 минут, затем взбейте блендером. Подавайте с соком лимона для лучшего усвоения железа.'
    },
    'Плов с говядиной': {
      ing: 'Говядина (300г), рис длиннозерный (200г), много моркови, лук, чеснок, зира.',
      prep: 'Обжарьте мясо с овощами (зирвак), засыпьте рис, залейте водой на 1.5 см выше уровня риса. Готовьте на медленном огне до выкипания воды.'
    },
    'Набиз (вода с финиками)': {
      ing: '1 стакан воды, 3-5 фиников (без косточек).',
      prep: 'Замочите финики в воде с вечера. К сухуру получится целебный напиток, дающий энергию на весь день. Рекомендуется употреблять сразу после приготовления.'
    },
    'Творог с медом и бананом': {
      ing: 'Творог 5-9% (200г), 1 банан, 1 ст.л. меда, семена льна или чиа.',
      prep: 'Смешайте творог с нарезанным бананом и медом. Семена добавят полезных жиров, необходимых во время поста.'
    }
  };

  const recipeDatabase = {
    suhoor: [
      'Овсянка с финиками и миндалем', 'Яичница с помидорами (Шакшука)', 'Творог с медом и бананом', 
      'Тосты с авокадо и яйцом пашот', 'Гречка с молоком', 'Сэндвич с сыром и огурцом',
      'Гранола с йогуртом и ягодами', 'Омлет со шпинатом', 'Блины из цельнозерновой муки',
      'Финиковый смузи-боул', 'Рисовая каша с курагой', 'Сырники в духовке'
    ],
    iftar: [
      'Чечевичный суп (Мерджимек)', 'Запеченная курица с картофелем', 'Плов с говядиной',
      'Мясной суп с овощами (Шурпа)', 'Рыба на пару с рисом', 'Паста с томатами и базиликом',
      'Тушеная баранина с нутом', 'Голубцы или Долма', 'Стейк из лосося с брокколи',
      'Рагу из телятины', 'Куриные котлеты с пюре', 'Лагман'
    ],
    drinks: [
      'Набиз (вода с финиками)', 'Мятный чай с лимоном', 'Компот из сухофруктов',
      'Кефир или Айран', 'Свежевыжатый апельсиновый сок', 'Травяной сбор',
      'Гранатовый сок', 'Молоко с медом', 'Арбузный фреш'
    ]
  };

  const createInitialData = () => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, taraweeh: false },
    quran: { surah: '', verses: '', completed: false },
    meals: { suhoor: '', iftar: '' },
    deeds: [
      { id: 1, text: 'Дать садака', done: false },
      { id: 2, text: 'Позвонить родителям', done: false }
    ],
    notes: ''
  }));

  const [ramadanData, setRamadanData] = useState(() => {
    const saved = localStorage.getItem('ramadan_data_2026_v2');
    return saved ? JSON.parse(saved) : createInitialData();
  });

  useEffect(() => {
    localStorage.setItem('ramadan_data_2026_v2', JSON.stringify(ramadanData));
  }, [ramadanData]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getRamadanStatus = () => {
    const start = new Date(RAMADAN_START_DATE);
    const now = new Date(currentTime);
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = start - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { isStarted: false, daysUntil: diffDays };
    } else {
      const dayOfRamadan = Math.abs(diffDays) + 1;
      return { isStarted: true, currentDay: Math.min(dayOfRamadan, 30), isFinished: dayOfRamadan > 30 };
    }
  };

  const status = getRamadanStatus();
  const [selectedDay, setSelectedDay] = useState(status.isStarted ? status.currentDay : 1);

  const changeDay = (newDay) => {
    if (newDay < 1 || newDay > 30) return;
    setDirection(newDay > selectedDay ? 1 : -1);
    setSelectedDay(newDay);
  };

  const updateDayData = (dayIndex, field, value) => {
    const newData = [...ramadanData];
    newData[dayIndex] = { ...newData[dayIndex], [field]: value };
    setRamadanData(newData);
  };

  const togglePrayer = (dayIndex, prayer) => {
    const newData = [...ramadanData];
    newData[dayIndex].prayers[prayer] = !newData[dayIndex].prayers[prayer];
    setRamadanData(newData);
  };

  const resetAllData = () => {
    const confirmed = window.confirm('Внимание! Все ваши записи будут удалены. Продолжить?');
    if (confirmed) {
      setRamadanData(createInitialData());
      setIsSettingsOpen(false);
    }
  };

  const currentDayData = ramadanData[selectedDay - 1];

  const getDailyRecipes = (day) => {
    const getItems = (list) => {
      const startIdx = (day - 1) % (list.length - 2);
      return list.slice(startIdx, startIdx + 3);
    };

    return [
      { title: 'Сухур (Энергия)', items: getItems(recipeDatabase.suhoor), icon: <Sun className="text-orange-400"/> },
      { title: 'Ифтар (Легкость)', items: getItems(recipeDatabase.iftar), icon: <Moon className="text-indigo-400"/> },
      { title: 'Напитки', items: getItems(recipeDatabase.drinks), icon: <Coffee className="text-emerald-400"/> }
    ];
  };

  const currentRecipes = getDailyRecipes(selectedDay);

  if (!status.isStarted) {
    return (
      <div className="min-h-screen bg-[#062c21] text-white flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        <div className="relative z-10 animate-in zoom-in duration-700 max-w-lg w-full">
          <Moon size={100} className="text-yellow-100 fill-yellow-100 mx-auto mb-8" />
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Рамадан <span className="text-emerald-400">2026</span></h1>
          <div className="bg-white/10 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 shadow-2xl inline-block w-full">
            <div className="text-8xl md:text-9xl font-black text-white mb-2 tabular-nums">{status.daysUntil}</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-emerald-400 font-black">Дней до начала</div>
          </div>
          <button onClick={() => setCurrentTime(new Date(RAMADAN_START_DATE))} className="mt-10 block w-full bg-white text-emerald-950 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all">Открыть Планер</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f0d] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <header className={`${isDarkMode ? 'bg-[#0f2a22]' : 'bg-emerald-900'} text-white pt-8 pb-32 px-6 rounded-b-[4rem] shadow-xl relative overflow-hidden`}>
        <div className="max-w-4xl mx-auto flex justify-between items-start mb-6 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1">Дневник Поста</h1>
            <span className="text-xs font-bold text-emerald-100 opacity-80">Рамадан 2026 • День {selectedDay}</span>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl transition-all border border-white/10">
            <Settings size={22} />
          </button>
        </div>
        
        <div className="max-w-md mx-auto relative z-10 bg-white/10 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/10 flex items-center justify-between shadow-xl">
          <button onClick={() => changeDay(selectedDay - 1)} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-2xl transition-all"><ChevronLeft size={28} /></button>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-1">Февраль - Март</span>
            <div key={selectedDay} className="text-5xl md:text-6xl font-black text-yellow-400 tracking-tighter animate-in fade-in slide-in-from-bottom-4">{selectedDay}</div>
          </div>
          <button onClick={() => changeDay(selectedDay + 1)} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-2xl transition-all"><ChevronRight size={28} /></button>
        </div>
      </header>

      <main className="px-5 max-w-4xl mx-auto space-y-8 -mt-16 relative z-20">
        <nav className={`max-w-md mx-auto flex backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-lg border transition-colors sticky top-4 z-30 ${isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-white/50'}`}>
          {[
            { id: 'daily', label: 'План', icon: <Layout size={18}/> },
            { id: 'quran', label: 'Коран', icon: <BookOpen size={18}/> },
            { id: 'meals', label: 'Кухня', icon: <Utensils size={18}/> },
            { id: 'progress', label: 'Итоги', icon: <Star size={18}/> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 rounded-[2rem] transition-all ${activeTab === tab.id ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400'}`}
            >
              {tab.icon}
              <span className="text-[9px] mt-1 font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div key={`${selectedDay}-${activeTab}`} className="space-y-6 animate-in fade-in duration-500">
          {activeTab === 'daily' && (
            <div className="grid md:grid-cols-2 gap-6">
              <section className={`p-6 md:p-8 rounded-[3rem] border transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Clock className="text-emerald-600" /> Намазы</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(currentDayData.prayers).map((prayer) => (
                    <button
                      key={prayer}
                      onClick={() => togglePrayer(selectedDay - 1, prayer)}
                      className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${currentDayData.prayers[prayer] ? 'bg-emerald-500/10 border-emerald-500' : 'bg-transparent border-transparent'}`}
                    >
                      <span className="text-[8px] font-black uppercase text-slate-400">{prayer}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${currentDayData.prayers[prayer] ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
                        {currentDayData.prayers[prayer] && <CheckCircle2 size={16} />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className={`p-6 md:p-8 rounded-[3rem] border transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                 <h3 className="text-xl font-black mb-4 flex items-center gap-3"><Heart className="text-rose-500" /> Дела дня</h3>
                 <div className="space-y-3">
                    {currentDayData.deeds.map((deed, idx) => (
                      <button 
                        key={deed.id}
                        onClick={() => {
                          const newDeeds = [...currentDayData.deeds];
                          newDeeds[idx].done = !newDeeds[idx].done;
                          updateDayData(selectedDay - 1, 'deeds', newDeeds);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${deed.done ? 'opacity-50' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-50')}`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${deed.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                          {deed.done && <CheckCircle2 size={14}/>}
                        </div>
                        <span className={`text-sm font-bold ${deed.done ? 'line-through' : ''}`}>{deed.text}</span>
                      </button>
                    ))}
                 </div>
              </section>
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-8 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-orange-400"><Sun size={20}/> Сухур</h3>
                  <textarea 
                    value={currentDayData.meals.suhoor} 
                    onChange={(e) => updateDayData(selectedDay - 1, 'meals', { ...currentDayData.meals, suhoor: e.target.value })} 
                    className={`w-full rounded-2xl p-4 outline-none h-40 text-sm font-bold resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} 
                    placeholder="Ваше меню на завтрак..." 
                  />
                </div>
                <div className={`p-8 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-indigo-400"><Moon size={20}/> Ифтар</h3>
                  <textarea 
                    value={currentDayData.meals.iftar} 
                    onChange={(e) => updateDayData(selectedDay - 1, 'meals', { ...currentDayData.meals, iftar: e.target.value })} 
                    className={`w-full rounded-2xl p-4 outline-none h-40 text-sm font-bold resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} 
                    placeholder="Ваше меню на ужин..." 
                  />
                </div>
              </div>
              <button 
                onClick={() => setIsRecipeModalOpen(true)}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-3 p-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                <ChefHat size={24}/> Посмотреть рецепты ({selectedDay}-й день)
              </button>
            </div>
          )}

          {activeTab === 'quran' && (
            <div className={`max-w-xl mx-auto p-10 rounded-[4rem] border transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-4 justify-center text-emerald-600"><BookOpen size={32} /> План чтения</h3>
              <div className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Напр: Сура 36 Ясин" 
                  value={currentDayData.quran.surah}
                  onChange={(e) => updateDayData(selectedDay - 1, 'quran', { ...currentDayData.quran, surah: e.target.value })}
                  className={`w-full p-6 rounded-3xl outline-none font-bold text-lg text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                />
                <button 
                  onClick={() => updateDayData(selectedDay - 1, 'quran', { ...currentDayData.quran, completed: !currentDayData.quran.completed })}
                  className={`w-full py-6 rounded-3xl font-black tracking-widest transition-all ${currentDayData.quran.completed ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}
                >
                  {currentDayData.quran.completed ? 'ВЫПОЛНЕНО ✔' : 'ОТМЕТИТЬ КАК ВЫПОЛНЕННОЕ'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
             <div className={`p-10 rounded-[4rem] border transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
               <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-yellow-500"><Star size={28} /> Мысли дня</h3>
               <textarea 
                value={currentDayData.notes} 
                onChange={(e) => updateDayData(selectedDay - 1, 'notes', e.target.value)} 
                className={`w-full rounded-3xl p-8 outline-none h-60 text-lg font-bold resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`} 
                placeholder="Запишите ваши размышления или важные моменты дня..." 
              />
             </div>
          )}
        </div>
      </main>

      {/* Recipe Modal */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className={`w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 transition-colors overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-4">
                 <ChefHat size={32} className="text-emerald-500" />
                 <h3 className="text-2xl font-black">Меню: День {selectedDay}</h3>
               </div>
               <button onClick={() => { setIsRecipeModalOpen(false); setSelectedRecipeDetail(null); }} className="p-2 bg-slate-100 rounded-full text-slate-900"><X/></button>
             </div>
             
             {selectedRecipeDetail ? (
               <div className="animate-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setSelectedRecipeDetail(null)} className="mb-4 text-emerald-500 font-bold flex items-center gap-2">
                    <ChevronLeft size={18}/> Назад к списку
                  </button>
                  <h4 className="text-2xl font-black mb-6 text-emerald-600 leading-tight">{selectedRecipeDetail.name}</h4>
                  <div className="space-y-6">
                    <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <h5 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Ингредиенты:</h5>
                      <p className="font-bold leading-relaxed">{selectedRecipeDetail.ing}</p>
                    </div>
                    <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <h5 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Приготовление:</h5>
                      <p className="font-bold leading-relaxed opacity-80">{selectedRecipeDetail.prep}</p>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="grid md:grid-cols-3 gap-6">
                  {currentRecipes.map((cat, idx) => (
                    <div key={idx} className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-800 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        {cat.icon}
                        <h4 className="font-black text-[10px] uppercase tracking-wider">{cat.title}</h4>
                      </div>
                      <div className="flex flex-col gap-2">
                        {cat.items.map((item, i) => (
                          <button 
                            key={i} 
                            onClick={() => recipeDetails[item] && setSelectedRecipeDetail({ name: item, ...recipeDetails[item] })}
                            className={`group flex items-start gap-2 text-sm font-bold leading-tight text-left transition-all ${recipeDetails[item] ? 'hover:text-emerald-500' : 'cursor-default'}`}
                          >
                            <div className={`w-1.5 h-1.5 min-w-[6px] rounded-full mt-1.5 transition-colors ${recipeDetails[item] ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <span>
                              {item}
                              {recipeDetails[item] && <Info size={12} className="inline ml-1 opacity-40 group-hover:opacity-100" />}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
             )}
             
             {!selectedRecipeDetail && (
               <div className="mt-8 p-6 rounded-[2rem] border-2 border-dashed border-emerald-500/20 text-center">
                 <p className="text-[11px] font-bold opacity-60 italic">
                   Нажмите на блюдо с иконкой (i), чтобы увидеть рецепт. Список идей обновляется каждый день!
                 </p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className={`w-full max-w-md rounded-[3rem] p-10 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black">Настройки</h3>
               <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-900"><X/></button>
             </div>
             <div className="space-y-4">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between p-5 bg-slate-500/10 rounded-3xl font-bold">
                  <span>Темная тема</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </button>
                <button onClick={resetAllData} className="w-full flex items-center justify-center gap-3 p-5 text-rose-500 bg-rose-500/10 rounded-3xl font-bold">
                  <Trash2 size={18}/> Удалить все записи
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;