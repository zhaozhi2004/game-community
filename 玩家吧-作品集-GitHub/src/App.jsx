import React, { useState, useEffect, useRef } from 'react'
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom'

// ============ 数据层 ============
const MOCK_POSTS = [
  {
    id: 'p1', category: '王者荣耀',
    title: 'S34赛季最强打野英雄推荐，上分必备！',
    content: '新赛季打野格局大变，镜和澜依然强势，但推荐大家试试赵云和云中君，容错率高，适合大部分玩家。特别是赵云，加强后伤害和坦度都很可观。',
    author: '峡谷老司机',
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    likes: 12,
    images: [],
    comments: [
      { id: 'c1', author: '新手小白', content: '赵云真的好用吗？我总是切不到后排', time: new Date(Date.now() - 3 * 60 * 1000).toISOString(), likes: 2 },
      { id: 'c2', author: '王者大神', content: '回复 @新手小白：赵云主打控制和收割，不要硬切满血后排', time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), likes: 5, replyTo: '新手小白' }
    ]
  },
  {
    id: 'p2', category: '原神',
    title: '纳塔版本新角色评测，值不值得抽？',
    content: '纳塔的新角色玛拉妮和基尼奇强度都很在线，特别是玛拉妮的蒸发伤害爆炸。但作为后台副C，基尼奇更适合平民玩家。建议优先抽基尼奇，玛拉妮可以等复刻。',
    author: '提瓦特旅行者',
    time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    likes: 8,
    images: [],
    comments: [
      { id: 'c3', author: '原神玩家', content: '基尼奇真的比玛拉妮强吗？', time: new Date(Date.now() - 20 * 60 * 1000).toISOString(), likes: 1 }
    ]
  },
  {
    id: 'p3', category: '英雄联盟',
    title: '世界赛观赛感想：T1这次真的太强了',
    content: 'Faker的状态简直回春，各种神仙操作。Zeus的兰博和永恩也是T1的秘密武器。这次世界赛含金量很高，LPL队伍也打出了风采，期待明年！',
    author: '电竞老粉',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 25,
    images: [],
    comments: []
  },
  {
    id: 'p4', category: '永劫无间',
    title: '新武器双刀连招教学，从入门到精通',
    content: '双刀的核心是利用攻击后的位移取消硬直，配合蓝光打出高额伤害。推荐连招：平A→闪避→平A→蓝光→升龙。新手建议先在练习场熟悉节奏。',
    author: '聚窟洲老手',
    time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    likes: 6,
    images: [],
    comments: [
      { id: 'c4', author: '永劫萌新', content: '蓝光是什么？求科普', time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), likes: 0 },
      { id: 'c5', author: '聚窟洲老手', content: '回复 @永劫萌新：蓝光就是蓄力攻击，长按攻击键蓄满释放', time: new Date(Date.now() - 25 * 60 * 1000).toISOString(), likes: 3, replyTo: '永劫萌新' }
    ]
  },
  {
    id: 'p5', category: '我的世界',
    title: '红石自动农场教程，一键收获小麦',
    content: '分享一个简易的红石自动农场设计，只需要观察者、活塞和漏斗。核心原理是观察者检测作物成熟，触发活塞推动，作物掉入漏斗收集。材料简单，适合新手。',
    author: '方块建筑师',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 15,
    images: [],
    comments: [
      { id: 'c6', author: 'MC玩家', content: '这个设计太实用了，已收藏！', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), likes: 2 }
    ]
  },
  {
    id: 'p6', category: '王者荣耀',
    title: '中路法师位当前版本节奏分析',
    content: '中路法师的支援节奏比之前版本更重要了，前期帮打野看视野，中期游走边路。推荐当前版本强势法师：安琪拉、貂蝉、不知火舞，各有各的优势。',
    author: '中路法王',
    time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 9,
    images: [],
    comments: []
  }
]

