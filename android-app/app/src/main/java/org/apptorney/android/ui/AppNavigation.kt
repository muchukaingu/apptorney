package org.apptorney.android.ui

import android.content.Intent
import androidx.compose.ui.res.painterResource
import org.apptorney.android.R
import android.net.Uri
import android.text.Spanned
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.InlineTextContent
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LibraryBooks
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.style.BaselineShift
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.text.HtmlCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.apptorney.android.BuildConfig
import org.apptorney.android.data.model.ApiResult
import org.apptorney.android.data.model.AskAiResult
import org.apptorney.android.data.model.CaseDetail
import org.apptorney.android.data.model.CaseSummary
import org.apptorney.android.data.model.ChatMessage
import org.apptorney.android.data.model.ChatReference
import org.apptorney.android.data.model.ChatThreadSummary
import org.apptorney.android.data.model.FlatLegislationPart
import org.apptorney.android.data.model.HomeItem
import org.apptorney.android.data.model.LegislationDetail
import org.apptorney.android.data.model.LegislationPart
import org.apptorney.android.data.model.LegislationSummary
import org.apptorney.android.data.repo.AuthRepository
import org.apptorney.android.data.repo.ContentRepository
import org.apptorney.android.data.repo.ChatRepository
import org.apptorney.android.data.repo.StreamEvent
import kotlin.math.max

private const val TERMS_LEGISLATION_ID = "5badf52b4594190056063cae"
private const val PRIVACY_LEGISLATION_ID = "5badec9d1a2fa200672d9abe"

private data class ChatUiMessage(
    val text: String,
    val isUser: Boolean,
    val references: List<ChatReference> = emptyList(),
)

private data class DecadeGroup(
    val title: String,
    val years: List<Int>,
)

private data class ItemListArgs(
    val mode: String,
    val type: String,
    val year: Int,
    val volume: Int,
    val title: String,
)

private fun buildItemListRoute(
    mode: String,
    type: String = "",
    year: Int = 0,
    volume: Int = 0,
    title: String = "Results",
): String {
    return "${Routes.ItemList}?mode=${Uri.encode(mode)}&type=${Uri.encode(type)}&year=$year&volume=$volume&title=${Uri.encode(title)}"
}

private fun NavBackStackEntry.itemArgs(): ItemListArgs {
    val mode = arguments?.getString("mode").orEmpty()
    val type = arguments?.getString("type").orEmpty()
    val year = arguments?.getInt("year") ?: 0
    val volume = arguments?.getInt("volume") ?: 0
    val title = arguments?.getString("title").orEmpty().ifBlank { "Results" }
    return ItemListArgs(mode, type, year, volume, title)
}

@Composable
fun ApptorneyApp(
    appViewModel: AppViewModel = viewModel(),
) {
    val navController = rememberNavController()
    val bootState by appViewModel.bootState.collectAsStateWithLifecycle()

    NavHost(
        navController = navController,
        startDestination = Routes.Splash,
    ) {
        composable(Routes.Splash) {
            SplashScreen()
            LaunchedEffect(bootState) {
                val ready = bootState as? BootState.Ready ?: return@LaunchedEffect
                navController.navigate(ready.destination) {
                    popUpTo(Routes.Splash) { inclusive = true }
                    launchSingleTop = true
                }
            }
        }

        composable(Routes.UpdateRequired) {
            UpdateRequiredScreen()
        }

        composable(Routes.Onboarding) {
            OnboardingScreen(
                onGetStarted = {
                    appViewModel.completeOnboarding()
                    navController.navigate(Routes.Login) {
                        popUpTo(Routes.Onboarding) { inclusive = true }
                    }
                },
            )
        }

        composable(Routes.Register) {
            RegisterScreen(
                authRepository = appViewModel.container.authRepository,
                onBackToLogin = { navController.navigate(Routes.Login) },
                onRegistered = { email ->
                    navController.navigate("${Routes.Verify}/${Uri.encode(email)}")
                },
            )
        }

        composable(
            route = "${Routes.Verify}/{email}",
            arguments = listOf(navArgument("email") { type = NavType.StringType }),
        ) { entry ->
            val email = entry.arguments?.getString("email").orEmpty()
            VerifyScreen(
                email = email,
                authRepository = appViewModel.container.authRepository,
                onVerified = {
                    navController.navigate(Routes.Main) {
                        popUpTo(0) { inclusive = true }
                    }
                },
            )
        }

        composable(Routes.Login) {
            LoginScreen(
                authRepository = appViewModel.container.authRepository,
                onOtpSent = { email ->
                    navController.navigate("${Routes.Verify}/${Uri.encode(email)}")
                },
                onOpenRegister = { navController.navigate(Routes.Register) },
            )
        }

        composable(Routes.Main) {
            MainShell(
                contentRepository = appViewModel.container.contentRepository,
                chatRepository = appViewModel.container.chatRepository,
                onOpenCaseDetail = { id -> navController.navigate("${Routes.CaseDetail}/${Uri.encode(id)}") },
                onOpenLegislationDetail = { id -> navController.navigate("${Routes.LegislationDetail}/${Uri.encode(id)}") },
                onOpenCaseSegmentation = { type -> navController.navigate("${Routes.CaseSegmentation}/${Uri.encode(type)}") },
                onOpenLegislationSegmentation = { type -> navController.navigate("${Routes.LegislationSegmentation}/${Uri.encode(type)}") },
                onOpenItemList = { route -> navController.navigate(route) },
                onOpenAgreement = { id, title -> navController.navigate("${Routes.Agreement}/${Uri.encode(id)}/${Uri.encode(title)}") },
                onLogout = {
                    appViewModel.logout()
                    navController.navigate(Routes.Login) {
                        popUpTo(0) { inclusive = true }
                    }
                },
            )
        }

        composable(
            route = "${Routes.CaseSegmentation}/{type}",
            arguments = listOf(navArgument("type") { type = NavType.StringType }),
        ) { entry ->
            CaseSegmentationScreen(
                resourceType = entry.arguments?.getString("type").orEmpty(),
                contentRepository = appViewModel.container.contentRepository,
                onBack = { navController.popBackStack() },
                onOpenItemList = { route -> navController.navigate(route) },
            )
        }

        composable(
            route = "${Routes.LegislationSegmentation}/{type}",
            arguments = listOf(navArgument("type") { type = NavType.StringType }),
        ) { entry ->
            LegislationSegmentationScreen(
                resourceType = entry.arguments?.getString("type").orEmpty(),
                onBack = { navController.popBackStack() },
                onOpenItemList = { route -> navController.navigate(route) },
            )
        }

        composable(
            route = "${Routes.ItemList}?mode={mode}&type={type}&year={year}&volume={volume}&title={title}",
            arguments = listOf(
                navArgument("mode") { type = NavType.StringType },
                navArgument("type") { type = NavType.StringType; defaultValue = "" },
                navArgument("year") { type = NavType.IntType; defaultValue = 0 },
                navArgument("volume") { type = NavType.IntType; defaultValue = 0 },
                navArgument("title") { type = NavType.StringType; defaultValue = "Results" },
            ),
        ) { entry ->
            ItemListScreen(
                args = entry.itemArgs(),
                contentRepository = appViewModel.container.contentRepository,
                onBack = { navController.popBackStack() },
                onOpenCaseDetail = { id -> navController.navigate("${Routes.CaseDetail}/${Uri.encode(id)}") },
                onOpenLegislationDetail = { id -> navController.navigate("${Routes.LegislationDetail}/${Uri.encode(id)}") },
            )
        }

        composable(
            route = "${Routes.CaseDetail}/{id}",
            arguments = listOf(navArgument("id") { type = NavType.StringType }),
        ) { entry ->
            CaseDetailScreen(
                caseId = entry.arguments?.getString("id").orEmpty(),
                contentRepository = appViewModel.container.contentRepository,
                bookmarkedIds = appViewModel.container.sessionStore.bookmarks(),
                onBack = { navController.popBackStack() },
                onBookmarkChanged = { updated ->
                    appViewModel.container.sessionStore.setBookmarks(updated.toList())
                },
                onOpenCaseDetail = { id -> navController.navigate("${Routes.CaseDetail}/${Uri.encode(id)}") },
                onOpenLegislationDetail = { id -> navController.navigate("${Routes.LegislationDetail}/${Uri.encode(id)}") },
            )
        }

        composable(
            route = "${Routes.LegislationDetail}/{id}",
            arguments = listOf(navArgument("id") { type = NavType.StringType }),
        ) { entry ->
            LegislationDetailScreen(
                legislationId = entry.arguments?.getString("id").orEmpty(),
                title = "Legislation Details",
                contentRepository = appViewModel.container.contentRepository,
                bookmarkedIds = appViewModel.container.sessionStore.bookmarks(),
                readOnly = false,
                onBack = { navController.popBackStack() },
                onBookmarkChanged = { updated ->
                    appViewModel.container.sessionStore.setBookmarks(updated.toList())
                },
            )
        }

        composable(
            route = "${Routes.Agreement}/{id}/{title}",
            arguments = listOf(
                navArgument("id") { type = NavType.StringType },
                navArgument("title") { type = NavType.StringType },
            ),
        ) { entry ->
            LegislationDetailScreen(
                legislationId = entry.arguments?.getString("id").orEmpty(),
                title = entry.arguments?.getString("title").orEmpty().ifBlank { "Agreement" },
                contentRepository = appViewModel.container.contentRepository,
                bookmarkedIds = emptySet(),
                readOnly = true,
                onBack = { navController.popBackStack() },
                onBookmarkChanged = {},
            )
        }
    }
}

