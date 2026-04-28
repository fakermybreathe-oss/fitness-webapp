# 智能健身训练系统

基于 **React + TypeScript + Vite** 构建的现代化智能健身训练 Web 应用，由 DeepSeek AI 驱动科学训练方案。

## 功能特性

- **智能仪表盘** — 训练概览、身体数据追踪、AI 智能器材推荐
- **器材库百科** — 分类浏览训练器材（力量/有氧/柔韧性），含详细使用指南和教练建议
- **科学训练计划** — 根据身体数据和目标生成的个性化训练方案
- **每日打卡** — 训练记录与进度追踪
- **进度可视化** — 基于 Recharts 的图表化训练数据分析

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.7 |
| 构建工具 | Vite 6 |
| 路由 | React Router v7 |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 图表 | Recharts |
| 测试 | Vitest (单元测试) + Playwright (E2E 测试) |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test          # 单元测试
npm run test:e2e  # E2E 测试
```

## 项目结构

```
src/
├── components/     # 通用组件
├── hooks/          # 自定义 Hooks
├── pages/          # 页面组件
│   ├── Dashboard   # 仪表盘
│   ├── Equipment   # 器材库
│   ├── Plan        # 训练计划
│   ├── Progress    # 进度追踪
│   ├── CheckIn     # 每日打卡
│   └── Settings    # 设置
├── data/           # 数据文件
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
└── styles/         # 全局样式
```

## 测试覆盖

- 单元测试：109+ 项（Vitest）
- E2E 测试：21 项（Playwright，涵盖器材库搜索、筛选、详情等核心流程）
