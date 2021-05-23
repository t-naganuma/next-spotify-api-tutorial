# SpotifyのAPIを叩くサンプル

## リポジトリをクローン
任意のディレクトリで下記のコマンドを実行
```
$ git clone https://github.com/X-HACK/next-spotify-api-tutorial.git
$ cd next-spotify-api-tutorial
```

## 環境変数を設定
### ファイル作成
```
# env.localファイルを作成
$ cp .env.local.example .env.local
```
### spotifyのAPI KEYをセット
API の取得は[https://developer.spotify.com/](https://developer.spotify.com/)
env.localに`CLIENT_ID`と`CLIENT_SECRET`を設定してください。

## パッケージ追加
npm or yarn で パッケージを追加してください。
```
$ npm install
# or
$ yarn
```

# 起動
以下コマンドを実行した後、 http://localhost:3000 にアクセスしてください。
```
$ npm run dev
# or
$ yarn
```

# 使い方
`auth`をクリックすると認証画面に遷移します。内容を読み良ければ同意ボタンを押してください。
`get access token`をクリックするとアクセストークンを取得します。
`refresh access token`をクリックするとアクセストークンを更新します。トークンの期限が切れた時にご使用ください。
`get profile`をクリックすると自分のspotifyでの表示名を取得し表示します。

# More info
以下Next.jsのReadme

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
