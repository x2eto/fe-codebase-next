/**
 * 酒店房型列表页面优化Demo
 */
import { getRoomList } from "@/lib/mock-api";
import RoomCard from "@/components/RoomCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "酒店房型预订 - Next Consult Quiz",
  description: "浏览我们的豪华房型，享受舒适的住宿体验。",
};

export default async function HotelPage() {
  // 在服务端获取房型列表 (SSR)
  const rooms = await getRoomList();

  return (
    <main className="min-h-screen bg-gray-100 pb-10">
      {/* 顶部 Header 模拟 */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="text-lg font-bold">12月11日 - 12月12日</div>
        <div className="text-blue-600 text-sm">修改日期 &gt;</div>
      </header>

      {/* 房型列表容器 */}
      <div className="p-3 max-w-md mx-auto">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      <div className="text-center text-gray-400 text-sm mt-4">已经到底啦</div>
    </main>
  );
}
