# Apptorney Android (Native Kotlin)

This project is a native Android app port of the iOS app in `../ios-app`, implemented with Kotlin + Jetpack Compose.

## What is implemented

- Startup flow parity:
  - Force-update check (`/updates/checkForUpdate`)
  - Onboarding -> Register/Login -> Main routing based on local flags
- Authentication flow parity:
  - Register (`/Customers`)
  - Login (`/appusers/login`)
  - Verify account (`/appusers/confirmPhone`)
  - Resend verification (`/appusers/resendVerification`)
  - Forgot/reset password (`/appusers/requestPasswordReset`, `/appusers/resetPasswordWithOTP`)
- Main app tabs parity:
  - Home: AI chat, chat thread list, thread history, new chat
  - Cases: search + thematic/chronological segmentation
  - Legislations: search + volume/acts/SI segmentation
  - Info: terms/privacy + sign out
- Legal content parity:
  - Case detail with references, bookmark toggle, feedback
  - Legislation detail with collapsible sections, bookmark toggle, feedback
  - Terms and Privacy screens via legislation IDs
- Endpoint and API header parity:
  - Base URL and IBM headers match iOS app
  - Cleartext HTTP is enabled for the existing backend URL

## Project structure

- `app/src/main/java/org/apptorney/android/data`: networking, models, repositories, local session store
- `app/src/main/java/org/apptorney/android/ui`: navigation and Compose screens
- `app/src/main/java/org/apptorney/android/MainActivity.kt`: app entry point

## Build notes

- `gradle` is not installed in this environment, so a local compile/build check could not be executed here.
- Open the project in Android Studio and run a Gradle sync/build.

## Backend

- Base API: `http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api`
- Client headers are configured in `ApiClient.kt` to match iOS behavior.
