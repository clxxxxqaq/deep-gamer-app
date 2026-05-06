import { GameType, MarketData, ValuationRecord, AccountItem } from './types';

export const SCREENSHOT_CONFIGS: Record<string, { key: string; type: 'image' | 'multi-image' | 'select'; label: string; sample: string; tip: string; options?: string[] }[]> = {
  '王者荣耀': [
    { key: 'nobleLevel', type: 'select', label: '贵族等级', sample: '', tip: '', options: ['无双贵族', '荣耀贵族', 'V10', 'V9', 'V8', 'V7', 'V6', 'V5', 'V4', 'V3', 'V2', 'V1', 'V0'] },
    { key: 'wanxiang', type: 'image', label: '上传万象图鉴', sample: 'https://picsum.photos/seed/wx/400/225', tip: '示例：包含万象图鉴等级的截图' },
    { key: 'skin', type: 'image', label: '上传皮肤图鉴', sample: 'https://picsum.photos/seed/skin/400/225', tip: '示例：包含皮肤数量和品质的截图' },
  ],
  '三角洲行动': [
    { key: 'profile', type: 'image', label: '上传个人主页', sample: 'https://picsum.photos/seed/delta_profile/400/225', tip: '示例：主页展示军衔和成就' },
    { key: 'office', type: 'image', label: '上传特勤处截图', sample: 'https://picsum.photos/seed/delta_office/400/225', tip: '示例：展示特勤处建设和资源' },
    { key: 'knife', type: 'image', label: '上传刀皮', sample: 'https://picsum.photos/seed/delta_knife/400/225', tip: '示例：展示拥有的近战武器' },
    { key: 'hero', type: 'multi-image', label: '上传英雄皮（可多图）', sample: 'https://picsum.photos/seed/delta_hero/400/225', tip: '示例：展示拥有的英雄/干员皮肤' },
    { key: 'gun', type: 'multi-image', label: '上传枪皮（可多图）', sample: 'https://picsum.photos/seed/delta_gun/400/225', tip: '示例：展示拥有的各类枪械皮肤' },
  ],
  '和平精英': [
    { key: 'profile', type: 'image', label: '个人主页', sample: 'https://picsum.photos/seed/peace1/400/225', tip: '示例：个人主页信息' },
    { key: 'skin-multi', type: 'multi-image', label: '资产截图', sample: 'https://picsum.photos/seed/peace2/400/225', tip: '示例：套装/枪皮/载具仓库' },
  ]
};

export const MOCK_RECORDS: ValuationRecord[] = [
  { id: '1', game: '王者荣耀', price: 2850, time: '2分钟前', user: '用户*7a' },
  { id: '2', game: '和平精英', price: 1200, time: '5分钟前', user: '用户*3b' },
  { id: '3', game: '三角洲行动', price: 450, time: '10分钟前', user: '用户*9c' },
  { id: '4', game: '王者荣耀', price: 8900, time: '15分钟前', user: '用户*1d' },
];

export const MOCK_MARKET_DATA: Record<GameType, MarketData[]> = {
  '王者荣耀': [
    { date: '03-26', price: 2100 },
    { date: '03-27', price: 2150 },
    { date: '03-28', price: 2080 },
    { date: '03-29', price: 2200 },
    { date: '03-30', price: 2300 },
    { date: '03-31', price: 2250 },
    { date: '04-01', price: 2400 },
  ],
  '和平精英': [
    { date: '03-26', price: 1500 },
    { date: '03-27', price: 1450 },
    { date: '03-28', price: 1550 },
    { date: '03-29', price: 1600 },
    { date: '03-30', price: 1580 },
    { date: '03-31', price: 1650 },
    { date: '04-01', price: 1700 },
  ],
  '三角洲行动': [
    { date: '03-26', price: 300 },
    { date: '03-27', price: 320 },
    { date: '03-28', price: 310 },
    { date: '03-29', price: 350 },
    { date: '03-30', price: 380 },
    { date: '03-31', price: 400 },
    { date: '04-01', price: 420 },
  ],
  '英雄联盟': [{ date: '03-26', price: 1000 }],
  '无畏契约': [{ date: '03-26', price: 1000 }],
  'steam': [{ date: '03-26', price: 1000 }]
};

export const HOT_TAGS: Record<GameType, string[]> = {
  '王者荣耀': ['无双皮肤', '荣耀水晶', '限定返场', '全英雄'],
  '和平精英': ['粉色玛莎', '火箭少女', '巧克力', '至尊金龙'],
  '三角洲行动': ['曼德尔', '红卡', '全改枪', '高价值物资'],
  '英雄联盟': ['龙虾', '至臻'],
  '无畏契约': ['冠军套装', '混沌'],
  'steam': ['绝版', '多游戏']
};

export const MOCK_ACCOUNTS: AccountItem[] = [
  {
    id: 'WDEJB4224',
    game: '王者荣耀',
    title: '【WDEJB4224】无双4 典藏2 传说36 史诗118 限定137 小兵1 英雄127 皮肤380 稀有英雄9 贵族10级 总场次6931 皮肤价值:312254...',
    price: 2500,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    tags: ['安卓qq', 'V10'],
    attributes: {
      '区服': '安卓qq',
      '贵族等级': 'V10',
      '皮肤数量': '380',
      '英雄数量': '127',
      '实名情况': '可二次实名',
    }
  },
  {
    id: 'WDEJB4225',
    game: '王者荣耀',
    title: '【绝版小乔】V9号满英雄, 10典藏, 大量绝版限定退游出售，急缺钱',
    price: 3600,
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800',
    tags: ['安卓微信', 'V9'],
    attributes: {
      '区服': '安卓微信',
      '贵族等级': 'V9',
      '皮肤数量': '260',
      '英雄数量': '127',
      '实名情况': '不可二次实名',
    }
  }
];
