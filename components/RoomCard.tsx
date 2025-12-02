"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import {
  RoomType,
  PriceInfo,
  getInitialPrices,
  getMorePrices,
} from "@/lib/mock-api";

interface RoomCardProps {
  room: RoomType;
}

export default function RoomCard({ room }: RoomCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 状态管理
  const [prices, setPrices] = useState<PriceInfo[]>([]);
  const [loading, setLoading] = useState(false); // 初始加载状态
  const [hasLoaded, setHasLoaded] = useState(false); // 是否已经加载过
  const [expanding, setExpanding] = useState(false); // 展开更多加载状态
  const [showAll, setShowAll] = useState(false); // 是否显示全部

  // Intersection Observer 逻辑
  useEffect(() => {
    let hasTriggered = false; // Use local flag to prevent race conditions

    const fetchData = async () => {
      if (hasTriggered) return; // Prevent duplicate fetches
      hasTriggered = true;

      setLoading(true);
      try {
        const data = await getInitialPrices(room.id);
        setPrices(data);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // 当进入视口时，触发请求
        if (entry.isIntersecting) {
          fetchData();
          // 断开观察，避免重复触发
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // rootMargin 提前100px预加载
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [room.id]); // Only depend on room.id

  // 点击展开更多价格
  const handleExpand = async () => {
    if (showAll) {
      setShowAll(false);
      return;
    }

    // 如果还没请求过更多数据，则请求
    // 这里假设初始只返回了2条，如果当前只有2条，说明需要请求更多
    if (prices.length <= 2) {
      setExpanding(true);
      try {
        const moreData = await getMorePrices(room.id);
        setPrices((prev) => [...prev, ...moreData]); // 追加数据
        setShowAll(true);
      } finally {
        setExpanding(false);
      }
    } else {
      setShowAll(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white mb-3 p-4 rounded-xl shadow-sm border border-gray-100 min-h-[200px]"
    >
      {/* --- 1. 房型基本信息区域 --- */}
      <div className="flex gap-3 mb-4">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 rounded">
            {room.features.length}张
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{room.area}</p>
          <div className="flex gap-2 mt-1">
            {room.features.map((f) => (
              <span
                key={f}
                className="text-xs text-gray-400 border border-gray-200 px-1 rounded"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2. 价格列表区域 (懒加载) --- */}
      <div className="space-y-3">
        {loading ? (
          // Loading 骨架屏
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
            <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
          </div>
        ) : (
          prices
            .slice(0, showAll ? undefined : 2)
            .map((priceItem, idx) => (
              <PriceItemRow
                key={`${priceItem.channelId}-${idx}`}
                item={priceItem}
              />
            ))
        )}
      </div>

      {/* --- 3. 底部展开按钮 --- */}
      {hasLoaded && !loading && (
        <div
          onClick={handleExpand}
          className="flex items-center justify-center mt-3 pt-3 border-t border-gray-50 cursor-pointer text-blue-500 text-sm font-medium active:opacity-70 transition-all"
        >
          {expanding ? (
            <span>加载更多价格...</span>
          ) : (
            <>
              {showAll ? "收起价格" : "查看剩余价格"}
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 子组件：单行价格渲染
function PriceItemRow({ item }: { item: PriceInfo }) {
  return (
    <div className="flex justify-between items-stretch bg-gray-50/50 p-3 rounded-lg">
      {/* 左侧：政策与标签 */}
      <div className="flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-700 text-sm">
            {item.tags[0]}
          </span>
          <div
            className={`flex items-center text-xs ${
              item.canCancel ? "text-green-600" : "text-red-500"
            }`}
          >
            {item.canCancel ? (
              <CheckCircle className="w-3 h-3 mr-0.5" />
            ) : (
              <XCircle className="w-3 h-3 mr-0.5" />
            )}
            {item.canCancel ? "限时取消" : "不可取消"}
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">
            {item.channelName}
          </span>
          {item.tags.slice(1).map((tag, i) => (
            <span
              key={i}
              className="border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 右侧：价格与按钮 */}
      <div className="flex flex-col items-end justify-center gap-1">
        <div className="flex items-baseline gap-0.5">
          <span className="text-xs text-blue-600 font-medium">
            {item.currency}
          </span>
          <span className="text-xl text-blue-600 font-bold">{item.price}</span>
        </div>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-blue-200 shadow-sm active:scale-95 transition-transform">
          订
        </button>
      </div>
    </div>
  );
}
