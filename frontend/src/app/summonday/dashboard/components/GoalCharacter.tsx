"use client";
import React from "react";
import { motion } from "framer-motion";

// 浮動小数点のSSR/Clientの不一致を防ぐための丸め用ヘルパー
const r3 = (n: number) => Math.round(n * 1000) / 1000;

type Category = 'exercise' | 'study' | 'money' | 'zen' | 'default';
interface GoalCharacterProps { currentXp: number; title: string; size?: number; }

const PALETTES = {
    exercise: { primary:"#ef4444", secondary:"#f97316", accent:"#fca5a5", glow:"#ef444440", dark:"#dc2626" },
    study:    { primary:"#8b5cf6", secondary:"#a78bfa", accent:"#ddd6fe", glow:"#8b5cf640", dark:"#7c3aed" },
    money:    { primary:"#f59e0b", secondary:"#fcd34d", accent:"#fef3c7", glow:"#f59e0b40", dark:"#d97706" },
    zen:      { primary:"#06b6d4", secondary:"#67e8f9", accent:"#cffafe", glow:"#06b6d440", dark:"#0891b2" },
    default:  { primary:"#10b981", secondary:"#34d399", accent:"#d1fae5", glow:"#10b98140", dark:"#059669" },
};
type P = typeof PALETTES.exercise;

function getCategory(title: string): Category {
    const t = title.toLowerCase();
    if (/運動|ヘルス|走る|スクワット|減量|ダイエット|ランニング|自転車|水泳|筋肉|体力|体重|痩せ|マラソン|ジョギング|縄跳び|ウェイト|腹筋|有酸素/.test(t)) return 'exercise';
    if (/勉強|本|読書|数学|英語|言語|資格|試験|学習|教育|学び|講義|講座|家庭教師|論文|コーディング|プログラミング|開発|TOEIC|TOEFL/.test(t)) return 'study';
    if (/お金|貯金|投資|収入|副業|節約|資産|万円|給料|収益|株|ファンド|お金持ち|金融|積立|銀行|経済|コイン|ビットコイン/.test(t)) return 'money';
    if (/睡眠|瞑想|心|精神|休息|ヨガ|ヒーリング|ストレス|マインド|平穏|呼吸|心理|感謝|日記|ルーティン|朝活|早起き/.test(t)) return 'zen';
    return 'default';
}
function getStage(xp: number): 2|3|4 { return xp<300?2:xp<600?3:4; }

