/**
 * 问答测试页面优化Demo
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const router = useRouter();
  // 从 Store 获取数据
  const questions = useQuizStore((state) => state.questions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: 下一题, -1: 上一题

  // 防御：如果用户直接输入 URL 进来且没数据，跳回首页
  useEffect(() => {
    if (questions.length === 0) {
      router.replace("/");
    }
  }, [questions, router]);

  // 计算当前题目 (O(1) 复杂度) - 移除 unnecessary useMemo
  const currentQuestion = questions[currentIndex];

  // 进度条 - 移除 unnecessary useMemo
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  // 交互处理
  const handleOptionClick = (value: string) => {
    // 这里可以保存答案到 Store 或 LocalStorage
    console.log(`Selected: ${value} for Question ${currentQuestion.id}`);

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      // 稍微延迟一点让用户看到点击反馈
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    } else {
      alert("测试完成！");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto px-5 pt-6 overflow-hidden font-sans">
      {/* 顶部 Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="上一题"
          className={`px-3 py-1 rounded-full border text-xs transition-colors ${
            currentIndex === 0
              ? "text-gray-300 border-gray-100"
              : "text-blue-500 border-blue-500"
          }`}
        >
          上一题
        </button>

        {/* 进度条容器 */}
        <div
          className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="测试进度"
        >
          <motion.div
            className="h-full bg-[#3b82f6] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <span
          className="text-sm text-gray-400 font-medium w-12 text-right"
          aria-label={`当前第 ${currentIndex + 1} 题，共 ${
            questions.length
          } 题`}
        >
          {currentIndex + 1}
          <span className="text-xs text-gray-300">/{questions.length}</span>
        </span>
      </div>

      {/* 题目区域 (带动画) */}
      <div className="relative w-full min-h-[400px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute top-0 left-0 w-full bg-white"
          >
            <h2 className="text-lg font-bold text-[#222] leading-relaxed mb-8">
              {currentQuestion.index}. {currentQuestion.title}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt.value)}
                  className="w-full text-left p-4 rounded-[2rem] bg-[#f7f8fa] text-[#333] hover:bg-[#eef0f4] active:bg-[#e0e4ea] transition-colors duration-200 -webkit-tap-highlight-transparent"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// 动画配置：实现像 App 一样的推入推出效果
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%", // 反直觉设计：往下一题走时，旧题目往左飞
    opacity: 0,
  }),
};
