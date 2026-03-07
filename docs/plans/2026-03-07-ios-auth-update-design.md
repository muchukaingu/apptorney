# iOS Auth Update to OTP Flow - Design

Date: 2026-03-07

## Goal

Update iOS app authentication from legacy password-based flow to OTP-based flow matching the backend API, web-app, and Android app.

## Changes

### New Auth Flow
- Login: email → POST /auth/login → OTP screen
- Register: email+name → POST /auth/register → OTP screen
- Verify: email+otp → POST /auth/verify-otp → JWT tokens → Home
- Token refresh: on 401 → POST /auth/refresh → new accessToken

### Files to Modify
- Appuser.swift - Replace auth methods with new OTP endpoints
- APIService.swift - Add refresh token, token refresh on 401
- LoginViewController.swift - Remove password, email-only
- RegisterViewController.swift - Remove password fields
- VerifyViewController.swift - Call /auth/verify-otp, store JWTs
- AppDelegate.swift - Update session validation
- Login.storyboard - Remove password field, forgot password button
- Register.storyboard - Remove password fields

### Files to Delete
- ForgotViewController.swift
- ResetPasswordViewController.swift
- Forgot.storyboard
