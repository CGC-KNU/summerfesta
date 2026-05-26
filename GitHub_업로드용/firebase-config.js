// ============================================================
// Firebase 설정 및 랭킹 공통 함수
// ============================================================
// 사용 전: 아래 firebaseConfig 객체에 본인의 Firebase 프로젝트 키를 입력하세요.
// Firebase 콘솔 → 프로젝트 설정 → "내 앱" → 웹 앱 → SDK 구성 에서 확인 가능
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 👇 여기에 본인의 Firebase 설정을 붙여넣으세요
const firebaseConfig = {
  apiKey: "AIzaSyCZ8Wztde3yZQimVmmYZfCJvhtR3BMXPv8",
  authDomain: "wouldulike-5f5e9.firebaseapp.com",
  projectId: "wouldulike-5f5e9",
  storageBucket: "wouldulike-5f5e9.firebasestorage.app",
  messagingSenderId: "463119339698",
  appId: "1:463119339698:web:bb52f388afe4faa3f7f9ab",
  measurementId: "G-Q3SQMS08X0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 컬렉션 이름 (게임별로 구분)
// 게임 종류: 'watermelon', 'surfing'
const COLLECTION_NAME = "rankings";

/**
 * 점수 등록
 * @param {string} game - 'watermelon' | 'surfing'
 * @param {string} nickname - 사용자 닉네임
 * @param {number} score - 점수
 */
export async function submitScore(game, nickname, score) {
  // 닉네임 정리 (공백 제거, 최대 8자)
  const cleanNick = String(nickname).trim().slice(0, 8);
  if (!cleanNick) throw new Error("닉네임을 입력해주세요.");
  if (typeof score !== "number" || isNaN(score)) throw new Error("점수가 올바르지 않습니다.");

  await addDoc(collection(db, COLLECTION_NAME), {
    game: game,
    nickname: cleanNick,
    score: Math.floor(score),
    createdAt: serverTimestamp()
  });
}

/**
 * 게임별 상위 랭킹 가져오기
 * @param {string} game - 'watermelon' | 'surfing'
 * @param {number} topN - 상위 몇 명 (기본 20)
 */
export async function fetchRanking(game, topN = 20) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("game", "==", game),
    orderBy("score", "desc"),
    limit(topN)
  );
  const snap = await getDocs(q);
  const list = [];
  snap.forEach(doc => {
    const d = doc.data();
    list.push({
      nickname: d.nickname,
      score: d.score,
      createdAt: d.createdAt ? d.createdAt.toDate() : null
    });
  });
  return list;
}

/**
 * 게임 랭킹 전체 초기화
 * @param {string} game - 'watermelon' | 'surfing' | 'icebreaking'
 */
export async function resetRanking(game) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("game", "==", game)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

/**
 * 간단한 욕설/스팸 필터 (필요시 단어 추가)
 */
const BAD_WORDS = ["시발", "씨발", "병신", "fuck", "shit", "ㅅㅂ", "ㅄ"];
export function isCleanNickname(nick) {
  const lower = String(nick).toLowerCase();
  return !BAD_WORDS.some(w => lower.includes(w));
}
