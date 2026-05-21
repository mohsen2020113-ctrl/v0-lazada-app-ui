# Build Instructions for 4leee Mobile App

## Prerequisites
- Node.js 18+
- Android Studio (for Android)
- Xcode 15+ on Mac (for iOS)

## Setup
```bash
cd mobile-app
npm install
npm run build
npx cap sync
```

## Android Build
```bash
npx cap open android
```
Then in Android Studio:
1. Build → Generate Signed Bundle/APK
2. Choose Android App Bundle (.aab)
3. Create/use keystore
4. Upload to Google Play Console

## iOS Build (Mac only)
```bash
npx cap open ios
```
Then in Xcode:
1. Select your Team (Apple Developer account)
2. Product → Archive
3. Distribute App → App Store Connect

## App Details
- App ID: com.leee.app
- App Name: 4leee
- Domain: app.4leee.com
- Version: 1.0.0