@Composable
private fun SplashScreen() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        CircularProgressIndicator()
    }
}

@Composable
private fun UpdateRequiredScreen() {
    val context = LocalContext.current
    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "Update Required",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "A newer version of Apptorney is required to continue.",
                style = MaterialTheme.typography.bodyLarge,
            )
            Spacer(modifier = Modifier.height(20.dp))
            Button(onClick = {
                val uri = Uri.parse("https://play.google.com/store/apps/details?id=org.apptorney.android")
                context.startActivity(Intent(Intent.ACTION_VIEW, uri))
            }) {
                Icon(Icons.Default.Refresh, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Update App")
            }
        }
    }
}

@Composable
private fun OnboardingScreen(
    onGetStarted: () -> Unit,
) {
    val pages = listOf(
        "Apptorney AI" to "Apptorney is an all-inclusive legal research tool for legal practitioners in Zambia, enhanced with AI features.",
        "Zambian Case Law" to "Find cases quickly by thematic domain or full-text search.",
        "Zambian Legislations" to "Search primary and subsidiary legislation from a comprehensive digital library.",
        "Easily Share" to "Copy and share legal content with colleagues and clients.",
        "Make It Your Own" to "Bookmark content and personalize your legal workflow.",
    )

    var index by rememberSaveable { mutableStateOf(0) }

    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp, vertical = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(modifier = Modifier.weight(1f))
            Text(
                text = pages[index].first,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = pages[index].second,
                style = MaterialTheme.typography.bodyLarge,
            )
            Spacer(modifier = Modifier.height(24.dp))
            Row(horizontalArrangement = Arrangement.Center) {
                repeat(pages.size) { dot ->
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .size(if (dot == index) 10.dp else 8.dp)
                            .background(
                                color = if (dot == index) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
                                shape = CircleShape,
                            ),
                    )
                }
            }
            Spacer(modifier = Modifier.weight(1f))

            if (index < pages.lastIndex) {
                Button(
                    onClick = { index += 1 },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Next")
                }
            } else {
                Button(
                    onClick = onGetStarted,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Get Started")
                }
            }
        }
    }
}

@Composable
private fun RegisterScreen(
    authRepository: AuthRepository,
    onBackToLogin: () -> Unit,
    onRegistered: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var firstName by rememberSaveable { mutableStateOf("") }
    var lastName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var organization by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }

    Scaffold(snackbarHost = { SnackbarHost(snackbarHost) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
        ) {
            Text("Sign Up", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedTextField(value = firstName, onValueChange = { firstName = it }, label = { Text("First Name") }, modifier = Modifier.fillMaxWidth())
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedTextField(value = lastName, onValueChange = { lastName = it }, label = { Text("Last Name") }, modifier = Modifier.fillMaxWidth())
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("Phone Number (optional)") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone, imeAction = ImeAction.Next),
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedTextField(
                value = organization,
                onValueChange = { organization = it },
                label = { Text("Organization (optional)") },
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (loading) return@Button

                    if (email.isBlank() || !email.contains("@") || !email.contains(".")) {
                        scope.launch { snackbarHost.showSnackbar("Enter a valid email address.") }
                        return@Button
                    }
                    if (firstName.isBlank() || lastName.isBlank()) {
                        scope.launch { snackbarHost.showSnackbar("First name and last name are required.") }
                        return@Button
                    }

                    scope.launch {
                        loading = true
                        when (val result = authRepository.register(email, firstName, lastName, phone, organization)) {
                            is ApiResult.Success -> onRegistered(result.data)
                            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                        }
                        loading = false
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                if (loading) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(if (loading) "Signing up..." else "Sign Up")
            }

            TextButton(onClick = onBackToLogin, modifier = Modifier.align(Alignment.CenterHorizontally)) {
                Text("Already have an account? Log in")
            }
        }
    }
}

