# Roses Radio TX

A NextJS application and associated radio streaming scripts for Roses.

## Getting Started

Install dependencies:

```bash
yarn install
```

You will also need the following tools to test streaming:

- liquidsoap
- ffmpeg (useful for testing)

You can start the NextJS development server with

```bash
yarn dev
```

## Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/docs/roses_radio_tx_v1.5_dark.png">
  <img alt="architecture diagram" src="/docs/roses_radio_tx_v1.5.png">
</picture>

[Click here if the image is too small](/docs/roses_radio_tx_v1.5.png)

### Components

#### NextJS app

Implements all the UI, as well as keeping track of HLS chunks and serving playlists.

#### stream-controller

A rust service that handles management of the actual audio-processing services, which are managed as systemd units and mostly written in liquidsoap and bash.

#### Liquidsoap scripts

Handle pulling audio from icecast into JACK, as well as generating HLS chunks and notifying the main NextJS app that they are now available.
