<p align="center">
  <h3 align="center">Movie &amp; TV Bookmark</h3>
  <p align="center">
    A front-end skill showcase web-app for searching and saving movie and tv shows :movie_camera:
    <br>
    <br>
    Made with Angular 17, Standalone Components, <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a> and <a href="https://ngrx.io/" target="_blank">NgRx</a>  💻
    <br>
    <br>
    Implementing back-end for authentication and CRUD operations with <a href="https://supabase.com/" target="_blank">Supabase <img src="https://i.imgur.com/o4Qli7e.png" width="25px" eight="25px"></a>
    <br>
    <br>
    Using the <a href="https://developer.themoviedb.org/docs/getting-started" target="_blank">TMDB API</a> with millions of movies, TV shows and people in the database <a href="https://developer.themoviedb.org/docs/getting-started" target="_blank"> <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" width="50px" eight="50px"></a>
    <br>
    <br>
<!--     <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JqY3ZkY2x5YWlrMTlwZnlkcm1tc3d1aHJ4NHlqc2NucHMwc2p2NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xeRzTaod5A2EpbmFTa/giphy.gif" alt="Demo example"/>  -->
    <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDdpMnRiODY3MjNhOTVxamk0aG0yMnoydGphb3ZlNWZsZ2Fhd3RtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vUoOd26zfqgHX7kS33/giphy.gif" alt="Demo example 2"/> 
    <br>
    <br>
    <a href="https://movie-tv-bookmark.netlify.app/">Movie &amp; Bookmark Demo here</a>
  </p>
</p>

## Setup

```bash
npm i
npm start
```

## Status

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=VinciprovaR_movie-tv-bookmark&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=VinciprovaR_movie-tv-bookmark)

## Server

The server is implemented with Supabase, a good alternative to Firebase. Used for JWT based authentication, edge functions (Used as proxy to mask the TMDB API key), RPC functions, email notifications and CRUD operations for storing the bookmark saved by the user.

## What's included

- ✔️ Standalone components
- ✔️ Functional Guards
- ✔️ <a href="https://ngrx.io/" target="_blank">NgRx</a> for state managment
- ✔️ CRUD: create, update and remove from bookmark movies and tv shows
- ✔️ Authentication with JWT tokens (Supabase)
- ✔️ Lazy loading modules
- ✔️ Responsive design with <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>
- ✔️ Use of [NgOptimizedImage](https://angular.io/guide/image-directive)
- ✔️ Use of an external API with <a href="https://developer.themoviedb.org/docs/getting-started" target="_blank">TMDB API</a> 


## Copyright and license

Code and documentation copyright 2023 the authors. Code released under the
[MIT License]().
