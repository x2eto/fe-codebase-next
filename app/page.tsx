"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function IntroPage() {
  const router = useRouter();
  const { questions, fetchQuestions } = useQuizStore();

  // 按钮专属的 loading 态
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  // 1. 页面挂载即触发预加载
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchQuestions is stable from zustand, only run on mount

  const handleStart = async () => {
    // A. 如果数据已就绪，秒跳
    if (questions.length > 0) {
      router.push("/quiz");
      return;
    }

    // B. 数据还没回，显示按钮 Loading 并等待
    setIsBtnLoading(true);
    await fetchQuestions(); // 等待 store 里的 promise 解决
    setIsBtnLoading(false);

    // 再次检查确保数据加载成功
    if (useQuizStore.getState().questions.length > 0) {
      router.push("/quiz");
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#333] font-sans pb-24">
      {/* 容器限制宽度，模拟手机屏 */}
      <div className="max-w-[480px] mx-auto px-6 pt-10">
        {/* 标题区 */}
        <h1 className="text-2xl font-bold text-center mb-6 text-[#222]">
          3分钟测出你们的真实关系
        </h1>

        <div className="flex justify-center items-center text-xs text-gray-400 mb-10 space-x-4">
          <span>34.4万人已测</span>
          <span className="h-3 w-[1px] bg-gray-200"></span>
          <span>11道精选题</span>
        </div>

        {/* 文案区 */}
        <div className="text-[15px] leading-relaxed text-gray-600 text-justify mb-10">
          <p>
            恋爱谈久了，感情就会慢慢的淡去，少了激情，少了感动，关系也没有之前的亲密了。
            你们现在是处于什么状态呢？下面有一个测试，来看看你们目前的真实关系是什么状态吧！
          </p>
        </div>

        {/* 参考文献 */}
        <div className="mt-8">
          <h4 className="text-sm text-gray-400 mb-2">部分参考文献</h4>
          <p className="text-xs text-gray-300 leading-snug">
            [1] Rogers, C. R. (2002). The interpersonal relationship. Supporting
            Lifelong Learning.
          </p>
        </div>
      </div>

      {/* 底部固定按钮区 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-8">
        <div className="max-w-[480px] mx-auto px-8">
          <button
            onClick={handleStart}
            disabled={isBtnLoading}
            className={cn(
              "w-full h-12 rounded-full text-white font-bold text-lg shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center",
              // 还原图片中的红橙色渐变
              "bg-gradient-to-r from-[#ff8c69] to-[#ff4d6a]",
              isBtnLoading && "opacity-80 cursor-wait"
            )}
          >
            {isBtnLoading ? (
              <>
                <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                准备题目中...
              </>
            ) : (
              "立即测试"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
