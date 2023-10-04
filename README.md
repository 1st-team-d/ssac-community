<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="static/images/ssac-community.gif">
    <img src="static/images/ssac-community.gif" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">새싹 스터디 커뮤니티</h3>

  <p align="center">
    새싹 스터디 커뮤니티 프로젝트입니다!
    <br />
    <a href="http://118.67.134.217:8080/"><strong>사이트 이동 »</strong></a>
    <br />
    <br />
    <a href="static/videos/ssac-community.mp4">View Demo</a>
    ·
    <a href="https://github.com/1st-team-d/ssac-community/issues">Report Bug</a>
    ·
    <a href="https://github.com/1st-team-d/ssac-community/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>목차</summary>
  <ol>
    <li>
      <a href="#기획-의도">기획 의도</a>
    </li>
    <li>
      <a href="#기획-과정">기획 과정</a>
      <ul>
        <li><a href="#메인">메인</a></li>
        <li><a href="#헤더">헤더</a></li>
        <li><a href="#로그인-/-회원가입">로그인 / 회원가입</a></li>
        <li><a href="#스터디-모집글">스터디 모집글</a></li>
        <li><a href="#스터디-관리-페이지">스터디 관리 페이지</a></li>
      </ul>
      <ul>
        <li><a href="#사용한-기술">사용한 기술</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 기획 의도

### 새싹에서 제공하는 러닝 메이트 서비스에 참여하기 위한 팀을 모집하는 과정에서, 해당 코스에 한정된 인원으로만 팀을 구성하는 한계점을 극복하고자 프로젝트를 기획하였습니다. 새싹 과정을 수강하고 있는 모든 분들을 대상으로, 자유롭게 스터디 모집 글을 올리고, 스터디 진행 상황을 확인하여 효율적인 러닝 메이트를 운영할 수 있게 하는 웹사이트를 목표로 제작하였습니다.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 기획 과정

### 메인

> 🌱 　**최대한 간단한 화면 구성을 목표**
>
> - 스터디 모집에 가장 큰 중점을 두어 다른 기능은 최소화하고 글 작성 기능만 추가
> - 이 외에 로그인 / 회원가입 모달창으로 바로 이동할 수 있게 구현

### 헤더

> 🌱 　**모든 페이지에서 사용되는 공통적인 부분**
>
> - 비로그인 시 로그인 모달창으로 이동할 수 있는 버튼이 나오게
> - 로그인 시 내 프로필, 로그아웃 버튼으로 구현

### 로그인 / 회원가입

> 🌱 　**모달창을 활용**
>
> - 페이지 이동 없이 해당 페이지 내에서 로그인 / 회원가입을 처리하기로 함
> - 회원가입 시 닉네임, 이메일, 비밀번호로 유저 식별
> - 프론트 / 백 모두 유효성 검사를 실시하여 최대한 에러 방지

### 스터디 모집글

> 🌱 　**CRUD 기반 모집글 구현**
>
> - 스터디 모집글은 최대한 게시판 형식으로 보이지 않게끔
> - 특정 스터디 모집글에 들어갔을 때 모집 내용에 대한 정보와 댓글로 의사소통을 할 수 있게
> - 첨부파일이 있다면 클릭해서 확인할 수 있도록

### 스터디 관리 페이지

> 🌱 　**효율적인 스터디 모집 진행 상태 파악을 목표**
>
> - 내가 모집글을 작성한 스터디와 내가 참여한 스터디로 구분
> - 최대인원, 모집중 / 모집 마감, 스터디 제목 표시

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 사용한 기술

- [![Node][Node.js]][Node-url]
- [![Express][Express]][Express-url]
- [![Sequelize][Sequelize]][Sequelize-url]
- [![MySQL][MySQL]][MySQL-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
  - [ ] Chinese
  - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
- [Malven's Grid Cheatsheet](https://grid.malven.co/)
- [Img Shields](https://shields.io)
- [GitHub Pages](https://pages.github.com)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/1st-team-d/ssac-community.svg?style=for-the-badge
[contributors-url]: https://github.com/1st-team-d/ssac-community/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/1st-team-d/ssac-community.svg?style=for-the-badge
[forks-url]: https://github.com/1st-team-d/ssac-community/network/members
[stars-shield]: https://img.shields.io/github/stars/1st-team-d/ssac-community.svg?style=for-the-badge
[stars-url]: https://github.com/1st-team-d/ssac-community/stargazers
[issues-shield]: https://img.shields.io/github/issues/1st-team-d/ssac-community.svg?style=for-the-badge
[issues-url]: https://github.com/1st-team-d/ssac-community/issues
[product-screenshot]: images/screenshot.png
[Node.js]: https://img.shields.io/badge/node.js-3c873a?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express]: https://img.shields.io/badge/Express-ffffff?style=for-the-badge&logo=Express&logoColor=000000
[Express-url]: https://expressjs.com/
[Sequelize]: https://img.shields.io/badge/Sequelize-000000?style=for-the-badge&logo=Sequelize&logoColor=52b0e7
[Sequelize-url]: https://sequelize.org/
[MySQL]: https://img.shields.io/badge/MySQL-5d87a2?style=for-the-badge&logo=MySQL&logoColor=f49823
[MySQL-url]: https://www.mysql.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
