<<<<<<< HEAD
![Base](logo.webp)

# Base Demo Applications

A repository of demo applications that utilize Base and Coinbase Developer Platform products.

<!-- Badge row 1 - status -->

[![GitHub contributors](https://img.shields.io/github/contributors/base/demos)](https://github.com/base/demos/graphs/contributors)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/w/base/demos)](https://github.com/base/demos/graphs/contributors)
[![GitHub Stars](https://img.shields.io/github/stars/base/demos.svg)](https://github.com/base/demos/stargazers)
![GitHub repo size](https://img.shields.io/github/repo-size/base/demos)
[![GitHub](https://img.shields.io/github/license/base/demos?color=blue)](https://github.com/base/demos/blob/master/LICENSE.md)

<!-- Badge row 2 - links and profiles -->

[![Website base.org](https://img.shields.io/website-up-down-green-red/https/base.org.svg)](https://base.org)
[![Blog](https://img.shields.io/badge/blog-up-green)](https://base.mirror.xyz/)
[![Docs](https://img.shields.io/badge/docs-up-green)](https://docs.base.org/)
[![Discord](https://img.shields.io/discord/1067165013397213286?label=discord)](https://base.org/discord)
[![Twitter Base](https://img.shields.io/twitter/follow/Base?style=social)](https://twitter.com/Base)

<!-- Badge row 3 - detailed status -->

[![GitHub pull requests by-label](https://img.shields.io/github/issues-pr-raw/base/demos)](https://github.com/base/demos/pulls)
[![GitHub Issues](https://img.shields.io/github/issues-raw/base/demos.svg)](https://github.com/base/demos/issues)

## Overview

This repository contains example applications demonstrating various [Base] and [Coinbase Developer Platform] features. Each demo is designed to be simple, educational, and ready to run.

## Available Demos

| Demo Name | Type | Location | Description |
|-----------|------|----------|-------------|
| **Agent Spend Permissions** | Base Account | `base-account/agent-spend-permissions/` | AI-powered Zora coin purchasing with Base Account spend permissions and gas-free transactions |
| **Base Pay Amazon** | Base Account | `base-account/base-pay-amazon/` | Chrome extension and checkout app that adds Base Pay to Amazon product pages |
| **Base App Coins** | Base Account | `base-app-coins/` | Index and load metadata for Uniswap v4 pools related to coins created via the Base App |
| **Hangman Onchain** | Paymaster | `paymaster/hangman-onchain/` | Classic hangman game with onchain win recording using Coinbase CDP |
| **Lingos Game** | Paymaster | `paymaster/onchain-game-lingos/` | Phrase completion game testing knowledge of international phrases and expressions |
| **Full Mini App Demo** | MiniKit | `minikit/mini-app-full-demo/` | Comprehensive Base Mini App demo showcasing all functionality in Base App |
| **Mini App Route** | MiniKit | `minikit/mini-app-route/` | Basic Next.js mini app template with routing examples |
| **Mini App Wrapped** | MiniKit | `minikit/mini-app-wrapped/` | Simple Next.js mini app with MiniKit provider wrapper |
| **Mini Neynar** | MiniKit | `minikit/mini-neynar/` | MiniKit template with Neynar API integration for Farcaster data |
| **Mini Zora** | MiniKit | `minikit/my-mini-zora/` | MiniKit template integrated with Zora protocol for NFT interactions |
| **Simple Mini App** | MiniKit | `minikit/my-simple-mini-app/` | Basic MiniKit template with essential features and notifications |
| **Three Card Monte** | MiniKit | `minikit/three-card-monte/` | Interactive card game mini app with onchain rewards and leaderboard |

## Getting Started

1. Clone this repository
2. Navigate to the specific demo directory you want to explore
3. Follow the README instructions in each demo directory

## Requirements

- Node.js (v16 or higher)
- npm or yarn
- A Base-compatible wallet (like Coinbase Wallet)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms of the included LICENSE file.

---

[Coinbase Developer Platform]: https://portal.cdp.coinbase.com
[Base]: https://base.org
=======
This is a [Vite](https://vitejs.dev) project bootstrapped with [`@farcaster/create-mini-app`](https://github.com/farcasterxyz/miniapps/tree/main/packages/create-mini-app).

For documentation and guides, visit [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz/docs/getting-started).

## `farcaster.json`

The `/.well-known/farcaster.json` is served from the [public
directory](https://vite.dev/guide/assets) and can be updated by editing
`./public/.well-known/farcaster.json`.

You can also use the `public` directory to serve a static image for `splashBackgroundImageUrl`.

## Frame Embed

Add a the `fc:frame` in `index.html` to make your root app URL sharable in feeds:

```html
  <head>
    <!--- other tags --->
    <meta name="fc:frame" content='{"version":"next","imageUrl":"https://placehold.co/900x600.png?text=Frame%20Image","button":{"title":"Open","action":{"type":"launch_frame","name":"App Name","url":"https://app.com"}}}' /> 
  </head>
```

>>>>>>> affae881667df7b18d5e21bab61b3392e27f69f2
