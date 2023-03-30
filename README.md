<div align="center">
  <a href="https://github.com/gangjun06/ideaslab">
    <img width="100" src="assets/icon.png" alt="">
  </a>
  <h3>아이디어스 랩</h3>
</div>

<h4 align="center">
  <a href="https://discord.gg/XepQjgpbum">디스코드</a> |
  <a href="https://www.craft.do/s/k1Hc9FX9indB84">문서</a> |
  <a href="https://ideaslab.kr">웹사이트</a>
</h4>

<details>
  <summary>목차</summary>
  <ol>
    <li>
      <a href="#-프로젝트-소개">📖 프로젝트 소개</a>
      <ul>
        <li><a href="#전체-기능">전체 기능</a></li>
      </ul>
    </li>
    <li>
      <a href="#-시작하기">🚀 시작하기</a>
      <ul>
        <li><a href="#개발서버">개발서버</a></li>
        <li><a href="#빌드">빌드</a></li>
      </ul>
    </li>
    <li>
      <a href="#-프로젝트-구성">📦 프로젝트 구성</a>
      <ul>
        <li><a href="#사용된-기술">사용된 기술</a></li>
        <li><a href="#폴더-구조">폴더 구조</a></li>
      </ul>
    </li>
    <li>
      <a href="#-기여">🌱 기여</a>
    </li>
    <li>
      <a href="#-라이선스">📝 라이선스</a>
    </li>
  </ol>
</details>

## 📖 프로젝트 소개

아이디어스 랩은 10여가지 다양한 분야의 창작자들이 모여 작업, 아이디어 논의, 프로젝트 진행 등을 할 수 있는 커뮤니티성 친목 서버입니다.

본 프로젝트는 디스코드 서버의 활동을 더욱 풍성하게 만들기 위해 개발된 프로젝트입니다.

웹사이트/봇 등을 통해 서버 내부의 정보를 제공하고, 서버 내부의 활동을 웹사이트에서도 확인할 수 있습니다.

### 전체 기능

#### 웹

- 아이디어스 랩 소개 웹페이지
- 회원가입 설문지
- 디스코드 - 웹사이트 연동
- 갤러리 및 사용자 프로필 웹페이지

#### 봇

- 웹으로의 데이터 제공
- 음성채널 관리
- 사용자의 활동 기록
- 건의함 (티켓기능)

## 🚀 시작하기

[아이디어스 랩 디스코드](https://discord.gg/XepQjgpbum)에 가입하셔서 바로 사용하실 수 있습니다.

### 개발서버

<details>
  <summary>데이터베이스 설정</summary>
  Postgresql과 함께 시간대별 기록을 효율적으로 하기 위해 Timescale DB를 사용합니다. <br/> 
  서버를 세팅하기 전, 먼저 서버에 먼저 설치해주세요.
  <a href="https://docs.timescale.com/">https://docs.timescale.com</a>
</details>

```bash
# 먼저 각 폴더의 .env를 수정해주세요.

# Install dependencies
yarn install

# Start dev server (http://localhost:8000)
docker-compose -f docker-compose.dev.yml up -d --build --force-recreate

# Show Logs
docker-compose -f docker-compose.dev.yml logs -f <main | nginx>

# Stop dev server
docker-compose -f docker-compose.dev.yml down
```

### 빌드

```bash
# Build server with docker
docker build . -f ./Dockerfile.server -t <tag_name>

# Build server with turbo
turbo run build --filter=server

# Build web with turbo
turbo run build --filter=web
```

## 📦 프로젝트 구성

### 사용된 기술

#### 공통

Turbopack, zod, redis

#### 웹

Next.js, Tailwind css, react-hook-form, trpc (react-query), jotai

#### 백엔드 & 봇

Trpc, Discord.js, Prisma, esbuild

### 폴더 구조

> 💡 자세한 구조는 각 폴더별 README를 참고하세요

```
apps/ # 프로젝트의 앱들
  - web/ # 웹
  - server/ # 백엔드 & 봇

packages/ # apps에서 사용하는 패키지들
  - db/ # Prisma DB
  - eslint-config/ # eslint 설정
  - tsconfig/ # TS 설정
  - validator/ # zod 스키마
```

## 🌱 기여

기여, 이슈 및 기능요청은 언제나 환영입니다!

자유롭게 [이슈](https://github.com/gangjun06/ideaslab/issues) 페이지를 살펴보고 [풀 리퀘스트](https://github.com/gangjun06/ideaslab/pulls)를 보내주세요.

## 📝 라이선스

본 프로젝트는 AGPL 라이선스를 따르고 있습니다.

자세한 내용은 [LICENSE](./LICENSE) 를 참고하세요.

### 사용/참고한 리소스 및 라이브러리

- UI 디자인
  - [Flowbite](https://flowbite.com">)
  - [MambaUI](https://mambaui.com")
  - [TailwindUI](https://tailwindui.com)
- 서버
  - [Discord.JS 템플릿](https://github.com/filename24/djs-template)
