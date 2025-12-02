import { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线问答测试 - Next Consult Quiz",
  description: "参与我们的在线问答测试，挑战你的知识储备。",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
