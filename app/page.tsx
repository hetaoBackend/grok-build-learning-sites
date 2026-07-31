import type { Metadata } from "next";
import { LearningCockpit } from "../components/LearningCockpit";

export const metadata: Metadata = {
  title: "grok-build 源码学习驾驶舱",
  description: "沿一次真实 Turn，理解 grok-build 的架构、工具安全、状态恢复和扩展系统。",
};

export default function Home() {
  return <LearningCockpit />;
}
