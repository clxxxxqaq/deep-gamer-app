/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Share2, 
  Download,
  ChevronRight, 
  Search, 
  History, 
  BarChart3, 
  Flame,
  Gamepad2,
  Link as LinkIcon,
  ShieldCheck,
  ClipboardList,
  ArrowLeft,
  HelpCircle,
  ShieldAlert,
  X,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Settings,
  Users,
  Mail,
  Copy,
  MessageCircle,
  Send,
  Image,
  RefreshCw,
  Bell,
  Brain,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Phone,
  Star,
  Filter,
  ArrowDownUp,
  Lock,
  ShoppingCart,
  Store,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/src/lib/utils';

// --- Types ---

import { GameType, ValuationMethod, Page, Message, UserInfo, ValuationHistory, ValuationRecord, MarketData, AccountItem, OrderItem } from './types';
import { SCREENSHOT_CONFIGS, MOCK_RECORDS, MOCK_MARKET_DATA, HOT_TAGS, MOCK_ACCOUNTS } from './constants';

// --- Components ---

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="flex items-center gap-2">
      {onBack && (
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
    </div>
  </header>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-2xl p-4 shadow-sm border border-gray-100", className)}>
    {children}
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameType>('王者荣耀');
  const [selectedMethod, setSelectedMethod] = useState<ValuationMethod>('授权估值');
  const [inputValue, setInputValue] = useState('');
  const [marketGame, setMarketGame] = useState<GameType>('王者荣耀');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountStep, setDeleteAccountStep] = useState(1);
  const [deleteAccountCode, setDeleteAccountCode] = useState('');
  const [deleteAccountTimer, setDeleteAccountTimer] = useState(0);
  const [isAppUpdated, setIsAppUpdated] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isDownloadingUpdate, setIsDownloadingUpdate] = useState(false);
  const [showInstallPermission, setShowInstallPermission] = useState(false);
  const [showForceUpdateModal, setShowForceUpdateModal] = useState(false);
  const [showRealNameTutorial, setShowRealNameTutorial] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showAgreementConfirm, setShowAgreementConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [campIdStatus, setCampIdStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [showCampIdErrorModal, setShowCampIdErrorModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionCallback, setPermissionCallback] = useState<(() => void) | null>(null);
  const [isPeaceAuthReady, setIsPeaceAuthReady] = useState(false);
  const [isQRCodeExpired, setIsQRCodeExpired] = useState(false);
  const [isQRCodeScanned, setIsQRCodeScanned] = useState(false);
  const [qrCodeTimer, setQrCodeTimer] = useState<NodeJS.Timeout | null>(null);
  const [peaceTab, setPeaceTab] = useState<'粉皮' | '战备' | '载具' | '套装'>('粉皮');
  const [honorTab, setHonorTab] = useState<'珍品无双' | '珍品传说' | '荣耀典藏' | '无双皮肤' | '传说皮肤'>('珍品无双');
  const [deltaTab, setDeltaTab] = useState<'英雄皮肤' | '枪皮' | '刀皮'>('英雄皮肤');
  const [editingPeaceItem, setEditingPeaceItem] = useState<string | null>(null);
  const [showSaveSuccessToast, setShowSaveSuccessToast] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showCopySuccessToast, setShowCopySuccessToast] = useState(false);
  const [contactTab, setContactTab] = useState<'wechat' | 'qq'>('wechat');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatStep, setChatStep] = useState(0);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [vote, setVote] = useState<'accurate' | 'inaccurate' | null>(null);
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [showGameFeedbackModal, setShowGameFeedbackModal] = useState(false);
  const [gameFeedbackInput, setGameFeedbackInput] = useState('');
  const [showMethodSheet, setShowMethodSheet] = useState(false);
  const [screenshotImages, setScreenshotImages] = useState<string[]>([]);
  const [screenshotCategories, setScreenshotCategories] = useState<Record<string, string[]>>({});
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [comprehensiveData, setComprehensiveData] = useState({
    // Honor of Kings
    system: '',
    antiAddiction: '',
    realNameStatus: '',
    nobleLevel: '',
    heroCount: '',
    skinCount: '',
    epicSkinCount: '',
    legendarySkinCount: '',
    honorCollectionCount: '',
    peerlessSkinCount: '',
    preciousLegendaryCount: '',
    preciousPeerlessCount: '',
    campNobleLevel: '',
    campStarSkinCount: '',
    
    // Peacekeeper Elite
    aceMarkCount: '',
    suitCount: '',
    gunSkinCount: '',
    vehicleCount: '',
    pinkSuitCount: '',
    pinkGunCount: '',
    
    // Peacekeeper Elite Special Items (Optional)
    peaceSpecialVehicles: [] as string[],
    peaceSpecialItems: {
      gachaFragments: '',
      carCoins: '',
      redSuitFragments: '',
      hallOfFameFrame: false,
      warGodFrame: false,
      aceMarkCount: '',
    },
    peaceSpecialGuns: [] as string[],
    peaceSpecialOutfits: {
      redOutfitLevel: '',
      others: [] as string[],
    },
    
    // Delta Force
    fireLevel: '',
    assets: '',
    warehouseLevel: '',
    trainingCenter: '',
    shootingRange: '',
    deltaHeroSkinCount: '',
    deltaGunSkinCount: '',
    deltaKnifeSkinCount: '',
    knifeCount: '',
    deltaHeroSkins: [] as string[],
    deltaGunSkins: [] as { name: string; isS: boolean }[],
    deltaKnifeSkins: [] as string[],
  });

  const [marketFilter, setMarketFilter] = useState({ sort: '默认排序', attributes: {} as Record<string, string> });
  const [showMarketFilterModal, setShowMarketFilterModal] = useState(false);
  const [showMarketSortModal, setShowMarketSortModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [checkoutAccountId, setCheckoutAccountId] = useState<string | null>(null);
  const [tradeChatMessages, setTradeChatMessages] = useState<Message[]>([]);
  const [tradeStep, setTradeStep] = useState(0);
  const [platformTab, setPlatformTab] = useState<'全部' | '端游' | '手游'>('全部');
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  
  // Bargain states
  const [showBargainSheet, setShowBargainSheet] = useState(false);
  const [bargainDiscount, setBargainDiscount] = useState<number>(80);
  const [isBargainMode, setIsBargainMode] = useState(false);
  const [bargainStatus, setBargainStatus] = useState<'waiting' | 'rejected'>('waiting');

  const userInfo: UserInfo = {
    nickname: '用户 UIG21h',
    phone: '',
    avatar: 'https://picsum.photos/seed/avatar/200/200',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (deleteAccountTimer > 0) {
      interval = setInterval(() => {
        setDeleteAccountTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deleteAccountTimer]);

  const valuationHistory: ValuationHistory[] = [
    { id: 'h1', game: '王者荣耀', price: 3280, beatPercent: 88, time: '2024-03-20 14:30' },
    { id: 'h2', game: '和平精英', price: 1560, beatPercent: 72, time: '2024-03-15 09:12' },
    { id: 'h3', game: '三角洲行动', price: 420, beatPercent: 45, time: '2024-03-10 18:45' },
  ];

  useEffect(() => {
    if (selectedGame === '和平精英' && selectedMethod === '授权估值' && currentPage === 'form') {
      setIsPeaceAuthReady(false);
      setIsQRCodeScanned(false);
      setIsQRCodeExpired(false);
      
      const timer = setTimeout(() => {
        setIsQRCodeExpired(true);
      }, 5000);
      
      setQrCodeTimer(timer);
      return () => clearTimeout(timer);
    } else {
      if (qrCodeTimer) clearTimeout(qrCodeTimer);
      setIsQRCodeExpired(false);
      setIsQRCodeScanned(false);
    }
  }, [selectedGame, selectedMethod, currentPage]);

  const handleRefreshQRCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQRCodeExpired(false);
    if (qrCodeTimer) clearTimeout(qrCodeTimer);
    const timer = setTimeout(() => {
      setIsQRCodeExpired(true);
    }, 5000);
    setQrCodeTimer(timer);
  };

  const handleQRCodeClick = () => {
    if (isQRCodeExpired) return;
    setIsQRCodeScanned(true);
    setIsPeaceAuthReady(true);
    setToast({ message: '扫码授权成功', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSaveQRCode = async () => {
    setPermissionCallback(() => () => {
      setToast({ message: '二维码已保存至相册', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    });
    setShowPermissionModal(true);
  };

  const [showShareModal, setShowShareModal] = useState(false);

  // Navigation handlers
  const resetValuationData = () => {
    setInputValue('');
    setCampIdStatus('idle');
    setEditingPeaceItem(null);
    setScreenshotImages([]);
    setComprehensiveData({
      system: '',
      antiAddiction: '',
      realNameStatus: '',
      nobleLevel: '',
      heroCount: '',
      skinCount: '',
      epicSkinCount: '',
      legendarySkinCount: '',
      honorCollectionCount: '',
      peerlessSkinCount: '',
      preciousLegendaryCount: '',
      preciousPeerlessCount: '',
      campNobleLevel: '',
      campStarSkinCount: '',
      aceMarkCount: '',
      suitCount: '',
      gunSkinCount: '',
      vehicleCount: '',
      pinkSuitCount: '',
      pinkGunCount: '',
      
      // Peacekeeper Elite Special Items (Optional)
      peaceSpecialVehicles: [],
      peaceSpecialItems: {
        gachaFragments: '',
        carCoins: '',
        redSuitFragments: '',
        hallOfFameFrame: false,
        warGodFrame: false,
        aceMarkCount: '',
      },
      peaceSpecialGuns: [],
      peaceSpecialOutfits: {
        redOutfitLevel: '',
        others: [],
      },
      
      fireLevel: '',
      assets: '',
      warehouseLevel: '',
      trainingCenter: '',
      shootingRange: '',
      deltaHeroSkinCount: '',
      deltaGunSkinCount: '',
      deltaKnifeSkinCount: '',
      knifeCount: '',
      deltaHeroSkins: [],
      deltaGunSkins: [],
      deltaKnifeSkins: [],
    });
  };

  const goToValuation = () => {
    resetValuationData();
    setCurrentPage('valuation');
  };

  const goBack = () => {
    if (currentPage === 'valuation') setCurrentPage('home');
    else if (currentPage === 'form' || currentPage === 'screenshot-form') {
      const isComprehensiveFilled = Object.values(comprehensiveData).some(val => val !== '');
      if (inputValue.trim() !== '' || (selectedMethod === '综合估值' && isComprehensiveFilled) || screenshotImages.length > 0) {
        setShowExitConfirm(true);
      } else {
        setCurrentPage('valuation');
      }
    }
    else if (currentPage === 'result') {
      resetValuationData();
      setCurrentPage('home');
    }
    else if (currentPage === 'tutorial-id' || currentPage === 'tutorial-link' || currentPage === 'campHelp' || currentPage === 'security') setCurrentPage('form');
    else if (currentPage === 'records' || currentPage === 'contact' || currentPage === 'privacy' || currentPage === 'settings' || currentPage === 'favorites') setCurrentPage('mine');
    else if (currentPage === 'versionDetail') setCurrentPage('settings');
    else if (currentPage === 'login' || currentPage === 'chat' || currentPage === 'find-account-games') setCurrentPage('home');
    else if (currentPage === 'market') setCurrentPage('find-account-games');
    else if (currentPage === 'item-detail') setCurrentPage('market');
    else if (currentPage === 'checkout') setCurrentPage('item-detail');
    else if (currentPage === 'im-trade') setCurrentPage('home');
  };

  const handleStartValuation = () => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    
    // Validation for Camp ID (Honor of Kings only)
    if (selectedMethod === '授权估值' && selectedGame === '王者荣耀') {
      if (!inputValue || !/^\d+$/.test(inputValue) || inputValue.length < 7 || inputValue.length > 11) {
        setToast({ message: '请输入正确的营地 ID', type: 'error' });
        setTimeout(() => setToast(null), 2000);
        return;
      }
      if (!comprehensiveData.campNobleLevel) {
        setToast({ message: '请完善所有信息', type: 'error' });
        setTimeout(() => setToast(null), 2000);
        return;
      }
    }

    setCurrentPage('loading');
    setTimeout(() => {
      setCurrentPage('result');
    }, 2000);
  };

  // --- Render Functions ---

  const renderFindAccountGames = () => {
    const tabs = [
      { id: '全部', icon: <div className="grid grid-cols-2 gap-[2px] w-5 h-5"><div className="bg-current rounded-[2px]"/><div className="bg-current rounded-[2px]"/><div className="bg-current rounded-[2px]"/><div className="bg-current rounded-[2px]"/></div> },
      { id: '端游', icon: <Monitor size={20} /> },
      { id: '手游', icon: <Smartphone size={20} /> }
    ];

    const allGames = [
      { name: 'steam', icon: '', platform: '端游' },
      { name: '英雄联盟', icon: 'https://picsum.photos/seed/lol/100/100', platform: '端游' },
      { name: '无畏契约', icon: 'https://picsum.photos/seed/valo/100/100', platform: '端游' },
      { name: '王者荣耀', icon: 'https://picsum.photos/seed/hok/100/100', platform: '手游' },
      { name: '三角洲行动', icon: 'https://picsum.photos/seed/delta/100/100', platform: '端游' },
      { name: '和平精英', icon: 'https://picsum.photos/seed/peace/100/100', platform: '手游' },
    ];

    const filteredGames = platformTab === '全部' ? allGames : allGames.filter(g => g.platform === platformTab);

    return (
      <div className="flex flex-col min-h-[calc(100vh-60px)] bg-gray-50 -mt-14 pt-14 absolute inset-0 z-50 overflow-hidden">
        <div className="flex items-center gap-3 p-4 relative z-10 w-full bg-white border-b border-gray-100">
          <button onClick={() => setCurrentPage('home')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center text-gray-900 font-bold text-lg">找账号</div>
          <div className="w-8"></div>
        </div>
        <div className="px-4 py-3 relative z-10 bg-white border-b border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="请输入游戏名称搜索" 
              className="bg-transparent flex-1 outline-none text-gray-900 text-sm placeholder:text-gray-400"
              value={marketSearchQuery}
              onChange={(e) => setMarketSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-24 bg-white border-r border-gray-100 flex flex-col gap-6 pt-4 items-center">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setPlatformTab(tab.id as '全部' | '端游' | '手游')}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all relative w-full py-2",
                  platformTab === tab.id ? "text-blue-600 font-bold" : "text-gray-500"
                )}
              >
                {platformTab === tab.id && <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-600 rounded-r-lg" />}
                <div className="w-8 h-8 flex items-center justify-center">
                  {tab.icon}
                </div>
                <span className="text-xs">{tab.id}</span>
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-gray-50 px-3 py-4 overflow-y-auto">
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 content-start">
              {filteredGames.filter(g => g.name.includes(marketSearchQuery)).map((game) => (
                <button
                  key={game.name}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  onClick={() => {
                    setMarketGame(game.name as GameType);
                    setCurrentPage('market');
                  }}
                >
                  <div className="w-[4.5rem] h-[4.5rem] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                    {game.icon ? (
                      <img src={game.icon} alt={game.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400 font-medium font-serif">steam</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-700 font-bold">{game.name !== 'steam' ? game.name : ''}</span>
                </button>
              ))}
            </div>
            <div className="text-center text-gray-400 text-xs mt-16 py-4">
              - 已经到底了 -
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderItemDetail = () => {
    const account = MOCK_ACCOUNTS.find(a => a.id === selectedAccountId);
    if (!account) return <div>商品不存在</div>;

    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-60px)] -mt-14 pt-14 absolute inset-0 z-50 overflow-y-auto pb-24">
        <div className="flex items-center px-4 py-3 sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <button onClick={() => setCurrentPage('market')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center text-gray-900 font-bold text-lg">商品详情</div>
          <div className="w-8"></div>
        </div>

        <div className="w-full relative shadow-sm">
           <img src={account.coverImage} className="w-full object-cover" />
        </div>

        <div className="p-4 mx-4 -mt-6 relative z-10 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-gray-900 font-bold leading-relaxed mb-3">
            {account.title}
          </h2>
          <div className="flex items-end gap-2 mb-4">
             <span className="text-red-500 font-bold text-2xl leading-none">¥ {account.price}</span>
          </div>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            {account.tags.map(tag => (
               <span key={tag} className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>商品编号：{account.id}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
           <h3 className="text-gray-900 font-bold text-lg mb-1 tracking-widest">游戏截图</h3>
           <div className="w-8 h-1 bg-red-500 rounded-full mb-6"></div>
           <div className="px-4 w-full">
              <img src={account.coverImage} className="w-full rounded-2xl border border-gray-100 mb-4 shadow-sm" />
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 w-full left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
            <button 
              className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-900"
              onClick={() => {
                setFavorites(prev => prev.includes(account.id) ? prev.filter(id => id !== account.id) : [...prev, account.id]);
                setToast({ message: favorites.includes(account.id) ? '已取消收藏' : '收藏成功', type: 'success' });
              }}
            >
              <Star size={20} className={cn(favorites.includes(account.id) && "fill-yellow-500 text-yellow-500")}/>
              <span className="text-[10px]">收藏</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-900"
              onClick={() => setShowBargainSheet(true)}
            >
              <ArrowDownUp size={20} />
              <span className="text-[10px]">砍价</span>
            </button>
          </div>
          <button 
            className="flex-1 ml-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
            onClick={() => {
              setIsBargainMode(false);
              setCheckoutAccountId(account.id);
              setCurrentPage('checkout');
            }}
          >
            立即购买
          </button>
        </div>
      </div>
    );
  };

  const handleBargain = () => {
    setShowBargainSheet(false);
    setIsBargainMode(true);
    setBargainStatus('waiting');
    
    setTradeChatMessages([
      { id: Date.now().toString(), type: 'system', content: '您发起了一笔砍价。', timestamp: new Date().toLocaleTimeString() },
      { id: Date.now().toString() + '1', type: 'user', content: `我出价 ¥${Math.floor(MOCK_ACCOUNTS.find(a => a.id === selectedAccountId)?.price! * (bargainDiscount / 100))}`, timestamp: new Date().toLocaleTimeString() }
    ]);
    setCurrentPage('im-trade');

    setTimeout(() => {
      setTradeChatMessages(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'bot', content: '卖家觉得您的出价不合适，拒绝了当前出价。', timestamp: new Date().toLocaleTimeString() }
      ]);
      setBargainStatus('rejected');
    }, 3000);
  };

  const handlePayment = () => {
    // 模拟支付完成
    setToast({ message: '支付成功，正在为您拉通交易群', type: 'success' });
    setTimeout(() => {
      setTradeStep(0);
      setTradeChatMessages([
        { id: '1', type: 'system', content: '订单支付成功，已拉通交易群组。', timestamp: new Date().toLocaleTimeString() },
        { id: '2', type: 'bot', content: '您好，我是本次交易的专属客服。这边看到您已经完成付款。', timestamp: new Date().toLocaleTimeString() },
        { id: '3', type: 'bot', content: '现在为您进行【换绑/过户】流程。请准备好您需要绑定的手机号/微信号。', timestamp: new Date().toLocaleTimeString() }
      ]);
      setCurrentPage('im-trade');
    }, 1500);
  };

  const renderCheckout = () => {
    const account = MOCK_ACCOUNTS.find(a => a.id === checkoutAccountId);
    if (!account) return null;

    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-60px)] -mt-14 pt-14 absolute inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button onClick={() => setCurrentPage('item-detail')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold text-lg">确认订单</div>
          <div className="w-8"></div>
        </div>

        <div className="p-4 flex flex-col gap-4 pb-24">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
               <img src={account.coverImage} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <div className="text-sm font-bold text-gray-800 line-clamp-2">{account.title}</div>
              <div className="text-red-500 font-bold text-lg">¥{account.price}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">商品总额</span>
                <span className="font-bold text-gray-800">¥{account.price}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">交易手续费</span>
                <span className="font-bold text-gray-800">¥0</span>
             </div>
             <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-800 font-bold">合计</span>
                <span className="text-red-500 font-bold text-lg">¥{account.price}</span>
             </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
              <div className="text-sm font-bold text-gray-800 mb-2">支付方式</div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white"><MessageSquare size={14}/></div>
                    <span className="text-sm text-gray-700">微信支付</span>
                 </div>
                 <div className="w-5 h-5 rounded-full border-4 border-blue-500 cursor-pointer"></div>
              </div>
              <div className="flex items-center justify-between py-3">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white"><span className="text-xs font-bold font-serif">支</span></div>
                    <span className="text-sm text-gray-700">支付宝</span>
                 </div>
                 <div className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer"></div>
              </div>
          </div>
        </div>

        <div className="fixed bottom-0 w-full left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-50">
           <div className="flex flex-col">
              <span className="text-xs text-gray-500">实付款：</span>
              <span className="text-red-500 font-bold text-2xl leading-none">¥{account.price}</span>
           </div>
           <button 
             className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-red-500/30 text-lg"
             onClick={handlePayment}
           >
             免密支付
           </button>
        </div>
      </div>
    );
  };

  const [tradeChatInput, setTradeChatInput] = useState('');

  const sendTradeMessage = () => {
    if (!tradeChatInput.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: tradeChatInput.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTradeChatMessages(prev => [...prev, newMsg]);
    setTradeChatInput('');

    // Simulate flow logic
    setTimeout(() => {
       if (tradeStep === 0) {
         setTradeStep(1);
         setTradeChatMessages(prev => [
           ...prev, 
           { id: Date.now().toString(), type: 'bot', content: '收到，正在为您联系卖家解除绑定，请稍候...', timestamp: new Date().toLocaleTimeString() }
         ]);
         
         setTimeout(() => {
           setTradeStep(2);
           setTradeChatMessages(prev => [
             ...prev, 
             { id: Date.now().toString(), type: 'bot', content: '卖家解绑完成！现在请您提供一个新的绑定手机号，并注意查收验证码。', timestamp: new Date().toLocaleTimeString() }
           ]);
         }, 3000);
       } else if (tradeStep === 2) {
         setTradeStep(3);
         setTradeChatMessages(prev => [
           ...prev, 
           { id: Date.now().toString(), type: 'bot', content: '好的，验证码已发送，请将验证码发在这里。', timestamp: new Date().toLocaleTimeString() }
         ]);
       } else if (tradeStep === 3) {
         setTradeStep(4);
         setTradeChatMessages(prev => [
           ...prev, 
           { id: Date.now().toString(), type: 'bot', content: '换绑成功！账号资料等请您自行修改。交易圆满完成，祝您游戏愉快！', timestamp: new Date().toLocaleTimeString() },
           { id: Date.now().toString() + '1', type: 'system', content: '交易已完成', timestamp: new Date().toLocaleTimeString() }
         ]);
       }
    }, 1000);
  };

  const tradeChatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPage === 'im-trade') {
      tradeChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tradeChatMessages, currentPage]);

  const renderImTrade = () => {
    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-60px)] -mt-14 pt-14 absolute inset-0 z-50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0 shadow-sm z-10">
          <button onClick={() => setCurrentPage(isBargainMode ? 'item-detail' : 'home')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold text-lg flex items-center gap-2">
            {isBargainMode ? '议价 - 专属客服' : '交易群聊'}
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <button className="p-1 text-gray-600">
             <Settings size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-20 relative">
          {/* Order Card Container */}
          {isBargainMode && selectedAccountId && (
            <div className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 border border-gray-100 mb-2 sticky top-0 z-10">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                <img src={MOCK_ACCOUNTS.find(a => a.id === selectedAccountId)?.coverImage} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <div className="text-sm font-bold text-gray-800 line-clamp-1">{MOCK_ACCOUNTS.find(a => a.id === selectedAccountId)?.title}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>编号：{selectedAccountId}</span>
                  <span className="text-red-500 font-bold ml-auto">¥{MOCK_ACCOUNTS.find(a => a.id === selectedAccountId)?.price}</span>
                </div>
              </div>
            </div>
          )}

          {tradeChatMessages.map((msg, i) => (
             <React.Fragment key={msg.id}>
               {msg.type === 'system' && (
                 <div className="flex justify-center text-xs text-gray-400 my-2">
                   {msg.content}
                 </div>
               )}
               {msg.type === 'bot' && (
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Store size={16} />
                   </div>
                   <div className="flex flex-col gap-1 items-start max-w-[80%]">
                     <span className="text-[10px] text-gray-400 ml-1">专属人工客服 <span className="ml-2">{msg.timestamp}</span></span>
                     <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-gray-800 shadow-sm border border-gray-100 whitespace-pre-wrap">
                       {msg.content}
                     </div>
                   </div>
                 </div>
               )}
               {msg.type === 'user' && (
                 <div className="flex gap-3 flex-row-reverse">
                   <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                     <img src={userInfo.avatar} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex flex-col gap-1 items-end max-w-[80%]">
                     <span className="text-[10px] text-gray-400 mr-1">{msg.timestamp}</span>
                     <div className="bg-blue-600 px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm whitespace-pre-wrap">
                       {msg.content}
                     </div>
                   </div>
                 </div>
               )}
             </React.Fragment>
          ))}
          {tradeStep === 1 && !isBargainMode && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <img src="https://picsum.photos/seed/seller/200/200" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 items-start max-w-[80%]">
                <span className="text-[10px] text-gray-400 ml-1">卖家 <span className="ml-2">{new Date().toLocaleTimeString()}</span></span>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-gray-800 shadow-sm border border-gray-100">
                  <div className="flex flex-col gap-2">
                    <Loader2 size={16} className="text-gray-400 animate-spin" />
                    <span>正在配合解绑中...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={tradeChatEndRef} />
        </div>

        {isBargainMode ? (
          <div className="fixed bottom-0 w-full left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-4 z-50">
            {bargainStatus === 'waiting' ? (
              <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-3.5 rounded-full flex items-center justify-center cursor-not-allowed">
                等待卖家回应报价...
              </button>
            ) : (
              <button 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-red-500/30"
                onClick={() => setShowBargainSheet(true)}
              >
                重新出价
              </button>
            )}
          </div>
        ) : (
          <div className="fixed bottom-0 w-full left-0 right-0 max-w-md mx-auto bg-gray-50 border-t border-gray-100 p-3 z-50">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full bg-white border border-gray-200 shrink-0">
                 <Image size={20} />
              </button>
              <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full px-4 py-2">
                <input 
                  type="text" 
                  placeholder="回复沟通进度..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  value={tradeChatInput}
                  onChange={e => setTradeChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendTradeMessage()}
                />
              </div>
              {tradeChatInput.trim() ? (
                <button 
                  onClick={sendTradeMessage}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md shadow-blue-500/30"
                >
                  <Send size={18} className="-ml-0.5" />
                </button>
              ) : (
                <button className="w-10 h-10 bg-gray-200 text-white rounded-full flex items-center justify-center shrink-0">
                  <Send size={18} className="-ml-0.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-60px)] -mt-14 pt-14 absolute inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button onClick={() => setCurrentPage('mine')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold text-lg">我的收藏</div>
          <div className="w-8"></div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {favorites.length === 0 ? (
             <div className="text-center text-gray-400 mt-20">您当前没有收藏的账号</div>
          ) : (
            MOCK_ACCOUNTS.filter(a => favorites.includes(a.id)).map(account => (
              <div 
                key={account.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                onClick={() => {
                  setSelectedAccountId(account.id);
                  setCurrentPage('item-detail');
                }}
              >
                <div className="relative aspect-[2/1] w-full bg-black/5">
                  <img src={account.coverImage} alt={account.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-gray-800 font-bold text-sm leading-snug line-clamp-2 mb-2">
                    {account.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-red-500 font-bold text-lg">
                      <span className="text-sm mr-0.5">¥</span>{account.price}
                    </div>
                    <button 
                       className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded border border-gray-200"
                       onClick={(e) => {
                          e.stopPropagation();
                          setFavorites(prev => prev.filter(id => id !== account.id));
                       }}
                    >
                       取消收藏
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderMarket = () => {
    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-60px)] -mt-14 pt-14 absolute inset-0 z-50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white sticky top-0 z-20">
          <button onClick={() => setCurrentPage('find-account-games')} className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex bg-gray-50 border border-gray-100 rounded-full px-4 py-2 mx-3 flex-1 flex items-center">
            <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
              <span className="text-gray-800 font-bold text-sm whitespace-nowrap">{marketGame}</span>
              <ChevronDown size={14} className="text-gray-400 ml-1" />
            </div>
            <input type="text" placeholder="关键字搜索商品" className="bg-transparent outline-none flex-1 text-gray-900 text-sm placeholder:text-gray-400" />
            <Search size={16} className="text-gray-400 ml-2" />
          </div>
        </div>

        {/* Sort and Filters bar */}
        <div className="flex items-center justify-between px-8 py-3 bg-white sticky top-[60px] z-10 border-b border-gray-100 shadow-sm">
          <button className="flex items-center gap-1 text-gray-700 text-sm" onClick={() => setShowMarketSortModal(true)}>
            <span className={marketFilter.sort !== '默认排序' ? 'text-blue-600 font-bold' : ''}>{marketFilter.sort}</span> <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 text-gray-700 text-sm">
             <span className="font-bold tracking-widest text-gray-900">大图</span> <div className="grid grid-cols-2 gap-[1px] opacity-70"><div className="w-1 h-1 border border-gray-900"/><div className="w-1 h-1 border border-gray-900"/><div className="w-1 h-1 border border-gray-900"/><div className="w-1 h-1 border border-gray-900"/></div>
          </button>
          <button className="flex items-center gap-1 text-gray-700 text-sm" onClick={() => setShowMarketFilterModal(true)}>
            筛选 <ChevronDown size={14} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs text-gray-500 text-center mb-4">共计搜索到 <span className="text-gray-900 font-bold">{MOCK_ACCOUNTS.filter(a => a.game === marketGame).length}</span> 个在售优质账号，敬请选购</p>
          
          <div className="flex flex-col gap-4 pb-20">
            {MOCK_ACCOUNTS.filter(a => a.game === marketGame).map(account => (
              <div 
                key={account.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                onClick={() => {
                  setSelectedAccountId(account.id);
                  setCurrentPage('item-detail');
                }}
              >
                <div className="relative aspect-[2/1] w-full bg-black/5">
                  <img src={account.coverImage} alt={account.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                    <Image size={12} className="text-white"/>
                    <span className="text-white text-[10px]">10+</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {account.tags.map(tag => (
                      <span key={tag} className="border border-blue-200 text-blue-600 bg-blue-50 text-[10px] px-2 py-0.5 rounded flex-shrink-0">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 mb-3">
                    {account.title}
                  </h3>
                  <div className="flex items-center text-red-500 font-bold text-lg">
                    <span className="text-sm mr-0.5">¥</span>{account.price}
                  </div>
                </div>
              </div>
            ))}
            {MOCK_ACCOUNTS.filter(a => a.game === marketGame).length === 0 && (
               <div className="text-center text-gray-500 mt-10">没有更多了</div>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        {showMarketFilterModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex">
            <div className="w-[15%] h-full" onClick={() => setShowMarketFilterModal(false)}></div>
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="flex-1 bg-white h-full flex flex-col rounded-l-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="font-bold text-lg ml-auto mr-auto pl-6">筛选</div>
                <button onClick={() => setShowMarketFilterModal(false)} className="p-1 text-gray-400"><X size={20}/></button>
              </div>
              <div className="px-4 py-3">
                <div className="bg-gray-50 flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 border-none">
                  <input type="text" placeholder="请输入关键词筛选" className="bg-transparent flex-1 text-sm outline-none" />
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="flex flex-1 overflow-hidden">
                <div className="w-24 bg-white border-r border-gray-50 overflow-y-auto">
                  {['区服', '段位', '贵族等级', '大国标', '小国标', '金标', '皮肤数量'].map((tab, i) => (
                    <div key={i} className={cn("text-center py-4 text-sm relative", i === 0 ? "font-bold text-gray-900" : "text-gray-500")}>
                      {i === 0 && <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-r-md"></div>}
                      {tab}
                    </div>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                  {/* 区服 example */}
                  <div>
                    <h4 className="font-bold text-sm mb-3 text-gray-800">区服</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {['安卓qq', '安卓微信', '苹果qq', '苹果微信'].map(t => (
                         <div key={t} className="bg-gray-50 text-gray-600 rounded-md py-2 text-center text-xs">{t}</div>
                       ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3 text-gray-800">实名情况</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {['可二次实名', '不可二次实名', '包人脸'].map(t => (
                         <div key={t} className="bg-gray-50 text-gray-600 rounded-md py-2 text-center text-xs">{t}</div>
                       ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3 text-gray-800">防沉迷</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {['无防沉迷', '有防沉迷'].map(t => (
                         <div key={t} className="bg-gray-50 text-gray-600 rounded-md py-2 text-center text-xs">{t}</div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 p-4 flex gap-3 bg-white z-10 w-full">
                <button className="flex-1 py-3 bg-gray-50 text-gray-600 font-bold rounded-full text-sm shrink-0">重置</button>
                <button className="flex-[2] py-3 bg-red-500 text-white font-bold rounded-full text-sm shrink-0" onClick={() => setShowMarketFilterModal(false)}>确定</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Sort Modal */}
        {showMarketSortModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end" onClick={() => setShowMarketSortModal(false)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white rounded-t-2xl p-4 pb-8 flex flex-col pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center font-bold text-gray-800 mb-6 relative">
                 选择排序方式
                 <button onClick={() => setShowMarketSortModal(false)} className="absolute right-0 top-0 text-gray-400"><X size={20} /></button>
              </div>
              <div className="flex flex-col">
                {['默认排序', '价格升序', '价格降序', '上架时间升序', '最新上架', '最多浏览'].map(sort => (
                  <button 
                    key={sort}
                    onClick={() => {
                      setMarketFilter(p => ({ ...p, sort }));
                      setShowMarketSortModal(false);
                    }}
                    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none"
                  >
                    <span className={cn("text-sm", marketFilter.sort === sort ? "text-red-500 font-bold" : "text-gray-700")}>{sort}</span>
                    {marketFilter.sort === sort && <CheckCircle2 className="text-red-500" size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => {
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    };

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 pb-24"
      >
        {/* 1. Announcement */}
        <motion.section variants={itemVariants} className="px-4 pt-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-100/50">
          <Bell size={14} className="text-blue-500 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <motion.div
              animate={{ x: [300, -500] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap text-xs text-blue-600 font-medium"
            >
              温馨提示：近期市场波动较大，建议多次估值取平均值。AI智能估值系统已升级，识别更精准！
            </motion.div>
          </div>
        </div>
        </motion.section>

        {/* 2. AI Intelligent Valuation */}
        <motion.section variants={itemVariants} className="px-4">
        <button 
          onClick={goToValuation}
          className="w-full relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md">
                <Sparkles size={12} className="text-amber-300" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">推荐</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">AI 智能估值</h2>
              <p className="text-xs text-blue-100 opacity-80">全网大数据支持，秒级生成专业报告</p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Brain size={32} className="text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>
        </button>
        </motion.section>

        {/* 3. Find Account & Pure Green Playmate */}
        <motion.section variants={itemVariants} className="px-4 grid grid-cols-2 gap-3">
        <button 
          onClick={() => setCurrentPage('find-account-games')}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
            <Search size={20} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-gray-800">找账号</span>
            <span className="text-[10px] text-gray-400">海量优质账号</span>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
            <Users size={20} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-gray-800">纯绿陪玩</span>
            <span className="text-[10px] text-gray-400">专业大神带飞</span>
          </div>
        </button>
        </motion.section>

        {/* 4. Recent Valuations */}
        <motion.section variants={itemVariants} className="px-4">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-gray-900" />
              <h2 className="text-sm font-bold text-gray-900">最近估过</h2>
            </div>
            {isLoggedIn && valuationHistory.length > 0 && (
              <button onClick={() => setCurrentPage('records')} className="text-[10px] text-blue-500 font-medium">查看全部</button>
            )}
          </div>

          {!isLoggedIn ? (
            <button 
              onClick={() => setCurrentPage('login')}
              className="flex flex-col items-center justify-center py-6 gap-2 bg-gray-50 rounded-xl border border-dashed border-gray-200"
            >
              <div className="p-2 bg-white rounded-full shadow-sm">
                <Users size={20} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">登录后查看估价记录</span>
            </button>
          ) : valuationHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-xs text-gray-400">暂无估价记录</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {valuationHistory.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">{record.game}</span>
                    <span className="text-[10px] text-gray-400">{record.time.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-orange-500">¥{record.price}</span>
                      <span className="text-[9px] text-green-500">超过 {record.beatPercent}% 用户</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        </motion.section>

        {/* 5. Service Stats */}
        <motion.section variants={itemVariants} className="px-4">
        <div className="flex items-center justify-center gap-2 py-3 bg-gray-900/5 rounded-2xl border border-gray-900/5">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/user${i}/100/100`} 
                className="w-6 h-6 rounded-full border-2 border-white" 
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            累计为 <span className="font-black text-gray-900">3,352,545</span> 名用户提供服务
          </p>
        </div>
        </motion.section>

        {/* 6. User Reviews */}
        <motion.section variants={itemVariants} className="px-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-500" />
          <h2 className="text-base font-bold text-gray-900">用户评价</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 -mx-4">
          {[
            { user: '小王***', content: '估值非常快，而且给出的价格跟我最后成交的价格差不多，很靠谱！', rating: 5 },
            { user: '游戏***', content: 'AI估值很智能，把我的稀有皮肤都识别出来了，推荐大家使用。', rating: 5 },
            { user: '阿强***', content: '客服回复很快，找账号功能也很好用，已经成功买到了心仪的号。', rating: 4 }
          ].map((review, i) => (
            <div key={i} className="min-w-[240px] p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">{review.user}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Sparkles key={j} size={10} className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{review.content}</p>
            </div>
          ))}
        </div>
        </motion.section>

        {/* 7. FAQ */}
        <motion.section variants={itemVariants} className="px-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-purple-500" />
          <h2 className="text-base font-bold text-gray-900">常见问题</h2>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { q: '估值结果准确吗？', a: '我们的AI模型基于全网百万级真实成交数据，结合账号稀有度、皮肤数量等维度进行综合计算，准确率高达95%以上。' },
            { q: '授权估值安全吗？', a: '授权估值仅读取游戏基础公开数据（如皮肤、等级），不涉及账号密码及支付信息，全程由官方接口支持，绝对安全。' },
            { q: '为什么不同时间估值不一样？', a: '账号价值受市场供需关系、版本更新及热门皮肤返场等因素影响，行情会实时波动。' }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-xs font-bold text-gray-800">{faq.q}</span>
                {faqOpen === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-[11px] text-gray-500 leading-relaxed pt-1 border-t border-gray-50">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        </motion.section>

        {/* 8. Satisfaction Vote */}
        <motion.section variants={itemVariants} className="px-4 text-center">
          <Card className="flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-white py-3">
            <div className="flex flex-col items-center gap-0.5">
              <h2 className="text-xs font-bold text-gray-900">满意度投票</h2>
              <p className="text-[9px] text-gray-400">您的反馈是我们进步的动力</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setVote('accurate')}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all",
                  vote === 'accurate' ? "bg-green-50 border-green-500 text-green-600 shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                )}
              >
                <ThumbsUp size={18} className={vote === 'accurate' ? "animate-bounce" : ""} />
                <span className="text-[10px] font-bold">准确</span>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    className="h-full bg-green-500" 
                  />
                </div>
                <span className="text-[8px] font-medium text-gray-400">95% 选择</span>
              </button>
              <button 
                onClick={() => setVote('inaccurate')}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all",
                  vote === 'inaccurate' ? "bg-red-50 border-red-500 text-red-600 shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                )}
              >
                <ThumbsDown size={18} className={vote === 'inaccurate' ? "animate-shake" : ""} />
                <span className="text-[10px] font-bold">不准确</span>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '5%' }}
                    className="h-full bg-red-500" 
                  />
                </div>
                <span className="text-[8px] font-medium text-gray-400">5% 选择</span>
              </button>
            </div>
          </Card>
        </motion.section>

        {/* 9. Market Trend Chart */}
        <motion.section variants={itemVariants} className="px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">行情曲线分析图</h2>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(['王者荣耀', '和平精英', '三角洲行动'] as GameType[]).map(game => (
              <button
                key={game}
                onClick={() => setMarketGame(game)}
                className={cn(
                  "px-2 py-1 text-[10px] rounded-md transition-all",
                  marketGame === game ? "bg-white text-blue-600 shadow-sm font-bold" : "text-gray-500"
                )}
              >
                {game.slice(0, 2)}
              </button>
            ))}
          </div>
        </div>

        <Card className="p-2">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_MARKET_DATA[marketGame]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 px-2 flex justify-between items-center">
            <span className="text-[10px] text-gray-400">最近七日成品价趋势</span>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp size={12} />
              <span className="text-[10px] font-bold">+5.2%</span>
            </div>
          </div>
        </Card>
        </motion.section>

        {/* 10. Recent Hotspots */}
        <motion.section variants={itemVariants} className="px-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-500" />
          <h2 className="text-base font-bold text-gray-900">最近热点</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {HOT_TAGS[marketGame].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100">
              #{tag}
            </span>
          ))}
        </div>
      </motion.section>
    </motion.div>
    );
  };

  const renderValuation = () => (
    <div className="flex flex-col bg-white">
      {/* Search Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="请输入游戏名称"
            value={gameSearchQuery}
            onChange={(e) => setGameSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Recently Valued */}
        <section className="px-4 py-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">最近估过</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {['王者荣耀', '和平精英'].map(game => (
              <button 
                key={game}
                onClick={() => {
                  setSelectedGame(game as GameType);
                  setShowMethodSheet(true);
                }}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Gamepad2 size={24} className="text-blue-500" />
                </div>
                <span className="text-[11px] font-medium text-gray-600">{game}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Game List with Index */}
        <section className="relative flex">
          <div className="flex-1">
            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">H</div>
            <button 
              onClick={() => {
                setSelectedGame('和平精英');
                setShowMethodSheet(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Gamepad2 size={20} />
              </div>
              <span className="text-sm font-bold text-gray-800">和平精英</span>
            </button>

            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">S</div>
            <button 
              onClick={() => {
                setSelectedGame('三角洲行动');
                setShowMethodSheet(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <Gamepad2 size={20} />
              </div>
              <span className="text-sm font-bold text-gray-800">三角洲行动</span>
            </button>

            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">W</div>
            <button 
              onClick={() => {
                setSelectedGame('王者荣耀');
                setShowMethodSheet(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <Gamepad2 size={20} />
              </div>
              <span className="text-sm font-bold text-gray-800">王者荣耀</span>
            </button>
          </div>

          {/* Alphabet Index */}
          <div className="sticky right-2 top-4 flex flex-col gap-1 h-fit">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'].map(char => (
              <span key={char} className={cn(
                "text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full",
                ['H', 'S', 'W'].includes(char) ? "text-blue-600" : "text-gray-300"
              )}>
                {char}
              </span>
            ))}
          </div>
        </section>

        {/* Feedback Button */}
        <div className="p-8 flex justify-center">
          <button 
            onClick={() => setShowGameFeedbackModal(true)}
            className="text-xs text-gray-400 font-medium flex items-center gap-1"
          >
            没有我想要的游戏？
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const calculateCompletion = () => {
    if (selectedMethod !== '综合估值') return 100;
    
    let fields: string[] = [];
    if (selectedGame === '王者荣耀') {
      fields = [
        'system', 'antiAddiction', 'realNameStatus', 'nobleLevel', 
        'heroCount', 'skinCount', 'epicSkinCount', 'legendarySkinCount', 
        'honorCollectionCount', 'peerlessSkinCount', 'preciousLegendaryCount', 'preciousPeerlessCount'
      ];
    } else if (selectedGame === '和平精英') {
      fields = [
        'system', 'antiAddiction', 'realNameStatus', 'aceMarkCount', 
        'suitCount', 'gunSkinCount', 'vehicleCount', 'pinkSuitCount', 'pinkGunCount'
      ];
    } else if (selectedGame === '三角洲行动') {
      fields = [
        'fireLevel', 'assets', 'warehouseLevel', 'trainingCenter', 
        'shootingRange', 'deltaHeroSkinCount', 'deltaGunSkinCount', 'deltaKnifeSkinCount'
      ];
    }

    if (fields.length === 0) return 0;
    const filledCount = fields.filter(f => comprehensiveData[f as keyof typeof comprehensiveData]).length;
    return Math.round((filledCount / fields.length) * 100);
  };

  const isScreenshotValuationReady = () => {
    const configs = SCREENSHOT_CONFIGS[selectedGame] || [];
    return configs.every(cfg => {
      if (cfg.type === 'select') return !!comprehensiveData.campNobleLevel;
      const key = `${selectedGame}_${cfg.key}`;
      return (screenshotCategories[key] || []).length > 0;
    });
  };

  const renderCompletionProgress = () => {
    const completion = calculateCompletion();
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-500">完成度</span>
          <span className="text-xl font-black text-green-500">{completion}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
        <p className="text-[10px] text-gray-400">完成度越高估值越准确哦~</p>
      </div>
    );
  };

  const renderForm = () => (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Game Selection (Read-only) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <span className="text-red-500 text-sm">*</span>
          <span className="text-sm font-bold text-gray-700">游戏</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm",
            selectedGame === '王者荣耀' ? "bg-red-500" : 
            selectedGame === '和平精英' ? "bg-blue-500" : "bg-orange-500"
          )}>
            <Gamepad2 size={24} />
          </div>
          <span className="text-base font-black text-gray-900">{selectedGame}</span>
        </div>
      </div>

      {/* Valuation Method Selection */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <span className="text-red-500 text-sm">*</span>
          <span className="text-sm font-bold text-gray-700">估值方式</span>
        </div>
        <div className="relative">
          <select 
            value={selectedMethod}
            onChange={(e) => {
              const method = e.target.value as ValuationMethod;
              setSelectedMethod(method);
            }}
            className="w-full h-14 pl-4 pr-10 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 appearance-none transition-all"
          >
            <option value="综合估值">综合信息估值</option>
            <option value="授权估值">授权估值</option>
            <option value="链接估值">链接估值</option>
            <option value="截图估值">截图估值</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Completion Progress for Comprehensive Method */}
      {selectedMethod === '综合估值' && renderCompletionProgress()}

      {/* Form Content */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-gray-900">估值信息填写</h3>
        </div>

        {selectedMethod === '授权估值' && (
          <div className="flex flex-col gap-4">
            {selectedGame === '王者荣耀' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">营地 ID 授权</label>
                    <button 
                      onClick={() => setCurrentPage('campHelp')}
                      className="text-[10px] text-blue-500 font-medium"
                    >
                      如何获取营地 ID？
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="请输入您的营地 ID"
                      value={inputValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInputValue(val);
                        
                        if (val && !/^\d+$/.test(val)) {
                          setCampIdStatus('idle');
                        } else if (val && val.length >= 7 && val.length <= 11) {
                          // Trigger validation
                          setCampIdStatus('validating');
                          setTimeout(() => {
                            if (val === '1111111') {
                              setCampIdStatus('error');
                              setShowCampIdErrorModal(true);
                            } else {
                              setCampIdStatus('success');
                              setComprehensiveData(prev => ({ ...prev, campNobleLevel: 'V10' }));
                            }
                          }, 1000);
                        } else {
                          setCampIdStatus('idle');
                        }
                      }}
                      onBlur={() => {}}
                      className="w-full h-14 pl-4 pr-12 pt-2 pb-5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                    />
                    {inputValue && (!/^\d+$/.test(inputValue) || inputValue.length < 7 || inputValue.length > 11) && (
                      <div className="absolute bottom-2 left-4 text-[9px] text-red-500 pointer-events-none font-medium transition-colors">
                        {!/^\d+$/.test(inputValue) ? "营地 ID 由数字组成" : "营地 ID 为 7-11 位"}
                      </div>
                    )}
                    {campIdStatus === 'validating' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <Loader2 size={20} className="animate-spin" />
                      </div>
                    )}
                    {campIdStatus === 'success' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sequential Fields for Camp ID */}
                {campIdStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">贵族等级</label>
                      <select 
                        value={comprehensiveData.campNobleLevel}
                        onChange={(e) => setComprehensiveData(prev => ({ ...prev, campNobleLevel: e.target.value }))}
                        className="h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      >
                        <option value="">请选择贵族等级</option>
                        {['无双贵族', '荣耀贵族', 'V10', 'V9', 'V8', 'V7', 'V6', 'V5', 'V4', 'V3', 'V2', 'V1', 'V0'].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : selectedGame === '和平精英' ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="flex flex-col items-center gap-1">
                  <h4 className="text-base font-bold text-gray-900">扫码授权</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <span>请打开QQ扫码授权登录</span>
                    <button 
                      onClick={() => setCurrentPage('security')}
                      className="text-blue-500 font-medium"
                    >
                      账号安全说明
                    </button>
                  </div>
                </div>
                
                {!isQRCodeScanned ? (
                  <div className="flex flex-col items-center gap-3">
                    <div 
                      onClick={handleQRCodeClick}
                      className="relative w-36 h-36 p-1.5 bg-white border-4 border-blue-50 rounded-2xl shadow-inner cursor-pointer overflow-hidden"
                    >
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PeacekeeperEliteAuth" 
                        alt="QR Code"
                        className={cn("w-full h-full rounded-xl transition-all duration-300", isQRCodeExpired && "opacity-20 grayscale")}
                      />
                      
                      {isQRCodeExpired && (
                        <div 
                          onClick={handleRefreshQRCode}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-xl"
                        >
                          <div className="p-2 bg-white rounded-full shadow-lg text-blue-600 animate-pulse">
                            <Zap size={20} fill="currentColor" />
                          </div>
                          <span className="mt-1 text-[10px] font-bold text-gray-800">点击刷新</span>
                        </div>
                      )}

                      {!isQRCodeExpired && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-xl pointer-events-none">
                          <motion.div 
                            animate={{ y: [-60, 60] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-0.5 bg-blue-400/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleSaveQRCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Download size={12} />
                      保存二维码至本地
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-36 h-36 bg-green-50 rounded-2xl border-2 border-dashed border-green-200 gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600">扫码授权成功</span>
                  </div>
                )}

                <div className="flex flex-col gap-1 w-full">
                  <div className="p-2 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-[10px] text-orange-600 text-center font-medium">
                      温馨提示：目前仅支持QQ授权登录，暂不支持微信授权
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <ShieldAlert size={48} strokeWidth={1.5} className="opacity-20" />
                <p className="text-sm">该游戏暂不支持授权估值</p>
              </div>
            )}

            {selectedGame !== '三角洲行动' && selectedGame !== '和平精英' && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 leading-relaxed">
                  温馨提示：授权估值将自动同步您的英雄、皮肤、段位等核心资产信息，估值结果更准确。
                </p>
              </div>
            )}
          </div>
        )}

        {selectedMethod === '链接估值' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">商品链接</label>
                <button 
                  onClick={() => setCurrentPage('tutorial-link')}
                  className="text-[10px] text-blue-500 font-medium"
                >
                  如何获取链接？
                </button>
              </div>
              <textarea 
                placeholder="请粘贴任意网站的账号商品链接（已支持大多数交易网站）"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>
        )}

        {selectedMethod === '综合估值' && (
          <div className="flex flex-col gap-4">
            {/* Sequential Form Fields for 王者荣耀 */}
            {selectedGame === '王者荣耀' && (
              <div className="flex flex-col gap-4">
                {/* 1. 系统 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">系统</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['安卓 QQ', '安卓微信', '苹果 QQ', '苹果微信'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setComprehensiveData(prev => ({ ...prev, system: opt }))}
                        className={cn(
                          "h-12 rounded-xl border text-sm font-bold transition-all",
                          comprehensiveData.system === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 有无防沉迷 */}
                {comprehensiveData.system && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">有无防沉迷</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['有', '无'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setComprehensiveData(prev => ({ ...prev, antiAddiction: opt }))}
                          className={cn(
                            "h-12 rounded-xl border text-sm font-bold transition-all",
                            comprehensiveData.antiAddiction === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. 实名情况 */}
                {comprehensiveData.antiAddiction && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <label className="text-sm font-medium text-gray-700">实名情况</label>
                      <button 
                        onClick={() => setShowRealNameTutorial(true)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <HelpCircle size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['可二次实名', '不可二次实名'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setComprehensiveData(prev => ({ ...prev, realNameStatus: opt }))}
                          className={cn(
                            "h-12 rounded-xl border text-sm font-bold transition-all",
                            comprehensiveData.realNameStatus === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. 贵族等级 */}
                {comprehensiveData.realNameStatus && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">贵族等级</label>
                    <select 
                      value={comprehensiveData.nobleLevel}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, nobleLevel: e.target.value }))}
                      className="h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择贵族等级</option>
                      {['无双贵族', '荣耀贵族', 'V10', 'V9', 'V8', 'V7', 'V6', 'V5', 'V4', 'V3', 'V2', 'V1', 'V0'].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* 5. 英雄数量 */}
                {comprehensiveData.nobleLevel && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">英雄数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入英雄数量 (0-122)"
                      value={comprehensiveData.heroCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(122, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, heroCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 6. 皮肤数量 */}
                {comprehensiveData.heroCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">皮肤数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入皮肤数量 (0-630)"
                      value={comprehensiveData.skinCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(630, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, skinCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 7. 史诗皮肤数量 */}
                {comprehensiveData.skinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">史诗皮肤数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入史诗皮肤数量 (0-220)"
                      value={comprehensiveData.epicSkinCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(220, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, epicSkinCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 8. 传说皮肤数量 */}
                {comprehensiveData.epicSkinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">传说皮肤数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入传说皮肤数量 (0-130)"
                      value={comprehensiveData.legendarySkinCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(130, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, legendarySkinCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 9. 荣耀典藏数量 */}
                {comprehensiveData.legendarySkinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">荣耀典藏数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入荣耀典藏数量 (0-16)"
                      value={comprehensiveData.honorCollectionCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(16, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, honorCollectionCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 10. 无双皮肤数量 */}
                {comprehensiveData.honorCollectionCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">无双皮肤数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入无双皮肤数量 (0-10)"
                      value={comprehensiveData.peerlessSkinCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(10, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, peerlessSkinCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 11. 珍品传说数量 */}
                {comprehensiveData.peerlessSkinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">珍品传说数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入珍品传说数量 (0-8)"
                      value={comprehensiveData.preciousLegendaryCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(8, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, preciousLegendaryCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {/* 12. 珍品无双数量 */}
                {comprehensiveData.preciousLegendaryCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">珍品无双数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入珍品无双数量 (0-4)"
                      value={comprehensiveData.preciousPeerlessCount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.min(4, Math.max(0, parseInt(e.target.value) || 0)).toString();
                        setComprehensiveData(prev => ({ ...prev, preciousPeerlessCount: val }));
                      }}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none border-blue-500"
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Sequential Form Fields for 和平精英 */}
            {selectedGame === '和平精英' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">系统</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['安卓 QQ', '安卓微信', '苹果 QQ', '苹果微信'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setComprehensiveData(prev => ({ ...prev, system: opt }))}
                        className={cn(
                          "h-12 rounded-xl border text-sm font-bold transition-all",
                          comprehensiveData.system === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {comprehensiveData.system && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">有无防沉迷</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['有', '无'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setComprehensiveData(prev => ({ ...prev, antiAddiction: opt }))}
                          className={cn(
                            "h-12 rounded-xl border text-sm font-bold transition-all",
                            comprehensiveData.antiAddiction === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {comprehensiveData.antiAddiction && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <label className="text-sm font-medium text-gray-700">实名情况</label>
                      <button 
                        onClick={() => setShowRealNameTutorial(true)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <HelpCircle size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['可二次实名', '不可二次实名'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setComprehensiveData(prev => ({ ...prev, realNameStatus: opt }))}
                          className={cn(
                            "h-12 rounded-xl border text-sm font-bold transition-all",
                            comprehensiveData.realNameStatus === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {comprehensiveData.realNameStatus && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">王牌印记次数</label>
                      <input 
                        type="number" 
                        placeholder="请输入次数 (范围 0-30)"
                        value={comprehensiveData.aceMarkCount}
                        onChange={(e) => setComprehensiveData(prev => ({ ...prev, aceMarkCount: Math.min(30, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                        className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    {comprehensiveData.aceMarkCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">套装数</label>
                        <input 
                          type="number" 
                          placeholder="请输入套装数 (范围 0-1000)"
                          value={comprehensiveData.suitCount}
                          onChange={(e) => setComprehensiveData(prev => ({ ...prev, suitCount: Math.min(1000, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                          className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </motion.div>
                    )}

                    {comprehensiveData.suitCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">枪皮数</label>
                        <input 
                          type="number" 
                          placeholder="请输入枪皮数 (范围 0-1000)"
                          value={comprehensiveData.gunSkinCount}
                          onChange={(e) => setComprehensiveData(prev => ({ ...prev, gunSkinCount: Math.min(1000, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                          className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </motion.div>
                    )}

                    {comprehensiveData.gunSkinCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">载具数</label>
                        <input 
                          type="number" 
                          placeholder="请输入载具数 (范围 0-100)"
                          value={comprehensiveData.vehicleCount}
                          onChange={(e) => setComprehensiveData(prev => ({ ...prev, vehicleCount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                          className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </motion.div>
                    )}

                    {comprehensiveData.vehicleCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">粉装数</label>
                        <input 
                          type="number" 
                          placeholder="请输入粉装数 (范围 0-300)"
                          value={comprehensiveData.pinkSuitCount}
                          onChange={(e) => setComprehensiveData(prev => ({ ...prev, pinkSuitCount: Math.min(300, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                          className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </motion.div>
                    )}

                    {comprehensiveData.pinkSuitCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">粉枪数</label>
                        <input 
                          type="number" 
                          placeholder="请输入粉枪数 (范围 0-150)"
                          value={comprehensiveData.pinkGunCount}
                          onChange={(e) => setComprehensiveData(prev => ({ ...prev, pinkGunCount: Math.min(150, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                          className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </motion.div>
                    )}

                    {comprehensiveData.pinkGunCount && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 pt-4 border-t border-gray-100">
                        {/* 特殊载具 */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">特殊载具 (选填)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['红蹦蹦', '载具升级车', '五级车', '满级车', '路特斯和玛莎满级', '金车', '马丁金车'].map(item => (
                              <button
                                key={item}
                                onClick={() => {
                                  setComprehensiveData(prev => ({
                                    ...prev,
                                    peaceSpecialVehicles: (prev.peaceSpecialVehicles || []).includes(item)
                                      ? (prev.peaceSpecialVehicles || []).filter(i => i !== item)
                                      : [...(prev.peaceSpecialVehicles || []), item]
                                  }));
                                }}
                                className={cn(
                                  "px-2 py-3 rounded-xl border text-[11px] font-bold transition-all",
                                  (comprehensiveData.peaceSpecialVehicles || []).includes(item) ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                )}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 特殊道具 */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">特殊道具 (选填)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: '扭蛋碎片', field: 'gachaFragments', value: comprehensiveData.peaceSpecialItems?.gachaFragments },
                              { label: '车币', field: 'carCoins', value: comprehensiveData.peaceSpecialItems?.carCoins },
                              { label: '红装碎片', field: 'redSuitFragments', value: comprehensiveData.peaceSpecialItems?.redSuitFragments },
                              { label: '王牌印记', field: 'aceMarkCount', value: comprehensiveData.peaceSpecialItems?.aceMarkCount },
                            ].map(item => (
                              <div key={item.field} className="flex flex-col gap-2">
                                <button
                                  onClick={() => setEditingPeaceItem(editingPeaceItem === item.field ? null : item.field)}
                                  className={cn(
                                    "h-10 rounded-lg border text-xs font-bold transition-all",
                                    item.value || editingPeaceItem === item.field ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                  )}
                                >
                                  {item.label}{item.value ? `: ${item.value}` : ''}
                                </button>
                                {editingPeaceItem === item.field && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                    <input 
                                      type="number" 
                                      placeholder={`请输入${item.label}`}
                                      value={item.value || ''}
                                      autoFocus
                                      onBlur={() => setEditingPeaceItem(null)}
                                      onChange={(e) => setComprehensiveData(prev => ({ 
                                        ...prev, 
                                        peaceSpecialItems: { ...(prev.peaceSpecialItems || {}), [item.field]: e.target.value } 
                                      }))}
                                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </motion.div>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setComprehensiveData(prev => ({ ...prev, peaceSpecialItems: { ...(prev.peaceSpecialItems || {}), hallOfFameFrame: !prev.peaceSpecialItems?.hallOfFameFrame } }))}
                              className={cn(
                                "h-10 rounded-lg border text-xs font-bold transition-all",
                                comprehensiveData.peaceSpecialItems?.hallOfFameFrame ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                              )}
                            >
                              名人堂框
                            </button>
                            <button
                              onClick={() => setComprehensiveData(prev => ({ ...prev, peaceSpecialItems: { ...(prev.peaceSpecialItems || {}), warGodFrame: !prev.peaceSpecialItems?.warGodFrame } }))}
                              className={cn(
                                "h-10 rounded-lg border text-xs font-bold transition-all",
                                comprehensiveData.peaceSpecialItems?.warGodFrame ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                              )}
                            >
                              战神框
                            </button>
                          </div>
                        </div>

                        {/* 特殊枪皮 */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">特殊枪皮 (选填)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['九级星梦奇缘', '九级超新星', '九级万古烈焰', '九级特效枪', '星际漫游m4'].map(item => (
                              <button
                                key={item}
                                onClick={() => {
                                  setComprehensiveData(prev => ({
                                    ...prev,
                                    peaceSpecialGuns: (prev.peaceSpecialGuns || []).includes(item)
                                      ? (prev.peaceSpecialGuns || []).filter(i => i !== item)
                                      : [...(prev.peaceSpecialGuns || []), item]
                                  }));
                                }}
                                className={cn(
                                  "px-2 py-3 rounded-xl border text-[11px] font-bold transition-all",
                                  (comprehensiveData.peaceSpecialGuns || []).includes(item) ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                )}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 特殊服装 */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">特殊服装 (选填)</label>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => setEditingPeaceItem(editingPeaceItem === 'redOutfitLevel' ? null : 'redOutfitLevel')}
                                className={cn(
                                  "h-10 rounded-lg border text-xs font-bold transition-all",
                                  comprehensiveData.peaceSpecialOutfits?.redOutfitLevel || editingPeaceItem === 'redOutfitLevel' ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                )}
                              >
                                红色衣服{comprehensiveData.peaceSpecialOutfits?.redOutfitLevel ? `: ${comprehensiveData.peaceSpecialOutfits.redOutfitLevel}级` : ''}
                              </button>
                              {editingPeaceItem === 'redOutfitLevel' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                  <input 
                                    type="number" 
                                    min="1"
                                    max="6"
                                    placeholder="请输入等级"
                                    value={comprehensiveData.peaceSpecialOutfits?.redOutfitLevel || ''}
                                    autoFocus
                                    onBlur={() => setEditingPeaceItem(null)}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      const clampedVal = isNaN(val) ? '' : Math.min(6, Math.max(1, val)).toString();
                                      setComprehensiveData(prev => ({ 
                                        ...prev, 
                                        peaceSpecialOutfits: { ...(prev.peaceSpecialOutfits || {}), redOutfitLevel: clampedVal } 
                                      }));
                                    }}
                                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                  />
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {['粉熊背包', '酷熊背包', '螳螂', '木乃伊紫装', '金鞋', '怪诞乔克', '雪国梦幻', '巡查衣/绝对防御上衣', '梦幻火箭', 'S1赛事服一套', '星新烈龙', '洛天依', '都市猎人', '沙漠守护/黑丝', '赤蝎幽灵', '寒蝎幽灵', '老101', 'Q区101', '天网终结者', '追光队服', '龙师傅外套', 'agfox战队服', '都市赤蝎金鞋子', '甜心巧克力', '太空漫步裤（星星）'].map(item => (
                              <button
                                key={item}
                                onClick={() => {
                                  setComprehensiveData(prev => ({
                                    ...prev,
                                    peaceSpecialOutfits: {
                                      ...(prev.peaceSpecialOutfits || {}),
                                      others: (prev.peaceSpecialOutfits?.others || []).includes(item)
                                        ? (prev.peaceSpecialOutfits?.others || []).filter(i => i !== item)
                                        : [...(prev.peaceSpecialOutfits?.others || []), item]
                                    }
                                  }));
                                }}
                                className={cn(
                                  "px-2 py-3 rounded-xl border text-[11px] font-bold transition-all",
                                  (comprehensiveData.peaceSpecialOutfits?.others || []).includes(item) ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                )}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Sequential Form Fields for 三角洲行动 */}
            {selectedGame === '三角洲行动' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">系统</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['QQ', '微信', 'Steam'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setComprehensiveData(prev => ({ ...prev, system: opt }))}
                        className={cn(
                          "h-12 rounded-xl border text-sm font-bold transition-all",
                          comprehensiveData.system === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {comprehensiveData.system && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">实名情况</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['可二次实名', '不可二次实名'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setComprehensiveData(prev => ({ ...prev, realNameStatus: opt }))}
                          className={cn(
                            "h-12 rounded-xl border text-sm font-bold transition-all",
                            comprehensiveData.realNameStatus === opt ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {comprehensiveData.realNameStatus && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">烽火等级</label>
                    <input 
                      type="number" 
                      placeholder="请输入等级 (范围 0-60)"
                      value={comprehensiveData.fireLevel}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, fireLevel: Math.min(60, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.fireLevel && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">资产</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="请输入资产"
                        value={comprehensiveData.assets}
                        onChange={(e) => setComprehensiveData(prev => ({ ...prev, assets: e.target.value }))}
                        className="w-full h-12 pl-4 pr-16 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">M (百万)</span>
                    </div>
                  </motion.div>
                )}

                {comprehensiveData.assets && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">仓库等级</label>
                    <input 
                      type="number" 
                      placeholder="请输入仓库等级 (范围 0-10)"
                      value={comprehensiveData.warehouseLevel}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, warehouseLevel: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.warehouseLevel && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">训练中心</label>
                    <input 
                      type="number" 
                      placeholder="请输入训练中心进度 (范围 0-7)"
                      value={comprehensiveData.trainingCenter}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, trainingCenter: Math.min(7, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.trainingCenter && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">靶场</label>
                    <input 
                      type="number" 
                      placeholder="请输入靶场进度 (范围 0-7)"
                      value={comprehensiveData.shootingRange}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, shootingRange: Math.min(7, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.shootingRange && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">英雄皮肤数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入英雄皮肤数量 (范围 0-23)"
                      value={comprehensiveData.deltaHeroSkinCount}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, deltaHeroSkinCount: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.deltaHeroSkinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">枪皮数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入枪皮数量 (范围 0-160)"
                      value={comprehensiveData.deltaGunSkinCount}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, deltaGunSkinCount: Math.min(160, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.deltaGunSkinCount && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">刀皮数量</label>
                    <input 
                      type="number" 
                      placeholder="请输入刀皮数量 (范围 0-11)"
                      value={comprehensiveData.deltaKnifeSkinCount}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, deltaKnifeSkinCount: Math.min(11, Math.max(0, parseInt(e.target.value) || 0)).toString() }))}
                      className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}

                {comprehensiveData.deltaKnifeSkinCount && (
                    <div className="flex flex-col gap-6 pt-4 border-t border-gray-100">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">特殊英雄皮肤 (选填)</label>
                        <div className="grid grid-cols-2 gap-2">
                        {['骇爪-水墨云图', '红狼-蚀金玫瑰', '威龙-飞虎', '威龙-蛟龙特工队', '威龙-铁面判官', '露娜-黑天际线', '蛊-能天使午夜邮差', '骇爪-维什戴尔'].map(skin => (
                          <button
                            key={skin}
                            onClick={() => {
                              setComprehensiveData(prev => ({
                                ...prev,
                                deltaHeroSkins: prev.deltaHeroSkins.includes(skin) 
                                  ? prev.deltaHeroSkins.filter(s => s !== skin)
                                  : [...prev.deltaHeroSkins, skin]
                              }));
                            }}
                            className={cn(
                              "px-2 py-3 rounded-xl border text-[11px] font-bold transition-all",
                              comprehensiveData.deltaHeroSkins.includes(skin) ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                            )}
                          >
                            {skin}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">特殊枪皮 (选填)</label>
                      <div className="flex flex-col gap-2">
                        {['电玩高手', '美杜莎', '棱镜', 'M7-棱镜攻势S2', 'K416 突击步枪-命运', 'QBZ95-王牌之剑', '腾龙突击步枪-气象感应', 'AUG突击步枪-气象感应', 'ASVAL突击步枪-悬赏令', 'M250-电玩高手 S2', 'MP7-电玩高手 S2'].map(skin => {
                          const existing = (comprehensiveData.deltaGunSkins as any[]).find(s => s.name === skin);
                          return (
                            <div key={skin} className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setComprehensiveData(prev => ({
                                    ...prev,
                                    deltaGunSkins: existing 
                                      ? prev.deltaGunSkins.filter((s: any) => s.name !== skin)
                                      : [...prev.deltaGunSkins, { name: skin, isS: false }]
                                  }));
                                }}
                                className={cn(
                                  "flex-1 h-12 rounded-xl border text-xs font-bold transition-all",
                                  existing ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                                )}
                              >
                                {skin}
                              </button>
                              {existing && (
                                <button
                                  onClick={() => {
                                    setComprehensiveData(prev => ({
                                      ...prev,
                                      deltaGunSkins: prev.deltaGunSkins.map((s: any) => s.name === skin ? { ...s, isS: !s.isS } : s)
                                    }));
                                  }}
                                  className={cn(
                                    "px-3 h-12 rounded-xl border text-xs font-bold transition-all",
                                    existing.isS ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-200 text-gray-400"
                                  )}
                                >
                                  S品质
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">特殊刀皮 (选填)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['赤枭', '黑海', '怜悯', '影锋', '北极星', '电锯惊魂', '信条', '龙牙', '暗星'].map(skin => (
                          <button
                            key={skin}
                            onClick={() => {
                              setComprehensiveData(prev => ({
                                ...prev,
                                deltaKnifeSkins: prev.deltaKnifeSkins.includes(skin) 
                                  ? prev.deltaKnifeSkins.filter(s => s !== skin)
                                  : [...prev.deltaKnifeSkins, skin]
                              }));
                            }}
                            className={cn(
                              "h-12 rounded-xl border text-[11px] font-bold transition-all",
                              comprehensiveData.deltaKnifeSkins.includes(skin) ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-100 text-gray-500"
                            )}
                          >
                            {skin}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {selectedMethod === '截图估值' && (
          <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-1 px-1">
              <p className="text-xs text-gray-500 font-medium">请按需上传以下截图，AI 智能识别系统将根据截图质量进行动态估值</p>
            </div>

            {(SCREENSHOT_CONFIGS[selectedGame] || []).map((config) => (
              <div key={config.key} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-black text-gray-900">{config.label}</h3>
                  </div>
                  {config.type === 'multi-image' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider">支持多图上传</span>
                  )}
                </div>

                {config.type === 'select' ? (
                  <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    <select 
                      value={comprehensiveData.campNobleLevel}
                      onChange={(e) => setComprehensiveData(prev => ({ ...prev, campNobleLevel: e.target.value }))}
                      className="w-full h-14 px-4 bg-gray-50/50 border border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-bold text-sm transition-all"
                    >
                      <option value="">请手动选择贵族等级</option>
                      {config.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Image Grid containing Uploaded, Upload Button, and Sample */}
                    <div className="grid grid-cols-3 gap-3 px-1">
                      {/* Uploaded Images */}
                      {(screenshotCategories[`${selectedGame}_${config.key}`] || []).map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-md group">
                          <img 
                            src={img} 
                            className="w-full h-full object-cover cursor-pointer" 
                            referrerPolicy="no-referrer" 
                            onClick={() => setZoomedImage(img)}
                          />
                          <div className="absolute inset-x-0 bottom-0 py-1 bg-black/20 backdrop-blur-[2px] text-[8px] text-white text-center font-bold pointer-events-none">已上传</div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const key = `${selectedGame}_${config.key}`;
                              setScreenshotCategories(prev => ({
                                ...prev,
                                [key]: prev[key].filter((_, idx) => idx !== i)
                              }));
                            }}
                            className="absolute top-1 right-1 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      {(config.type === 'multi-image' || (screenshotCategories[`${selectedGame}_${config.key}`] || []).length === 0) && (
                        <button 
                          onClick={() => {
                            const key = `${selectedGame}_${config.key}`;
                            setScreenshotCategories(prev => ({
                              ...prev,
                              [key]: [...(prev[key] || []), `https://picsum.photos/seed/${Math.random()}/800/600`]
                            }));
                          }}
                          className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 active:bg-gray-100 transition-all hover:border-blue-400 hover:text-blue-500 bg-white group shadow-sm hover:shadow-md"
                        >
                          <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                            <Image size={24} className="group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-[10px] font-bold">上传截图</span>
                        </button>
                      )}

                      {/* Sample Image Slot (to the right of Upload) */}
                      <div 
                        onClick={() => setZoomedImage(config.sample)}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-md group cursor-pointer active:scale-95 transition-all bg-gray-50"
                      >
                        <img 
                          src={config.sample} 
                          className="w-full h-full object-cover opacity-60" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center">
                          <div className="px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded border border-white/30 mb-1">
                            <span className="text-[8px] font-black text-white uppercase tracking-wider">示例图</span>
                          </div>
                          <p className="text-[8px] text-white/90 font-medium leading-tight line-clamp-3 px-1">{config.tip}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                            <Zap size={16} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2">
        <button 
          onClick={handleStartValuation}
          disabled={
            (selectedMethod === '授权估值' && selectedGame === '王者荣耀' && (!inputValue || !comprehensiveData.campNobleLevel)) ||
            (selectedMethod === '授权估值' && selectedGame === '和平精英' && !isPeaceAuthReady) ||
            (selectedMethod === '链接估值' && !inputValue) ||
            (selectedMethod === '综合估值' && calculateCompletion() < 100) ||
            (selectedMethod === '截图估值' && !isScreenshotValuationReady())
          }
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all",
            ((selectedMethod === '授权估值' && selectedGame === '王者荣耀' && inputValue && comprehensiveData.campNobleLevel) ||
             (selectedMethod === '授权估值' && selectedGame === '和平精英' && isPeaceAuthReady) ||
             (selectedMethod === '链接估值' && inputValue) ||
             (selectedMethod === '综合估值' && calculateCompletion() === 100) ||
             (selectedMethod === '截图估值' && isScreenshotValuationReady()))
              ? "bg-blue-600 text-white shadow-blue-100" 
              : "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed"
          )}
        >
          开始估值
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-2 border-dashed border-blue-200 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-transparent border-t-blue-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="text-blue-600" size={40} />
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">正在深度估值中</h2>
          <div className="flex gap-1 justify-center mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
              />
            ))}
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-400 font-medium max-w-[200px]"
        >
          正在连接大数据分析模块，实时对标全网交易行情
        </motion.p>
      </div>

      <div className="w-full max-w-xs relative bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full relative"
        >
          <motion.div
            animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-20 bg-white/30 skew-x-12"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full"
      >
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Security Authenticated</span>
      </motion.div>
    </div>
  );

  const renderResult = () => {
    const getHighValueSkins = () => {
      if (selectedGame === '和平精英') {
        const peaceData = {
          '粉皮': [
            { name: '龙神之翼', tag: '粉级套装', img: 'https://picsum.photos/seed/peace1/400/600' },
            { name: '梦幻火箭', tag: '粉级套装', img: 'https://picsum.photos/seed/peace2/400/600' },
            { name: '巧克力工厂', tag: '粉级套装', img: 'https://picsum.photos/seed/peace3/400/600' },
            { name: '激战未来', tag: '粉级套装', img: 'https://picsum.photos/seed/peace4/400/600' },
          ],
          '战备': [
            { name: 'M416-五爪金龙', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun1/400/600' },
            { name: 'SCAR-L-梦幻火箭', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun2/400/600' },
            { name: 'AKM-甜心宝贝', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun3/400/600' },
            { name: 'M762-小黄鸭', tag: '限定枪皮', img: 'https://picsum.photos/seed/gun4/400/600' },
          ],
          '载具': [
            { name: '玛莎拉蒂-粉', tag: '限定载具', img: 'https://picsum.photos/seed/car1/400/600' },
            { name: '特斯拉-白', tag: '限定载具', img: 'https://picsum.photos/seed/car2/400/600' },
            { name: '兰博基尼-黄', tag: '限定载具', img: 'https://picsum.photos/seed/car3/400/600' },
            { name: '合金龙骑', tag: '限定载具', img: 'https://picsum.photos/seed/car4/400/600' },
          ],
          '套装': [
            { name: '雪国幻梦', tag: '限定套装', img: 'https://picsum.photos/seed/suit1/400/600' },
            { name: '深海小曼巴', tag: '限定套装', img: 'https://picsum.photos/seed/suit2/400/600' },
            { name: '浪漫波比', tag: '限定套装', img: 'https://picsum.photos/seed/suit3/400/600' },
            { name: '向日葵', tag: '限定套装', img: 'https://picsum.photos/seed/suit4/400/600' },
          ]
        };
        return peaceData[peaceTab];
      } else if (selectedGame === '三角洲行动') {
        const deltaData = {
          '英雄皮肤': [
            { name: '骇爪-水墨云图', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta1/400/600' },
            { name: '红狼-蚀金玫瑰', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta2/400/600' },
            { name: '威龙-飞虎', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta3/400/600' },
            { name: '威龙-铁面判官', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta4/400/600' },
          ],
          '枪皮': [
            { name: 'ASVal-蚀金玫瑰', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta5/400/600' },
            { name: 'M4A1-水墨云图', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta6/400/600' },
            { name: 'K416-铁面判官', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta7/400/600' },
            { name: 'PKM-黑天际线', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta8/400/600' },
          ],
          '刀皮': [
            { name: '战术折刀-水墨云图', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta9/400/600' },
            { name: '战术折刀-蚀金玫瑰', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta10/400/600' },
            { name: '战术折刀-铁面判官', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta11/400/600' },
          ]
        };
        return deltaData[deltaTab];
      } else if (selectedGame === '王者荣耀') {
        const honorData = {
          '珍品无双': [
            { name: '武则天-青冥印', tag: '珍品无双', img: 'https://picsum.photos/seed/honor1/400/600' },
            { name: '妲己-九尾', tag: '珍品无双', img: 'https://picsum.photos/seed/honor2/400/600' },
            { name: '瑶-真我赫兹', tag: '珍品无双', img: 'https://picsum.photos/seed/honor3/400/600' },
            { name: '小乔-琳琅生', tag: '珍品无双', img: 'https://picsum.photos/seed/honor4/400/600' },
          ],
          '珍品传说': [
            { name: '李白-鸣剑·曳影', tag: '珍品传说', img: 'https://picsum.photos/seed/honor5/400/600' },
            { name: '诸葛亮-星域神启', tag: '珍品传说', img: 'https://picsum.photos/seed/honor6/400/600' },
            { name: '花木兰-九霄神辉', tag: '珍品传说', img: 'https://picsum.photos/seed/honor7/400/600' },
            { name: '关羽-赤兔', tag: '珍品传说', img: 'https://picsum.photos/seed/honor8/400/600' },
          ],
          '荣耀典藏': [
            { name: '倪克斯神谕', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin1/400/600' },
            { name: '天鹅之梦', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin2/400/600' },
            { name: '九霄神辉', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin3/400/600' },
            { name: '鸣剑·曳影', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin4/400/600' },
          ],
          '无双皮肤': [
            { name: '孙悟空-齐天大圣', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor9/400/600' },
            { name: '韩信-弑枪猎手', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor10/400/600' },
            { name: '李元芳-飞鸢探春', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor11/400/600' },
            { name: '鲁班七号-乒乒乓乓', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor12/400/600' },
          ],
          '传说皮肤': [
            { name: '貂蝉-仲夏夜之梦', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor13/400/600' },
            { name: '虞姬-云霓雀翎', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor14/400/600' },
            { name: '孙尚香-末日机甲', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor15/400/600' },
            { name: '李信-一念神魔', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor16/400/600' },
          ]
        };
        return honorData[honorTab];
      }
      return [];
    };

    const getStats = () => {
      if (selectedGame === '和平精英') {
        return [
          { label: '系统', value: comprehensiveData.system || '微信' },
          { label: '实名情况', value: comprehensiveData.realNameStatus || '可二次实名' },
          { label: '王牌印记次数', value: comprehensiveData.aceMarkCount || '0' },
          { label: '套装数量', value: comprehensiveData.suitCount || '0' },
          { label: '枪皮数量', value: comprehensiveData.gunSkinCount || '0' },
          { label: '载具数量', value: comprehensiveData.vehicleCount || '0' },
          { label: '粉装数量', value: comprehensiveData.pinkSuitCount || '0' },
          { label: '粉枪数量', value: comprehensiveData.pinkGunCount || '0' },
          ...(comprehensiveData.peaceSpecialVehicles?.length ? [{ label: '特殊载具', value: comprehensiveData.peaceSpecialVehicles.join(', ') }] : []),
          ...(comprehensiveData.peaceSpecialGuns?.length ? [{ label: '特殊枪皮', value: comprehensiveData.peaceSpecialGuns.join(', ') }] : []),
          ...(comprehensiveData.peaceSpecialOutfits?.others?.length ? [{ label: '特殊服装', value: comprehensiveData.peaceSpecialOutfits.others.join(', ') }] : []),
          ...(comprehensiveData.peaceSpecialOutfits?.redOutfitLevel ? [{ label: '红装等级', value: comprehensiveData.peaceSpecialOutfits.redOutfitLevel + '级' }] : []),
          ...(comprehensiveData.peaceSpecialItems?.gachaFragments ? [{ label: '扭蛋碎片', value: comprehensiveData.peaceSpecialItems.gachaFragments }] : []),
          ...(comprehensiveData.peaceSpecialItems?.carCoins ? [{ label: '车币', value: comprehensiveData.peaceSpecialItems.carCoins }] : []),
          ...(comprehensiveData.peaceSpecialItems?.redSuitFragments ? [{ label: '红装碎片', value: comprehensiveData.peaceSpecialItems.redSuitFragments }] : []),
          ...(comprehensiveData.peaceSpecialItems?.hallOfFameFrame ? [{ label: '名人堂框', value: '已拥有' }] : []),
          ...(comprehensiveData.peaceSpecialItems?.warGodFrame ? [{ label: '战神框', value: '已拥有' }] : []),
        ];
      } else if (selectedGame === '三角洲行动') {
        return [
          { label: '系统', value: comprehensiveData.system || '微信' },
          { label: '实名情况', value: comprehensiveData.realNameStatus || '可二次实名' },
          { label: '烽火等级', value: comprehensiveData.fireLevel || '0' },
          { label: '资产', value: comprehensiveData.assets || '0' },
          { label: '仓库等级', value: comprehensiveData.warehouseLevel || '0' },
          { label: '英雄皮肤', value: comprehensiveData.deltaHeroSkinCount || '0' },
          { label: '枪皮数量', value: comprehensiveData.deltaGunSkinCount || '0' },
          { label: '刀皮数量', value: comprehensiveData.deltaKnifeSkinCount || '0' },
          ...(comprehensiveData.deltaHeroSkins?.length ? [{ label: '特殊英雄皮肤', value: comprehensiveData.deltaHeroSkins.join(', ') }] : []),
          ...(comprehensiveData.deltaGunSkins?.length ? [{ label: '特殊枪皮', value: comprehensiveData.deltaGunSkins.map((s: any) => `${s.name}${s.isS ? '(S)' : ''}`).join(', ') }] : []),
          ...(comprehensiveData.deltaKnifeSkins?.length ? [{ label: '特殊刀皮', value: comprehensiveData.deltaKnifeSkins.join(', ') }] : []),
        ];
      }
      return [
        { label: '系统', value: comprehensiveData.system || '微信' },
        { label: '实名情况', value: comprehensiveData.realNameStatus || '可二次实名' },
        { label: '贵族等级', value: comprehensiveData.nobleLevel || 'V10' },
        { label: '英雄数量', value: comprehensiveData.heroCount || '122' },
        { label: '皮肤数量', value: comprehensiveData.skinCount || '382' },
        { label: '史诗皮肤', value: comprehensiveData.epicSkinCount || '0' },
        { label: '传说皮肤', value: comprehensiveData.legendarySkinCount || '0' },
        { label: '荣耀典藏', value: comprehensiveData.honorCollectionCount || '0' },
        { label: '无双皮肤', value: comprehensiveData.peerlessSkinCount || '0' },
        { label: '珍品传说', value: comprehensiveData.preciousLegendaryCount || '0' },
        { label: '珍品无双', value: comprehensiveData.preciousPeerlessCount || '0' },
      ];
    };

    return (
      <div className="flex flex-col gap-6 p-4 pb-24">
        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Share Image Content */}
                <div className="flex flex-col bg-gray-50 overflow-y-auto max-h-[70vh]">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">估值报告</span>
                        <h2 className="text-2xl font-black">{selectedGame}</h2>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Gamepad2 size={24} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-blue-100 text-[10px] font-medium uppercase tracking-wider">预计成交价</span>
                      <span className="text-4xl font-black">¥3,280</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6 grid grid-cols-3 gap-4 bg-white">
                    {getStats().slice(0, 6).map((stat, i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-gray-400 font-medium">{stat.label}</span>
                        <span className="text-xs font-bold text-gray-900">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Flattened High Value Skins */}
                  <div className="p-6 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Flame size={16} className="text-orange-500" />
                      {(selectedGame === '和平精英' || selectedGame === '三角洲行动') ? '资产展示' : '高价值皮肤'}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(() => {
                        let allSkins: any[] = [];
                        if (selectedGame === '和平精英') {
                          const peaceData = {
                            '粉皮': [
                              { name: '龙神之翼', tag: '粉级套装', img: 'https://picsum.photos/seed/peace1/400/600' },
                              { name: '梦幻火箭', tag: '粉级套装', img: 'https://picsum.photos/seed/peace2/400/600' },
                              { name: '巧克力工厂', tag: '粉级套装', img: 'https://picsum.photos/seed/peace3/400/600' },
                              { name: '激战未来', tag: '粉级套装', img: 'https://picsum.photos/seed/peace4/400/600' },
                            ],
                            '战备': [
                              { name: 'M416-五爪金龙', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun1/400/600' },
                              { name: 'SCAR-L-梦幻火箭', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun2/400/600' },
                              { name: 'AKM-甜心宝贝', tag: '特效枪皮', img: 'https://picsum.photos/seed/gun3/400/600' },
                              { name: 'M762-小黄鸭', tag: '限定枪皮', img: 'https://picsum.photos/seed/gun4/400/600' },
                            ],
                            '载具': [
                              { name: '玛莎拉蒂-粉', tag: '限定载具', img: 'https://picsum.photos/seed/car1/400/600' },
                              { name: '特斯拉-白', tag: '限定载具', img: 'https://picsum.photos/seed/car2/400/600' },
                              { name: '兰博基尼-黄', tag: '限定载具', img: 'https://picsum.photos/seed/car3/400/600' },
                              { name: '合金龙骑', tag: '限定载具', img: 'https://picsum.photos/seed/car4/400/600' },
                            ],
                            '套装': [
                              { name: '雪国幻梦', tag: '限定套装', img: 'https://picsum.photos/seed/suit1/400/600' },
                              { name: '深海小曼巴', tag: '限定套装', img: 'https://picsum.photos/seed/suit2/400/600' },
                              { name: '浪漫波比', tag: '限定套装', img: 'https://picsum.photos/seed/suit3/400/600' },
                              { name: '向日葵', tag: '限定套装', img: 'https://picsum.photos/seed/suit4/400/600' },
                            ]
                          };
                          Object.entries(peaceData).forEach(([cat, skins]) => {
                            skins.forEach(skin => allSkins.push({ ...skin, category: cat }));
                          });
                        } else if (selectedGame === '三角洲行动') {
                          const deltaData = {
                            '英雄皮肤': [
                              { name: '骇爪-水墨云图', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta1/400/600' },
                              { name: '红狼-蚀金玫瑰', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta2/400/600' },
                              { name: '威龙-飞虎', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta3/400/600' },
                              { name: '威龙-铁面判官', tag: '典藏皮肤', img: 'https://picsum.photos/seed/delta4/400/600' },
                            ],
                            '枪皮': [
                              { name: 'ASVal-蚀金玫瑰', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta5/400/600' },
                              { name: 'M4A1-水墨云图', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta6/400/600' },
                              { name: 'K416-铁面判官', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta7/400/600' },
                              { name: 'PKM-黑天际线', tag: '典藏枪皮', img: 'https://picsum.photos/seed/delta8/400/600' },
                            ],
                            '刀皮': [
                              { name: '战术折刀-水墨云图', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta9/400/600' },
                              { name: '战术折刀-蚀金玫瑰', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta10/400/600' },
                              { name: '战术折刀-铁面判官', tag: '典藏刀皮', img: 'https://picsum.photos/seed/delta11/400/600' },
                            ]
                          };
                          Object.entries(deltaData).forEach(([cat, skins]) => {
                            skins.forEach(skin => allSkins.push({ ...skin, category: cat }));
                          });
                        } else if (selectedGame === '王者荣耀') {
                          const honorData = {
                            '珍品无双': [
                              { name: '武则天-青冥印', tag: '珍品无双', img: 'https://picsum.photos/seed/honor1/400/600' },
                              { name: '妲己-九尾', tag: '珍品无双', img: 'https://picsum.photos/seed/honor2/400/600' },
                              { name: '瑶-真我赫兹', tag: '珍品无双', img: 'https://picsum.photos/seed/honor3/400/600' },
                              { name: '小乔-琳琅生', tag: '珍品无双', img: 'https://picsum.photos/seed/honor4/400/600' },
                            ],
                            '珍品传说': [
                              { name: '李白-鸣剑·曳影', tag: '珍品传说', img: 'https://picsum.photos/seed/honor5/400/600' },
                              { name: '诸葛亮-星域神启', tag: '珍品传说', img: 'https://picsum.photos/seed/honor6/400/600' },
                              { name: '花木兰-九霄神辉', tag: '珍品传说', img: 'https://picsum.photos/seed/honor7/400/600' },
                              { name: '关羽-赤兔', tag: '珍品传说', img: 'https://picsum.photos/seed/honor8/400/600' },
                            ],
                            '荣耀典藏': [
                              { name: '倪克斯神谕', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin1/400/600' },
                              { name: '天鹅之梦', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin2/400/600' },
                              { name: '九霄神辉', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin3/400/600' },
                              { name: '鸣剑·曳影', tag: '荣耀典藏', img: 'https://picsum.photos/seed/skin4/400/600' },
                            ],
                            '无双皮肤': [
                              { name: '孙悟空-齐天大圣', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor9/400/600' },
                              { name: '韩信-弑枪猎手', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor10/400/600' },
                              { name: '李元芳-飞鸢探春', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor11/400/600' },
                              { name: '鲁班七号-乒乒乓乓', tag: '无双皮肤', img: 'https://picsum.photos/seed/honor12/400/600' },
                            ],
                            '传说皮肤': [
                              { name: '貂蝉-仲夏夜之梦', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor13/400/600' },
                              { name: '虞姬-云霓雀翎', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor14/400/600' },
                              { name: '孙尚香-末日机甲', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor15/400/600' },
                              { name: '李信-一念神魔', tag: '传说皮肤', img: 'https://picsum.photos/seed/honor16/400/600' },
                            ]
                          };
                          Object.entries(honorData).forEach(([cat, skins]) => {
                            skins.forEach(skin => allSkins.push({ ...skin, category: cat }));
                          });
                        }
                        return allSkins.slice(0, 9).map((skin, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-sm">
                            <img 
                              src={skin.img} 
                              alt={skin.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-1 left-1">
                              <span className="px-1.5 py-0.5 bg-blue-600/80 backdrop-blur-sm text-white text-[7px] font-black rounded-sm uppercase tracking-tighter">
                                {skin.category}
                              </span>
                            </div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <span className="text-[8px] font-bold text-white truncate block">{skin.name}</span>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="p-6 pt-0 flex justify-between items-center border-t border-gray-100 mt-4 bg-white">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-gray-400">估值时间: {new Date().toLocaleDateString()}</span>
                      <span className="text-[8px] text-gray-400">数据来源: 深度估值动态评估模型</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ValuationReport" 
                          alt="QR Code"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[6px] text-gray-400 font-medium scale-[0.85] origin-top whitespace-nowrap">扫码查看估值报告</span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setPermissionCallback(() => () => {
                        setToast({ message: '已保存到本地相册', type: 'success' });
                        setTimeout(() => setToast(null), 2000);
                      });
                      setShowPermissionModal(true);
                    }}
                    className="flex items-center justify-center gap-2 h-12 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                  >
                    <Download size={18} />
                    保存图片
                  </button>
                  <button 
                    onClick={() => setShowShareSheet(true)}
                    className="flex items-center justify-center gap-2 h-12 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-blue-100"
                  >
                    <Share2 size={18} />
                    立即分享
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Valuation Price Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none p-6 relative overflow-hidden shadow-xl shadow-blue-100">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-blue-100 text-xs font-medium uppercase tracking-wider">预计成交价</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">¥3,280</span>
                </div>
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold border border-white/30">
                击败了 88% 账号
              </div>
            </div>
          </div>
        </Card>

        {/* User Filled Data Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-500" />
            数据统计
          </h3>
          <Card className="p-4 grid grid-cols-2 gap-y-4 gap-x-6">
            {getStats().map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">{stat.label}</span>
                <span className="text-sm font-bold text-gray-800">{stat.value}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* High-Value Skins Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              {(selectedGame === '和平精英' || selectedGame === '三角洲行动') ? '资产展示' : '高价值皮肤'}
            </h3>
            {selectedGame === '和平精英' && (
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['粉皮', '战备', '载具', '套装'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPeaceTab(tab)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                      peaceTab === tab 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
            {selectedGame === '三角洲行动' && (
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['英雄皮肤', '枪皮', '刀皮'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDeltaTab(tab)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                      deltaTab === tab 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
            {selectedGame === '王者荣耀' && (
              <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-[200px]">
                {(['珍品无双', '珍品传说', '荣耀典藏', '无双皮肤', '传说皮肤'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setHonorTab(tab)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded-md transition-all whitespace-nowrap",
                      honorTab === tab 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {getHighValueSkins().map((skin, i) => (
              <div key={i} className="relative group rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <img 
                  src={skin.img} 
                  alt={skin.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-0.5">
                  <span className="text-[10px] text-orange-400 font-black tracking-wider uppercase">{skin.tag}</span>
                  <span className="text-xs font-bold text-white">{skin.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={() => setCurrentPage('contact')}
            className="w-full h-14 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            联系客服
          </button>
          <button 
            onClick={() => {
              resetValuationData();
              setCurrentPage('home');
            }}
            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100"
          >
            返回首页
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-full h-14 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            分享估值报告
          </button>
        </div>
      </div>
    );
  };

  const renderTutorialId = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-900">如何获取营地 ID</h2>
        <p className="text-sm text-gray-500">按照以下步骤即可快速找到您的营地 ID</p>
      </div>
      <div className="flex flex-col gap-4">
        {[
          { step: 1, text: '打开“王者营地” App' },
          { step: 2, text: '点击右下角“我”进入个人中心' },
          { step: 3, text: '在头像下方即可看到“营地ID”' },
          { step: 4, text: '长按 ID 即可完成复制' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
              {item.step}
            </div>
            <p className="text-sm text-gray-700 font-medium">{item.text}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setCurrentPage('form')}
        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold"
      >
        我知道了
      </button>
    </div>
  );

  const renderTutorialLink = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-900">如何获取链接二级页面内容</h2>
      </div>
      <div className="flex flex-col gap-4">
        {[
          { step: 1, text: '手机/电脑打开需要估价的商品详情页' },
          { step: 2, text: '复制顶部链接栏的链接，手机可以直接分享商品链接' },
          { step: 3, text: '将复制的链接粘贴到输入框内，开始估值' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
              {item.step}
            </div>
            <p className="text-sm text-gray-700 font-medium">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
        <ShieldAlert className="text-orange-500 flex-shrink-0" size={20} />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-orange-700">注意：</span>
          <p className="text-xs text-orange-600 leading-relaxed">
            目前已支持大部分交易网站，更多网站正在支持中
          </p>
        </div>
      </div>

      <button 
        onClick={() => setCurrentPage('form')}
        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold mt-4"
      >
        返回
      </button>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col gap-8 p-6 pt-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-gray-900">欢迎登录</h2>
        <p className="text-sm text-gray-500">登录后即可享受极速估值服务</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">手机号</label>
          <input 
            type="tel" 
            placeholder="请输入手机号"
            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">验证码</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="请输入验证码"
              className="flex-1 h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <button className="px-4 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl">获取验证码</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => {
            if (!agreed) {
              setShowAgreementConfirm(true);
              return;
            }
            setIsLoggedIn(true);
            setCurrentPage('home');
          }}
          className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100"
        >
          立即登录
        </button>
        
        <div className="flex items-center gap-2 px-1">
          <button 
            onClick={() => setAgreed(!agreed)}
            className={cn(
              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
              agreed ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"
            )}
          >
            {agreed && <CheckCircle2 size={12} />}
          </button>
          <p className="text-xs text-gray-500">
            登录即代表您已阅读并同意
            <button onClick={() => setCurrentPage('privacy')} className="text-blue-600 font-medium">《用户服务协议》</button>
            和
            <button onClick={() => setCurrentPage('privacy')} className="text-blue-600 font-medium">《隐私政策》</button>
          </p>
        </div>
      </div>
    </div>
  );

  const renderMine = () => (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* User Info */}
      <div 
        onClick={() => {
          if (!isLoggedIn) setCurrentPage('login');
        }}
        className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-50">
            <img 
              src={isLoggedIn ? userInfo.avatar : 'https://picsum.photos/seed/default/200/200'} 
              alt="avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{isLoggedIn ? userInfo.nickname : '未登录'}</span>
            {!isLoggedIn && <span className="text-sm text-gray-500">点击登录账号</span>}
          </div>
        </div>
        {isLoggedIn && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage('settings');
            }}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Menu List */}
      <div className="flex flex-col gap-2">
        {[
          { id: 'records', icon: <History className="text-blue-500" />, label: '估值记录' },
          { id: 'favorites', icon: <Star className="text-yellow-500" />, label: '我的收藏' },
          { id: 'contact', icon: <HelpCircle className="text-purple-500" />, label: '联系我们' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (!isLoggedIn && (item.id === 'records' || item.id === 'favorites')) {
                setCurrentPage('login');
              } else {
                setCurrentPage(item.id as Page);
              }
            }}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-bold text-gray-700">{item.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
               {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="text-xs text-gray-400">{favorites.length} 个商品</span>
               )}
               <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Favorites Section */}
      {isLoggedIn && favorites.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">最近收藏</h3>
            <button 
              className="text-xs text-blue-600 font-medium"
              onClick={() => setCurrentPage('favorites')}
            >
              查看全部
            </button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 snap-x" style={{ scrollbarWidth: 'none' }}>
            {MOCK_ACCOUNTS.filter(a => favorites.includes(a.id)).slice(0, 5).map(account => (
               <button 
                 key={account.id} 
                 className="flex flex-col gap-1.5 w-32 shrink-0 snap-start active:scale-95 transition-transform"
                 onClick={() => {
                    setSelectedAccountId(account.id);
                    setCurrentPage('item-detail');
                 }}
               >
                 <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative">
                   <img src={account.coverImage} className="w-full h-full object-cover" />
                   <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white">
                      ¥{account.price}
                   </div>
                 </div>
                 <div className="text-[11px] font-medium text-gray-800 line-clamp-2 text-left leading-tight">
                   {account.title}
                 </div>
               </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRecords = () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">估值记录</h2>
        <p className="text-xs text-gray-400">共 {valuationHistory.length} 条记录</p>
      </div>
      <div className="flex flex-col gap-3">
        {valuationHistory.map((record) => (
          <div key={record.id}>
            <Card className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{record.game}</span>
                  <span className="text-[10px] text-gray-400">{record.time}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-orange-500">¥{record.price}</span>
                  <span className="text-[10px] text-green-500 font-medium">击败了 {record.beatPercent}% 账号</span>
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('result')}
                className="w-full py-2 bg-gray-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-50"
              >
                查看详情报告
              </button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPage === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, currentPage]);

  const startChat = () => {
    setChatStep(0);
    setChatMessages([
      {
        id: '1',
        type: 'bot',
        content: '请问您想估价哪个游戏，王者荣耀、和平精英还是三角洲行动',
        options: ['王者荣耀', '和平精英', '三角洲行动']
      }
    ]);
    setCurrentPage('chat');
  };

  const handleChatOption = (option: string) => {
    const userMsg: Message = { id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type: 'user', content: option };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatTyping(true);

    setTimeout(() => {
      setIsChatTyping(false);
      if (chatStep === 0) {
        if (option === '王者荣耀') {
          setChatStep(1);
          setChatMessages(prev => [...prev, {
            id: `bot-s0-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            options: ['输入营地 ID', '网站链接', '自己填写信息']
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            id: `bot-retry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            options: ['重新开始']
          }]);
          if (option === '重新开始') startChat();
        }
      } else if (chatStep === 1) {
        if (option === '自己填写信息') {
          setChatStep(2);
          setChatMessages(prev => [...prev, {
            id: `bot-s1-write-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            options: ['安卓微信', '安卓QQ', '苹果微信', '苹果QQ']
          }]);
        } else if (option === '输入营地 ID') {
          setChatStep(10);
          setChatMessages(prev => [...prev, {
            id: `bot-s1-camp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            field: 'campId'
          }]);
        } else if (option === '网站链接') {
          setChatStep(11);
          setChatMessages(prev => [...prev, {
            id: `bot-s1-link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            field: 'link'
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            id: `bot-s1-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            options: ['自己填写信息']
          }]);
        }
      } else if (chatStep === 2) {
        setChatStep(3);
        setComprehensiveData(prev => ({ ...prev, system: option }));
        setChatMessages(prev => [...prev, {
          id: `bot-s2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '2.这个账号有没有防沉迷限制呀？',
          options: ['无限制', '有限制']
        }]);
      } else if (chatStep === 3) {
        setChatStep(4);
        setComprehensiveData(prev => ({ ...prev, antiAddiction: option }));
        setChatMessages(prev => [...prev, {
          id: `bot-s3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '3.账号有没有做过二次实名呢？',
          options: ['已做二次', '未做二次']
        }]);
      } else if (chatStep === 4) {
        setChatStep(5);
        setComprehensiveData(prev => ({ ...prev, realNameStatus: option }));
        setChatMessages(prev => [...prev, {
          id: `bot-s4-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '4. 您的贵族等级是多少呀？（v1到v10 都可以说，荣耀/无双贵族也属于 v10哦）',
          options: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', '荣耀贵族', '无双贵族']
        }]);
      } else if (chatStep === 5) {
        setChatStep(6);
        setComprehensiveData(prev => ({ ...prev, nobleLevel: option }));
        setChatMessages(prev => [...prev, {
          id: `bot-s5-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '5.账号里总共有多少个皮肤呀？',
          field: 'skinCount'
        }]);
      } else if (chatStep === 6) {
        setChatStep(7);
        setChatMessages(prev => [...prev, {
          id: `bot-s6-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '6.荣耀典藏皮肤有几个呢？',
          field: 'honorCollectionCount'
        }]);
      } else if (chatStep === 7) {
        setChatStep(8);
        setChatMessages(prev => [...prev, {
          id: `bot-s7-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '7.传说皮肤有几个呀？',
          field: 'legendarySkinCount'
        }]);
      } else if (chatStep === 8) {
        setChatStep(9);
        setChatMessages(prev => [...prev, {
          id: `bot-s8-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '8. 无双皮肤有几个呀？',
          field: 'peerlessSkinCount'
        }]);
      } else if (chatStep === 9) {
        setChatMessages(prev => [...prev, {
          id: `bot-s9-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '填写完毕，正在为您估价...',
        }]);
        setTimeout(() => {
          setCurrentPage('loading');
          setTimeout(() => setCurrentPage('result'), 2000);
        }, 1000);
      } else if (chatStep === 10) {
        // Validate Camp ID
        const isNumeric = /^\d+$/.test(option);
        const isValidLength = option.length >= 7 && option.length <= 11;
        
        if (option === '1111111') {
          setChatMessages(prev => [...prev, {
            id: `bot-s10-err1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            field: 'campId'
          }]);
        } else if (!isNumeric || !isValidLength) {
          setChatMessages(prev => [...prev, {
            id: `bot-s10-err2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            field: 'campId'
          }]);
        } else {
          setInputValue(option);
          setSelectedGame('王者荣耀');
          setSelectedMethod('授权估值');
          setChatMessages(prev => [...prev, {
            id: `bot-s10-ok-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }]);
          setTimeout(() => {
            setCurrentPage('loading');
            setTimeout(() => setCurrentPage('result'), 2000);
          }, 1000);
        }
      } else if (chatStep === 11) {
        setInputValue(option);
        setSelectedGame('王者荣耀');
        setSelectedMethod('链接估值');
        setChatMessages(prev => [...prev, {
          id: `bot-s11-ok-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: '链接已确认，正在为您估价...',
        }]);
        setTimeout(() => {
          setCurrentPage('loading');
          setTimeout(() => setCurrentPage('result'), 2000);
        }, 1000);
      }
    }, 1500);
  };

  const handleChatInput = (val: string, field: string) => {
    if (field !== 'campId' && field !== 'link') {
      setComprehensiveData(prev => ({ ...prev, [field]: val }));
    }
    handleChatOption(val);
  };

  const renderChat = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {chatMessages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              msg.type === 'user' ? "self-end items-end" : "self-start items-start"
            )}
          >
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.type === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 shadow-sm rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        {chatMessages[chatMessages.length - 1]?.options ? (
          <div className="flex flex-wrap gap-2">
            {chatMessages[chatMessages.length - 1].options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChatOption(opt)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600 active:bg-blue-50 active:border-blue-200 active:text-blue-600 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : chatMessages[chatMessages.length - 1]?.field ? (
          <div className="flex gap-2">
            <input 
              type={(chatMessages[chatMessages.length - 1].field === 'link' || chatMessages[chatMessages.length - 1].field === 'campId') ? "text" : "number"}
              placeholder={chatMessages[chatMessages.length - 1].field === 'link' ? "请输入链接" : "请输入数量/ID"}
              className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val) {
                    handleChatInput(val, chatMessages[chatMessages.length - 1].field!);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button 
              onClick={() => {
                const input = document.querySelector('input[placeholder^="请输入"]') as HTMLInputElement;
                if (input.value) {
                  handleChatInput(input.value, chatMessages[chatMessages.length - 1].field!);
                  input.value = '';
                }
              }}
              className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              发送
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="flex flex-col gap-6 p-4 pb-20 bg-gray-50 min-h-screen">
      {/* Tab Toggle */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
        <button 
          onClick={() => setContactTab('wechat')}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
            contactTab === 'wechat' ? "bg-green-500 text-white shadow-lg shadow-green-100" : "text-gray-400"
          )}
        >
          企业微信
        </button>
        <button 
          onClick={() => setContactTab('qq')}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
            contactTab === 'qq' ? "bg-green-500 text-white shadow-lg shadow-green-100" : "text-gray-400"
          )}
        >
          QQ 群组
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {contactTab === 'wechat' ? (
          <Card className="p-8 flex flex-col items-center gap-6 bg-white rounded-[32px] border-none shadow-xl shadow-gray-200/50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <MessageCircle size={40} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-black text-gray-900">添加企业微信</h3>
                <p className="text-sm text-gray-400 font-medium">专业客服一对一服务</p>
              </div>
            </div>

            <div className="w-full max-w-[240px] aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="w-full h-full border-2 border-gray-200 border-dashed rounded-2xl flex items-center justify-center text-gray-300 font-bold text-lg">
                二维码
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[10px] text-gray-400 font-bold">扫码添加客服</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => {
                  setPermissionCallback(() => () => {
                    setToast({ message: '已保存到本地相册', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  });
                  setShowPermissionModal(true);
                }}
                className="w-full h-12 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Download size={18} />
                保存图片
              </button>
              <div className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">深度估号客服</span>
                    <span className="text-[10px] text-gray-400 font-mono">微信号: haoboshi2024</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('haoboshi2024');
                    setToast({ message: '微信号已复制', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 active:scale-95 transition-transform"
                >
                  <Copy size={14} />
                  复制
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 flex flex-col items-center gap-6 bg-white rounded-[32px] border-none shadow-xl shadow-gray-200/50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Users size={40} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-black text-gray-900">账号特价群</h3>
                <p className="text-sm text-gray-400 font-medium">专业客服一对一服务</p>
              </div>
            </div>

            <div className="w-full max-w-[240px] aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="w-full h-full border-2 border-gray-200 border-dashed rounded-2xl flex items-center justify-center text-gray-300 font-bold text-lg">
                二维码
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[10px] text-gray-400 font-bold">扫码添加客服</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setPermissionCallback(() => () => {
                      setToast({ message: '已保存到本地相册', type: 'success' });
                      setTimeout(() => setToast(null), 2000);
                    });
                    setShowPermissionModal(true);
                  }}
                  className="flex items-center justify-center gap-2 h-12 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                >
                  <Download size={18} />
                  保存图片
                </button>
                <button 
                  onClick={() => {
                    setToast({ message: '正在跳转 QQ...', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="flex items-center justify-center gap-2 h-12 bg-blue-600 text-white rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-blue-100"
                >
                  <ExternalLink size={18} />
                  一键进群
                </button>
              </div>

              <div className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">账号特价群</span>
                    <span className="text-[10px] text-gray-400 font-mono">群号: 782910345</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('782910345');
                    setToast({ message: '群号已复制', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  <Copy size={14} />
                  复制
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold text-gray-900">隐私协议</h2>
      <div className="prose prose-sm text-gray-600 leading-relaxed">
        <p>我们非常重视您的隐私。本协议阐述了我们如何收集、使用和保护您的个人信息。</p>
        <h3 className="text-sm font-bold text-gray-800 mt-4">1. 信息收集</h3>
        <p>我们会收集您在估值过程中提供的账号信息、营地 ID 以及联系方式，仅用于生成估值报告。</p>
        <h3 className="text-sm font-bold text-gray-800 mt-4">2. 信息使用</h3>
        <p>您的信息将通过加密方式传输，并仅在估值算法中使用，不会泄露给任何第三方。</p>
        <h3 className="text-sm font-bold text-gray-800 mt-4">3. 账号安全</h3>
        <p>请妥善保管您的登录信息。我们会采取行业标准的安全措施保护您的数据。</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">设置</h2>
        <p className="text-xs text-gray-400">管理您的账号与应用设置</p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => setCurrentPage('privacy')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-sm font-bold text-gray-700">隐私协议</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button
          onClick={() => setCurrentPage('versionDetail')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="text-blue-500" size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-700">当前版本</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAppUpdated ? (
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full">有新版本</span>
            ) : (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">已是最新</span>
            )}
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </button>

        <button
          onClick={() => {
            setDeleteAccountStep(1);
            setShowDeleteAccountModal(true);
          }}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-orange-500" size={20} />
            <span className="text-sm font-bold text-gray-700">注销账号</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </div>

      <button 
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full h-14 bg-white text-red-500 border border-red-100 rounded-2xl font-bold shadow-sm active:scale-95 transition-transform mt-4"
      >
        退出登录
      </button>
    </div>
  );

  const renderVersionDetail = () => {
    const handleUpdate = () => {
      if (isAppUpdated) {
        setShowForceUpdateModal(true);
        return;
      }
      if (isDownloadingUpdate) return;
      
      setIsDownloadingUpdate(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUpdateProgress(100);
          setTimeout(() => {
            setShowInstallPermission(true);
          }, 500);
        } else {
          setUpdateProgress(progress);
        }
      }, 300);
    };

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex flex-col items-center pt-12 pb-8 gap-4">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center text-white">
            <Zap size={40} fill="currentColor" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-xl font-bold text-gray-900">深度估号</h3>
            <span className="text-sm text-gray-400">当前版本 v2.1.0</span>
          </div>
        </div>

        <div className="flex-1 px-6">
          <div className="bg-gray-50 rounded-3xl p-6 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-900">
              {isAppUpdated ? '当前内容' : '新版本内容'}
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">优化了授权估值的识别算法，准确率提升 20%</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">新增注销账号功能，保障用户数据权利</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">修复了部分机型在生成报告时的闪退问题</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button 
            onClick={handleUpdate}
            className={cn(
              "relative w-full h-14 rounded-2xl font-bold text-base transition-all overflow-hidden",
              isAppUpdated 
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-95"
            )}
          >
            {isDownloadingUpdate && !isAppUpdated && (
              <motion.div 
                className="absolute inset-0 bg-blue-700 origin-left"
                style={{ width: `${updateProgress}%` }}
              />
            )}
            <span className="relative z-10">
              {isAppUpdated ? '已是最新版本' : isDownloadingUpdate ? `正在下载 ${Math.round(updateProgress)}%` : '立即更新'}
            </span>
          </button>
        </div>
      </div>
    );
  };

  const renderCampHelp = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-900">营地 ID 获取指引</h2>
        <p className="text-sm text-gray-500">请按照以下步骤获取您的王者营地 ID</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-gray-800">第一步</span>
            <p className="text-sm text-gray-500 leading-relaxed">下载【王者营地】并打开</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-gray-800">第二步</span>
            <p className="text-sm text-gray-500 leading-relaxed">登录自己账号后，打开右下角【我】的页面</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-gray-800">第三步</span>
            <p className="text-sm text-gray-500 leading-relaxed">点击右上角设置，即可查看自己的营地 ID</p>
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
          <ShieldAlert className="text-orange-500 flex-shrink-0" size={20} />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-orange-700">注意：</span>
            <p className="text-xs text-orange-600 leading-relaxed">
              使用过程中，需要您在设置内，打开【游戏隐私】设置，将物品中的【英雄、常用英雄】【皮肤】【铭文】数据设置为【所有人可见】
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setCurrentPage('form')}
        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4"
      >
        返回
      </button>
    </div>
  );

  const renderSecurity = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-900">账号安全说明</h2>
        <p className="text-sm text-gray-500">平台承诺保障您的账号资产安全</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-600">
          <ShieldCheck size={24} />
          <span className="font-bold">安全授权保障</span>
        </div>
        
        <p className="text-base text-gray-700 leading-relaxed">
          需通过“和平营地”同步资产明细（请先完成账号关联）。平台承诺仅“读取”数据以生成精准分析报告，绝无任何违规操作，请放心授权。
        </p>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-2">我们的承诺：</h4>
          <ul className="text-xs text-gray-500 flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>仅读取公开资产数据，不涉及账号密码</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>数据加密传输，严格保护用户隐私</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>绝不进行任何游戏内违规操作</span>
            </li>
          </ul>
        </div>
      </div>

      <button 
        onClick={() => setCurrentPage('form')}
        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4"
      >
        返回
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative">
      <Header 
        title={
          currentPage === 'chat' ? (isChatTyping ? '【正在输入中】' : '在线估值') :
          currentPage === 'home' ? '深度估号' : 
          currentPage === 'valuation' ? 'AI估值' :
          currentPage === 'form' ? (selectedMethod === '截图估值' ? '截图估值' : '填写信息') :
          currentPage === 'loading' ? '估值中' : 
          currentPage === 'result' ? '估值结果' :
          currentPage === 'mine' ? '个人中心' :
          currentPage === 'campHelp' ? '获取指引' :
          currentPage === 'tutorial-link' ? '如何获取链接二级页面内容' :
          currentPage === 'records' ? '估值记录' :
          currentPage === 'contact' ? '联系我们' :
          currentPage === 'privacy' ? '隐私协议' :
          currentPage === 'login' ? '登录' :
          currentPage === 'security' ? '账号安全说明' :
          currentPage === 'versionDetail' ? '版本详情' :
          currentPage === 'settings' ? '设置' :
          currentPage === 'find-account-games' ? '游戏选项' :
          currentPage === 'market' ? '账号列表' :
          currentPage === 'item-detail' ? '商品详情' :
          currentPage === 'checkout' ? '确认订单' :
          currentPage === 'im-trade' ? '交易群组聊天' :
          currentPage === 'favorites' ? '我的收藏' : '操作教程'
        } 
        onBack={currentPage !== 'home' && currentPage !== 'mine' && currentPage !== 'valuation' ? goBack : undefined}
      />
      
      <main className="min-h-[calc(100vh-120px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.25,
              ease: "easeOut"
            }}
          >
            {currentPage === 'home' && renderHome()}
            {currentPage === 'valuation' && renderValuation()}
            {currentPage === 'form' && renderForm()}
            {currentPage === 'loading' && renderLoading()}
            {currentPage === 'result' && renderResult()}
            {currentPage === 'tutorial-id' && renderTutorialId()}
            {currentPage === 'tutorial-link' && renderTutorialLink()}
            {currentPage === 'mine' && renderMine()}
            {currentPage === 'records' && renderRecords()}
            {currentPage === 'contact' && renderContact()}
            {currentPage === 'privacy' && renderPrivacy()}
            {currentPage === 'login' && renderLogin()}
            {currentPage === 'settings' && renderSettings()}
            {currentPage === 'versionDetail' && renderVersionDetail()}
            {currentPage === 'campHelp' && renderCampHelp()}
            {currentPage === 'security' && renderSecurity()}
            {currentPage === 'chat' && renderChat()}
            {currentPage === 'find-account-games' && renderFindAccountGames()}
            {currentPage === 'market' && renderMarket()}
            {currentPage === 'item-detail' && renderItemDetail()}
            {currentPage === 'checkout' && renderCheckout()}
            {currentPage === 'im-trade' && renderImTrade()}
            {currentPage === 'favorites' && renderFavorites()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Entry */}
      {currentPage !== 'chat' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startChat}
          className="fixed right-6 bottom-24 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl flex flex-col items-center justify-center text-white border-2 border-white/20 backdrop-blur-sm"
        >
          <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-bold mt-0.5">在线估值</span>
        </motion.button>
      )}

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showDeleteAccountModal && (
          <div key="delete-account-modal" className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              key="delete-account-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteAccountModal(false)}
            />
            <motion.div 
              key="delete-account-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              {deleteAccountStep === 1 && (
                <>
                  <div className="flex flex-col gap-2 text-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-2">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">注销账号</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      注销账号是不可逆的操作，注销后您的所有数据将被永久删除。
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button 
                      onClick={() => setDeleteAccountStep(2)}
                      className="w-full h-12 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-100 active:scale-95 transition-transform"
                    >
                      下一步
                    </button>
                    <button 
                      onClick={() => setShowDeleteAccountModal(false)}
                      className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                    >
                      取消
                    </button>
                  </div>
                </>
              )}

              {deleteAccountStep === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-gray-900 text-center">注销须知</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">账号内的所有估值记录将被清空且无法找回。</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">账号绑定的手机号将自动解绑。</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">注销后，您将无法再使用此账号登录本平台。</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button 
                      onClick={() => setDeleteAccountStep(3)}
                      className="w-full h-12 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-100 active:scale-95 transition-transform"
                    >
                      我已了解，继续注销
                    </button>
                    <button 
                      onClick={() => setDeleteAccountStep(1)}
                      className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                    >
                      返回
                    </button>
                  </div>
                </>
              )}

              {deleteAccountStep === 3 && (
                <>
                  <div className="flex flex-col gap-2 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-2">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">安全验证</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      为了您的账号安全，请完成手机验证
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="请输入验证码"
                        value={deleteAccountCode}
                        onChange={(e) => setDeleteAccountCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:border-red-200 transition-colors"
                      />
                      <button 
                        disabled={deleteAccountTimer > 0}
                        onClick={() => {
                          setDeleteAccountTimer(60);
                          setToast({ message: '验证码已发送', type: 'success' });
                          setTimeout(() => setToast(null), 2000);
                        }}
                        className={cn(
                          "absolute right-2 top-2 h-8 px-3 rounded-lg text-xs font-bold transition-colors",
                          deleteAccountTimer > 0 
                            ? "bg-gray-100 text-gray-400" 
                            : "bg-red-50 text-red-600 active:bg-red-100"
                        )}
                      >
                        {deleteAccountTimer > 0 ? `${deleteAccountTimer}s` : '获取验证码'}
                      </button>
                    </div>

                    <button 
                      disabled={deleteAccountCode.length < 4}
                      onClick={() => {
                        setShowDeleteAccountModal(false);
                        setIsLoggedIn(false);
                        setCurrentPage('home');
                        setToast({ message: '账号已注销', type: 'success' });
                        setDeleteAccountCode('');
                        setDeleteAccountTimer(0);
                        setTimeout(() => setToast(null), 2000);
                      }}
                      className={cn(
                        "w-full h-12 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95",
                        deleteAccountCode.length >= 4
                          ? "bg-red-600 text-white shadow-red-100"
                          : "bg-gray-100 text-gray-400 shadow-none"
                      )}
                    >
                      确认注销
                    </button>
                    <button 
                      onClick={() => setDeleteAccountStep(2)}
                      className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                    >
                      返回
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showForceUpdateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForceUpdateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-2">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">发现新版本</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  为了提供更好的服务，我们需要您更新到最新版本以继续使用。
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowForceUpdateModal(false);
                    setIsAppUpdated(false);
                    setUpdateProgress(0);
                    setToast({ message: '已重置更新状态', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  立即更新
                </button>
                <button 
                  onClick={() => setShowForceUpdateModal(false)}
                  className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showInstallPermission && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInstallPermission(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-2">
                  <Settings size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">安装权限</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  为了完成版本更新，我们需要获取您的系统安装权限以安装新版本。
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowInstallPermission(false);
                    setIsAppUpdated(true);
                    setIsDownloadingUpdate(false);
                    setToast({ message: '版本更新成功', type: 'success' });
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  确认安装
                </button>
                <button 
                  onClick={() => setShowInstallPermission(false)}
                  className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-lg font-bold text-gray-900">确认退出？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">是否退出当前账号？</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    setIsLoggedIn(false);
                    setCurrentPage('home');
                  }}
                  className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-100"
                >
                  确认退出
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-lg font-bold text-gray-900">确认退出？</h3>
                <p className="text-sm text-gray-500 leading-relaxed">当前已填写的数据退出后将要被清空，是否确认退出？</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowExitConfirm(false);
                    resetValuationData();
                    setCurrentPage('valuation');
                  }}
                  className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-100"
                >
                  确认退出
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showRealNameTutorial && (
          <div key="realname-tutorial-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              key="realname-tutorial-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRealNameTutorial(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              key="realname-tutorial-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">实名情况查询指引</h3>
                  <button 
                    onClick={() => setShowRealNameTutorial(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-800">第一步</span>
                        <p className="text-xs text-gray-500 leading-relaxed">微信搜索“腾讯健康系统”，进入腾讯官方公众号</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-800">第二步</span>
                        <p className="text-xs text-gray-500 leading-relaxed">登录您上架的游戏账号，若您上架账号为 QQ 区，点击右上角“切换 QQ 查询”进行账号切换</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-800">第三步</span>
                        <p className="text-xs text-gray-500 leading-relaxed">点击“实名认证查询”进入跳转页面</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-800">第四步</span>
                        <p className="text-xs text-gray-500 leading-relaxed">跳转页面下方，若存在蓝色“点击此处”的选项，则说明有可申请二次实名；若未显示蓝色字体选项，或显示“申诉”那么为不可二次实名</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowRealNameTutorial(false)}
                  className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 mt-2"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAgreementConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgreementConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-lg font-bold text-gray-900">温馨提示</h3>
                <p className="text-sm text-gray-500 leading-relaxed">登录前请先阅读并同意《用户服务协议》和《隐私政策》</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setShowAgreementConfirm(false)}
                  className="flex-1 h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowAgreementConfirm(false);
                    setAgreed(true);
                    setIsLoggedIn(true);
                    setCurrentPage('home');
                  }}
                  className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
                >
                  同意并登录
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bargain Sheet */}
        <AnimatePresence>
          {showBargainSheet && (
            <div className="fixed inset-0 z-[200]">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowBargainSheet(false)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <h3 className="text-center text-lg font-bold text-gray-900 mb-6">发起砍价</h3>
                
                <div className="flex flex-col gap-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">我的出价</div>
                    <div className="text-4xl font-black text-red-500">
                      <span className="text-2xl mr-1">¥</span>
                      {Math.floor(MOCK_ACCOUNTS.find(a => a.id === selectedAccountId)?.price! * (bargainDiscount / 100))}
                    </div>
                  </div>

                  <div className="px-4 relative">
                    <input 
                      type="range" 
                      min="60" 
                      max="100" 
                      step="10" 
                      value={bargainDiscount}
                      onChange={(e) => setBargainDiscount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500 relative z-10"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
                      <span>6折</span>
                      <span>7折</span>
                      <span>8折</span>
                      <span>9折</span>
                      <span>原价</span>
                    </div>
                    
                    {/* Tooltips */}
                    <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-1">
                      {bargainDiscount === 60 && <><span className="text-red-500 font-bold text-sm">【屠龙刀慎用，卖家大概率直接拒绝】</span><span className="text-xs text-gray-500">成交率极低 ↓</span></>}
                      {bargainDiscount === 70 && <><span className="text-orange-500 font-bold text-sm">【卖家可能需要考虑】</span><span className="text-xs text-gray-500">成交率较低</span></>}
                      {bargainDiscount === 80 && <><span className="text-blue-500 font-bold text-sm">【比较合理的出价】</span><span className="text-xs text-gray-500">成交率适中</span></>}
                      {bargainDiscount === 90 && <><span className="text-green-500 font-bold text-sm">【非常有诚意的出价】</span><span className="text-xs text-gray-500">成交率较高 ↑</span></>}
                      {bargainDiscount === 100 && <><span className="text-gray-900 font-bold text-sm">【原价购买】</span><span className="text-xs text-gray-500">成交率100%</span></>}
                    </div>
                  </div>

                  <button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-500/30 text-lg"
                    onClick={handleBargain}
                  >
                    确认发起
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Share Sheet */}
        <AnimatePresence>
          {showShareSheet && (
            <div className="fixed inset-0 z-[200]">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowShareSheet(false)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <h3 className="text-center text-sm font-bold text-gray-900 mb-8">分享到</h3>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { icon: <MessageCircle size={28} className="text-[#07C160]" />, label: '微信', onClick: () => setShowShareSheet(false) },
                    { icon: <Send size={28} className="text-[#12B7F5]" />, label: 'QQ', onClick: () => setShowShareSheet(false) },
                    { icon: <LinkIcon size={28} className="text-gray-600" />, label: '复制链接', onClick: () => {
                      setShowShareSheet(false);
                      setToast({ message: '链接复制成功', type: 'success' });
                      setTimeout(() => setToast(null), 2000);
                    }},
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={item.onClick}
                      className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        {item.icon}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {toast && (
          <div className="fixed top-20 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "px-6 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-2",
                toast.type === 'error' ? "bg-red-500 text-white" : "bg-green-500 text-white"
              )}
            >
              {toast.type === 'error' ? <X size={16} /> : <CheckCircle2 size={16} />}
              {toast.message}
            </motion.div>
          </div>
        )}

        {showPermissionModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPermissionModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-2">
                  <Image size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">权限申请</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  为了将图片保存到您的相册，我们需要获取您的相册访问权限。
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowPermissionModal(false);
                    if (permissionCallback) {
                      permissionCallback();
                    }
                  }}
                  className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                >
                  允许访问
                </button>
                <button 
                  onClick={() => setShowPermissionModal(false)}
                  className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                >
                  拒绝
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showCampIdErrorModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-lg font-bold text-gray-900">授权失败</h3>
                <p className="text-sm text-gray-500 leading-relaxed">营地 ID 不存在，请修改后重试</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowCampIdErrorModal(false);
                    setInputValue('');
                    setCampIdStatus('idle');
                  }}
                  className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
                >
                  重新获取
                </button>
                <button 
                  onClick={() => {
                    setShowCampIdErrorModal(false);
                    setCurrentPage('valuation');
                    setInputValue('');
                    setCampIdStatus('idle');
                  }}
                  className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm"
                >
                  退出估值
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Game Feedback Modal */}
        {showGameFeedbackModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowGameFeedbackModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-lg font-bold text-gray-900">游戏添加反馈</h3>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="输入您想要添加的游戏"
                  value={gameFeedbackInput}
                  onChange={(e) => setGameFeedbackInput(e.target.value.slice(0, 15))}
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-200 transition-colors placeholder:text-gray-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  {gameFeedbackInput.length}/15
                </span>
              </div>
              <button 
                onClick={() => {
                  setShowGameFeedbackModal(false);
                  setGameFeedbackInput('');
                  setToast({ message: '反馈成功', type: 'success' });
                  setTimeout(() => setToast(null), 2000);
                }}
                className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-transform"
              >
                提交反馈
              </button>
            </motion.div>
          </div>
        )}

        {/* Valuation Method Bottom Sheet */}
        <AnimatePresence>
          {showMethodSheet && (
            <div key="method-sheet-modal" className="fixed inset-0 z-[200]">
              <motion.div 
                key="method-sheet-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowMethodSheet(false)}
              />
              <motion.div 
                key="method-sheet-content"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <h3 className="text-center text-xl font-black text-gray-900 mb-8">选择估值方式</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { id: '授权估值', icon: <ShieldCheck />, desc: selectedGame === '三角洲行动' ? '敬请期待' : '快速授权游戏账号，一键估值', color: 'blue', disabled: selectedGame === '三角洲行动' },
                    { id: '链接估值', icon: <LinkIcon />, desc: '复制估值商品链接，快速估值', color: 'purple' },
                    { id: '综合估值', icon: <ClipboardList />, desc: '填写/上传详细信息，精确估值', color: 'orange' },
                    { id: '截图估值', icon: <Image />, desc: '上传游戏内资产截图，AI智能估值', color: 'green' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      disabled={method.disabled}
                      onClick={() => {
                        setSelectedMethod(method.id as ValuationMethod);
                        setShowMethodSheet(false);
                        setCurrentPage('form');
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl active:scale-[0.98] transition-all text-left w-full",
                        method.disabled && "opacity-50 grayscale cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        method.color === 'blue' ? "bg-blue-50 text-blue-600" : 
                        method.color === 'purple' ? "bg-purple-50 text-purple-600" : 
                        method.color === 'orange' ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      )}>
                        {method.icon}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-base font-bold text-gray-800">{method.id}</span>
                        <p className="text-[11px] text-gray-400">{method.desc}</p>
                      </div>
                      <ChevronRight className="text-gray-300" size={18} />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* Bottom Navigation */}
      {(currentPage === 'home' || currentPage === 'mine' || currentPage === 'valuation') && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
          <button 
            onClick={() => setCurrentPage('home')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors flex-1",
              currentPage === 'home' ? "text-blue-600" : "text-gray-400"
            )}
          >
            <Gamepad2 size={22} />
            <span className="text-[10px] font-bold">首页</span>
          </button>
          <button 
            onClick={goToValuation}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors flex-1",
              currentPage === 'valuation' ? "text-blue-600" : "text-gray-400"
            )}
          >
            <Zap size={22} />
            <span className="text-[10px] font-bold">估值</span>
          </button>
          <button 
            onClick={() => setCurrentPage('mine')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors flex-1",
              currentPage === 'mine' ? "text-blue-600" : "text-gray-400"
            )}
          >
            <Users size={22} />
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </nav>
      )}

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <div key="image-zoom-modal" className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              key="image-zoom-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setZoomedImage(null)}
            />
            <motion.div 
              key="image-zoom-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src={zoomedImage} 
                className="w-full h-full object-contain bg-gray-100" 
                referrerPolicy="no-referrer" 
              />
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