// ── 共通の目 ──────────────────────────────────────────────────────
function Eyes({ lx=43, rx=57, y=57, r=5.5 }: {lx?:number;rx?:number;y?:number;r?:number}) {
    return (<g>
        <circle cx={lx} cy={y} r={r} fill="white"/>
        <circle cx={rx} cy={y} r={r} fill="white"/>
        <circle cx={lx} cy={y+1} r={r*0.65} fill="#1e1b4b"/>
        <circle cx={rx} cy={y+1} r={r*0.65} fill="#1e1b4b"/>
        <circle cx={lx+1.5} cy={y-1} r={r*0.27} fill="white"/>
        <circle cx={rx+1.5} cy={y-1} r={r*0.27} fill="white"/>
    </g>);
}
function Smile({y=67, wide=false}:{y?:number;wide?:boolean}) {
    return wide
        ? <path d={`M41 ${y} Q50 ${y+9} 59 ${y}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        : <path d={`M44 ${y} Q50 ${y+5} 56 ${y}`} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>;
}
function Cheeks({p}:{p:P}) {
    return (<g>
        <circle cx="37" cy="63" r="4" fill={p.secondary} opacity="0.4"/>
        <circle cx="63" cy="63" r="4" fill={p.secondary} opacity="0.4"/>
    </g>);
}
function Body({p, stage}:{p:P;stage:number}) {
    return (<g>
        <ellipse cx="50" cy="62" rx="27" ry="29" fill={p.primary}/>
        <ellipse cx="50" cy="70" rx="16" ry="13" fill={p.accent} opacity="0.55"/>
    </g>);
}
function Feet({p}:{p:P}) {
    return (<g>
        <ellipse cx="41" cy="88" rx="9" ry="5" fill={p.dark}/>
        <ellipse cx="59" cy="88" rx="9" ry="5" fill={p.dark}/>
    </g>);
}
function Crown({p}:{p:P}) {
    return (<g>
        <path d="M32 30 L36 17 L42 26 L50 11 L58 26 L64 17 L68 30 Z" fill={p.secondary} stroke={p.dark} strokeWidth="1"/>
        <circle cx="50" cy="20" r="3.5" fill="white" opacity="0.9"/>
        <circle cx="37" cy="26" r="2.5" fill={p.accent}/>
        <circle cx="63" cy="26" r="2.5" fill={p.accent}/>
    </g>);
}
function Aura({p}:{p:P}) {
    return <circle cx="50" cy="55" r="44" fill={p.glow}/>;
}

// ══ EXERCISE ══════════════════════════════════════════════════════════════
function ExerciseS2({p}:{p:P}) {
    return (<g>
        <Body p={p} stage={2}/>
        {/* ヘアバンド */}
        <rect x="27" y="35" width="46" height="8" rx="4" fill={p.dark}/>
        <rect x="27" y="35" width="46" height="3" rx="1.5" fill="white" opacity="0.2"/>
        {/* 稲妻 */}
        <path d="M48 37 L46 42 L50 42 L47 47 L53 41 L49 41 Z" fill="#fde68a"/>
        {/* 腕 */}
        <ellipse cx="23" cy="64" rx="8" ry="6" fill={p.primary} transform="rotate(-15 23 64)"/>
        <ellipse cx="77" cy="64" rx="8" ry="6" fill={p.primary} transform="rotate(15 77 64)"/>
        <Eyes/><Cheeks p={p}/><Smile/>
        {/* 汗 */}
        <path d="M65 38 Q67 33 69 38 Q69 42 65 42 Z" fill="#bfdbfe" opacity="0.8"/>
        <Feet p={p}/>
    </g>);
}
function ExerciseS3({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        <Body p={p} stage={3}/>
        {/* 筋肉の腕 */}
        <path d="M23 60 Q13 46 19 36" stroke={p.primary} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <circle cx="19" cy="36" r="7" fill={p.dark}/>
        <path d="M77 60 Q87 46 81 36" stroke={p.primary} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <circle cx="81" cy="36" r="7" fill={p.dark}/>
        {/* ヘアバンド */}
        <rect x="27" y="34" width="46" height="9" rx="4.5" fill={p.dark}/>
        <path d="M47 36 L44 42 L49 42 L46 49 L54 41 L49 41 Z" fill="#fde68a"/>
        <Eyes r={6}/>
        {/* しかめっ面の眉毛 */}
        <path d="M37 48 L47 51" stroke={p.dark} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M53 51 L63 48" stroke={p.dark} strokeWidth="2.5" strokeLinecap="round"/>
        <Cheeks p={p}/><Smile wide/>
        {/* スピードライン */}
        <path d="M9 74 L22 74" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M11 80 L22 80" stroke={p.secondary} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M78 74 L91 74" stroke={p.secondary} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <Feet p={p}/>
    </g>);
}
function ExerciseS4({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        {/* 炎 */}
        <path d="M20 52 Q13 38 21 25 Q26 44 30 52Z" fill={p.secondary} opacity="0.85"/>
        <path d="M80 52 Q87 38 79 25 Q74 44 70 52Z" fill={p.secondary} opacity="0.85"/>
        <path d="M36 28 Q32 16 40 10 Q41 24 46 28Z" fill={p.secondary} opacity="0.7"/>
        <path d="M64 28 Q68 16 60 10 Q59 24 54 28Z" fill={p.secondary} opacity="0.7"/>
        <Body p={p} stage={4}/>
        {/* トロフィーのへそ */}
        <path d="M44 68 L50 62 L56 68 L53 74 L47 74 Z" fill="#fde68a"/>
        <circle cx="50" cy="67" r="2.5" fill="white" opacity="0.7"/>
        {/* パワーアーム */}
        <path d="M23 60 Q13 44 20 32" stroke={p.primary} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <circle cx="20" cy="32" r="8" fill={p.dark}/>
        <path d="M77 60 Q87 44 80 32" stroke={p.primary} strokeWidth="12" strokeLinecap="round" fill="none"/>
        <circle cx="80" cy="32" r="8" fill={p.dark}/>
        <Crown p={p}/>
        <Eyes r={6.5}/><Cheeks p={p}/><Smile wide/>
        {/* 稲妻の装飾 */}
        <text x="8" y="25" fontSize="11" fill="#fde68a" opacity="0.9">⚡</text>
        <text x="80" y="22" fontSize="9" fill="#fde68a" opacity="0.9">⚡</text>
        <Feet p={p}/>
    </g>);
}

// ══ STUDY ══════════════════════════════════════════════════════════════
function StudyS2({p}:{p:P}) {
    return (<g>
        <Body p={p} stage={2}/>
        {/* メガネ */}
        <circle cx="43" cy="57" r="7" fill="none" stroke="#1e1b4b" strokeWidth="2"/>
        <circle cx="57" cy="57" r="7" fill="none" stroke="#1e1b4b" strokeWidth="2"/>
        <line x1="50" y1="57" x2="50" y2="57" stroke="#1e1b4b" strokeWidth="2"/>
        <line x1="36" y1="54" x2="30" y2="52" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="64" y1="54" x2="70" y2="52" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round"/>
        <Eyes lx={43} rx={57} y={57} r={5}/>
        {/* 星の電球 */}
        <circle cx="50" cy="31" r="6.5" fill="#fde68a"/>
        <path d="M50 25 L51.5 29 L55.5 29 L52 31.5 L53.5 35.5 L50 33 L46.5 35.5 L48 31.5 L44.5 29 L48.5 29Z" fill="#fde68a" opacity="0.5"/>
        <line x1="50" y1="38" x2="50" y2="34" stroke="#d97706" strokeWidth="1.5"/>
        {/* 本 */}
        <rect x="63" y="57" width="16" height="21" rx="2" fill="#312e81"/>
        <rect x="64" y="58" width="14" height="19" rx="1" fill="white" opacity="0.9"/>
        <line x1="64" y1="65" x2="78" y2="65" stroke={p.primary} strokeWidth="1" opacity="0.4"/>
        <line x1="64" y1="69" x2="78" y2="69" stroke={p.primary} strokeWidth="1" opacity="0.4"/>
        <line x1="64" y1="73" x2="78" y2="73" stroke={p.primary} strokeWidth="1" opacity="0.4"/>
        <path d="M63 65 Q68 61 77 65" stroke={p.primary} strokeWidth="8" strokeLinecap="round" fill="none"/>
        <Smile/><Feet p={p}/>
    </g>);
}
function StudyS3({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        <Body p={p} stage={3}/>
        {/* 角帽 */}
        <rect x="32" y="35" width="36" height="7" rx="1" fill="#312e81"/>
        <rect x="34" y="28" width="32" height="7" rx="1" fill="#4c1d95"/>
        <line x1="62" y1="32" x2="70" y2="42" stroke="#fde68a" strokeWidth="2"/>
        <circle cx="70" cy="43" r="2.5" fill="#fde68a"/>
        <line x1="70" y1="43" x2="68" y2="51" stroke="#fde68a" strokeWidth="1.2"/>
        <line x1="70" y1="43" x2="72" y2="50" stroke="#fde68a" strokeWidth="1.2"/>
        {/* 四角いメガネ */}
        <rect x="35" y="51" width="14" height="11" rx="2.5" fill="none" stroke="#1e1b4b" strokeWidth="2"/>
        <rect x="51" y="51" width="14" height="11" rx="2.5" fill="none" stroke="#1e1b4b" strokeWidth="2"/>
        <line x1="49" y1="57" x2="51" y2="57" stroke="#1e1b4b" strokeWidth="2"/>
        <line x1="35" y1="57" x2="29" y2="55" stroke="#1e1b4b" strokeWidth="1.5"/>
        <line x1="65" y1="57" x2="71" y2="55" stroke="#1e1b4b" strokeWidth="1.5"/>
        <Eyes lx={42} rx={58} y={57} r={4.5}/>
        {/* 浮いている本 */}
        <rect x="10" y="43" width="13" height="18" rx="2" fill="#4c1d95" transform="rotate(-15 10 43)"/>
        <rect x="11" y="44" width="11" height="16" rx="1" fill="white" opacity="0.85" transform="rotate(-15 10 43)"/>
        <rect x="77" y="46" width="13" height="18" rx="2" fill="#7c3aed" transform="rotate(12 77 46)"/>
        <rect x="78" y="47" width="11" height="16" rx="1" fill="white" opacity="0.85" transform="rotate(12 77 46)"/>
        <Smile wide/><Cheeks p={p}/>
        <text x="23" y="28" fontSize="9" fill="#fde68a" opacity="0.9">✦</text>
        <text x="72" y="33" fontSize="7" fill="#fde68a" opacity="0.9">✦</text>
        <Feet p={p}/>
    </g>);
}
function StudyS4({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        <text x="9" y="18" fontSize="11" fill="#fde68a" opacity="0.9">✦</text>
        <text x="78" y="14" fontSize="8" fill={p.secondary} opacity="0.9">✦</text>
        <text x="85" y="78" fontSize="9" fill="#fde68a" opacity="0.8">✦</text>
        <text x="4" y="72" fontSize="7" fill={p.secondary} opacity="0.8">✦</text>
        <Body p={p} stage={4}/>
        {/* へその星 */}
        <path d="M50 63 L51.5 67 L56 67 L52.5 70 L54 74 L50 71 L46 74 L47.5 70 L44 67 L48.5 67Z" fill="#fde68a"/>
        {/* 魔法使いの帽子 */}
        <path d="M33 38 Q50 4 67 38 Q60 32 40 32 Z" fill="#4c1d95"/>
        <rect x="29" y="37" width="42" height="7" rx="3.5" fill="#312e81"/>
        <text x="45" y="30" fontSize="8" fill="#fde68a">★</text>
        <text x="52" y="22" fontSize="5" fill={p.secondary}>★</text>
        {/* 輝くメガネ */}
        <circle cx="43" cy="57" r="7" fill="none" stroke={p.secondary} strokeWidth="2.5"/>
        <circle cx="57" cy="57" r="7" fill="none" stroke={p.secondary} strokeWidth="2.5"/>
        <line x1="50" y1="57" x2="50" y2="57" stroke={p.secondary} strokeWidth="2.5"/>
        <line x1="36" y1="57" x2="29" y2="54" stroke={p.secondary} strokeWidth="2"/>
        <line x1="64" y1="57" x2="71" y2="54" stroke={p.secondary} strokeWidth="2"/>
        <Eyes lx={43} rx={57} y={57} r={5}/>
        {/* 魔法の杖アーム */}
        <path d="M72 62 Q80 53 79 43" stroke={p.primary} strokeWidth="9" strokeLinecap="round" fill="none"/>
        <line x1="79" y1="43" x2="86" y2="37" stroke="#fde68a" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="87" cy="36" r="4.5" fill="#fde68a"/>
        <text x="84" y="28" fontSize="9" fill="#fde68a">✨</text>
        <Smile wide/><Cheeks p={p}/><Feet p={p}/>
    </g>);
}

// ══ MONEY ══════════════════════════════════════════════════════════════
function MoneyS2({p}:{p:P}) {
    return (<g>
        {/* コインの胴体 */}
        <ellipse cx="50" cy="62" rx="29" ry="27" fill={p.primary}/>
        <ellipse cx="50" cy="62" rx="24" ry="22" fill={p.secondary} opacity="0.5"/>
        <ellipse cx="50" cy="62" rx="29" ry="27" fill="none" stroke={p.dark} strokeWidth="2.5"/>
        <ellipse cx="50" cy="62" rx="22" ry="20" fill="none" stroke={p.dark} strokeWidth="1" opacity="0.4"/>
        {/* 貯金箱のコインスロット */}
        <rect x="43" y="33" width="14" height="4" rx="2" fill={p.dark}/>
        {/* へその ₩ */}
        <text x="43" y="72" fontSize="14" fill={p.dark} fontWeight="bold">₩</text>
        <Eyes y={56}/>
        <Cheeks p={p}/>
        <path d="M44 67 Q50 72 56 67" stroke={p.dark} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* ミニコイン */}
        <circle cx="22" cy="55" r="6" fill={p.secondary}/>
        <circle cx="22" cy="55" r="6" fill="none" stroke={p.dark} strokeWidth="1.2"/>
        <text x="19" y="58.5" fontSize="7" fill={p.dark} fontWeight="bold">₩</text>
        <Feet p={p}/>
    </g>);
}
function MoneyS3({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        {/* コインの翼 */}
        <path d="M24 53 Q10 40 19 24 Q30 41 31 54Z" fill={p.secondary} opacity="0.9"/>
        <path d="M76 53 Q90 40 81 24 Q70 41 69 54Z" fill={p.secondary} opacity="0.9"/>
        <circle cx="20" cy="40" r="5" fill={p.primary} opacity="0.7"/>
        <circle cx="80" cy="40" r="5" fill={p.primary} opacity="0.7"/>
        <ellipse cx="50" cy="62" rx="29" ry="27" fill={p.primary}/>
        <ellipse cx="50" cy="62" rx="24" ry="22" fill={p.secondary} opacity="0.5"/>
        <ellipse cx="50" cy="62" rx="29" ry="27" fill="none" stroke={p.dark} strokeWidth="2.5"/>
        {/* お金の袋の頭 */}
        <circle cx="50" cy="31" r="11" fill={p.secondary}/>
        <path d="M43 36 Q50 43 57 36" stroke={p.dark} strokeWidth="2" fill="none"/>
        <text x="45" y="36" fontSize="11" fill={p.dark} fontWeight="bold">$</text>
        <Eyes y={57}/>
        <Cheeks p={p}/>
        <path d="M43 68 Q50 74 57 68" stroke={p.dark} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* 浮いているコイン */}
        <circle cx="14" cy="28" r="5.5" fill={p.secondary}/><circle cx="14" cy="28" r="5.5" fill="none" stroke={p.dark} strokeWidth="1"/>
        <circle cx="86" cy="32" r="5" fill={p.secondary}/><circle cx="86" cy="32" r="5" fill="none" stroke={p.dark} strokeWidth="1"/>
        <circle cx="18" cy="80" r="4" fill={p.secondary} opacity="0.7"/>
        <circle cx="82" cy="78" r="4" fill={p.secondary} opacity="0.7"/>
        <Feet p={p}/>
    </g>);
}
function MoneyS4({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        {/* コインの雨 */}
        {[{x:10,y:14,r:4},{x:24,y:7,r:3},{x:76,y:9,r:4.5},{x:88,y:20,r:3},{x:91,y:68,r:3.5},{x:7,y:64,r:3}].map((c,i)=>(
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={p.secondary} opacity="0.85"/>
        ))}
        {/* 大きな翼 */}
        <path d="M22 50 Q4 28 17 9 Q28 35 31 51Z" fill={p.secondary}/>
        <path d="M78 50 Q96 28 83 9 Q72 35 69 51Z" fill={p.secondary}/>
        <ellipse cx="50" cy="62" rx="29" ry="27" fill={p.primary}/>
        <ellipse cx="50" cy="62" rx="24" ry="22" fill={p.secondary} opacity="0.5"/>
        <ellipse cx="50" cy="62" rx="29" ry="27" fill="none" stroke={p.dark} strokeWidth="2.5"/>
        {/* ダイヤのへそ */}
        <path d="M45 62 L50 55 L55 62 L50 70 Z" fill="white" opacity="0.9"/>
        <path d="M45 62 L50 70 L55 62" stroke={p.primary} strokeWidth="0.8" fill="none"/>
        <Crown p={p}/>
        <Eyes r={6.5} y={58}/>
        <Cheeks p={p}/>
        <path d="M41 68 Q50 78 59 68" stroke={p.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <Feet p={p}/>
    </g>);
}

// ══ ZEN ══════════════════════════════════════════════════════════════
function ZenCloud({p}:{p:P}) {
    return (<g>
        <circle cx="36" cy="67" r="16" fill={p.primary} opacity="0.9"/>
        <circle cx="50" cy="61" r="21" fill={p.primary}/>
        <circle cx="64" cy="67" r="16" fill={p.primary} opacity="0.9"/>
        <circle cx="43" cy="72" r="13" fill={p.primary} opacity="0.8"/>
        <circle cx="57" cy="72" r="13" fill={p.primary} opacity="0.8"/>
        <circle cx="50" cy="63" r="14" fill={p.secondary} opacity="0.35"/>
    </g>);
}
function ZenS2({p}:{p:P}) {
    return (<g>
        <ZenCloud p={p}/>
        {/* 三日月 */}
        <path d="M39 27 Q50 17 61 27 Q53 21 47 21 Q43 21 39 27 Z" fill="#fde68a"/>
        {/* ZZZ */}
        <text x="63" y="40" fontSize="7" fill={p.secondary} opacity="0.8" fontWeight="bold">z</text>
        <text x="70" y="33" fontSize="9" fill={p.secondary} opacity="0.9" fontWeight="bold">z</text>
        <text x="77" y="25" fontSize="12" fill={p.secondary} fontWeight="bold">Z</text>
        {/* 眠そうな目（半開き）*/}
        <ellipse cx="43" cy="58" rx="5.5" ry="4" fill="white"/>
        <ellipse cx="57" cy="58" rx="5.5" ry="4" fill="white"/>
        <path d="M37.5 56 Q43 53.5 48.5 56" fill={p.primary}/>
        <path d="M51.5 56 Q57 53.5 62.5 56" fill={p.primary}/>
        <circle cx="43" cy="58.5" r="2.5" fill="#1e1b4b"/>
        <circle cx="57" cy="58.5" r="2.5" fill="#1e1b4b"/>
        <circle cx="44" cy="57.5" r="1" fill="white"/>
        <circle cx="58" cy="57.5" r="1" fill="white"/>
        <path d="M45 67 Q50 71 55 67" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="15" y="50" fontSize="8" fill="#fde68a" opacity="0.7">★</text>
        <text x="78" y="55" fontSize="7" fill="#fde68a" opacity="0.7">★</text>
    </g>);
}
function ZenS3({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        <circle cx="50" cy="58" r="38" fill="none" stroke={p.secondary} strokeWidth="1.5" opacity="0.4"/>
        <circle cx="50" cy="58" r="31" fill="none" stroke={p.secondary} strokeWidth="1" opacity="0.3"/>
        {/* 蓮の花の座り姿勢 */}
        <ellipse cx="35" cy="83" rx="13" ry="6" fill={p.primary}/>
        <ellipse cx="65" cy="83" rx="13" ry="6" fill={p.primary}/>
        <ZenCloud p={p}/>
        {/* 満月 */}
        <circle cx="50" cy="29" r="14" fill="#fde68a" opacity="0.9"/>
        <circle cx="50" cy="29" r="11" fill="#fef3c7"/>
        <circle cx="56" cy="29" r="10" fill="#fde68a" opacity="0.5"/>
        {/* 閉じた目 */}
        <path d="M37 57 Q43 53 49 57" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M51 57 Q57 53 63 57" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* 第三の目 */}
        <circle cx="50" cy="52" r="3.5" fill={p.secondary} opacity="0.85"/>
        <circle cx="50" cy="52" r="1.5" fill="white" opacity="0.7"/>
        <path d="M44 66 Q50 71 56 66" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="11" y="30" fontSize="10" fill="#fde68a" opacity="0.8">★</text>
        <text x="76" y="27" fontSize="8" fill="#fde68a" opacity="0.8">★</text>
        <text x="19" y="78" fontSize="7" fill={p.secondary} opacity="0.7">✦</text>
        <text x="73" y="76" fontSize="7" fill={p.secondary} opacity="0.7">✦</text>
    </g>);
}
function ZenS4({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        {[38,32,27,22].map((r,i)=>(
            <circle key={i} cx="50" cy="55" r={r} fill="none" stroke={p.secondary} strokeWidth="1.5" opacity={0.5-i*0.1}/>
        ))}
        <text x="7" y="17" fontSize="10" fill="#fde68a" opacity="0.9">★</text>
        <text x="82" y="14" fontSize="8" fill={p.secondary} opacity="0.9">★</text>
        <text x="88" y="80" fontSize="8" fill="#fde68a" opacity="0.8">★</text>
        <text x="2" y="75" fontSize="7" fill={p.secondary} opacity="0.8">★</text>
        <text x="45" y="7" fontSize="9" fill="#fde68a" opacity="0.8">★</text>
        {/* 蓮の花ポーズ */}
        <ellipse cx="33" cy="83" rx="14" ry="7" fill={p.primary}/>
        <ellipse cx="67" cy="83" rx="14" ry="7" fill={p.primary}/>
        <ZenCloud p={p}/>
        {/* ギャラクシー王冠（月）*/}
        <circle cx="50" cy="27" r="15" fill={p.dark}/>
        <circle cx="50" cy="27" r="12" fill={p.primary}/>
        <circle cx="50" cy="27" r="9" fill="#fde68a" opacity="0.8"/>
        <text x="43" y="30" fontSize="10" fill={p.dark} opacity="0.6">☾</text>
        {/* 閉じた目（太い）*/}
        <path d="M36 57 Q43 52 50 57" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M50 57 Q57 52 64 57" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* 輝く第三の目 */}
        <circle cx="50" cy="51" r="4.5" fill={p.secondary}/>
        <circle cx="50" cy="51" r="2.5" fill="white" opacity="0.9"/>
        <path d="M43 67 Q50 73 57 67" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* 足元の蓮の花 */}
        <text x="25" y="89" fontSize="11" fill="#fce7f3" opacity="0.8">❋</text>
        <text x="60" y="89" fontSize="11" fill="#fce7f3" opacity="0.8">❋</text>
    </g>);
}

// ══ DEFAULT / NATURE ══════════════════════════════════════════════════════════════
function NatureS2({p}:{p:P}) {
    return (<g>
        <Body p={p} stage={2}/>
        {/* 新芽 */}
        <line x1="50" y1="34" x2="50" y2="22" stroke={p.dark} strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="46" cy="18" rx="7" ry="10" fill={p.primary} transform="rotate(-20 46 18)"/>
        <ellipse cx="55" cy="20" rx="6" ry="8" fill={p.secondary} transform="rotate(15 55 20)" opacity="0.85"/>
        <line x1="46" y1="18" x2="42" y2="13" stroke={p.dark} strokeWidth="0.8" opacity="0.5"/>
        {/* 葉っぱのアーム */}
        <ellipse cx="23" cy="65" rx="8" ry="6" fill={p.primary} transform="rotate(-15 23 65)"/>
        <ellipse cx="77" cy="65" rx="8" ry="6" fill={p.primary} transform="rotate(15 77 65)"/>
        <Eyes/><Cheeks p={p}/><Smile/>
        <Feet p={p}/>
    </g>);
}
function NatureS3({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        <Body p={p} stage={3}/>
        {/* 花の冠 */}
        {[0,60,120,180,240,300].map((deg,i)=>{
            const rad = deg*Math.PI/180;
            const cx = r3(50 + Math.cos(rad)*12);
            const cy = r3(30 + Math.sin(rad)*10);
            return <circle key={i} cx={cx} cy={cy} r={5} fill={i%2===0?p.secondary:p.accent} opacity="0.9"/>;
        })}
        <circle cx="50" cy="30" r="6" fill="#fde68a"/>
        {/* つるのアーム */}
        <path d="M24 58 Q14 48 18 36" stroke={p.primary} strokeWidth="9" strokeLinecap="round" fill="none"/>
        <circle cx="18" cy="36" r="5" fill={p.secondary}/>
        <circle cx="18" cy="36" r="3" fill={p.primary}/>
        <path d="M76 58 Q86 48 82 36" stroke={p.primary} strokeWidth="9" strokeLinecap="round" fill="none"/>
        <circle cx="82" cy="36" r="5" fill={p.secondary}/>
        <circle cx="82" cy="36" r="3" fill={p.primary}/>
        {/* 木の葉の翼 */}
        <path d="M26 53 Q12 36 24 20 Q32 38 32 53Z" fill={p.secondary} opacity="0.8"/>
        <path d="M74 53 Q88 36 76 20 Q68 38 68 53Z" fill={p.secondary} opacity="0.8"/>
        <Eyes r={6}/><Cheeks p={p}/><Smile wide/>
        <text x="14" y="30" fontSize="9" fill={p.secondary} opacity="0.9">✿</text>
        <text x="76" y="26" fontSize="8" fill={p.secondary} opacity="0.9">✿</text>
        <Feet p={p}/>
    </g>);
}
function NatureS4({p}:{p:P}) {
    return (<g>
        <Aura p={p}/>
        {/* 光の筋 */}
        {[0,45,90,135,180,225,270,315].map((deg,i)=>{
            const rad=deg*Math.PI/180;
            const x1=r3(50+Math.cos(rad)*28), y1=r3(55+Math.sin(rad)*28);
            const x2=r3(50+Math.cos(rad)*44), y2=r3(55+Math.sin(rad)*44);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={p.secondary} strokeWidth="2" opacity="0.5" strokeLinecap="round"/>;
        })}
        {/* 大きな木の葉の翼 */}
        <path d="M22 50 Q5 28 18 8 Q28 34 31 50Z" fill={p.secondary} opacity="0.85"/>
        <path d="M78 50 Q95 28 82 8 Q72 34 69 50Z" fill={p.secondary} opacity="0.85"/>
        <Body p={p} stage={4}/>
        {/* 花びらの冠 */}
        {[0,51,102,153,204,255,306].map((deg,i)=>{
            const rad=deg*Math.PI/180;
            const cx=r3(50+Math.cos(rad)*15), cy=r3(28+Math.sin(rad)*12);
            return <circle key={i} cx={cx} cy={cy} r={6} fill={i%3===0?p.secondary:i%3===1?p.accent:"#fde68a"} opacity="0.9"/>;
        })}
        <circle cx="50" cy="28" r="8" fill="#fde68a"/>
        <circle cx="50" cy="28" r="5" fill="white" opacity="0.8"/>
        {/* 星のへそ */}
        <path d="M50 63 L52 68 L57 68 L53 71 L55 76 L50 73 L45 76 L47 71 L43 68 L48 68 Z" fill={p.secondary}/>
        <Eyes r={6.5}/><Cheeks p={p}/><Smile wide/>
        {/* 輝き */}
        <text x="8" y="22" fontSize="10" fill={p.secondary} opacity="0.9">✿</text>
        <text x="80" y="18" fontSize="9" fill={p.secondary} opacity="0.9">✿</text>
        <text x="12" y="80" fontSize="8" fill="#fde68a" opacity="0.8">✦</text>
        <text x="80" y="78" fontSize="8" fill="#fde68a" opacity="0.8">✦</text>
        <Feet p={p}/>
    </g>);
}

// ══ レンダリング ══════════════════════════════════════════════════════════════
const CHARS: Record<Category, Record<2|3|4, (props:{p:P})=>React.ReactElement>> = {
    exercise: { 2: ExerciseS2, 3: ExerciseS3, 4: ExerciseS4 },
    study:    { 2: StudyS2,    3: StudyS3,    4: StudyS4    },
    money:    { 2: MoneyS2,    3: MoneyS3,    4: MoneyS4    },
    zen:      { 2: ZenS2,      3: ZenS3,      4: ZenS4      },
    default:  { 2: NatureS2,   3: NatureS3,   4: NatureS4   },
};
const LABELS: Record<2|3|4, string> = { 2:"芽", 3:"成長", 4:"完成" };

export default function GoalCharacter({ currentXp, title, size=100 }: GoalCharacterProps) {
    const cat = getCategory(title);
    const stage = getStage(currentXp);
    const p = PALETTES[cat];
    const Char = CHARS[cat][stage];

    return (
        <motion.div
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.5, ease:"backOut" }}
            className="flex flex-col items-center gap-1"
        >
            <motion.div
                animate={stage===4 ? { filter:["brightness(1)","brightness(1.25)","brightness(1)"] } : {}}
                transition={{ repeat:Infinity, duration:2.5, ease:"easeInOut" }}
            >
                <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{overflow:"visible"}}>
                    <Char p={p}/>
                </svg>
            </motion.div>
            <motion.span
                key={stage}
                initial={{ opacity:0, y:4 }}
                animate={{ opacity:1, y:0 }}
                className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                style={{ background:`${p.primary}25`, color:p.primary, border:`1px solid ${p.primary}50` }}
            >
                Lv.{stage-1} {LABELS[stage]}
            </motion.span>
        </motion.div>
    );
}
