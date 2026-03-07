package org.apptorney.android.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.apptorney.android.BuildConfig
import org.apptorney.android.data.model.ApiResult
import org.apptorney.android.data.repo.AppContainer

sealed interface BootState {
    data object Loading : BootState
    data class Ready(val destination: String) : BootState
}

class AppViewModel(application: Application) : AndroidViewModel(application) {
    val container = AppContainer(application.applicationContext)

    private val _bootState = MutableStateFlow<BootState>(BootState.Loading)
    val bootState: StateFlow<BootState> = _bootState.asStateFlow()

    init {
        determineLaunchDestination()
    }

    fun determineLaunchDestination() {
        viewModelScope.launch {
            _bootState.value = BootState.Loading

            val version = "${BuildConfig.VERSION_NAME}.${BuildConfig.VERSION_CODE}"
            val needsUpdate = when (val result = container.contentRepository.checkForUpdate(version)) {
                is ApiResult.Success -> result.data
                is ApiResult.Failure -> false
            }

            val destination = when {
                needsUpdate -> Routes.UpdateRequired
                !container.sessionStore.onboardingComplete -> Routes.Onboarding
                container.sessionStore.loginComplete && container.sessionStore.hasValidAuthSession() -> Routes.Main
                container.sessionStore.loginComplete -> {
                    container.sessionStore.loginComplete = false
                    Routes.Login
                }
                else -> Routes.Login
            }

            _bootState.value = BootState.Ready(destination)
        }
    }

    fun completeOnboarding() {
        container.sessionStore.onboardingComplete = true
    }

    fun logout() {
        container.sessionStore.logout()
    }
}

object Routes {
    const val Splash = "splash"
    const val UpdateRequired = "update"
    const val Onboarding = "onboarding"
    const val Register = "register"
    const val Verify = "verify"
    const val Login = "login"
    const val Main = "main"
    const val CaseSegmentation = "case_segmentation"
    const val LegislationSegmentation = "legislation_segmentation"
    const val ItemList = "item_list"
    const val CaseDetail = "case_detail"
    const val LegislationDetail = "legislation_detail"
    const val Agreement = "agreement"
}
