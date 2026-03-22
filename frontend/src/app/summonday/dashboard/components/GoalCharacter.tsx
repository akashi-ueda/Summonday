"use client";

import { motion } from "framer-motion";

interface GoalCharacterProps {
    progress: number; // 0–100
    title: string;
    size?: number;
}

// 목표 제목 키워드 기반 색상 팔레트 결정
function getPalette(title: string): { primary: string; secondary: string; glow: string } {
    const t = title.toLowerCase();
    if (/운동|헬스|달리기|스쿼트|감량|다이어트|러닝|자전거|수영/.test(t))
        return { primary: "#ef4444", secondary: "#f97316", glow: "#ef444480" };
    if (/공부|책|독서|수학|영어|언어|자격증|시험/.test(t))
        return { primary: "#8b5cf6", secondary: "#6366f1", glow: "#8b5cf680" };
    if (/돈|저축|투자|수입|부업|재테크/.test(t))
        return { primary: "#f59e0b", secondary: "#eab308", glow: "#f59e0b80" };
    if (/수면|명상|마음|정신|휴식/.test(t))
        return { primary: "#06b6d4", secondary: "#0ea5e9", glow: "#06b6d480" };
    // 기본 (자기계발, 그 외)
    return { primary: "#10b981", secondary: "#14b8a6", glow: "#10b98180" };
}

// 진행률 → 단계
function getStage(progress: number): 1 | 2 | 3 | 4 {
    if (progress < 25) return 1;
    if (progress < 50) return 2;
    if (progress < 75) return 3;
    return 4;
}

// ─── 단계별 SVG 캐릭터 ────────────────────────────────────────────────
function StageOne() {
    return (
        <g>
            {/* 알 몸통 */}
            <ellipse cx="50" cy="58" rx="28" ry="33" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            {/* 반짝이 하이라이트 */}
            <ellipse cx="40" cy="44" rx="8" ry="5" fill="white" opacity="0.4" />
            {/* 눈 */}
            <circle cx="43" cy="56" r="4" fill="#374151" />
            <circle cx="57" cy="56" r="4" fill="#374151" />
            <circle cx="44.5" cy="54.5" r="1.5" fill="white" />
            <circle cx="58.5" cy="54.5" r="1.5" fill="white" />
            {/* 입: 작은 U모양 */}
            <path d="M45 63 Q50 67 55 63" stroke="#6b7280" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
    );
}

function StageTwo({ p }: { p: typeof getPalette extends (...args: any) => infer R ? R : never }) {
    return (
        <g>
            {/* 몸통 */}
            <ellipse cx="50" cy="58" rx="26" ry="30" fill={p.primary} opacity="0.9" />
            <ellipse cx="50" cy="58" rx="18" ry="22" fill={p.secondary} opacity="0.5" />
            {/* 하이라이트 */}
            <ellipse cx="40" cy="45" rx="7" ry="4" fill="white" opacity="0.3" />
            {/* 팔 왼쪽 */}
            <ellipse cx="24" cy="60" rx="6" ry="9" fill={p.primary} transform="rotate(-20 24 60)" />
            {/* 팔 오른쪽 */}
            <ellipse cx="76" cy="60" rx="6" ry="9" fill={p.primary} transform="rotate(20 76 60)" />
            {/* 다리 */}
            <ellipse cx="41" cy="85" rx="7" ry="5" fill={p.primary} />
            <ellipse cx="59" cy="85" rx="7" ry="5" fill={p.primary} />
            {/* 눈 */}
            <circle cx="43" cy="54" r="5" fill="white" />
            <circle cx="57" cy="54" r="5" fill="white" />
            <circle cx="43" cy="55" r="3" fill="#1e1b4b" />
            <circle cx="57" cy="55" r="3" fill="#1e1b4b" />
            <circle cx="44" cy="54" r="1" fill="white" />
            <circle cx="58" cy="54" r="1" fill="white" />
            {/* 입 */}
            <path d="M44 65 Q50 70 56 65" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
    );
}

