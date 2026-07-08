# Android Signed App Bundle (AAB) Generation Guide

This guide will walk you through the complete process of generating a signed Android App Bundle for your Capacitor app.

## Prerequisites

- Java JDK installed (you need keytool command)
- Android Studio or Gradle installed
- Your Capacitor app built and synced

## Step 1: Generate a Keystore File

A keystore is required to sign your app. You only need to do this once.

### Generate Keystore Command:

```bash
keytool -genkey -v -keystore release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### You will be prompted for:

1. **Keystore password** - Choose a strong password and SAVE IT SECURELY
2. **Key password** - Can be the same as keystore password
3. **First and last name** - Your name or company name
4. **Organizational unit** - Your team/department (can skip with ENTER)
5. **Organization** - Your company name
6. **City or Locality** - Your city
7. **State or Province** - Your state
8. **Two-letter country code** - e.g., US, UK, etc.

### Important Notes:

- **CRITICAL**: Store the keystore file (`release-key.keystore`) and passwords securely
- If you lose the keystore, you CANNOT update your app on Play Store
- Never commit the keystore to version control
- Recommended location: `android/app/release-key.keystore`

---

## Step 2: Create Keystore Properties File

Create a file to store your signing credentials securely.

### File: `android/keystore.properties`

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=my-key-alias
storeFile=release-key.keystore
```

**Replace**:
- `YOUR_KEYSTORE_PASSWORD` with your actual keystore password
- `YOUR_KEY_PASSWORD` with your actual key password
- `my-key-alias` with the alias you used (keep it as is if you used the command above)

### Add to .gitignore:

Make sure these lines are in your `.gitignore`:

```
android/keystore.properties
android/app/*.keystore
*.keystore
```

---

## Step 3: Configure Signing in build.gradle

The `android/app/build.gradle` file needs to be updated to use your keystore for signing.

### Required Changes:

Add this BEFORE the `android {` block:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add this INSIDE the `android {` block, after `defaultConfig`:

```gradle
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
```

Update the `buildTypes` section to use the signing config:

```gradle
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
```

---

## Step 4: Build the Web App

Before building the Android bundle, ensure your web app is built:

```bash
npm run build
npx cap sync android
```

---

## Step 5: Generate the Signed App Bundle

Navigate to the android directory and build:

```bash
cd android
./gradlew bundleRelease
```

On Windows (if the above doesn't work):

```bash
cd android
gradlew.bat bundleRelease
```

---

## Step 6: Locate Your Signed Bundle

The signed AAB file will be located at:

```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Verification

To verify your bundle is signed correctly:

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

You should see "jar verified" in the output.

---

## Uploading to Google Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create a new app)
3. Navigate to "Release" → "Production" (or Testing tracks)
4. Click "Create new release"
5. Upload the `app-release.aab` file
6. Follow the prompts to complete the release

---

## Version Updates

For future releases, update in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2        // Increment this for each release
    versionName "1.1"    // Update this for user-facing version
}
```

---

## Troubleshooting

### "keytool not found"
- Make sure Java JDK is installed and in your PATH
- Try: `java -version` to verify Java installation

### "Keystore was tampered with, or password was incorrect"
- Double-check your passwords in `keystore.properties`
- Ensure there are no extra spaces in the properties file

### Build fails with signing errors
- Verify the keystore file path in `keystore.properties` is correct
- Make sure `keystore.properties` exists in the `android/` directory

### "AAPT: error: resource not found"
- Run `npm run build` and `npx cap sync android` again
- Clean the build: `cd android && ./gradlew clean`

---

## Security Checklist

- [ ] Keystore file backed up in a secure location
- [ ] Passwords stored in a password manager
- [ ] `keystore.properties` added to `.gitignore`
- [ ] Keystore file NOT committed to git
- [ ] Same keystore will be used for all future updates

---

## Quick Reference Commands

```bash
# 1. Generate keystore (once)
keytool -genkey -v -keystore android/app/release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 2. Build web app
npm run build
npx cap sync android

# 3. Build signed bundle
cd android
./gradlew bundleRelease

# 4. Find the AAB
# Located at: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Additional Resources

- [Android App Signing Docs](https://developer.android.com/studio/publish/app-signing)
- [Google Play Upload Guide](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
