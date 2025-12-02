# FE-CODEBASE-NEXT 前端项目

一个使用 Next.js 16 与 React 19 构建的示例应用，包含「在线问答测试」与「酒店房型列表」两个页面，用于演示客户端交互、动画与服务端渲染（SSR）。

## 技术栈

- `Next.js 16`、`React 19`、`TypeScript 5`
- 样式：`Tailwind CSS 4`
- 状态管理：`zustand`
- 动效：`framer-motion`
- 图标：`lucide-react`
- 代码质量：`eslint`（Next Core Web Vitals 规则），路径别名 `@/*`（`tsconfig.json` 中配置，见 `tsconfig.json:21`）

## 目录结构（摘录）

```
app/
  page.tsx              # 首页：问答介绍与开始按钮
  globals.css           # 全局样式（Tailwind 引入）
  quiz/
    page.tsx           # 问答测试（客户端交互与动画）
    layout.tsx         # 问答子布局与元数据
  hotel/
    page.tsx           # 酒店房型列表（SSR）
components/
  RoomCard.tsx         # 房型卡片组件
store/
  useQuizStore.ts      # zustand Store（题目数据与加载）
lib/
  mock-api.ts          # 模拟接口（房型列表与价格）
```

## 本地开发

```bash
npm install
npm run dev
# 或：yarn dev / pnpm dev / bun dev
```

- 访问 `http://localhost:3000`
- 构建：`npm run build`
- 生产启动：`npm run start`
- 代码检查：`npm run lint`

## 路由与功能

- `/` 首页（`app/page.tsx`）：预加载问答数据并提供「开始测试」按钮。预加载逻辑与按钮处理见 `app/page.tsx:18`、`app/page.tsx:20`。
- `/quiz` 问答测试（`app/quiz/page.tsx`）：
  - 题目进度与切换，动画在 `const variants` 配置中实现（`app/quiz/page.tsx` 末尾）。
  - 交互函数：选项点击 `app/quiz/page.tsx:33`，上一题 `app/quiz/page.tsx:47`。
- `/hotel` 酒店房型（`app/hotel/page.tsx`）：服务端渲染获取房型列表，见 `app/hotel/page.tsx:12`；房型卡片组件 `components/RoomCard.tsx`。
- 问答子布局与页面元信息：`app/quiz/layout.tsx:3`。

## 数据与状态

- 题目数据使用 `zustand` 管理，创建于 `store/useQuizStore.ts:18`。
- 防重复请求与大数据模拟：在 `store/useQuizStore.ts:32` 处生成 5000 条题目，并通过 `fetchPromise` 避免并发重复请求。
- 首页在挂载时预加载题目，见 `app/page.tsx:18`；按钮点击时确保数据就绪后跳转，见 `app/page.tsx:20`。

## 样式与动效

- Tailwind 配置：`tailwind.config.ts:1`，扫描 `src` 与 `app` 目录下组件。
- 全局样式与暗色变量：`app/globals.css:1`。
- 页面动效：`framer-motion` 实现题目切换的推入/推出动画，配置位于 `app/quiz/page.tsx` 文件底部 `variants`。

## 代码质量与约定

- ESLint 配置：`eslint.config.mjs:1`，启用 Next 官方规则并自定义忽略项。
- TypeScript 严格模式与别名：`tsconfig.json` 已开启 `strict` 并配置 `@/*` 路径别名（`tsconfig.json:21`）。
- 项目约定：
  - 所有输出与文档使用中文，代码注释使用英文。
  - 不做过度设计，代码简洁易懂、简单实用。
  - 注意圈复杂度，尽可能复用代码。
  - 模块化设计，适用合适的设计模式。
  - 改动尽量最小化，避免影响其他模块。

## 部署建议

- 生产构建：`npm run build` 后使用 `npm run start` 启动。
- 托管平台：可部署到 Vercel（Next.js 官方推荐）。

## 常见问题

- 本项目使用 React 19 与 Next 16，请确保 Node 版本满足 Next 要求。
- 若本地样式未生效，检查 Tailwind 扫描路径与 `globals.css` 是否已引入。
