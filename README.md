# <a style="text-align:center" href='https://github.com/pemmed/pem-app'><img src='https://i.imgur.com/4HAEm2D.png' alt='Pem App Logo' aria-label='https://github.com/pemmed/pem-app' /></a>

If you have time to set up badges like these ones please help out!
[![build status](https://img.shields.io/travis/reduxjs/redux/master.svg?style=flat-square)](https://travis-ci.org/reduxjs/redux)
[![redux channel on discord](https://img.shields.io/badge/discord-%23redux%20%40%20reactiflux-61dafb.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bZ6au5t)

## Introduction

Pediatric Emergency Medicine App is designed for healthcare workers such as nurse practitioners, physician assistants, residents in pediatric, emergency medicine and family medicine residency programs, fellows in pediatric emergency medicine, and attending physicians in emergency and urgent care settings that provide acute care to sick and injured children. The app will provide updated medical information quickly and clearly for the common medical emergencies that are seen in emergency departments and urgent care settings.

## Installation
First make sure you have the latest stable version of [Node](https://nodejs.org/en/download/)
### Get Node For Mac
```
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```
### Get Node For Windows
Go [here](https://nodejs.org/en/download/) and choose your corresponding windows version.

### Get Git
Download the correct version [here](https://git-scm.com/)

### Install Expo Globally
Install it
```
npm i -g expo-cli
```
Check if installed
```
expo whoami
```
If response is ```Not Logged In``` you can create one with
```
expo register
```
or login with
```
expo login
```
but this is not required❗️

###  Install Watchman (Optional & Recommended for macOS)
Download and install [here](https://facebook.github.io/watchman/docs/install#buildinstall)

### Clone this repo
To a directory you have admin rights over, for example 
```
mkdir ~/Repos/
cd ~/Repos/
git clone git@github.com:Pem-Med/pem-app.git
cd pem-app/
```
Rename ```firebaseConfig.js.example``` to ```firebaseConfig.js``` and add ***proper credentials*** so you get a valid connection to the backend. *If you don't have an idea of what this is, ask your team mates or product owners about how to get this info.*

### Run it in the browser (Option A)
*This option is still in beta and has a lot of issues, we recommend to use the other two options if possible.*
```
npm install react-native-web react-dom
```
Ensure your project has at least ```expo@^33.0.0``` installed.

Start your project with ```expo start``` then press ```w``` to start Webpack and open the project in the browser.

For more details, see Expo's [Running in the Browser](https://docs.expo.io/guides/running-in-the-browser/) Guide.


### Run it on your Android or iOS Device (Option B)

Download expo client apps from an iOS or an Android Device<br>

[App Store (iOS)](https://itunes.com/apps/exponent)

[Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Running it on your computer (Option C)
**(Only macOS)** Follow [this Expo guide](https://docs.expo.io/workflow/ios-simulator/) for using the XCode Simulator

Follow [this Expo guide](https://docs.expo.io/workflow/android-studio-emulator/) for using the Android Studio Emulator

### Starting up the server
Navigate to your project's root directory *(where the package.json is)* and run
```
npm start
```
*(Expo CLI starts Metro Bundler, which is an HTTP server that compiles the JavaScript code of our app using Babel and serves it to the Expo app. It also pops up Expo Dev Tools, a graphical interface for Expo CLI.)*

🍎 On your iPhone or iPad, open the default Apple "Camera" app and scan the QR code you see in the terminal or in Expo Dev Tools."<br>
🤖 On your Android device, press "Scan QR Code" on the "Projects" tab of the Expo client app and scan the QR code you see in the terminal or in Expo Dev Tools.

## Documentation

This app docs are still in progress so feel free to add your PR to make it better!
- To enhance it you can use GitHub's [markdown cheat sheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf).

## Stack Used
 - [React Native](https://reactnative.dev/)
 - [Expo](https://expo.io/)
 - [Redux](https://redux.js.org/)
 - [Firebase](https://firebase.google.com/?gclid=EAIaIQobChMIpOTE0LnG6wIVqwiICR26Jg51EAAYASAAEgLgFvD_BwE)

## Essential Tutorials
### React-Native 

React Native is like React, but it uses native components instead of web components as building blocks. So to understand the basic structure of a React Native app, you need to understand some of the basic React concepts, like JSX, components, state, and props. If you already know React, you still need to learn some React-Native-specific stuff, like the native components. This tutorial is aimed at all audiences, whether you have React experience or not. [Click Here](https://reactnative.dev/docs/tutorial)

### Expo

In this tutorial we are going to build an app for iOS, Android, and web that allows you to share photos with your friends! Of course there are already plenty of apps that let you share photos from your phone, you just can't do it with your own app. Let's remedy that. [Click Here](https://docs.expo.io/tutorial/planning)

### Redux

The Redux Essentials tutorial is a "top-down" tutorial that teaches how to use Redux the right way, using our latest recommended APIs and best practices. We recommend starting there. [Click Here](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

### Firebase

This tutorial is slightly outdated but it is a really nice guide if you want to get a good idea about how firebase works. [Click Here](https://youtu.be/9kRgVxULbag)


## Logo

You can find the official logos [on our Imgur Album](https://imgur.com/a/OklaLas).

## License

[MIT](LICENSE.md)

