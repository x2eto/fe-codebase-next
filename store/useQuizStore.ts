import { create } from "zustand";

// 定义题目类型
export interface Question {
  id: number;
  index: number;
  title: string;
  options: { label: string; value: string }[];
}

interface QuizState {
  questions: Question[];
  isLoading: boolean;
  error: string | null; // 错误状态
  fetchPromise: Promise<void> | null; // 用于防止重复请求

  // Actions
  fetchQuestions: () => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  isLoading: false,
  error: null,
  fetchPromise: null,

  fetchQuestions: async () => {
    // 1. 如果已经有数据，直接返回
    if (get().questions.length > 0) return;

    // 2. 如果正在请求中，返回现有的 Promise
    const currentPromise = get().fetchPromise;
    if (currentPromise) return currentPromise;

    // 3. 发起新请求
    const promise = (async () => {
      set({ isLoading: true, error: null });
      try {
        // 模拟 API 延迟 1.5秒
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 模拟生成 5000 条数据
        const mockData = Array.from({ length: 5000 }).map((_, i) => ({
          id: i,
          index: i + 1,
          title: `第 ${
            i + 1
          } 题：如果伴侣在这个时候给你发消息，你会立刻回复吗？`,
          options: [
            { label: "是的，这是一种习惯", value: "yes" },
            { label: "看心情", value: "no" },
          ],
        }));

        set({ questions: mockData, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "加载失败";
        console.error("Fetch failed", errorMessage);
        set({ error: errorMessage });
      } finally {
        set({ isLoading: false, fetchPromise: null });
      }
    })();

    set({ fetchPromise: promise });
    return promise;
  },
}));
