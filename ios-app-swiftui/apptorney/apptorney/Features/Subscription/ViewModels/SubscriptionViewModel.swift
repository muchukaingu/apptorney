import Foundation
import StoreKit

@MainActor
class SubscriptionViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isSubscribed: Bool = false
    @Published var isLoading: Bool = false
    @Published var snackbar: SnackbarMessage?

    private static let productIds = ["apptorney_subs"]

    // MARK: - Load Products

    func loadProducts() async {
        isLoading = true
        do {
            products = try await Product.products(for: Self.productIds)
        } catch {
            snackbar = SnackbarMessage(text: "Failed to load products: \(error.localizedDescription)")
        }
        isLoading = false
    }

    // MARK: - Purchase

    func purchase() async {
        guard let product = products.first else {
            snackbar = SnackbarMessage(text: "No product available")
            return
        }

        isLoading = true
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                isSubscribed = true
                snackbar = SnackbarMessage(text: "Subscription activated!", isError: false)
            case .userCancelled:
                break
            case .pending:
                snackbar = SnackbarMessage(text: "Purchase is pending approval", isError: false)
            @unknown default:
                break
            }
        } catch {
            snackbar = SnackbarMessage(text: "Purchase failed: \(error.localizedDescription)")
        }
        isLoading = false
    }

    // MARK: - Check Subscription Status

    func checkSubscriptionStatus() async {
        for await result in Transaction.currentEntitlements {
            if let transaction = try? checkVerified(result) {
                if transaction.productID == "apptorney_subs" && transaction.revocationDate == nil {
                    isSubscribed = true
                    return
                }
            }
        }
        isSubscribed = false
    }

    // MARK: - Restore Purchases

    func restorePurchases() async {
        isLoading = true
        do {
            try await AppStore.sync()
            await checkSubscriptionStatus()
            if isSubscribed {
                snackbar = SnackbarMessage(text: "Subscription restored!", isError: false)
            } else {
                snackbar = SnackbarMessage(text: "No active subscription found")
            }
        } catch {
            snackbar = SnackbarMessage(text: "Restore failed: \(error.localizedDescription)")
        }
        isLoading = false
    }

    // MARK: - Helpers

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let item):
            return item
        }
    }
}
