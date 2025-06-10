# Bitcoin Price Prediction App

リアルタイムでビットコインの価格推移を表示し、統計モデルを使用して今後7日間の価格予測を行うNext.jsアプリケーションです。

![Bitcoin Price Prediction App](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 特徴

### 📊 リアルタイム価格表示
- CoinGecko APIを使用してビットコインの最新価格データを取得
- 過去30日間の価格推移をインタラクティブなチャートで表示
- 現在価格、24時間変動率、予測期間の情報を一目で確認

### 🔮 価格予測機能
- 統計モデルを使用した今後7日間の価格予測
- 過去のデータに基づくランダムウォークモデルとトレンド分析
- 予測値と実際の価格を区別して表示

### 📈 インタラクティブなチャート
- Rechartsライブラリを使用した美しいラインチャート
- 実際の価格と予測価格を異なる色で表示
- ホバーツールチップで詳細な価格情報を表示

### 📱 レスポンシブデザイン
- モバイル、タブレット、デスクトップに最適化
- Tailwind CSSを使用したモダンなUI/UX
- ダークモード対応の色彩設計

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15.3.3 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **チャートライブラリ**: Recharts
- **アイコン**: Lucide React
- **API**: CoinGecko API
- **デプロイ**: Vercel対応

## 📦 インストール

### 前提条件
- Node.js 18以上
- npm または yarn

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/RNMUDS/bitcoin-price-prediction-app.git
cd bitcoin-price-prediction-app
```

2. 依存関係をインストール
```bash
npm install
# または
yarn install
```

3. 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
```

4. ブラウザで http://localhost:3000 を開く

## 🚀 使用方法

### 基本機能
1. **価格チャート**: アプリを開くと自動的に過去30日間のビットコイン価格チャートが表示されます
2. **予測表示**: チャート上でオレンジ色の点が今後7日間の予測価格を示します
3. **詳細情報**: 予測テーブルで日別の予測価格と変動率を確認できます

### インターフェース
- **ヘッダー**: 現在価格、24時間変動、予測期間の概要
- **メインチャート**: 過去30日と今後7日の価格推移
- **予測テーブル**: 日別の詳細な予測データ
- **注意事項**: 予測の限界と投資判断に関する警告

## 📊 API仕様

### CoinGecko API
- **エンドポイント**: `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`
- **パラメータ**:
  - `vs_currency`: USD
  - `days`: 30
  - `interval`: daily

### 予測アルゴリズム
```typescript
// シンプルなランダムウォークモデル
const volatility = 0.03; // 3%の日次ボラティリティ
const trend = 0.001; // 0.1%の日次トレンド
const randomFactor = (Math.random() - 0.5) * volatility;
const predictedPrice = lastPrice * (1 + trend + randomFactor) * Math.pow(1.001, days);
```

## 🏗️ プロジェクト構造

```
bitcoin-price-prediction-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # メインページコンポーネント
│   │   ├── layout.tsx        # アプリケーションレイアウト
│   │   └── globals.css       # グローバルスタイル
├── public/                   # 静的ファイル
├── package.json             # 依存関係とスクリプト
├── tailwind.config.ts       # Tailwind CSS設定
├── tsconfig.json           # TypeScript設定
└── README.md               # プロジェクト説明
```

## 📱 スクリーンショット

### デスクトップ表示
- 大画面での3カラムレイアウト
- 詳細なチャートとテーブル表示

### モバイル表示
- 1カラムのレスポンシブレイアウト
- タッチ操作に最適化されたインターフェース

## ⚠️ 重要な注意事項

### 予測の限界
- この予測は過去のデータに基づく簡単な統計モデルによるものです
- 実際の価格は市場の様々な要因により大きく変動する可能性があります
- **投資判断は慎重に行い、自己責任でお願いします**

### API制限
- CoinGecko APIには利用制限があります
- 過度なリクエストを避けるため、適切な間隔でのアクセスを心がけてください

## 🚀 デプロイ

### Vercelでのデプロイ
1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. 自動デプロイが設定されます

### その他のプラットフォーム
- Netlify
- AWS Amplify
- Docker対応

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順でお願いします：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 お問い合わせ

質問や提案がありましたら、GitHubのIssuesページでお気軽にお知らせください。

---

**免責事項**: このアプリケーションは教育目的で作成されています。投資判断に使用する場合は、必ず複数の情報源を参照し、専門家の助言を求めることをお勧めします。
