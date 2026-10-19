# 真途导航 / Zhenvia Nav（nav.zhenvia.com）

通用导航站点：Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS，部署在 **Vercel**（`sin1`），申请收录队列使用 **Neon Postgres**。

基于 [site-nav](../site-nav) 骨架改造；与 [mysite-nuxt](../mysite-nuxt) 一样走 Vercel 直连 DNS（不要套 Cloudflare 橙云代理）。

## 技术栈

- Nuxt 3 / Vue 3 / TypeScript / Tailwind CSS
- Nitro（Vercel）
- Neon Postgres（`@neondatabase/serverless`）
- 申请收录 + 简易管理后台（签名 Cookie）

## 目录结构

```text
.
├── assets/css/
├── components/
├── composables/
├── data/                  # navigation.json 等
├── layouts/
├── migrations/            # Postgres SQL
├── pages/                 # 含 /apply、/admin
├── public/
├── scripts/               # db:migrate、icons:fetch
├── server/
│   ├── api/
│   ├── routes/            # sitemap.xml / robots.txt
│   └── utils/
├── types/
├── utils/
├── nuxt.config.ts
├── vercel.json            # regions: sin1
└── README.md
```

## 环境要求

- Node.js `>= 20`（仓库 `.nvmrc` 可继续用 24.x）

```bash
nvm use
```

## 安装与本地运行

```bash
npm install
cp .env.example .env
# 填入 Neon DATABASE_URL（或 NUXT_DATABASE_URL）以及管理后台密钥
npm run db:migrate
npm run dev
```

浏览器访问：http://localhost:3000

- 申请收录：http://localhost:3000/apply
- 管理后台：http://localhost:3000/admin

## 部署到 Vercel

### 1. 连接仓库

1. 推送到 GitHub / GitLab / Bitbucket  
2. 在 [Vercel](https://vercel.com) 导入该仓库  
3. Framework Preset 选 **Nuxt.js**（沿用 `vercel.json`）  
4. Functions Region：`vercel.json` 已指定 `sin1`  
5. 配置环境变量（见下）并部署  

本地也可：

```bash
nvm use
npx vercel
```

### 2. Neon 数据库

1. 在 [Neon](https://neon.tech) 创建项目，或用 Vercel Marketplace 安装 Neon 集成  
2. 将 `DATABASE_URL`（或 `NUXT_DATABASE_URL`）写入 Vercel 环境变量  
3. 首次部署前在本地或 CI 执行一次：

```bash
DATABASE_URL='postgresql://...' npm run db:migrate
```

也可把 `migrations/001_submissions.sql` 粘贴到 Neon SQL Editor 执行。

### 3. 环境变量

| 变量 | 说明 |
| ---- | ---- |
| `NUXT_PUBLIC_SITE_URL` | 站点 origin，生产为 `https://nav.zhenvia.com` |
| `DATABASE_URL` 或 `NUXT_DATABASE_URL` | Neon 连接串 |
| `NUXT_ADMIN_PASSWORD` | 管理后台登录密码 |
| `NUXT_ADMIN_SESSION_SECRET` | 签名 cookie 用密钥（长随机串） |

### 4. 绑定域名 `nav.zhenvia.com`

与 zhenvia.com 相同：**DNS 直接指到 Vercel，不要走 Cloudflare 代理**。

1. Vercel 项目 → Settings → Domains → 添加 `nav.zhenvia.com`  
2. 按提示在 DNS 添加 CNAME / A 记录  
3. 确认解析不是 Cloudflare 的 `104.21.*` / `172.67.*`  

验证：

```bash
curl -sI https://nav.zhenvia.com/ | egrep -i 'server|x-vercel|age|cache'
```

期望类似：`server: Vercel`、`x-vercel-id: sin1::...`（或邻近 POP）。

## 申请收录流程

1. 用户在 `/apply` 提交 → 写入 Neon（`pending`）  
2. 管理员在 `/admin` 审核（通过 / 拒绝）  
3. 通过后仍需把站点写入 `data/navigation.json` 并部署（正式收录源仍是 Git）

## 自定义内容

1. 站点名称与文案：`utils/site.ts`  
2. 导航分类与链接：`data/navigation.json`  
3. 分组展示：`utils/navigation.ts` 中的 `navigationGroups`
