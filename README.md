# デジタル名刺アプリ

オンラインで名刺を共有・登録できる eb アプリケーションです。ユーザーはスキルや SNS 情報を登録し、URL を通じて自身のプロフィールを他者に簡単に共有できます。

# 主な機能

- ユーザー登録（ID、名前、自己紹介、スキル、GitHub/Qiita/X のリンク）
- 名刺ページの自動生成（共有用 URL あり）
- 名刺の ID 検索

# 使用技術

- 言語：TypeScript
- フロントエンド: React + Vite + Chakra UI(v2)
- データベース: Supabase
- テスト： Jest×Testing Library
- その他： GitHub Actions（CI/CD 自動化）

## セットアップ

### 1. 環境変数の設定

```
git clone https://github.com/higa1234/digital-business-card.git
cd digital-business-card
```

### 2. プロジェクトルートに `.env` ファイルを作成し、以下を記述

```.env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. 開発環境の起動

```bash
npm install
npm run dev
```

## テスト(Jest×Testing Library)

```bash
npm run test
```

## バージョン

- npm ：9.6.4
- node：v20.0.0

## 更新日

2025/06/02
