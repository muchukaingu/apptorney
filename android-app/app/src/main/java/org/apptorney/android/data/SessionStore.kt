package org.apptorney.android.data

import android.content.Context

class SessionStore(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    var onboardingComplete: Boolean
        get() = prefs.getBoolean(KEY_ONBOARDING_COMPLETE, false)
        set(value) = prefs.edit().putBoolean(KEY_ONBOARDING_COMPLETE, value).apply()

    var loginComplete: Boolean
        get() = prefs.getBoolean(KEY_LOGIN_COMPLETE, false)
        set(value) = prefs.edit().putBoolean(KEY_LOGIN_COMPLETE, value).apply()

    var email: String
        get() = prefs.getString(KEY_EMAIL, "") ?: ""
        set(value) = prefs.edit().putString(KEY_EMAIL, value).apply()

    var accessToken: String
        get() = prefs.getString(KEY_ACCESS_TOKEN, "") ?: ""
        set(value) = prefs.edit().putString(KEY_ACCESS_TOKEN, value).apply()

    var refreshToken: String
        get() = prefs.getString(KEY_REFRESH_TOKEN, "") ?: ""
        set(value) = prefs.edit().putString(KEY_REFRESH_TOKEN, value).apply()

    var userId: String
        get() = prefs.getString(KEY_USER_ID, "") ?: ""
        set(value) = prefs.edit().putString(KEY_USER_ID, value).apply()

    var userName: String
        get() = prefs.getString(KEY_USER_NAME, "") ?: ""
        set(value) = prefs.edit().putString(KEY_USER_NAME, value).apply()

    fun saveAuthTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun saveUser(id: String, firstName: String, lastName: String, email: String) {
        prefs.edit()
            .putString(KEY_USER_ID, id)
            .putString(KEY_USER_NAME, "$firstName $lastName".trim())
            .putString(KEY_EMAIL, email)
            .apply()
    }

    fun hasValidAuthSession(): Boolean {
        val token = accessToken
        return token.isNotBlank() && token.length >= 12
    }

    fun setBookmarks(ids: List<String>) {
        prefs.edit().putStringSet(KEY_BOOKMARKS, ids.toSet()).apply()
    }

    fun bookmarks(): Set<String> = prefs.getStringSet(KEY_BOOKMARKS, emptySet()) ?: emptySet()

    fun logout() {
        prefs.edit()
            .putBoolean(KEY_LOGIN_COMPLETE, false)
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .remove(KEY_USER_ID)
            .remove(KEY_USER_NAME)
            .remove(KEY_EMAIL)
            .apply()
    }

    companion object {
        private const val PREFS_NAME = "apptorney_prefs"
        private const val KEY_ONBOARDING_COMPLETE = "onboardingComplete"
        private const val KEY_LOGIN_COMPLETE = "loginComplete"
        private const val KEY_EMAIL = "email"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_BOOKMARKS = "bookmarks"
    }
}