function StageThree({ p }: { p: ReturnType<typeof getPalette> }) {
    return (
        <g>
            {/* 날개 */}
            <path d="M24 55 Q10 35 20 20 Q30 40 28 58Z" fill={p.secondary} opacity="0.85" />
            <path d="M76 55 Q90 35 80 20 Q70 40 72 58Z" fill={p.secondary} opacity="0.85" />
            {/* 몸통 */}
            <ellipse cx="50" cy="58" rx="26" ry="30" fill={p.primary} />
            <ellipse cx="50" cy="58" rx="16" ry="20" fill={p.secondary} opacity="0.6" />
            {/* 하이라이트 */}
            <ellipse cx="40" cy="44" rx="7" ry="4" fill="white" opacity="0.35" />
            {/* 뿔/머리 장식 */}
            <path d="M50 28 L44 15 L50 22 L56 15 Z" fill={p.secondary} />
            {/* 다리 */}
            <ellipse cx="41" cy="85" rx="7" ry="5" fill={p.primary} />
            <ellipse cx="59" cy="85" rx="7" ry="5" fill={p.primary} />
            {/* 눈 (더 인상적) */}
            <circle cx="43" cy="54" r="6" fill="white" />
            <circle cx="57" cy="54" r="6" fill="white" />
            <circle cx="43" cy="55" r="4" fill="#1e1b4b" />
            <circle cx="57" cy="55" r="4" fill="#1e1b4b" />
            <circle cx="44" cy="54" r="1.5" fill="white" />
            <circle cx="58" cy="54" r="1.5" fill="white" />
            {/* 볼 터치 */}
            <circle cx="37" cy="62" r="4" fill={p.secondary} opacity="0.5" />
            <circle cx="63" cy="62" r="4" fill={p.secondary} opacity="0.5" />
            {/* 입 */}
            <path d="M43 66 Q50 72 57 66" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
    );
}

function StageFour({ p }: { p: ReturnType<typeof getPalette> }) {
    return (
        <g>
            {/* 빛나는 아우라 */}
            <circle cx="50" cy="55" r="42" fill={p.glow} />
            {/* 날개 (더 크고 화려) */}
            <path d="M24 52 Q5 28 18 8 Q28 35 30 55Z" fill={p.secondary} />
            <path d="M76 52 Q95 28 82 8 Q72 35 70 55Z" fill={p.secondary} />
            {/* 몸통 */}
            <ellipse cx="50" cy="57" rx="27" ry="31" fill={p.primary} />
            <ellipse cx="50" cy="57" rx="16" ry="20" fill="white" opacity="0.2" />
            {/* 하이라이트 */}
            <ellipse cx="39" cy="43" rx="8" ry="5" fill="white" opacity="0.4" />
            {/* 왕관 */}
            <path d="M35 28 L38 18 L43 25 L50 14 L57 25 L62 18 L65 28 Z" fill={p.secondary} stroke={p.primary} strokeWidth="1" />
            {/* 보석 */}
            <circle cx="50" cy="24" r="3" fill="white" opacity="0.9" />
            {/* 눈 */}
            <circle cx="43" cy="53" r="6.5" fill="white" />
            <circle cx="57" cy="53" r="6.5" fill="white" />
            <circle cx="43" cy="54" r="4.5" fill="#1e1b4b" />
            <circle cx="57" cy="54" r="4.5" fill="#1e1b4b" />
            <circle cx="44" cy="52.5" r="2" fill="white" />
            <circle cx="58" cy="52.5" r="2" fill="white" />
            {/* 별 눈썹처럼 */}
            <path d="M39 46 L41 44 L43 46" stroke={p.secondary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M57 46 L59 44 L61 46" stroke={p.secondary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* 볼 */}
            <circle cx="36" cy="61" r="5" fill={p.secondary} opacity="0.5" />
            <circle cx="64" cy="61" r="5" fill={p.secondary} opacity="0.5" />
            {/* 입 (활짝) */}
            <path d="M41 67 Q50 76 59 67" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* 다리 */}
            <ellipse cx="41" cy="85" rx="8" ry="5.5" fill={p.primary} />
            <ellipse cx="59" cy="85" rx="8" ry="5.5" fill={p.primary} />
            {/* 반짝이 별들 */}
            <text x="12" y="22" fontSize="10" fill={p.secondary} opacity="0.9">✦</text>
            <text x="80" y="18" fontSize="8" fill={p.secondary} opacity="0.9">✦</text>
            <text x="22" y="80" fontSize="7" fill={p.secondary} opacity="0.7">✦</text>
        </g>
    );
}

export default function GoalCharacter({ progress, title, size = 100 }: GoalCharacterProps) {
    const stage = getStage(progress);
    const p = getPalette(title);

    const stageLabels: Record<number, string> = {
        1: "알",
        2: "새싹",
        3: "성장",
        4: "완성",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="flex flex-col items-center gap-1"
        >
            <motion.div
                animate={stage === 4 ? { filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ overflow: "visible" }}
                >
                    {stage === 1 && <StageOne />}
                    {stage === 2 && <StageTwo p={p} />}
                    {stage === 3 && <StageThree p={p} />}
                    {stage === 4 && <StageFour p={p} />}
                </svg>
            </motion.div>

            {/* 단계 뱃지 */}
            <motion.span
                key={stage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{ background: `${p.primary}30`, color: p.primary, border: `1px solid ${p.primary}60` }}
            >
                Lv.{stage} {stageLabels[stage]}
            </motion.span>
        </motion.div>
    );
}
