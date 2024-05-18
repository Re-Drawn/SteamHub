<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!--[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]-->
[![Stargazers][stars-shield]][stars-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Re-Drawn/SteamHub">
    <img src="https://i.postimg.cc/KvkV4zQB/steamhub-logo.png" alt="Logo">
  </a>

  <p align="center">
    A Discord Bot for Steam Statistics.
    <br />
    <a href="https://github.com/Re-Drawn/SteamHub"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Re-Drawn/SteamHub">View Demo</a>
    ·
    <a href="https://github.com/Re-Drawn/SteamHub/issues">Report Bug</a>
    ·
    <a href="https://github.com/Re-Drawn/SteamHub/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<!--<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
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
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>-->



<!-- ABOUT THE PROJECT -->
## About The Project

SteamHub is a ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=flat&logo=discord&logoColor=white) bot used to get information and statistics from the gaming platform ![Steam](https://img.shields.io/badge/steam-%23000000.svg?style=flat&logo=steam&logoColor=white)

### Invite

Use the following link to invite SteamHub to your discord community! (coming soon)

### Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Commands

### /game
<p align="center">
  <img src="https://i.postimg.cc/4xKv4KGc/game-command.png">
</p>
/game queries the Steam database for any search term given and gives you information on the top result!
Information includes:
<ul>
  <li>Price</li>
  <li>Description</li>
  <li>Genres</li>
  <li>Ratings (from MetaCritic)</li>
  <li>Current Player Count</li>
  <li>Release Date</li>
  <li>Trailers</li>
</ul>
If the current result isn't what you're looking for, hitting the "Wrong Game?" button will bring up other choices for you to choose from.
<p align="center">
  <img src="https://i.postimg.cc/90KS8Djj/game-command-wronggame.png">
</p>

<hr>

### /reviews
<p align="center">
  <img src="https://i.postimg.cc/nrFX0rcL/reviews-command.png">
</p>
/reviews gives 10 user reviews from the game of your choice. These reviews will help give you a general understanding of the public's opinion of a title!
Information includes:
<ul>
  <li>Reviewer's Steam Profile</li>
  <li>Reviewer's Rating</li>
  <li>The Review</li>
  <li>Hours Played</li>
  <li>Community Helpful Votes</li>
  <li>Community Funny Votes</li>
  <li>Date of Review Publication</li>
</ul>

<hr>

### /gamenews
<p align="center">
  <img src="https://i.postimg.cc/q791Wf9n/gamenews-command.png">
</p>
/gamenews gives the latest news/updates of a game.

<hr>

### /topplayercount
<p align="center">
  <img src="https://i.postimg.cc/Sxwy1RNG/topplayercount-command.png">
</p>
/topplayercount lists the top 100 games by the current amount of players on.

<hr>

### /userstats
<p align="center">
  <img src="https://i.postimg.cc/5t2htdgT/userstats-command.png">
</p>
/userstats queries user Steam profiles
Information includes:
<ul>
  <li>Steam ID</li>
  <li>Vanity URL (if one is set)</li>
  <li>Steam Level</li>
  <li>Account Age</li>
  <li>Top 10 Most Game Hours</li>
  <li>Amount of Games Owned</li>
  <li>Percentage of Owned Games Played</li>
  <li>Library Value (at full price and on sale)</li>
  <li>Total Account Playtime</li>
</ul>

<!-- GETTING STARTED -->
<!--## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/Re-Drawn/SteamHub.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>-->



<!-- ROADMAP -->
## In Progress

- [ ] Language Support
    - [ ] Integrate Steam Web API's language support
- [ ] Server specific settings that can be set by server admins
    - [ ] Output channel
    - [ ] Default language
    - [ ] Server leaderboards

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Re-Drawn/SteamHub.svg?style=for-the-badge
[contributors-url]: https://github.com/Re-Drawn/SteamHub/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Re-Drawn/SteamHub.svg?style=for-the-badge
[forks-url]: https://github.com/Re-Drawn/SteamHub/network/members
[stars-shield]: https://img.shields.io/github/stars/Re-Drawn/SteamHub.svg?style=for-the-badge
[stars-url]: https://github.com/Re-Drawn/SteamHub/stargazers
[issues-shield]: https://img.shields.io/github/issues/Re-Drawn/SteamHub.svg?style=for-the-badge
[issues-url]: https://github.com/Re-Drawn/SteamHub/issues
[license-shield]: https://img.shields.io/github/license/Re-Drawn/SteamHub.svg?style=for-the-badge
[license-url]: https://github.com/Re-Drawn/SteamHub/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
