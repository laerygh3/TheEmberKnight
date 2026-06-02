import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Users, MessageSquare, Plus, Save, Trash2, Image, Sparkles, 
  Layers, Map, BarChart2, CheckCircle2, ChevronRight, Edit2, X, Send, 
  Copy, Link2, AlertCircle, RefreshCw, UploadCloud, User, UserCheck, HelpCircle
} from 'lucide-react';

// Firebase initialization utilizing environment configuration
let db = null;
let auth = null;
let appId = 'ember-knight-default';
let firebaseAvailable = false;

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const { initializeApp } = require('firebase/app');
    const { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } = require('firebase/auth');
    const { getFirestore, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, getDocs } = require('firebase/firestore');
    
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'ember-knight-default';
    firebaseAvailable = true;
  }
} catch (e) {
  console.warn("Firebase initialize failed. Falling back to Local Memory Mode.", e);
}

// Master design cards populated with the official specs defined in previous steps
const defaultDesignCards = [
  // Class & Monster Category
  {
    id: "card-1",
    tab: "characters",
    title: "주인공 '나규(나견)' 기믹 및 스탯",
    author: "이승훈 PM",
    content: "전투력 0 스펙 구현. 직접적인 근접 타격은 가하지 않으나 최후방에서 '허세 게이지'와 '5분 주기 기어스 스킬'을 시전하여 전장의 상성을 뒤집습니다. 전용장비 '어처구니' 장착 시 파밍 유틸 성능 극대화.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&auto=format&fit=crop",
    likes: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: "card-2",
    tab: "characters",
    title: "S급 견습기사 '루디카' 전용 스킬",
    author: "박성민 아트디렉터",
    content: "직업군: 검사(Swordsman). 전용 스킬 '집중'은 자신의 방어성능을 3초간 포기하는 대신 전방 적들을 관통하여 누적 5회의 크리티컬 데미지(공격력의 130%)를 가합니다. 나규의 통찰의 눈 기어스와 환상의 시너지를 냅니다.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
    likes: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: "card-3",
    tab: "characters",
    title: "SSR급 보스 '와론' 도깨비 기사",
    author: "이승훈 PM",
    content: "직업군: 격투가(Brawler) 메인 탱커. 거대 철퇴를 휘둘러 범위 넉백을 발생시키며 아군 전체 보호막을 생성합니다. 적군 몬스터 스펙(와론 보스전)과 동료 소환 버전이 완벽히 대칭되도록 구성하여 개발 편의 도모.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop",
    likes: 15,
    createdAt: new Date().toISOString()
  },
  // Combat & Stage Category
  {
    id: "card-4",
    tab: "combat",
    title: "사상지평(Event Horizon) 기어스 메커니즘",
    author: "김동환 테크니컬기획",
    content: "Risk: 시전 즉시 아군 전체가 10초간 행동 불가(기절/무방비 상태).\nReturn: 현재 맵 전체 몬스터 중 가장 체력이 높은 대상(보스/엘리트)의 현재 체력을 즉시 50% 차감시킵니다.\n나규의 강력한 전략 카드로 작동.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=300&auto=format&fit=crop",
    likes: 9,
    createdAt: new Date().toISOString()
  },
  {
    id: "card-5",
    tab: "combat",
    title: "방치형 심상 훈련 스테이지 vs스토리 모드",
    author: "이승훈 PM",
    content: "이원화 시스템 구축.\n1) 심상 훈련(방치형): 사망자(나진 등)나 와론 등 적군을 포함해 100종의 모든 수집형 캐릭터를 자유 배치해 20단계 난이도 돌파.\n2) 스토리 모드: 웹툰 컷신 연출 위주 수동 모드로 원작 고증 강제 편성 적용.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300&auto=format&fit=crop",
    likes: 11,
    createdAt: new Date().toISOString()
  },
  // Roadmap & Review Category
  {
    id: "card-6",
    tab: "roadmap",
    title: "4개월 내 코어 루프 구축 마일스톤",
    author: "네이버웹툰 이승훈PM 협의",
    content: "1개월차: 캐릭터/장비 리스트 기획 및 UI/UX 1차 시안 완료\n2개월차: 소환, 전투, 방치 스테이지 2차 빌드 완료 (프로토)\n3개월차: 서버 연동 및 FGT 진행 (베타/검진원 타겟)\n4개월차: 최종 밸런싱 및 소프트 론칭 완료",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=300&auto=format&fit=crop",
    likes: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: "card-7",
    tab: "roadmap",
    title: "원작 PSD 리소스 인게임 최적화 가이드라인",
    author: "박성민 아트디렉터",
    content: "네이버웹툰 제공 오리지널 PSD 파일을 수령해 URP 환경용 2D 스파인 뼈대 구성 및 SD 디자인을 창작합니다. 작가님의 7일 영업일 내 피드백 시스템과 싱크하여 번복 없는 프로세스를 확립합니다.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop",
    likes: 7,
    createdAt: new Date().toISOString()
  },
  // KPI & Business Category
  {
    id: "card-8",
    tab: "business",
    title: "D+1 리텐션 45% 및 예상 ARPPU 목표",
    author: "경콘진 사업기획",
    content: "방치형 특유의 빠른 초기 온보딩과 네이버웹툰 채널링 시너지를 통한 초기 D+1 리텐션 45% 달성이 핵심 목표입니다. 중/소과금 타겟 루디카 성장패스(₩38,500) 및 팝업 패키지 고도화를 통해 마켓 매출 10억 달성 추진.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop",
    likes: 16,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('characters');
  const [cards, setCards] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  
  // States for creating a new card
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [newCardImage, setNewCardImage] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('비공개 협업자');

  // Sync state & visual notifications
  const [syncStatus, setSyncStatus] = useState('Initializing...');
  const [showNotification, setShowNotification] = useState(null);

  // Authentication handler following Rule 3
  useEffect(() => {
    if (!firebaseAvailable) {
      setUser({ uid: 'guest-developer-1234-uuid', displayName: '오프라인 개발자' });
      setSyncStatus('Local Storage Mode');
      // Load from localStorage or defaults
      const localCards = localStorage.getItem('ember_cards');
      const localComments = localStorage.getItem('ember_comments');
      if (localCards) setCards(JSON.parse(localCards));
      else {
        setCards(defaultDesignCards);
        localStorage.setItem('ember_cards', JSON.stringify(defaultDesignCards));
      }
      if (localComments) setComments(JSON.parse(localComments));
      else {
        setComments([
          { id: 'com-1', cardId: 'card-1', author: '네웹 PM 이승훈', text: '기어스 시전 리스크에 대한 UI 연출이 아주 훌륭합니다. 흑백 블러 처리 합의 가능합니다.', createdAt: new Date().toISOString() },
          { id: 'com-2', cardId: 'card-3', author: '와론 팬', text: '와론의 도깨비 위압감이 방치형 가챠 등급(SSR)에 아주 잘 연동되었네요.', createdAt: new Date().toISOString() }
        ]);
      }
      return;
    }

    const { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } = require('firebase/auth');
    const initAuth = async () => {
      try {
        setSyncStatus('Authenticating...');
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase auth error:", err);
        setSyncStatus('Auth Failed (offline fallback)');
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setSyncStatus('Connected to Cloud Database');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore real-time synchronization complying with Rule 1 and Rule 2
  useEffect(() => {
    if (!firebaseAvailable || !user) return;
    const { collection, query, onSnapshot } = require('firebase/firestore');

    // 1. Fetching Design Cards (Public / Shared path)
    const cardsCol = collection(db, 'artifacts', appId, 'public', 'data', 'design_cards');
    const unsubscribeCards = onSnapshot(query(cardsCol), (snapshot) => {
      const fetchedCards = [];
      snapshot.forEach(doc => {
        fetchedCards.push({ id: doc.id, ...doc.data() });
      });
      // If db is empty, initialize it with master design defaults
      if (fetchedCards.length === 0) {
        defaultDesignCards.forEach(async (card) => {
          const { doc, setDoc } = require('firebase/firestore');
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'design_cards', card.id), card);
        });
        setCards(defaultDesignCards);
      } else {
        setCards(fetchedCards);
      }
    }, (error) => {
      console.error("Design cards snapshot error:", error);
      triggerNotification("데이터 동기화 오류가 발생했습니다.");
    });

    // 2. Fetching Comments (Public / Shared path)
    const commentsCol = collection(db, 'artifacts', appId, 'public', 'data', 'comments');
    const unsubscribeComments = onSnapshot(query(commentsCol), (snapshot) => {
      const fetchedComments = [];
      snapshot.forEach(doc => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
    }, (error) => {
      console.error("Comments snapshot error:", error);
    });

    return () => {
      unsubscribeCards();
      unsubscribeComments();
    };
  }, [user]);

  const triggerNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Utilizes imagen-4.0-generate-001 for high quality fantasy game artwork
  const handleAIImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      triggerNotification("컨셉 아트를 생성할 프롬프트를 먼저 입력해주세요.");
      return;
    }
    
    setIsGeneratingImage(true);
    triggerNotification("경기게임지원 스펙에 맞는 AI 컨셉 아트를 생성하는 중입니다...");

    try {
      // Clean target prompt to fit "Ember Knight" art style
      const refinedPrompt = `A webtoon game illustration, detailed anime sketch style matching raw embers theme, ${imagePrompt}, dramatic cinematic lighting, warm amber fire accents, highly detailed game graphic`;
      
      const payload = { 
        instances: [{ prompt: refinedPrompt }], 
        parameters: { sampleCount: 1, aspect_ratio: "1:1" } 
      };
      
      const apiKey = ""; // Canvas framework provides API key at runtime automatically
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const generatedUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setNewCardImage(generatedUrl);
        triggerNotification("컨셉 아트가 성공적으로 생성되어 기획서에 동기화되었습니다!");
      } else {
        throw new Error("No predictions returned");
      }
    } catch (err) {
      console.error("AI image generation error:", err);
      // Fallback with premium placeholder with random seed
      const randomId = Math.floor(Math.random() * 1000);
      setNewCardImage(`https://picsum.photos/seed/${randomId}/400/300`);
      triggerNotification("서버 한계로 임시 컨셉 아트 프레임워크를 적용했습니다.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !newCardContent.trim()) {
      triggerNotification("제목과 상세 기획 내용을 기재해 주세요.");
      return;
    }

    const cardData = {
      title: newCardTitle,
      content: newCardContent,
      tab: activeTab,
      image: newCardImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop",
      author: authorName,
      updatedAt: new Date().toISOString()
    };

    if (isEditing && selectedCard) {
      // Complying with Firestore rules
      if (firebaseAvailable && db) {
        const { doc, updateDoc } = require('firebase/firestore');
        try {
          const cardRef = doc(db, 'artifacts', appId, 'public', 'data', 'design_cards', selectedCard.id);
          await updateDoc(cardRef, cardData);
          triggerNotification("기획안 문서가 성공적으로 클라우드에 업데이트되었습니다!");
        } catch (err) {
          console.error("Error updating doc:", err);
        }
      } else {
        const updated = cards.map(c => c.id === selectedCard.id ? { ...c, ...cardData } : c);
        setCards(updated);
        localStorage.setItem('ember_cards', JSON.stringify(updated));
        triggerNotification("로컬에 저장되었습니다.");
      }
    } else {
      const newId = `card-${Date.now()}`;
      const newCard = {
        id: newId,
        ...cardData,
        likes: 0,
        createdAt: new Date().toISOString()
      };

      if (firebaseAvailable && db) {
        const { doc, setDoc } = require('firebase/firestore');
        try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'design_cards', newId), newCard);
          triggerNotification("새로운 기획 명세가 프로젝트 보드에 추가되었습니다!");
        } catch (err) {
          console.error("Error creating doc:", err);
        }
      } else {
        const updated = [newCard, ...cards];
        setCards(updated);
        localStorage.setItem('ember_cards', JSON.stringify(updated));
        triggerNotification("새 기획안이 로컬에 보존되었습니다.");
      }
    }

    // Reset fields
    setNewCardTitle('');
    setNewCardContent('');
    setNewCardImage('');
    setImagePrompt('');
    setIsEditing(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = async (cardId) => {
    if (firebaseAvailable && db) {
      const { doc, deleteDoc } = require('firebase/firestore');
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'design_cards', cardId));
        triggerNotification("기획서 카드가 안전하게 파기되었습니다.");
        if (selectedCardId === cardId) setSelectedCardId(null);
      } catch (err) {
        console.error("Error deleting doc:", err);
      }
    } else {
      const updated = cards.filter(c => c.id !== cardId);
      setCards(updated);
      localStorage.setItem('ember_cards', JSON.stringify(updated));
      triggerNotification("로컬에서 삭제 완료.");
      if (selectedCardId === cardId) setSelectedCardId(null);
    }
  };

  const handleLikeCard = async (cardId, currentLikes) => {
    if (firebaseAvailable && db) {
      const { doc, updateDoc } = require('firebase/firestore');
      try {
        const cardRef = doc(db, 'artifacts', appId, 'public', 'data', 'design_cards', cardId);
        await updateDoc(cardRef, { likes: (currentLikes || 0) + 1 });
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = cards.map(c => c.id === cardId ? { ...c, likes: (c.likes || 0) + 1 } : c);
      setCards(updated);
      localStorage.setItem('ember_cards', JSON.stringify(updated));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedCardId) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      cardId: selectedCardId,
      author: authorName,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    if (firebaseAvailable && db) {
      const { doc, setDoc } = require('firebase/firestore');
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'comments', newComment.id), newComment);
        setCommentText('');
      } catch (err) {
        console.error("Error saving comment:", err);
      }
    } else {
      const updated = [...comments, newComment];
      setComments(updated);
      localStorage.setItem('ember_comments', JSON.stringify(updated));
      setCommentText('');
    }
  };

  const handleCopyShareLink = () => {
    const rawUrl = window.location.href.split('?')[0];
    const shareLink = `${rawUrl}?appId=${appId}`;
    navigator.clipboard.writeText(shareLink);
    triggerNotification("동시 공동작업 링크가 클립보드에 복사되었습니다! 팀원에게 공유하세요.");
  };

  const filteredCards = cards.filter(card => card.tab === activeTab);
  const activeComments = comments.filter(com => com.cardId === selectedCardId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased">
      {/* Dynamic Popups for instant feedback */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 max-w-sm bg-gradient-to-r from-amber-600 to-orange-700 text-white font-medium p-4 rounded-xl shadow-2xl border border-amber-400 flex items-center space-x-3 animate-bounce">
          <Sparkles className="w-5 h-5 flex-shrink-0 animate-spin" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header section with real-time status and user indicators */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-xl text-zinc-950 shadow-md">
              잔
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-amber-500 flex items-center gap-2">
                잔불의 기사 RPG: 기획 마스터 허브
              </h1>
              <p className="text-xs text-zinc-400">경기게임제작지원 검수 및 공동 기획 플랫폼</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
            {/* Real-time synchronization badge */}
            <div className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-2 border ${
              firebaseAvailable 
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
                : 'bg-zinc-850 text-zinc-400 border-zinc-700/50'
            }`}>
              <RefreshCw className={`w-3.5 h-3.5 ${firebaseAvailable ? 'animate-spin' : ''}`} />
              <span>{syncStatus}</span>
            </div>

            {/* Complete User ID display as per safety rules */}
            <div className="text-xs text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800 hidden sm:flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>ID: <span className="font-mono text-zinc-300 select-all">{user?.uid || 'offline-mode-user'}</span></span>
            </div>

            <button 
              onClick={handleCopyShareLink}
              className="bg-amber-600 text-zinc-950 hover:bg-amber-500 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>동작 링크 복사</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main collaborative dashboard panels */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Navigation & Document Status */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg">
            <h3 className="font-bold text-sm text-amber-500 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 기획 카테고리
            </h3>
            <div className="space-y-1">
              {[
                { id: 'characters', label: '캐릭터/몬스터', icon: Users, desc: '100종 영웅 & 50종 몬스터 구성' },
                { id: 'combat', label: '전투/스테이지', icon: Map, desc: '이원화 20단계 난이도 스펙' },
                { id: 'roadmap', label: '로드맵/검수', icon: BookOpen, desc: '4개월 완성 타겟 마일스톤' },
                { id: 'business', label: '지표/비즈니스', icon: BarChart2, desc: '리텐션 & RS 정산 관리' }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSelectedCardId(null); }}
                    className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-amber-600/20 to-zinc-900 border-l-4 border-amber-500 text-zinc-100' 
                        : 'hover:bg-zinc-800/50 text-zinc-400'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${activeTab === tab.id ? 'text-amber-500' : 'text-zinc-500'}`} />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs text-zinc-500 truncate">{tab.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg">
            <h3 className="font-bold text-sm text-amber-500 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 실시간 프로젝트 목표 현황
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>캐릭터 스펙 달성 (100종)</span>
                  <span className="text-amber-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>몬스터 바리에이션 (50종)</span>
                  <span className="text-amber-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>검수 회신 대응 기한</span>
                  <span className="text-emerald-400 font-bold">영업일 7일</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Middle/Main Area: Interactive Content Cards */}
        <section className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-zinc-50 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                {activeTab === 'characters' && '캐릭터 / 몬스터 데이터 보드'}
                {activeTab === 'combat' && '전투 / 스테이지 밸런스 정보'}
                {activeTab === 'roadmap' && '개발 마일스톤 및 작가 피드백'}
                {activeTab === 'business' && '지표 통계 및 라이선스 정산 계획'}
              </h2>
            </div>

            {/* List of active design items in this category */}
            {filteredCards.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                <p className="text-sm">현재 탭에 작성된 기획 명세가 없습니다.</p>
                <p className="text-xs text-zinc-600 mt-1">우측 에디터를 활용해 첫 명세를 등록해보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-4 rounded-xl transition-all border cursor-pointer ${
                      selectedCardId === card.id 
                        ? 'bg-zinc-850 border-amber-500/80 shadow-amber-950/20 shadow-md' 
                        : 'bg-zinc-900 hover:bg-zinc-850/50 border-zinc-800'
                    }`}
                  >
                    <div className="flex gap-4">
                      {card.image && (
                        <img 
                          src={card.image} 
                          alt="Concept" 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 border border-zinc-800 shadow-inner"
                        />
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-zinc-100 hover:text-amber-400 transition-colors truncate">
                              {card.title}
                            </h4>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing(true);
                                  setSelectedCard(card);
                                  setNewCardTitle(card.title);
                                  setNewCardContent(card.content);
                                  setNewCardImage(card.image);
                                }}
                                className="p-1 hover:text-amber-400 text-zinc-500 rounded transition-colors"
                                title="수정"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCard(card.id);
                                }}
                                className="p-1 hover:text-red-500 text-zinc-500 rounded transition-colors"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 mt-1.5 whitespace-pre-wrap leading-relaxed">
                            {card.content}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/40">
                          <span className="font-medium text-amber-500/80">지은이: {card.author}</span>
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeCard(card.id, card.likes);
                              }}
                              className="flex items-center space-x-1 text-zinc-400 hover:text-amber-500 transition-colors"
                            >
                              <span>🔥</span>
                              <span className="font-bold text-zinc-300">{card.likes || 0}</span>
                            </button>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-zinc-500" />
                              {comments.filter(c => c.cardId === card.id).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Interactive Real-time Collaborators, Editor & Comments */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Editor Mode: Create or Update */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-xl">
            <h3 className="font-bold text-sm text-amber-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 
              {isEditing ? '선택 기획서 수정하기' : '새로운 기획 명세 작성'}
            </h3>
            <form onSubmit={handleSaveCard} className="space-y-3">
              <div>
                <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">작성자 이름</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="예: 경기콘진 홍길동"
                  className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">명세서 제목</label>
                <input 
                  type="text" 
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="예: 와론 공격 스탯 고증"
                  className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">상세 기획 내용</label>
                <textarea 
                  rows="4"
                  value={newCardContent}
                  onChange={(e) => setNewCardContent(e.target.value)}
                  placeholder="구체적인 수치 공식, 기어스 적용 범위를 작성해 주세요..."
                  className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Imagen AI Image Generator Module */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-amber-500/90 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> AI 컨셉아트 생성기
                  </span>
                  <span className="text-[9px] text-zinc-600 font-semibold">by Imagen 4.0</span>
                </div>
                <input 
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="예: 황금빛 대검을 쥐고 있는 기사"
                  className="w-full bg-zinc-900 text-[11px] text-zinc-300 border border-zinc-800 rounded p-1.5 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={handleAIImageGeneration}
                  className="w-full bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 text-[10px] font-bold py-1 px-2 rounded border border-amber-500/20 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingImage ? '컨셉아트 그리는 중...' : '컨셉 이미지 생성'}</span>
                </button>
                {newCardImage && (
                  <div className="relative mt-2 border border-zinc-800 rounded-lg overflow-hidden max-h-32">
                    <img src={newCardImage} alt="Generated Asset" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setNewCardImage('')}
                      className="absolute top-1 right-1 bg-zinc-950/80 p-1 rounded-full text-zinc-400 hover:text-zinc-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-extrabold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? '변경사항 저장' : '기획서 등록'}</span>
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setNewCardTitle('');
                      setNewCardContent('');
                      setNewCardImage('');
                    }}
                    className="bg-zinc-800 hover:bg-zinc-750 font-bold py-2 px-3 rounded-lg text-xs"
                  >
                    취소
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Contextual Collaborative Comments Area */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-xl flex flex-col max-h-[350px]">
            <h3 className="font-bold text-sm text-amber-500 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> 
              {selectedCardId ? '선택 기획 실시간 토론' : '기획안을 선택해 주세요'}
            </h3>

            {selectedCardId ? (
              <>
                {/* Scrollable list of Comments */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-xs">
                  {activeComments.length === 0 ? (
                    <div className="text-center text-zinc-600 py-6">
                      <p>아직 토론 피드백이 없습니다.</p>
                      <p className="text-[10px] mt-1">첫 번째 고증 감수 의견을 남겨보세요!</p>
                    </div>
                  ) : (
                    activeComments.map((com) => (
                      <div key={com.id} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-850">
                        <div className="flex justify-between items-center text-[10px] text-amber-500/90 font-bold mb-1">
                          <span>{com.author}</span>
                          <span className="text-zinc-600">{new Date(com.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed leading-normal">{com.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Send Comment Box */}
                <form onSubmit={handleAddComment} className="mt-auto">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="감수 검토 의견 입력..."
                      className="flex-1 bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                    />
                    <button 
                      type="submit"
                      className="bg-amber-600 text-zinc-950 hover:bg-amber-500 p-2 rounded-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-600 text-xs">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                왼쪽 명세 보드에서 기획 항목을 클릭하면 해당 부문의 실시간 댓글과 피드백 피드가 활성화됩니다.
              </div>
            )}
          </div>
        </section>

      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 mt-12 py-6 text-center text-xs text-zinc-600">
        <p>© 2026. 잔불의 기사 RPG 기획 협업 허브. All Rights Reserved.</p>
        <p className="mt-1 text-[10px] text-zinc-700">본 대시보드는 네이버웹툰 공식 PSD 리소스 가이드를 준수합니다.</p>
      </footer>
    </div>
  );
}