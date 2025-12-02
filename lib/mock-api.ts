// lib/mock-api.ts

export interface RoomType {
  id: string;
  name: string;
  image: string;
  area: string;
  features: string[];
}

export interface PriceInfo {
  channelId: string;
  channelName: string;
  tags: string[];
  price: number;
  currency: string;
  canCancel: boolean;
}

// 模拟后端：获取房型列表
export const getRoomList = async (): Promise<RoomType[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Array.from({ length: 10 }).map((_, i) => ({
    id: `room-${i}`,
    name: i % 2 === 0 ? "休闲大床房(有窗)" : "豪华双床房(无烟)",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80", // 示例图
    area: "17-25m²",
    features: ["大床", "有窗", "WiFi"],
  }));
};

// 模拟后端：获取初始价格 (只返回2个核心渠道)
export const getInitialPrices = async (
  roomId: string
): Promise<PriceInfo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 模拟查询耗时
  return [
    {
      channelId: "ctrip",
      channelName: "携程酒店",
      tags: ["无早", "限时取消", "可开专票"],
      price: 138 + Math.floor(Math.random() * 20),
      currency: "¥",
      canCancel: true,
    },
    {
      channelId: "meituan",
      channelName: "美团酒店",
      tags: ["无早", "不可取消"],
      price: 135 + Math.floor(Math.random() * 20),
      currency: "¥",
      canCancel: false,
    },
  ];
};

// 模拟后端：获取剩余价格
export const getMorePrices = async (roomId: string): Promise<PriceInfo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [
    {
      channelId: "agoda",
      channelName: "Agoda",
      tags: ["含早", "立即确认"],
      price: 160,
      currency: "¥",
      canCancel: true,
    },
    {
      channelId: "booking",
      channelName: "Booking",
      tags: ["无早"],
      price: 155,
      currency: "¥",
      canCancel: false,
    },
  ];
};