@Composable
private fun VerifyScreen(
    email: String,
    authRepository: AuthRepository,
    onVerified: () -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var otp by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    var resending by rememberSaveable { mutableStateOf(false) }

    Scaffold(snackbarHost = { SnackbarHost(snackbarHost) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.Center,
        ) {
            Text("Enter Verification Code", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("We sent a code to $email")
            Spacer(modifier = Modifier.height(14.dp))
            OutlinedTextField(
                value = otp,
                onValueChange = { otp = it },
                label = { Text("Verification Code") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(16.dp))

            Button(onClick = {
                if (loading) return@Button
                if (otp.isBlank()) {
                    scope.launch { snackbarHost.showSnackbar("Enter the verification code.") }
                    return@Button
                }

                scope.launch {
                    loading = true
                    when (val result = authRepository.verifyOtp(email, otp)) {
                        is ApiResult.Success -> onVerified()
                        is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                    }
                    loading = false
                }
            }, modifier = Modifier.fillMaxWidth()) {
                if (loading) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(if (loading) "Verifying..." else "Verify")
            }

            TextButton(onClick = {
                if (resending) return@TextButton
                scope.launch {
                    resending = true
                    when (val result = authRepository.login(email)) {
                        is ApiResult.Success -> snackbarHost.showSnackbar("New code sent to $email")
                        is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                    }
                    resending = false
                }
            }) {
                Text(if (resending) "Sending..." else "Resend Code")
            }
        }
    }
}

@Composable
private fun LoginScreen(
    authRepository: AuthRepository,
    onOtpSent: (String) -> Unit,
    onOpenRegister: () -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var email by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }

    Scaffold(snackbarHost = { SnackbarHost(snackbarHost) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.Center,
        ) {
            Text("Log In", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Enter your email to receive a verification code", style = MaterialTheme.typography.bodyMedium)
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(16.dp))

            Button(onClick = {
                if (loading) return@Button
                scope.launch {
                    loading = true
                    when (val result = authRepository.login(email)) {
                        is ApiResult.Success -> onOtpSent(result.data)
                        is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                    }
                    loading = false
                }
            }, modifier = Modifier.fillMaxWidth()) {
                if (loading) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(if (loading) "Sending code..." else "Continue")
            }

            TextButton(onClick = onOpenRegister, modifier = Modifier.align(Alignment.CenterHorizontally)) {
                Text("Don't have an account? Sign Up")
            }
        }
    }
}

private enum class MainTab(
    val route: String,
    val label: String,
) {
    Home("home_tab", "Home"),
    Cases("cases_tab", "Cases"),
    Legislations("legislations_tab", "Legislations"),
    Info("info_tab", "Info"),
}

@Composable
private fun MainShell(
    contentRepository: ContentRepository,
    chatRepository: ChatRepository,
    onOpenCaseDetail: (String) -> Unit,
    onOpenLegislationDetail: (String) -> Unit,
    onOpenCaseSegmentation: (String) -> Unit,
    onOpenLegislationSegmentation: (String) -> Unit,
    onOpenItemList: (String) -> Unit,
    onOpenAgreement: (String, String) -> Unit,
    onLogout: () -> Unit,
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route ?: MainTab.Home.route

    Scaffold(
        contentWindowInsets = WindowInsets.ime,
        bottomBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .navigationBarsPadding()
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                MainTab.entries.forEach { tab ->
                    val selected = currentRoute == tab.route
                    val tint = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                    Column(
                        modifier = Modifier
                            .clickable {
                                if (!selected) {
                                    navController.navigate(tab.route) {
                                        launchSingleTop = true
                                        restoreState = true
                                        popUpTo(MainTab.Home.route) { saveState = true }
                                    }
                                }
                            }
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        when (tab) {
                            MainTab.Home -> Icon(painter = painterResource(id = R.drawable.ic_home), contentDescription = null, modifier = Modifier.size(20.dp), tint = tint)
                            MainTab.Cases -> Icon(painter = painterResource(id = R.drawable.ic_cases), contentDescription = null, modifier = Modifier.size(20.dp), tint = tint)
                            MainTab.Legislations -> Icon(painter = painterResource(id = R.drawable.ic_legislations), contentDescription = null, modifier = Modifier.size(20.dp), tint = tint)
                            MainTab.Info -> Icon(Icons.Default.Info, contentDescription = null, modifier = Modifier.size(20.dp), tint = tint)
                        }
                        Text(tab.label, style = MaterialTheme.typography.labelSmall, color = tint)
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = MainTab.Home.route,
            modifier = Modifier.padding(padding),
        ) {
            composable(MainTab.Home.route) {
                HomeChatScreen(
                    chatRepository = chatRepository,
                    onSelectTab = { tab -> navController.navigate(tab.route) },
                    onOpenCaseDetail = onOpenCaseDetail,
                    onOpenLegislationDetail = onOpenLegislationDetail,
                )
            }

            composable(MainTab.Cases.route) {
                CasesScreen(
                    contentRepository = contentRepository,
                    onOpenCaseDetail = onOpenCaseDetail,
                    onOpenSegmentation = onOpenCaseSegmentation,
                    onOpenItemList = onOpenItemList,
                )
            }

            composable(MainTab.Legislations.route) {
                LegislationsScreen(
                    contentRepository = contentRepository,
                    onOpenLegislationDetail = onOpenLegislationDetail,
                    onOpenSegmentation = onOpenLegislationSegmentation,
                    onOpenItemList = onOpenItemList,
                )
            }

            composable(MainTab.Info.route) {
                InfoScreen(
                    onOpenTerms = { onOpenAgreement(TERMS_LEGISLATION_ID, "Terms of Use") },
                    onOpenPrivacy = { onOpenAgreement(PRIVACY_LEGISLATION_ID, "Privacy Policy") },
                    onLogout = onLogout,
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun HomeChatScreen(
    chatRepository: ChatRepository,
    onSelectTab: (MainTab) -> Unit,
    onOpenCaseDetail: (String) -> Unit,
    onOpenLegislationDetail: (String) -> Unit,
) {
    val drawerState = androidx.compose.material3.rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val snackbarHost = remember { SnackbarHostState() }

    val messages = remember {
        mutableStateListOf(
            ChatUiMessage(
                text = "Ask anything about Zambian case law or legislation to get started.",
                isUser = false,
            ),
        )
    }

    var prompt by rememberSaveable { mutableStateOf("") }
    var currentThreadId by rememberSaveable { mutableStateOf<String?>(null) }
    var waitingForResponse by rememberSaveable { mutableStateOf(false) }
    var loadingThreads by rememberSaveable { mutableStateOf(false) }
    var threads by remember { mutableStateOf<List<ChatThreadSummary>>(emptyList()) }

    val listState = rememberLazyListState()

    suspend fun refreshThreads() {
        loadingThreads = true
        when (val result = chatRepository.getThreads()) {
            is ApiResult.Success -> threads = result.data
            is ApiResult.Failure -> {
                threads = emptyList()
            }
        }
        loadingThreads = false
    }

    suspend fun openThread(threadId: String) {
        when (val result = chatRepository.getThreadHistory(threadId)) {
            is ApiResult.Success -> {
                currentThreadId = threadId
                messages.clear()
                if (result.data.isEmpty()) {
                    messages += ChatUiMessage(
                        text = "Ask anything about Zambian case law or legislation to get started.",
                        isUser = false,
                    )
                } else {
                    messages += result.data.map {
                        ChatUiMessage(text = it.text, isUser = it.isUser, references = it.references)
                    }
                }
                scope.launch { drawerState.close() }
            }

            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
        }
    }

    suspend fun sendMessage() {
        val trimmed = prompt.trim()
        if (trimmed.isBlank() || waitingForResponse) return

        if (messages.size == 1 && !messages.first().isUser) {
            messages.clear()
        }

        messages += ChatUiMessage(text = trimmed, isUser = true)
        prompt = ""
        waitingForResponse = true

        val aiIndex = messages.size
        messages += ChatUiMessage(text = "", isUser = false)

        var accumulatedText = ""
        var references = listOf<ChatReference>()

        try {
            chatRepository.askAiStream(trimmed, currentThreadId).collect { event ->
                when (event) {
                    is StreamEvent.Token -> {
                        accumulatedText += event.text
                        messages[aiIndex] = ChatUiMessage(
                            text = accumulatedText,
                            isUser = false,
                            references = references,
                        )
                    }

                    is StreamEvent.Metadata -> {
                        references = event.references
                        messages[aiIndex] = messages[aiIndex].copy(references = references)
                    }

                    is StreamEvent.Done -> {
                        if (event.fullAnswer.isNotBlank()) {
                            accumulatedText = event.fullAnswer
                        }
                        if (!event.threadId.isNullOrBlank()) {
                            currentThreadId = event.threadId
                            refreshThreads()
                        }
                        messages[aiIndex] = ChatUiMessage(
                            text = accumulatedText,
                            isUser = false,
                            references = references,
                        )
                    }

                    is StreamEvent.Error -> {
                        if (accumulatedText.isBlank()) {
                            messages[aiIndex] = ChatUiMessage(
                                text = "Sorry, I couldn't get a response right now. Please try again.",
                                isUser = false,
                            )
                        }
                        snackbarHost.showSnackbar(event.message)
                    }
                }
            }
        } catch (t: Throwable) {
            if (accumulatedText.isBlank()) {
                messages[aiIndex] = ChatUiMessage(
                    text = "Sorry, I couldn't get a response right now. Please try again.",
                    isUser = false,
                )
            }
        }

        waitingForResponse = false
    }

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(max(0, messages.lastIndex))
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(modifier = Modifier.width(300.dp)) {
                Text(
                    text = "Apptorney",
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 18.dp),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                )
                DrawerNavButton("Home") { onSelectTab(MainTab.Home); scope.launch { drawerState.close() } }
                DrawerNavButton("Cases") { onSelectTab(MainTab.Cases); scope.launch { drawerState.close() } }
                DrawerNavButton("Legislations") { onSelectTab(MainTab.Legislations); scope.launch { drawerState.close() } }
                DrawerNavButton("Info") { onSelectTab(MainTab.Info); scope.launch { drawerState.close() } }

                Divider(modifier = Modifier.padding(vertical = 10.dp))
                Text(
                    text = "Conversations",
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.outline,
                )

                if (loadingThreads) {
                    Text("Loading conversations...", modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp))
                } else if (threads.isEmpty()) {
                    Text("No conversations yet", modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp))
                } else {
                    LazyColumn(contentPadding = PaddingValues(bottom = 16.dp)) {
                        items(threads) { thread ->
                            val selected = currentThreadId == thread.id
                            Text(
                                text = thread.title.takeIf { it.isNotBlank() && it.lowercase() != "new chat" }
                                    ?: thread.lastQuestion.ifBlank { "New chat" },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        scope.launch { openThread(thread.id) }
                                    }
                                    .background(
                                        if (selected) MaterialTheme.colorScheme.surfaceVariant else Color.Transparent,
                                        shape = RoundedCornerShape(10.dp),
                                    )
                                    .padding(horizontal = 20.dp, vertical = 10.dp),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                }
            }
        },
    ) {
        Scaffold(
            topBar = {
                CenterAlignedTopAppBar(
                    title = { Text("Apptorney AI") },
                    navigationIcon = {
                        IconButton(onClick = {
                            scope.launch {
                                refreshThreads()
                                drawerState.open()
                            }
                        }) {
                            Icon(Icons.Default.Menu, contentDescription = null)
                        }
                    },
                    actions = {
                        IconButton(onClick = {
                            currentThreadId = null
                            messages.clear()
                            messages += ChatUiMessage(
                                text = "Ask anything about Zambian case law or legislation to get started.",
                                isUser = false,
                            )
                            prompt = ""
                        }) {
                            Icon(Icons.Outlined.Add, contentDescription = null)
                        }
                    },
                    windowInsets = WindowInsets(top = 40.dp),
                )
            },
            snackbarHost = { SnackbarHost(snackbarHost) },
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
            ) {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    state = listState,
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    items(messages) { message ->
                        ChatBubble(
                            message = message,
                            onReferenceClick = { ref ->
                                if (ref.type == "case") {
                                    onOpenCaseDetail(ref.id)
                                }
                                if (ref.type == "legislation") {
                                    onOpenLegislationDetail(ref.id)
                                }
                            },
                        )
                    }

                    if (waitingForResponse) {
                        item {
                            val dotCount = remember { mutableStateOf(1) }
                            LaunchedEffect(Unit) {
                                while (true) {
                                    delay(400)
                                    dotCount.value = (dotCount.value % 3) + 1
                                }
                            }
                            Text(
                                text = ".".repeat(dotCount.value),
                                style = MaterialTheme.typography.headlineMedium,
                                color = MaterialTheme.colorScheme.outline,
                            )
                        }
                    }
                }

                var inputFocused by remember { mutableStateOf(false) }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(y = if (inputFocused) (-5).dp else (-20).dp)
                        .padding(horizontal = 12.dp)
                        .background(
                            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            RoundedCornerShape(24.dp),
                        )
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        BasicTextField(
                            value = prompt,
                            onValueChange = { prompt = it },
                            modifier = Modifier
                                .weight(1f)
                                .padding(vertical = 8.dp)
                                .onFocusChanged { inputFocused = it.isFocused },
                            textStyle = MaterialTheme.typography.bodyLarge.copy(
                                color = MaterialTheme.colorScheme.onSurface,
                            ),
                            keyboardOptions = KeyboardOptions(
                                capitalization = KeyboardCapitalization.Sentences,
                                imeAction = ImeAction.Send,
                            ),
                            keyboardActions = KeyboardActions(
                                onSend = { scope.launch { sendMessage() } },
                            ),
                            maxLines = 4,
                            decorationBox = { innerTextField ->
                                Box {
                                    if (prompt.isEmpty()) {
                                        Text(
                                            "Ask anything",
                                            style = MaterialTheme.typography.bodyLarge,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                    innerTextField()
                                }
                            },
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .size(30.dp)
                                .background(
                                    if (prompt.isNotBlank()) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.outlineVariant,
                                    CircleShape,
                                )
                                .clickable(enabled = prompt.isNotBlank()) {
                                    scope.launch { sendMessage() }
                                },
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(
                                Icons.Default.KeyboardArrowUp,
                                contentDescription = "Send",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DrawerNavButton(title: String, onClick: () -> Unit) {
    Text(
        text = title,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 20.dp, vertical = 12.dp),
        style = MaterialTheme.typography.bodyLarge,
    )
}

@Composable
private fun ChatBubble(
    message: ChatUiMessage,
    onReferenceClick: (ChatReference) -> Unit,
) {
    if (message.isUser) {
        Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.End) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth(0.82f),
            ) {
                Text(
                    text = stripHtml(message.text),
                    color = MaterialTheme.colorScheme.onPrimary,
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.padding(12.dp),
                )
            }
        }
    } else {
        val context = LocalContext.current
        val clipboardManager = LocalClipboardManager.current

        Column(modifier = Modifier.fillMaxWidth()) {
            val rawText = cleanAiText(message.text)
            val refMap = message.references.associateBy { it.source }
            val badgeColor = MaterialTheme.colorScheme.primary
            val onBadgeColor = Color.White
            val hasMainText = rawText.replace("\\[S\\d+]".toRegex(), "").isNotBlank()

            if (hasMainText) {
                val annotated = buildFormattedText(rawText, refMap.keys)

                val inlineContent = message.references.mapIndexed { index, ref ->
                    "badge_${ref.source}" to InlineTextContent(
                        placeholder = Placeholder(16.sp, 16.sp, PlaceholderVerticalAlign.TextCenter),
                    ) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center,
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(15.dp)
                                    .background(badgeColor, CircleShape)
                                    .clickable { onReferenceClick(ref) },
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    text = "${index + 1}",
                                    color = onBadgeColor,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                    lineHeight = 9.sp,
                                )
                            }
                        }
                    }
                }.toMap()

                Text(
                    text = annotated,
                    inlineContent = inlineContent,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                )
            }

            if (hasMainText && message.references.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                message.references.forEachIndexed { index, ref ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onReferenceClick(ref) }
                            .padding(vertical = 3.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            modifier = Modifier
                                .size(18.dp)
                                .background(badgeColor, CircleShape),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = "${index + 1}",
                                color = onBadgeColor,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = ref.title,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }
            }

            if (hasMainText) {
                val copyText = rawText.replace("\\[S\\d+]".toRegex(), "").replace(Regex("#{1,3}\\s*"), "")
                Row(
                    modifier = Modifier.padding(top = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(0.dp),
                ) {
                    IconButton(
                        onClick = { clipboardManager.setText(AnnotatedString(copyText)) },
                        modifier = Modifier.size(32.dp),
                    ) {
                        Icon(
                            Icons.Default.ContentCopy,
                            contentDescription = "Copy",
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    IconButton(
                        onClick = {
                            val sendIntent = Intent(Intent.ACTION_SEND).apply {
                                putExtra(Intent.EXTRA_TEXT, copyText)
                                type = "text/plain"
                            }
                            context.startActivity(Intent.createChooser(sendIntent, null))
                        },
                        modifier = Modifier.size(32.dp),
                    ) {
                        Icon(
                            Icons.Default.Share,
                            contentDescription = "Share",
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CasesScreen(
    contentRepository: ContentRepository,
    onOpenCaseDetail: (String) -> Unit,
    onOpenSegmentation: (String) -> Unit,
    onOpenItemList: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var query by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    var results by remember { mutableStateOf<List<CaseSummary>>(emptyList()) }

    LaunchedEffect(query) {
        val term = query.trim()
        if (term.isBlank()) {
            results = emptyList()
            return@LaunchedEffect
        }
        delay(500)
        loading = true
        when (val res = contentRepository.searchCases(term)) {
            is ApiResult.Success -> results = res.data
            is ApiResult.Failure -> {
                results = emptyList()
                snackbarHost.showSnackbar(res.message)
            }
        }
        loading = false
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Cases") }) },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                placeholder = { Text("Search cases") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            )
            Spacer(modifier = Modifier.height(12.dp))

            if (query.isBlank()) {
                OptionCard(
                    title = "Thematic Domains",
                    description = "Show cases categorized by Areas of Law.",
                    onClick = { onOpenSegmentation("themes") },
                )
                Spacer(modifier = Modifier.height(10.dp))
                OptionCard(
                    title = "Chronological",
                    description = "Show cases by the year in which judgment was passed.",
                    onClick = { onOpenSegmentation("years") },
                )
            } else {
                if (loading) {
                    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(modifier = Modifier.padding(20.dp))
                    }
                } else if (results.isEmpty()) {
                    EmptyState("No results for \"${query.trim()}\"")
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(results) { item ->
                            ResultCard(
                                title = item.name,
                                subtitle = if (item.highlight.isNotBlank()) item.highlight else item.summaryOfRuling,
                                metaLeft = item.areaOfLawName.uppercase(),
                                metaRight = item.caseNumber.ifBlank {
                                    "${item.citation.year ?: ""}/${item.citation.code}/${item.citation.pageNumber ?: ""}"
                                },
                                onClick = { onOpenCaseDetail(item.id) },
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            OutlinedButton(
                onClick = {
                    onOpenItemList(
                        buildItemListRoute(
                            mode = "bookmarks",
                            title = "Bookmarks",
                        ),
                    )
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open Bookmarks")
            }
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedButton(
                onClick = {
                    scope.launch {
                        when (val news = contentRepository.getNews()) {
                            is ApiResult.Success -> {
                                if (news.data.isNotEmpty()) {
                                    onOpenItemList(buildItemListRoute(mode = "news", title = "What's New"))
                                }
                            }

                            is ApiResult.Failure -> snackbarHost.showSnackbar(news.message)
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open What's New")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LegislationsScreen(
    contentRepository: ContentRepository,
    onOpenLegislationDetail: (String) -> Unit,
    onOpenSegmentation: (String) -> Unit,
    onOpenItemList: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }

    var query by rememberSaveable { mutableStateOf("") }
    var loading by rememberSaveable { mutableStateOf(false) }
    var results by remember { mutableStateOf<List<LegislationSummary>>(emptyList()) }

    LaunchedEffect(query) {
        val term = query.trim()
        if (term.isBlank()) {
            results = emptyList()
            return@LaunchedEffect
        }
        delay(500)
        loading = true
        when (val res = contentRepository.searchLegislations(term)) {
            is ApiResult.Success -> results = res.data
            is ApiResult.Failure -> {
                results = emptyList()
                snackbarHost.showSnackbar(res.message)
            }
        }
        loading = false
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Legislations") }) },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                placeholder = { Text("Search legislations") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            )
            Spacer(modifier = Modifier.height(12.dp))

            if (query.isBlank()) {
                OptionCard(
                    title = "Volumes",
                    description = "Acts of Parliament enacted before 1996.",
                    onClick = { onOpenSegmentation("volumes") },
                )
                Spacer(modifier = Modifier.height(10.dp))
                OptionCard(
                    title = "Acts of Parliament",
                    description = "Primary legislation enacted after 1996.",
                    onClick = { onOpenSegmentation("acts") },
                )
                Spacer(modifier = Modifier.height(10.dp))
                OptionCard(
                    title = "Statutory Instruments",
                    description = "Subsidiary legislation issued under acts.",
                    onClick = { onOpenSegmentation("sis") },
                )
            } else {
                if (loading) {
                    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(modifier = Modifier.padding(20.dp))
                    }
                } else if (results.isEmpty()) {
                    EmptyState("No results for \"${query.trim()}\"")
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(results) { item ->
                            ResultCard(
                                title = item.name,
                                subtitle = if (item.highlight.isNotBlank() && item.highlight != "...") item.highlight else item.preamble,
                                metaLeft = item.legislationType.uppercase(),
                                metaRight = item.yearOfAmendment?.let { "Amended in $it" }.orEmpty(),
                                onClick = { onOpenLegislationDetail(item.id) },
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            OutlinedButton(
                onClick = { onOpenItemList(buildItemListRoute(mode = "trending", title = "Trending")) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open Trending")
            }
        }
    }
}

@Composable
private fun OptionCard(
    title: String,
    description: String,
    onClick: () -> Unit,
) {
    OutlinedCard(onClick = onClick, modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            Text(description, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
private fun EmptyState(text: String) {
    Box(modifier = Modifier.fillMaxWidth().padding(top = 24.dp), contentAlignment = Alignment.Center) {
        Text(text, color = MaterialTheme.colorScheme.outline)
    }
}

@Composable
private fun ResultCard(
    title: String,
    subtitle: String,
    metaLeft: String,
    metaRight: String,
    onClick: () -> Unit,
) {
    ElevatedCard(onClick = onClick, modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(stripHtml(title), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            Text(stripHtml(subtitle), style = MaterialTheme.typography.bodyMedium, maxLines = 3, overflow = TextOverflow.Ellipsis)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                MetaPill(metaLeft)
                MetaPill(metaRight)
            }
        }
    }
}

@Composable
private fun MetaPill(text: String) {
    if (text.isBlank()) return
    Box(
        modifier = Modifier
            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Text(text, style = MaterialTheme.typography.labelMedium)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun InfoScreen(
    onOpenTerms: () -> Unit,
    onOpenPrivacy: () -> Unit,
    onLogout: () -> Unit,
) {
    Scaffold(topBar = { TopAppBar(title = { Text("Info") }) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(
                text = "Apptorney is a single-source legal research platform for Zambian case law and legislation.",
                style = MaterialTheme.typography.bodyLarge,
            )
            OutlinedButton(onClick = onOpenTerms, modifier = Modifier.fillMaxWidth()) {
                Text("Terms of Use")
            }
            OutlinedButton(onClick = onOpenPrivacy, modifier = Modifier.fillMaxWidth()) {
                Text("Privacy Policy")
            }
            Button(
                onClick = onLogout,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Icon(Icons.Default.Refresh, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign Out")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CaseSegmentationScreen(
    resourceType: String,
    contentRepository: ContentRepository,
    onBack: () -> Unit,
    onOpenItemList: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }

    var areaGroups by remember { mutableStateOf<Map<String, List<Pair<String, String>>>>(emptyMap()) }
    var loading by rememberSaveable { mutableStateOf(false) }

    val decades = remember(resourceType) {
        if (resourceType == "years") {
            createDecadeMenu(1900)
        } else {
            emptyList()
        }
    }

    LaunchedEffect(resourceType) {
        if (resourceType == "themes") {
            loading = true
            when (val result = contentRepository.getAreasOfLaw()) {
                is ApiResult.Success -> {
                    areaGroups = result.data
                        .sortedBy { it.name }
                        .groupBy { it.name.firstOrNull()?.uppercase() ?: "#" }
                        .mapValues { entry ->
                            entry.value.map { it.id to it.name }
                        }
                }

                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }
            loading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (resourceType == "years") "Select Year" else "Select Domain") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = null)
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        if (loading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(10.dp),
            ) {
                if (resourceType == "years") {
                    decades.forEach { decade ->
                        item {
                            Text(
                                decade.title,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                        items(decade.years) { year ->
                            SegmentationRow(title = year.toString()) {
                                onOpenItemList(
                                    buildItemListRoute(
                                        mode = "caseByYear",
                                        year = year,
                                        title = "$year Cases",
                                    ),
                                )
                            }
                        }
                    }
                } else {
                    areaGroups.keys.sorted().forEach { key ->
                        item {
                            Text(
                                key,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                        items(areaGroups[key].orEmpty()) { pair ->
                            SegmentationRow(title = pair.second) {
                                onOpenItemList(
                                    buildItemListRoute(
                                        mode = "caseByArea",
                                        type = pair.first,
                                        title = pair.second,
                                    ),
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LegislationSegmentationScreen(
    resourceType: String,
    onBack: () -> Unit,
    onOpenItemList: (String) -> Unit,
) {
    val decades = remember(resourceType) {
        when (resourceType) {
            "acts" -> createDecadeMenu(1990)
            "sis" -> createDecadeMenu(1900)
            else -> emptyList()
        }
    }

    val volumes = remember { (1..26).toList() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(if (resourceType == "volumes") "Select Volume" else "Select Year")
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = null)
                    }
                },
            )
        },
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(10.dp),
        ) {
            if (resourceType == "volumes") {
                items(volumes) { volume ->
                    SegmentationRow(title = "Volume $volume") {
                        onOpenItemList(
                            buildItemListRoute(
                                mode = "legislationByVolume",
                                volume = volume,
                                title = "Volume $volume",
                            ),
                        )
                    }
                }
            } else {
                decades.forEach { decade ->
                    item {
                        Text(
                            decade.title,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    items(decade.years) { year ->
                        SegmentationRow(title = year.toString()) {
                            val type = if (resourceType == "acts") "Acts" else "SIs"
                            onOpenItemList(
                                buildItemListRoute(
                                    mode = "legislationByYear",
                                    type = type,
                                    year = year,
                                    title = "$year $type",
                                ),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SegmentationRow(title: String, onClick: () -> Unit) {
    OutlinedCard(onClick = onClick, modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp)) {
        Text(title, modifier = Modifier.padding(14.dp), style = MaterialTheme.typography.bodyLarge)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ItemListScreen(
    args: ItemListArgs,
    contentRepository: ContentRepository,
    onBack: () -> Unit,
    onOpenCaseDetail: (String) -> Unit,
    onOpenLegislationDetail: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }

    var loading by rememberSaveable { mutableStateOf(true) }
    var items by remember { mutableStateOf<List<HomeItem>>(emptyList()) }

    LaunchedEffect(args) {
        loading = true
        when (args.mode) {
            "caseByArea" -> when (val result = contentRepository.getCasesByArea(args.type)) {
                is ApiResult.Success -> {
                    items = result.data.map {
                        HomeItem(
                            title = it.name,
                            summary = if (it.summaryOfRuling.isNotBlank()) it.summaryOfRuling else it.highlight,
                            type = "case",
                            sourceId = it.id,
                        )
                    }
                }

                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "caseByYear" -> when (val result = contentRepository.getCasesByYear(args.year)) {
                is ApiResult.Success -> {
                    items = result.data.map {
                        HomeItem(
                            title = it.name,
                            summary = if (it.summaryOfRuling.isNotBlank()) it.summaryOfRuling else it.highlight,
                            type = "case",
                            sourceId = it.id,
                        )
                    }
                }

                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "legislationByVolume" -> when (val result = contentRepository.getLegislationsByVolume(args.volume)) {
                is ApiResult.Success -> {
                    items = result.data.map {
                        HomeItem(
                            title = it.name,
                            summary = it.preamble,
                            type = "legislation",
                            sourceId = it.id,
                        )
                    }
                }

                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "legislationByYear" -> when (val result = contentRepository.getLegislationsByYear(args.year, args.type)) {
                is ApiResult.Success -> {
                    items = result.data.map {
                        HomeItem(
                            title = it.name,
                            summary = it.preamble,
                            type = "legislation",
                            sourceId = it.id,
                        )
                    }
                }

                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "bookmarks" -> when (val result = contentRepository.getBookmarks()) {
                is ApiResult.Success -> items = result.data
                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "news" -> when (val result = contentRepository.getNews()) {
                is ApiResult.Success -> items = result.data
                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }

            "trending" -> when (val result = contentRepository.getTrends()) {
                is ApiResult.Success -> items = result.data
                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
            }
        }

        loading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(args.title) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = null)
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        if (loading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (items.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text("No results")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(vertical = 10.dp),
            ) {
                items(items) { item ->
                    OutlinedCard(
                        onClick = {
                            if (item.type == "case") onOpenCaseDetail(item.sourceId)
                            if (item.type == "legislation") onOpenLegislationDetail(item.sourceId)
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(stripHtml(item.title), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(stripHtml(item.summary), maxLines = 4, overflow = TextOverflow.Ellipsis)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CaseDetailScreen(
    caseId: String,
    contentRepository: ContentRepository,
    bookmarkedIds: Set<String>,
    onBack: () -> Unit,
    onBookmarkChanged: (Set<String>) -> Unit,
    onOpenCaseDetail: (String) -> Unit,
    onOpenLegislationDetail: (String) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var loading by rememberSaveable { mutableStateOf(true) }
    var caseDetail by remember { mutableStateOf<CaseDetail?>(null) }
    var searchQuery by rememberSaveable { mutableStateOf("") }
    var currentMatchIndex by rememberSaveable { mutableStateOf(0) }
    var bookmarked by rememberSaveable(caseId) { mutableStateOf(bookmarkedIds.contains(caseId)) }

    var showFeedback by rememberSaveable { mutableStateOf(false) }
    var feedbackText by rememberSaveable { mutableStateOf("") }

    var sections by remember {
        mutableStateOf(
            mapOf(
                "Cases Referenced" to false,
                "Legislations Referenced" to false,
                "Holding" to true,
            ),
        )
    }

    val totalMatches by remember(searchQuery, caseDetail) {
        derivedStateOf {
            val detail = caseDetail ?: return@derivedStateOf 0
            val q = searchQuery.trim()
            if (q.isBlank()) return@derivedStateOf 0
            var count = 0
            count += countMatches(stripHtml(detail.name), q)
            count += countMatches(detail.areaOfLawName, q)
            count += countMatches(detail.caseNumber, q)
            detail.caseReferences.forEach { count += countMatches(stripHtml(it.name), q) }
            detail.legislationReferences.forEach { count += countMatches(stripHtml(it.name), q) }
            count += countMatches(stripHtml(detail.judgement), q)
            count
        }
    }

    val holdingOffset by remember(searchQuery, caseDetail) {
        derivedStateOf {
            val detail = caseDetail ?: return@derivedStateOf 0
            val q = searchQuery.trim()
            if (q.isBlank()) return@derivedStateOf 0
            countMatches(stripHtml(detail.name), q) +
                countMatches(detail.areaOfLawName, q) +
                countMatches(detail.caseNumber, q) +
                caseDetail!!.caseReferences.sumOf { countMatches(stripHtml(it.name), q) } +
                caseDetail!!.legislationReferences.sumOf { countMatches(stripHtml(it.name), q) }
        }
    }

    LaunchedEffect(caseId) {
        loading = true
        when (val result = contentRepository.loadCase(caseId)) {
            is ApiResult.Success -> {
                caseDetail = result.data
                bookmarked = bookmarkedIds.contains(result.data.id)
            }

            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
        }
        loading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(caseDetail?.name?.let { stripHtml(it).take(40) } ?: "Case Details") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = null)
                    }
                },
                actions = {
                    IconButton(onClick = {
                        val detail = caseDetail ?: return@IconButton
                        scope.launch {
                            when (val result = contentRepository.addBookmark(detail.id, "case")) {
                                is ApiResult.Success -> {
                                    bookmarked = !bookmarked
                                    val updated = bookmarkedIds.toMutableSet()
                                    if (bookmarked) updated += detail.id else updated -= detail.id
                                    onBookmarkChanged(updated)
                                }

                                is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                            }
                        }
                    }) {
                        Icon(if (bookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder, contentDescription = null)
                    }
                    IconButton(onClick = { showFeedback = true }) {
                        Icon(Icons.Default.Info, contentDescription = null)
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        if (loading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            val detail = caseDetail
            if (detail == null) {
                Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text("Unable to load case")
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    item {
                        Column {
                            OutlinedTextField(
                                value = searchQuery,
                                onValueChange = {
                                    searchQuery = it
                                    currentMatchIndex = 0
                                },
                                modifier = Modifier.fillMaxWidth(),
                                placeholder = { Text("Search within this case") },
                                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                            )
                            if (searchQuery.isNotBlank() && totalMatches > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    Text(
                                        "${currentMatchIndex + 1}/$totalMatches",
                                        style = MaterialTheme.typography.bodySmall,
                                    )
                                    IconButton(onClick = {
                                        currentMatchIndex = if (currentMatchIndex > 0) currentMatchIndex - 1 else totalMatches - 1
                                    }) {
                                        Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Previous match")
                                    }
                                    IconButton(onClick = {
                                        currentMatchIndex = if (currentMatchIndex < totalMatches - 1) currentMatchIndex + 1 else 0
                                    }) {
                                        Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Next match")
                                    }
                                }
                            }
                        }
                    }

                    item {
                        SummaryCard(
                            title = stripHtml(detail.name),
                            labels = listOf(
                                detail.areaOfLawName,
                                detail.caseNumber,
                                "${detail.courtName} | ${detail.jurisdictionName} Jurisdiction | ${detail.locationName}",
                                detail.coram.joinToString("\n"),
                            ),
                            body = "",
                            searchQuery = searchQuery,
                        )
                    }

                    item {
                        ExpandableSection(
                            title = "Cases Referenced",
                            expanded = sections["Cases Referenced"] == true,
                            onToggle = { sections = toggleOneSection(sections, "Cases Referenced") },
                        ) {
                            if (detail.caseReferences.isEmpty()) {
                                Text("No case references", style = MaterialTheme.typography.bodyMedium)
                            } else {
                                detail.caseReferences.forEach { ref ->
                                    TextButton(onClick = { onOpenCaseDetail(ref.id) }) {
                                        Text(stripHtml(ref.name), modifier = Modifier.fillMaxWidth())
                                    }
                                }
                            }
                        }
                    }

                    item {
                        ExpandableSection(
                            title = "Legislations Referenced",
                            expanded = sections["Legislations Referenced"] == true,
                            onToggle = { sections = toggleOneSection(sections, "Legislations Referenced") },
                        ) {
                            if (detail.legislationReferences.isEmpty()) {
                                Text("No legislation references", style = MaterialTheme.typography.bodyMedium)
                            } else {
                                detail.legislationReferences.forEach { ref ->
                                    TextButton(onClick = { onOpenLegislationDetail(ref.id) }) {
                                        Text(stripHtml(ref.name), modifier = Modifier.fillMaxWidth())
                                    }
                                }
                            }
                        }
                    }

                    item {
                        ExpandableSection(
                            title = "Holding",
                            expanded = sections["Holding"] == true,
                            onToggle = { sections = toggleOneSection(sections, "Holding") },
                        ) {
                            HighlightedText(
                                text = stripHtml(detail.judgement),
                                query = searchQuery,
                                currentMatchIndex = currentMatchIndex,
                                globalOffset = holdingOffset,
                            )
                        }
                    }
                }
            }
        }

        if (showFeedback) {
            FeedbackDialog(
                text = feedbackText,
                onTextChange = { feedbackText = it },
                onDismiss = { showFeedback = false },
                onSend = {
                    val detail = caseDetail ?: return@FeedbackDialog
                    scope.launch {
                        val version = "${BuildConfig.VERSION_NAME}.${BuildConfig.VERSION_CODE}"
                        when (val result = contentRepository.sendFeedback(feedbackText, detail.id, "case", version)) {
                            is ApiResult.Success -> {
                                showFeedback = false
                                feedbackText = ""
                                snackbarHost.showSnackbar("Thank you. Your feedback was sent.")
                            }

                            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                        }
                    }
                },
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LegislationDetailScreen(
    legislationId: String,
    title: String,
    contentRepository: ContentRepository,
    bookmarkedIds: Set<String>,
    readOnly: Boolean,
    onBack: () -> Unit,
    onBookmarkChanged: (Set<String>) -> Unit,
) {
    val snackbarHost = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var loading by rememberSaveable { mutableStateOf(true) }
    var detail by remember { mutableStateOf<LegislationDetail?>(null) }
    var searchQuery by rememberSaveable { mutableStateOf("") }
    var currentMatchIndex by rememberSaveable { mutableStateOf(0) }
    var showFeedback by rememberSaveable { mutableStateOf(false) }
    var feedbackText by rememberSaveable { mutableStateOf("") }
    var bookmarked by rememberSaveable(legislationId) { mutableStateOf(bookmarkedIds.contains(legislationId)) }

    var expandedMap by remember { mutableStateOf<Map<String, Boolean>>(emptyMap()) }

    LaunchedEffect(legislationId) {
        loading = true
        when (val result = contentRepository.loadLegislation(legislationId)) {
            is ApiResult.Success -> {
                detail = result.data
                bookmarked = bookmarkedIds.contains(result.data.id)

                val topParts = if (result.data.parts.size == 1) {
                    result.data.parts.first().subParts
                } else {
                    result.data.parts
                }
                expandedMap = topParts.associate { formatPartTitle(it) to false }
            }

            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
        }
        loading = false
    }

    val totalMatches by remember(searchQuery, detail) {
        derivedStateOf {
            val loaded = detail ?: return@derivedStateOf 0
            val q = searchQuery.trim()
            if (q.isBlank()) return@derivedStateOf 0
            var count = 0
            count += countMatches(stripHtml(loaded.legislationName), q)
            count += countMatches(loaded.legislationType, q)
            count += countMatches(loaded.enactment, q)
            count += countMatches(loaded.preamble, q)
            val topParts = if (loaded.parts.size == 1) loaded.parts.first().subParts else loaded.parts
            topParts.forEach { part ->
                flattenPart(part).forEach { flat ->
                    count += countMatches(stripHtml("${flat.number} ${flat.title}".trim()), q)
                    count += countMatches(stripHtml(flat.content), q)
                }
            }
            count
        }
    }

    val summaryMatchCount by remember(searchQuery, detail) {
        derivedStateOf {
            val loaded = detail ?: return@derivedStateOf 0
            val q = searchQuery.trim()
            if (q.isBlank()) return@derivedStateOf 0
            countMatches(stripHtml(loaded.legislationName), q) +
                countMatches(loaded.legislationType, q) +
                countMatches(loaded.enactment, q) +
                countMatches(loaded.preamble, q)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = null)
                    }
                },
                actions = {
                    if (!readOnly) {
                        IconButton(onClick = {
                            val loaded = detail ?: return@IconButton
                            scope.launch {
                                when (val result = contentRepository.addBookmark(loaded.id, "legislation")) {
                                    is ApiResult.Success -> {
                                        bookmarked = !bookmarked
                                        val updated = bookmarkedIds.toMutableSet()
                                        if (bookmarked) updated += loaded.id else updated -= loaded.id
                                        onBookmarkChanged(updated)
                                    }

                                    is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                                }
                            }
                        }) {
                            Icon(if (bookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder, contentDescription = null)
                        }

                        IconButton(onClick = { showFeedback = true }) {
                            Icon(Icons.Default.Info, contentDescription = null)
                        }
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbarHost) },
    ) { padding ->
        if (loading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            val loaded = detail
            if (loaded == null) {
                Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text("Unable to load legislation")
                }
            } else {
                val topParts = if (loaded.parts.size == 1) loaded.parts.first().subParts else loaded.parts

                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    item {
                        Column {
                            OutlinedTextField(
                                value = searchQuery,
                                onValueChange = {
                                    searchQuery = it
                                    currentMatchIndex = 0
                                },
                                modifier = Modifier.fillMaxWidth(),
                                placeholder = { Text("Search within this legislation") },
                                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                            )
                            if (searchQuery.isNotBlank() && totalMatches > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    Text(
                                        "${currentMatchIndex + 1}/$totalMatches",
                                        style = MaterialTheme.typography.bodySmall,
                                    )
                                    IconButton(onClick = {
                                        currentMatchIndex = if (currentMatchIndex > 0) currentMatchIndex - 1 else totalMatches - 1
                                    }) {
                                        Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Previous match")
                                    }
                                    IconButton(onClick = {
                                        currentMatchIndex = if (currentMatchIndex < totalMatches - 1) currentMatchIndex + 1 else 0
                                    }) {
                                        Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Next match")
                                    }
                                }
                            }
                        }
                    }

                    item {
                        val volumeLine = buildString {
                            if (loaded.volumeNumber.isNotBlank() && loaded.chapterNumber.isNotBlank()) {
                                append("Volume ${loaded.volumeNumber}, Chapter ${loaded.chapterNumber}")
                                val assentYear = loaded.dateOfAssent.take(4)
                                if (assentYear.isNotBlank()) append(" of $assentYear")
                                loaded.yearOfAmendment?.let { append(" (Amended in $it)") }
                            }
                        }

                        SummaryCard(
                            title = stripHtml(loaded.legislationName),
                            labels = listOf(loaded.legislationType, volumeLine, loaded.enactment),
                            body = loaded.preamble,
                            searchQuery = searchQuery,
                        )
                    }

                    items(topParts.size) { partIndex ->
                        val part = topParts[partIndex]
                        val sectionTitle = formatPartTitle(part)

                        // Compute global offset for this part
                        val partOffset = summaryMatchCount + topParts.take(partIndex).sumOf { precedingPart ->
                            flattenPart(precedingPart).sumOf { flat ->
                                countMatches(stripHtml("${flat.number} ${flat.title}".trim()), searchQuery.trim()) +
                                    countMatches(stripHtml(flat.content), searchQuery.trim())
                            }
                        }

                        ExpandableSection(
                            title = sectionTitle,
                            expanded = expandedMap[sectionTitle] == true,
                            onToggle = {
                                expandedMap = if (expandedMap[sectionTitle] == true) {
                                    expandedMap.toMutableMap().apply { this[sectionTitle] = false }
                                } else {
                                    expandedMap.keys.associateWith { key -> key == sectionTitle }
                                }
                            },
                        ) {
                            val content = flattenPart(part)
                            if (content.isEmpty()) {
                                Text("No content available", style = MaterialTheme.typography.bodyMedium)
                            } else {
                                var runningOffset = partOffset
                                content.forEach { item ->
                                    if (item.title.isNotBlank()) {
                                        val titleText = stripHtml("${item.number} ${item.title}".trim())
                                        HighlightedText(
                                            text = titleText,
                                            query = searchQuery,
                                            style = MaterialTheme.typography.titleSmall,
                                            currentMatchIndex = currentMatchIndex,
                                            globalOffset = runningOffset,
                                        )
                                        runningOffset += countMatches(titleText, searchQuery.trim())
                                    }
                                    if (item.content.isNotBlank()) {
                                        val contentText = stripHtml(item.content)
                                        HighlightedText(
                                            text = contentText,
                                            query = searchQuery,
                                            currentMatchIndex = currentMatchIndex,
                                            globalOffset = runningOffset,
                                        )
                                        runningOffset += countMatches(contentText, searchQuery.trim())
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                }
                            }
                        }
                    }
                }
            }
        }

        if (showFeedback) {
            FeedbackDialog(
                text = feedbackText,
                onTextChange = { feedbackText = it },
                onDismiss = { showFeedback = false },
                onSend = {
                    val loaded = detail ?: return@FeedbackDialog
                    scope.launch {
                        val version = "${BuildConfig.VERSION_NAME}.${BuildConfig.VERSION_CODE}"
                        when (val result = contentRepository.sendFeedback(feedbackText, loaded.id, "legislation", version)) {
                            is ApiResult.Success -> {
                                feedbackText = ""
                                showFeedback = false
                                snackbarHost.showSnackbar("Thank you. Your feedback was sent.")
                            }

                            is ApiResult.Failure -> snackbarHost.showSnackbar(result.message)
                        }
                    }
                },
            )
        }
    }
}

@Composable
private fun SummaryCard(
    title: String,
    labels: List<String>,
    body: String,
    searchQuery: String,
) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            labels.filter { it.isNotBlank() }.forEach { label ->
                Spacer(modifier = Modifier.height(4.dp))
                Text(stripHtml(label), style = MaterialTheme.typography.bodyMedium)
            }

            if (body.isNotBlank()) {
                Spacer(modifier = Modifier.height(10.dp))
                HighlightedText(stripHtml(body), searchQuery)
            }
        }
    }
}

@Composable
private fun ExpandableSection(
    title: String,
    expanded: Boolean,
    onToggle: () -> Unit,
    content: @Composable () -> Unit,
) {
    OutlinedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onToggle)
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text(if (expanded) "Hide" else "Show", color = MaterialTheme.colorScheme.primary)
            }
            AnimatedVisibility(visible = expanded) {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)) {
                    content()
                }
            }
        }
    }
}

@Composable
private fun HighlightedText(
    text: String,
    query: String,
    style: TextStyle = MaterialTheme.typography.bodyMedium,
    currentMatchIndex: Int = -1,
    globalOffset: Int = 0,
) {
    val normalizedText = text.trim()
    if (query.isBlank()) {
        Text(normalizedText, style = style)
        return
    }

    val q = query.trim().lowercase()
    if (q.isBlank()) {
        Text(normalizedText, style = style)
        return
    }

    val lower = normalizedText.lowercase()
    val matches = mutableListOf<IntRange>()
    var searchFrom = 0
    while (true) {
        val idx = lower.indexOf(q, searchFrom)
        if (idx < 0) break
        matches += idx until (idx + q.length)
        searchFrom = idx + 1
    }

    if (matches.isEmpty()) {
        Text(normalizedText, style = style)
        return
    }

    val highlightColor = Color(0xFFF3A435)
    val currentHighlightColor = Color(0xFFFF6B00)

    val annotated = androidx.compose.ui.text.buildAnnotatedString {
        var cursor = 0
        matches.forEachIndexed { localIndex, range ->
            if (cursor < range.first) {
                append(normalizedText.substring(cursor, range.first))
            }
            val isCurrentMatch = (globalOffset + localIndex) == currentMatchIndex
            pushStyle(
                SpanStyle(
                    background = if (isCurrentMatch) currentHighlightColor else highlightColor,
                    color = Color.Black,
                ),
            )
            append(normalizedText.substring(range.first, range.last + 1))
            pop()
            cursor = range.last + 1
        }
        if (cursor < normalizedText.length) {
            append(normalizedText.substring(cursor))
        }
    }

    Text(text = annotated, style = style)
}

@Composable
private fun FeedbackDialog(
    text: String,
    onTextChange: (String) -> Unit,
    onDismiss: () -> Unit,
    onSend: () -> Unit,
) {
    androidx.compose.material3.AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Feedback") },
        text = {
            Column {
                Text("Please provide your feedback below.")
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = text,
                    onValueChange = onTextChange,
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    maxLines = 6,
                )
            }
        },
        confirmButton = {
            TextButton(onClick = onSend) {
                Text("Send")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        },
    )
}

private fun countMatches(text: String, query: String): Int {
    if (query.isBlank()) return 0
    val q = query.trim().lowercase()
    val lower = text.lowercase()
    var count = 0
    var from = 0
    while (true) {
        val idx = lower.indexOf(q, from)
        if (idx < 0) break
        count++
        from = idx + 1
    }
    return count
}

private fun stripHtml(value: String): String {
    if (value.isBlank()) return ""
    val spanned: Spanned = HtmlCompat.fromHtml(value, HtmlCompat.FROM_HTML_MODE_LEGACY)
    return spanned.toString().replace("\u00A0", " ").trim()
}

/**
 * Light cleanup of AI response text: preserves newlines (needed for markdown
 * parsing) but strips stray HTML tags and normalises whitespace within lines.
 */
private fun cleanAiText(value: String): String {
    if (value.isBlank()) return ""
    return value
        .replace(Regex("<[^>]+>"), "")          // strip any HTML tags
        .replace("\u00A0", " ")                  // non-breaking space → space
        .replace("\r\n", "\n").replace("\r", "\n") // normalise line endings
        .replace(Regex("[ \t]+"), " ")           // collapse horizontal whitespace
        .replace(Regex(" *\n *"), "\n")          // trim spaces around newlines
        .trim()
}

/**
 * Builds a formatted [AnnotatedString] from AI response text (markdown).
 * Handles: **bold**, # / ## / ### headers, bullet lists (- / *), numbered lists (1.),
 * [S1] reference badges, and paragraph spacing via blank-line detection.
 */
private fun buildFormattedText(
    rawText: String,
    refKeys: Set<String>,
): AnnotatedString {
    val inlinePattern = Regex("(\\*\\*.+?\\*\\*|\\[S(\\d+)])")
    val headerPattern = Regex("^(#{1,3})\\s*(.*)")

    fun AnnotatedString.Builder.appendInline(
        text: String,
        extraStyle: SpanStyle? = null,
    ) {
        if (extraStyle != null) pushStyle(extraStyle)
        var cursor = 0
        for (match in inlinePattern.findAll(text)) {
            if (cursor < match.range.first) append(text.substring(cursor, match.range.first))
            val v = match.value
            if (v.startsWith("**") && v.endsWith("**")) {
                withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) {
                    append(v.removePrefix("**").removeSuffix("**"))
                }
            } else {
                val num = match.groupValues[2]
                val tag = "S$num"
                if (num.isNotEmpty() && tag in refKeys) {
                    appendInlineContent("badge_$tag", "[$num]")
                } else {
                    append(v)
                }
            }
            cursor = match.range.last + 1
        }
        if (cursor < text.length) append(text.substring(cursor))
        if (extraStyle != null) pop()
    }

    return buildAnnotatedString {
        val lines = rawText.split("\n")
        var prevWasBlank = false

        for ((i, line) in lines.withIndex()) {
            val trimmed = line.trim()

            // Blank line → paragraph break (double newline)
            if (trimmed.isEmpty()) {
                prevWasBlank = true
                continue
            }

            // Insert spacing before this line
            if (i > 0) {
                if (prevWasBlank) {
                    append("\n\n")  // paragraph gap
                } else {
                    append("\n")
                }
            }
            prevWasBlank = false

            // Header: # / ## / ### (with or without space after hashes)
            val headerMatch = headerPattern.matchEntire(trimmed)
            if (headerMatch != null) {
                val hashes = headerMatch.groupValues[1]
                val content = headerMatch.groupValues[2]
                val style = when (hashes.length) {
                    1 -> SpanStyle(fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    2 -> SpanStyle(fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    else -> SpanStyle(fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                appendInline(content, style)
                continue
            }

            // Bullet list: - or *
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                append("  \u2022  ")
                appendInline(trimmed.drop(2))
                continue
            }

            // Numbered list: 1. 2. etc.
            if (trimmed.matches(Regex("^\\d+[.)]+\\s.*"))) {
                val numEnd = trimmed.indexOfFirst { it == ' ' } + 1
                append("  ${trimmed.substring(0, numEnd)}")
                appendInline(trimmed.substring(numEnd))
                continue
            }

            // Regular line
            appendInline(trimmed)
        }
    }
}

private fun toggleOneSection(current: Map<String, Boolean>, target: String): Map<String, Boolean> {
    val nextExpanded = current[target] != true
    return current.keys.associateWith { key -> key == target && nextExpanded }
}

private fun flattenPart(root: LegislationPart): List<FlatLegislationPart> {
    val list = mutableListOf<FlatLegislationPart>()

    fun recurse(node: LegislationPart) {
        list += FlatLegislationPart(
            number = node.number,
            title = node.title,
            content = if (node.content.isNotBlank()) node.content else node.flatContentNew,
        )
        node.subParts.forEach(::recurse)
    }

    recurse(root)
    return list
}

private fun formatPartTitle(part: LegislationPart): String {
    return "${part.number} ${part.title}".trim().ifBlank { "Section" }
}

private fun createDecadeMenu(start: Int): List<DecadeGroup> {
    val currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)
    val groups = mutableListOf<DecadeGroup>()
    var year = start

    while (year <= currentYear) {
        if (year % 10 == 0) {
            val years = (year until year + 10).filter { it <= currentYear }
            groups += DecadeGroup(title = "${year}s", years = years)
        }
        year += 1
    }

    return groups
}