// 默认话题分类
const DEFAULT_CATEGORIES = ['王者荣耀', '原神', '英雄联盟', '永劫无间', '我的世界']

// 默认管理员账户
const DEFAULT_ADMIN = { username: 'admin', password: 'admin123', isAdmin: true, avatar: '' }
const DEFAULT_USERS = [
  { username: 'test1', password: 'test123', isAdmin: false, avatar: '' },
  { username: 'test2', password: 'test123', isAdmin: false, avatar: '' }
]

const initData = () => {
  if (!localStorage.getItem('wanjiaba_posts')) {
    localStorage.setItem('wanjiaba_posts', JSON.stringify(MOCK_POSTS))
  }
  if (!localStorage.getItem('wanjiaba_users')) {
    localStorage.setItem('wanjiaba_users', JSON.stringify([DEFAULT_ADMIN, ...DEFAULT_USERS]))
  }
  if (!localStorage.getItem('wanjiaba_currentUser')) {
    localStorage.setItem('wanjiaba_currentUser', JSON.stringify(null))
  }
  if (!localStorage.getItem('wanjiaba_categories')) {
    localStorage.setItem('wanjiaba_categories', JSON.stringify(DEFAULT_CATEGORIES))
  }
}

const getPosts = () => JSON.parse(localStorage.getItem('wanjiaba_posts') || '[]')
const savePosts = (posts) => localStorage.setItem('wanjiaba_posts', JSON.stringify(posts))
const getUsers = () => JSON.parse(localStorage.getItem('wanjiaba_users') || '[]')
const saveUsers = (users) => localStorage.setItem('wanjiaba_users', JSON.stringify(users))
const getCurrentUser = () => JSON.parse(localStorage.getItem('wanjiaba_currentUser') || 'null')
const saveCurrentUser = (user) => localStorage.setItem('wanjiaba_currentUser', JSON.stringify(user))
const getCategories = () => JSON.parse(localStorage.getItem('wanjiaba_categories') || '[]')
const saveCategories = (cats) => localStorage.setItem('wanjiaba_categories', JSON.stringify(cats))

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m}分钟前`
  if (h < 24) return `${h}小时前`
  if (d < 7) return `${d}天前`
  return new Date(iso).toLocaleDateString('zh-CN')
}

const generateId = () => 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

// 获取头像：优先用户自定义头像，否则用 DiceBear
const getAvatar = (name) => {
  const users = getUsers()
  const user = users.find(u => u.username === name)
  if (user && user.avatar) return user.avatar
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f8cff&textColor=ffffff`
}

// ============ 头部组件 ============
function Header({ search, setSearch, currentUser, setCurrentUser, setIsLoginPage }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownTimeoutRef = useRef(null)
  
  const handleLogout = () => {
    saveCurrentUser(null)
    setCurrentUser(null)
    setShowDropdown(false)
    navigate('/')
  }

  const goToAdmin = () => {
    navigate('/admin')
    setShowDropdown(false)
  }

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setShowDropdown(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 300) // 300ms 延迟，给用户足够时间移动到菜单
  }

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate('/'); setSearch(''); }}>
          <div className="w-8 h-8 bg-[#2a7ae2] rounded-lg flex items-center justify-center text-white font-bold text-lg">吧</div>
          <span className="text-xl font-bold text-gray-800">玩家吧</span>
        </div>
        <div className="flex-1 max-w-md mx-8">
          <input type="text" placeholder="搜索帖子标题..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 px-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
        </div>
        <div className="relative">
          {currentUser ? (
            <div 
              className="flex items-center gap-2 cursor-pointer select-none py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={getAvatar(currentUser.username)} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => e.target.style.display='none'} />
              <span className="text-sm text-gray-600 hidden sm:inline">{currentUser.username}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              
              {/* 下拉菜单 - 添加了延迟关闭逻辑 */}
              <div 
                className="absolute right-0 top-full mt-0 w-44 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                style={{ display: showDropdown ? 'block' : 'none' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  <div className="font-medium text-gray-700">{currentUser.username}</div>
                  {currentUser.isAdmin && <div className="text-xs text-[#2a7ae2]">管理员</div>}
                </div>
                {currentUser.isAdmin && (
                  <button 
                    onClick={goToAdmin}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    管理后台
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsLoginPage(true)} className="px-4 py-1.5 text-sm bg-[#2a7ae2] text-white rounded-full hover:bg-[#1a5bb8]">登录</button>
          )}
        </div>
      </div>
    </header>
  )
}

