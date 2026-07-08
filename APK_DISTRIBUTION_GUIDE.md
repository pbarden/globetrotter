# APK Direct Distribution Guide

This guide covers how to distribute your Android app via APK (without Google Play Store).

## Understanding APK vs AAB

- **APK (Android Package)** - Can be installed directly on devices (sideloading). Use this for direct distribution.
- **AAB (Android App Bundle)** - Can ONLY be used with Google Play Store. Cannot be installed directly.

**For distribution outside Play Store, you MUST use APK files.**

---

## Your Signed APK Location

Your signed release APK is located at:
```
C:\Users\paulb\globetrotter\app-release.apk
```

Also available at the original build location:
```
C:\Users\paulb\globetrotter\android\app\build\outputs\apk\release\app-release.apk
```

**File size:** 264 MB
**Status:** ✅ Verified and properly signed

---

## Distribution Methods

### Method 1: Direct Download (Web Hosting)

1. **Upload APK to your web server/hosting**
   - Upload `app-release.apk` to your website
   - Example: `https://yoursite.com/downloads/app-release.apk`

2. **Share the download link**
   - Users download the APK file from the link

3. **Installation instructions for users:**
   - Download the APK file
   - Open Settings → Security → Enable "Install from Unknown Sources" (varies by device)
   - Open the downloaded APK file
   - Tap "Install"

### Method 2: Email Distribution

1. Attach `app-release.apk` to an email
2. Send to users
3. Users download and install (same security settings needed)

**Note:** Some email providers block APK attachments. Consider using cloud storage links instead.

### Method 3: Cloud Storage (Recommended)

1. **Upload to cloud storage:**
   - Google Drive
   - Dropbox
   - OneDrive
   - AWS S3
   - Any file hosting service

2. **Generate shareable link**

3. **Share link with users**

4. **Pros:**
   - No file size limits in emails
   - Easy to update (replace file, keep same link)
   - Track downloads (some services)

### Method 4: Enterprise Distribution Platforms

For larger organizations:
- **AppCenter** (Microsoft)
- **Firebase App Distribution** (Google)
- **TestFlight alternative for Android** (AWS Device Farm, etc.)
- **MDM (Mobile Device Management)** solutions

---

## User Installation Instructions

Share these instructions with your users:

### For Most Android Devices:

1. **Download the APK file** from the provided link
2. **Enable Unknown Sources:**
   - Go to **Settings** → **Security** (or **Privacy**)
   - Enable **"Install Unknown Apps"** or **"Unknown Sources"**
   - Select your browser/file manager and allow it to install apps
3. **Locate the downloaded APK:**
   - Usually in **Downloads** folder
   - Or tap the notification after download completes
4. **Tap the APK file**
5. **Tap "Install"**
6. **Tap "Open"** to launch the app

### For Samsung Devices:

1. Download the APK
2. Go to **Settings** → **Biometrics and security** → **Install unknown apps**
3. Select the app you're using to install (e.g., Chrome, Files)
4. Toggle **"Allow from this source"**
5. Install the APK

### For Android 12+ Devices:

1. Download the APK
2. When you tap the APK, you'll see a prompt
3. Tap **Settings** → Allow installation from the specific app
4. Return and complete installation

---

## Important Security Notes

### For You (Developer):

- ✅ Your APK is signed with your keystore
- ✅ All future updates MUST be signed with the same keystore
- ✅ Users will see "Unknown source" warnings (this is normal for non-Play Store apps)
- ⚠️ Keep your keystore and passwords backed up securely

### For Your Users:

- Assure users that the "Unknown sources" warning is normal for apps not from the Play Store
- Make sure they download from YOUR official link only
- Consider using HTTPS for download links to prevent tampering

---

## Updating Your App

When you release updates:

1. **Update version in build.gradle:**
   ```gradle
   defaultConfig {
       versionCode 2        // Increment this (was 1)
       versionName "1.1"    // Update user-facing version
   }
   ```

2. **Build new APK:**
   ```bash
   npm run build
   npx cap sync android
   export JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
   cd android
   ./gradlew assembleRelease
   ```

3. **Distribute new APK** using same method

4. **Users install new version** - Android will recognize it as an update (must be signed with same keystore)

---

## Verification for Users

Users can verify the app is from you by checking:

1. **Package name:** `com.moonmandigital.radiofreemoon`
2. **Version:** Check in Settings → Apps → Your App

Consider publishing the SHA-256 fingerprint on your website so users can verify authenticity.

### Get your app's SHA-256 fingerprint:

```bash
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore android/app/release-key.keystore -alias my-key-alias
```

---

## Distribution Checklist

Before distributing:

- [ ] APK is signed and verified
- [ ] Version number is correct in build.gradle
- [ ] App has been tested on at least one device
- [ ] Installation instructions prepared for users
- [ ] Download link or hosting is ready
- [ ] Users know to enable "Unknown Sources"
- [ ] You have backup of keystore and passwords

---

## Quick Commands Reference

### Build new signed APK:
```bash
npm run build
npx cap sync android
export JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
cd android
./gradlew assembleRelease
```

### Copy APK to project root:
```bash
cp android/app/build/outputs/apk/release/app-release.apk ./app-release.apk
```

### Verify APK signature:
```bash
"C:\Program Files\Android\Android Studio\jbr\bin\jarsigner.exe" -verify android/app/build/outputs/apk/release/app-release.apk
```

---

## Common Issues

### "App not installed" error
- User may have an existing version with different signature
- Solution: Uninstall old version first

### "For security reasons, your phone is not allowed to install..."
- Unknown sources not enabled
- Solution: Follow "Enable Unknown Sources" instructions above

### App installs but crashes immediately
- Check that the APK was built for release (not debug)
- Verify `npm run build` and `npx cap sync android` were run before building APK

---

## Alternative: Private Distribution via Play Store

If you want better distribution but still want to control access:

1. **Internal Testing Track** - Up to 100 testers
2. **Closed Testing Track** - Invite-only with email list
3. **Open Testing** - Anyone with link can join

These still use Play Store infrastructure but give you more control over who can access the app.

---

## Legal Considerations

- Ensure you have rights to distribute all content in your app
- Include a privacy policy if collecting user data
- Comply with relevant regulations (GDPR, CCPA, etc.)
- Consider terms of service for your app

---

## Support

When users have installation issues:
1. Verify they've enabled "Unknown Sources"
2. Confirm they're downloading from your official link
3. Check their Android version compatibility
4. Have them try in Safe Mode if device has restrictions