// ============ 分类标签栏 ============
function CategoryTabs({ active, setActive, onAddCategory }) {
  const categories = ['全部', ...getCategories()]
  const [showAddInput, setShowAddInput] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !getCategories().includes(newCategory.trim())) {
      const newCats = [...getCategories(), newCategory.trim()]
      saveCategories(newCats)
      setActive(newCategory.trim())
      setNewCategory('')
      setShowAddInput(false)
      if (onAddCategory) onAddCategory()
    }
  }
  
  return (
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar py-3 items-center">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap rounded-full transition ${active === cat ? 'bg-[#2a7ae2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
          <button 
            onClick={() => setShowAddInput(!showAddInput)}
            className="px-3 py-1.5 text-sm whitespace-nowrap rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新话题
          </button>
        </div>
        {showAddInput && (
          <div className="pb-3 flex gap-2">
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="输入新话题名称..."
              maxLength={20}
              className="flex-1 h-9 px-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2a7ae2]"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button 
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="px-4 py-1.5 bg-[#2a7ae2] text-white text-sm rounded-lg hover:bg-[#1a5bb8] disabled:opacity-50"
            >
              创建
            </button>
            <button 
              onClick={() => { setShowAddInput(false); setNewCategory('') }}
              className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 帖子卡片 ============
function PostCard({ post, onLike, currentUser }) {
  const navigate = useNavigate()
  const isLiked = currentUser?.likedPosts?.includes(post.id)
  return (
    <div className="post-card bg-white rounded-lg p-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="flex gap-3">
        <img src={getAvatar(post.author)} alt="" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" onError={(e) => e.target.style.display='none'} />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{post.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className="flex gap-2 mb-2">
              {post.images.slice(0, 3).map((img, idx) => (
                <img key={idx} src={img} alt="" className="h-16 w-16 object-cover rounded" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{post.author}</span>
            <span className="px-2 py-0.5 bg-[#2a7ae2]/10 text-[#2a7ae2] rounded">{post.category}</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {post.comments?.length || 0}
            </span>
            <button className={`like-btn flex items-center gap-1 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}>
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {post.likes}
            </button>
            <span>{formatTime(post.time)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 登录/注册页面 ============
function LoginPage({ setIsLoginPage, setCurrentUser }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [error, setError] = useState('')

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    setError('')
    const users = getUsers()
    
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空')
      return
    }

    if (isLogin) {
      // 登录逻辑
      const user = users.find(u => u.username === username && u.password === password)
      if (user) {
        const userLikedPosts = JSON.parse(localStorage.getItem(`wanjiaba_${username}_likedPosts`) || '[]')
        const userLikedComments = JSON.parse(localStorage.getItem(`wanjiaba_${username}_likedComments`) || '{}')
        const fullUser = { 
          ...user, 
          likedPosts: userLikedPosts, 
          likedComments: userLikedComments 
        }
        saveCurrentUser(fullUser)
        setCurrentUser(fullUser)
        setIsLoginPage(false)
        navigate('/')
      } else {
        setError('用户名或密码错误')
      }
    } else {
      // 注册逻辑
      if (password !== confirmPassword) {
        setError('两次密码输入不一致')
        return
      }
      if (users.find(u => u.username === username)) {
        setError('用户名已存在')
        return
      }
      const newUser = { username: username.trim(), password, isAdmin: false, avatar }
      const newUsers = [...users, newUser]
      saveUsers(newUsers)
      
      const fullUser = { ...newUser, likedPosts: [], likedComments: {} }
      saveCurrentUser(fullUser)
      setCurrentUser(fullUser)
      setIsLoginPage(false)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f5f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isLogin ? '登录' : '注册'}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">用户名</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
          </div>
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">确认密码</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">头像（可选）</label>
                <div className="flex items-center gap-4">
                  {avatar && <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover" />}
                  <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                    {avatar ? '更换头像' : '上传头像'}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </>
          )}
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <button onClick={handleSubmit}
            className="w-full h-10 bg-[#2a7ae2] text-white rounded-lg hover:bg-[#1a5bb8]">
            {isLogin ? '登录' : '注册'}
          </button>
          
          <div className="text-center text-sm text-gray-500">
            {isLogin ? '没有账号？' : '已有账号？'}
            <button onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-[#2a7ae2] hover:underline ml-1">
              {isLogin ? '去注册' : '去登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 发布新帖模态框 ============
function NewPostModal({ isOpen, onClose, onSubmit, currentUser }) {
  const categories = getCategories()
  const [category, setCategory] = useState(categories[0] || '王者荣耀')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(category)) {
      setCategory(categories[0])
    }
  }, [categories])
  
  if (!isOpen) return null
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = []
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result)
        if (newImages.length === files.length) {
          setImages([...images, ...newImages].slice(0, 9))
        }
      }
      reader.readAsDataURL(file)
    })
  }
  
  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx))
  }
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const newCats = [...categories, newCategory.trim()]
      saveCategories(newCats)
      setCategory(newCategory.trim())
      setNewCategory('')
      setShowNewCategory(false)
    }
  }
  
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    onSubmit({ 
      id: generateId(), 
      category, 
      title: title.trim(), 
      content: content.trim(), 
      author: currentUser.username, 
      time: new Date().toISOString(), 
      likes: 0, 
      images,
      comments: [] 
    })
    setTitle('')
    setContent('')
    setImages([])
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="modal-enter bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">发布新帖</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">选择话题</label>
            <div className="flex gap-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)} 
                className="flex-1 h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button 
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                +新话题
              </button>
            </div>
            {showNewCategory && (
              <div className="mt-2 flex gap-2">
                <input 
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="输入新话题名称"
                  maxLength={20}
                  className="flex-1 h-9 px-3 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2a7ae2]"
                />
                <button 
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  className="px-3 py-1.5 bg-[#2a7ae2] text-white text-sm rounded hover:bg-[#1a5bb8] disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">标题</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
              placeholder="请输入帖子标题..." maxLength={50}
              className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">正文</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} 
              placeholder="分享你的游戏心得..." rows={5}
              className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2a7ae2]/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">图片（最多9张）</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                  <button onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
                </div>
              ))}
              {images.length < 9 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-[#2a7ae2]">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}
            className="px-6 py-2 bg-[#2a7ae2] text-white rounded-lg hover:bg-[#1a5bb8] disabled:opacity-50">发布</button>
        </div>
      </div>
    </div>
  )
}

// ============ 帖子列表页 ============
function PostListPage({ active, setActive, search, posts, setPosts, currentUser }) {
  const [showModal, setShowModal] = useState(false)
  const [categoryVersion, setCategoryVersion] = useState(0)
  
  const filteredPosts = posts.filter(p => {
    const matchCategory = active === '全部' || p.category === active
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })
  
  const handleLikePost = (postId) => {
    if (!currentUser) return
    const newPosts = posts.map(p => p.id === postId ? { ...p, likes: currentUser.likedPosts?.includes(postId) ? p.likes - 1 : p.likes + 1 } : p)
    const newLikedPosts = currentUser.likedPosts?.includes(postId) 
      ? currentUser.likedPosts.filter(id => id !== postId) 
      : [...(currentUser.likedPosts || []), postId]
    savePosts(newPosts)
    saveCurrentUser({ ...currentUser, likedPosts: newLikedPosts })
    localStorage.setItem(`wanjiaba_${currentUser.username}_likedPosts`, JSON.stringify(newLikedPosts))
    setPosts(newPosts)
  }
  
  const handleNewPost = (newPost) => {
    const newPosts = [newPost, ...posts]
    savePosts(newPosts)
    setPosts(newPosts)
    setActive(newPost.category)
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{active === '全部' ? '全部帖子' : `${active}吧`}</h2>
        {currentUser && (
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#2a7ae2] text-white text-sm rounded-full hover:bg-[#1a5bb8]">发布新帖</button>
        )}
      </div>
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">没有找到相关帖子，快去发布第一个吧！</div>
        ) : filteredPosts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLikePost} currentUser={currentUser} />
        ))}
      </div>
      <NewPostModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleNewPost} currentUser={currentUser} />
    </div>
  )
}

// ============ 帖子详情页 ============
function PostDetailPage({ posts, setPosts, currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [mainComment, setMainComment] = useState('')
  
  const post = posts.find(p => p.id === id)
  if (!post) return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-gray-400">帖子不存在</div>
  
  const isLiked = currentUser?.likedPosts?.includes(post.id)
  const isOwner = currentUser && currentUser.username === post.author
  const isAdmin = currentUser?.isAdmin
  
  const handleLikePost = () => {
    if (!currentUser) return
    const newPosts = posts.map(p => p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p)
    const newLikedPosts = isLiked 
      ? currentUser.likedPosts.filter(pid => pid !== id) 
      : [...(currentUser.likedPosts || []), id]
    savePosts(newPosts)
    saveCurrentUser({ ...currentUser, likedPosts: newLikedPosts })
    localStorage.setItem(`wanjiaba_${currentUser.username}_likedPosts`, JSON.stringify(newLikedPosts))
    setPosts(newPosts)
  }
  
  const handleLikeComment = (commentId) => {
    if (!currentUser) return
    const key = `${post.id}_${commentId}`
    const isCommentLiked = currentUser.likedComments?.[key]
    const newPosts = posts.map(p => p.id === id ? {
      ...p,
      comments: p.comments.map(c => c.id === commentId ? { ...c, likes: isCommentLiked ? c.likes - 1 : c.likes + 1 } : c)
    } : p)
    const newLikedComments = { ...currentUser.likedComments }
    if (isCommentLiked) delete newLikedComments[key]
    else newLikedComments[key] = true
    savePosts(newPosts)
    saveCurrentUser({ ...currentUser, likedComments: newLikedComments })
    localStorage.setItem(`wanjiaba_${currentUser.username}_likedComments`, JSON.stringify(newLikedComments))
    setPosts(newPosts)
  }
  
  const handleSubmitComment = (content, replyToUser = null) => {
    if (!currentUser || !content.trim()) return
    const newComment = {
      id: generateId(),
      author: currentUser.username,
      content: content.trim(),
      time: new Date().toISOString(),
      likes: 0,
      ...(replyToUser && { replyTo: replyToUser })
    }
    const newPosts = posts.map(p => p.id === id ? { ...p, comments: [...p.comments, newComment] } : p)
    savePosts(newPosts)
    setPosts(newPosts)
    setReplyContent('')
    setMainComment('')
    setReplyTo(null)
  }
  
  const handleDeleteComment = (commentId) => {
    if (!currentUser) return
    const newPosts = posts.map(p => p.id === id ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p)
    savePosts(newPosts)
    setPosts(newPosts)
  }
  
  const handleDeletePost = () => {
    if (!currentUser) return
    const newPosts = posts.filter(p => p.id !== id)
    savePosts(newPosts)
    setPosts(newPosts)
    navigate('/')
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span className="cursor-pointer hover:text-[#2a7ae2]" onClick={() => navigate('/')}>玩家吧</span>
        <span>›</span>
        <span className="cursor-pointer hover:text-[#2a7ae2]" onClick={() => navigate('/')}>{post.category}</span>
        <span>›</span>
        <span className="text-gray-800 truncate">{post.title}</span>
      </div>
      
      <div className="bg-white rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
          {(isOwner || isAdmin) && (
            <button onClick={handleDeletePost} className="text-red-500 text-sm hover:underline">删除帖子</button>
          )}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <img src={getAvatar(post.author)} alt="" className="w-10 h-10 rounded-full object-cover" onError={(e) => e.target.style.display='none'} />
          <div>
            <div className="font-medium text-gray-800">{post.author}
              {isOwner && <span className="ml-2 text-xs text-[#2a7ae2] bg-[#2a7ae2]/10 px-2 py-0.5 rounded">房主</span>}
            </div>
            <div className="text-sm text-gray-400">{formatTime(post.time)}</div>
          </div>
          <span className="ml-auto px-3 py-1 bg-[#2a7ae2]/10 text-[#2a7ae2] text-sm rounded">{post.category}</span>
        </div>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</div>
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt="" className="w-full rounded cursor-pointer hover:opacity-80" 
                onClick={() => window.open(img, '_blank')} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button onClick={handleLikePost}
            className={`like-btn flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likes}</span>
          </button>
          <span className="text-gray-400 text-sm">{post.comments.length} 条评论</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-5 mt-4">
        <h3 className="font-bold text-gray-800 mb-4">热门回复（{post.comments.length}）</h3>
        {post.comments.length === 0 ? (
          <div className="text-center text-gray-400 py-8">暂无评论，快来抢沙发吧~</div>
        ) : (
          <div className="space-y-4">
            {post.comments.map(comment => {
              const key = `${post.id}_${comment.id}`
              const isCommentLiked = currentUser?.likedComments?.[key]
              const canDelete = currentUser && (currentUser.username === post.author || currentUser.isAdmin || currentUser.username === comment.author)
              
              return (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex gap-3">
                    <img src={getAvatar(comment.author)} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => e.target.style.display='none'} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800 text-sm">{comment.author}</span>
                        {comment.replyTo && <span className="text-xs text-gray-400">回复 <span className="text-[#2a7ae2]">@{comment.replyTo}</span></span>}
                        <span className="text-xs text-gray-400">{formatTime(comment.time)}</span>
                        {canDelete && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-red-500 hover:underline">删除</button>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <button onClick={() => handleLikeComment(comment.id)}
                          className={`like-btn flex items-center gap-1 ${isCommentLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                          <svg className="w-4 h-4" fill={isCommentLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {comment.likes}
                        </button>
                        {currentUser && (
                          <button onClick={() => setReplyTo(replyTo === comment.author ? null : comment.author)} className="hover:text-[#2a7ae2]">回复</button>
                        )}
                      </div>
                      {replyTo === comment.author && currentUser && (
                        <div className="mt-3 flex gap-2">
                          <input type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`回复 @${comment.author}...`}
                            className="flex-1 h-8 px-3 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2a7ae2]" />
                          <button onClick={() => { handleSubmitComment(replyContent, comment.author); setReplyTo(null); }}
                            disabled={!replyContent.trim()}
                            className="px-4 py-1 bg-[#2a7ae2] text-white text-sm rounded hover:bg-[#1a5bb8] disabled:opacity-50">发送</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {currentUser && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex gap-3">
              <img src={getAvatar(currentUser.username)} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => e.target.style.display='none'} />
              <div className="flex-1 flex gap-2">
                <input type="text" value={mainComment} onChange={(e) => setMainComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="flex-1 h-9 px-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2a7ae2]" />
                <button onClick={() => handleSubmitComment(mainComment)} disabled={!mainComment.trim()}
                  className="px-4 py-1.5 bg-[#2a7ae2] text-white text-sm rounded-lg hover:bg-[#1a5bb8] disabled:opacity-50">发表评论</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 管理员后台 ============
function AdminPage({ currentUser }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  
  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/')
      return
    }
    setUsers(getUsers())
    setPosts(getPosts())
  }, [currentUser, navigate])
  
  const handleDeleteUser = (username) => {
    if (username === 'admin') return
    const newUsers = users.filter(u => u.username !== username)
    saveUsers(newUsers)
    setUsers(newUsers)
  }
  
  const handleDeletePost = (postId) => {
    const newPosts = posts.filter(p => p.id !== postId)
    savePosts(newPosts)
    setPosts(newPosts)
  }
  
  const handleDeleteComment = (postId, commentId) => {
    const newPosts = posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p)
    savePosts(newPosts)
    setPosts(newPosts)
  }
  
  if (!currentUser?.isAdmin) return null
  
  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[#2a7ae2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-800">管理后台</span>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-800 text-sm">返回首页</button>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-[#2a7ae2] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            用户管理
          </button>
          <button onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'posts' ? 'bg-[#2a7ae2] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            帖子管理
          </button>
        </div>
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">用户列表（{users.length}）</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">密码</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">头像</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(user => (
                    <tr key={user.username}>
                      <td className="px-4 py-3 text-sm text-gray-800">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{user.password}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${user.isAdmin ? 'bg-[#2a7ae2]/10 text-[#2a7ae2]' : 'bg-gray-100 text-gray-600'}`}>
                          {user.isAdmin ? '管理员' : '普通用户'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">默认头像</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {user.username !== 'admin' && (
                          <button onClick={() => handleDeleteUser(user.username)}
                            className="text-red-500 text-sm hover:underline">删除</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">帖子列表（{posts.length}）</h2>
            </div>
            <div className="divide-y">
              {posts.map(post => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#2a7ae2] bg-[#2a7ae2]/10 px-2 py-0.5 rounded">{post.category}</span>
                        <span className="text-sm font-medium text-gray-800">{post.title}</span>
                      </div>
                      <p className="text-xs text-gray-500">作者: {post.author} | {formatTime(post.time)} | {post.likes}赞 | {post.comments.length}评论</p>
                      {post.comments.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200">
                          {post.comments.map(c => (
                            <div key={c.id} className="text-xs py-1 flex items-start gap-2">
                              <span className="text-gray-600"><b>{c.author}</b>: {c.content}</span>
                              <button onClick={() => handleDeleteComment(post.id, c.id)}
                                className="text-red-500 hover:underline">删除</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 text-sm hover:underline ml-4">删除帖子</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 主应用 ============
function App() {
  const [posts, setPosts] = useState([])
  const [active, setActive] = useState('全部')
  const [search, setSearch] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoginPage, setIsLoginPage] = useState(false)
  const [categoryVersion, setCategoryVersion] = useState(0)
  const location = useLocation()
  
  useEffect(() => {
    initData()
    setPosts(getPosts())
    setCurrentUser(getCurrentUser())
  }, [])
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  
  if (isLoginPage) {
    return <LoginPage setIsLoginPage={setIsLoginPage} setCurrentUser={setCurrentUser} />
  }
  
  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <Header search={search} setSearch={setSearch} currentUser={currentUser} setCurrentUser={setCurrentUser} setIsLoginPage={setIsLoginPage} />
      <CategoryTabs active={active} setActive={setActive} onAddCategory={() => setCategoryVersion(v => v + 1)} />
      <Routes>
        <Route path="/" element={<PostListPage active={active} setActive={setActive} search={search} posts={posts} setPosts={setPosts} currentUser={currentUser} />} />
        <Route path="/post/:id" element={<PostDetailPage posts={posts} setPosts={setPosts} currentUser={currentUser} />} />
        <Route path="/admin" element={<AdminPage currentUser={currentUser} />} />
      </Routes>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}
