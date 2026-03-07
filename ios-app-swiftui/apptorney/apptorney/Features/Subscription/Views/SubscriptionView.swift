import SwiftUI

struct SubscriptionView: View {
    @StateObject private var viewModel = SubscriptionViewModel()

    var body: some View {
        Group {
            if viewModel.isSubscribed {
                subscribedView
            } else {
                notSubscribedView
            }
        }
        .navigationTitle("Subscription")
        .navigationBarTitleDisplayMode(.inline)
        .snackbar(message: $viewModel.snackbar)
        .task {
            await viewModel.checkSubscriptionStatus()
            await viewModel.loadProducts()
        }
    }

    // MARK: - Subscribed

    private var subscribedView: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 64))
                .foregroundColor(.green)

            Text("Subscription Active")
                .font(.title2.bold())

            Text("You have full access to all Apptorney features.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            Spacer()
        }
    }

    // MARK: - Not Subscribed

    private var notSubscribedView: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "star.circle")
                .font(.system(size: 64))
                .foregroundColor(.appBlue)

            Text("Apptorney Premium")
                .font(.title2.bold())

            Text("Get unlimited access to AI-powered legal research, case law analysis, and more.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            if let product = viewModel.products.first {
                Text(product.displayPrice)
                    .font(.title3.bold())
                    .foregroundColor(.appBlue)

                Button(action: {
                    Task { await viewModel.purchase() }
                }) {
                    Text("Subscribe")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.appBlue)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 32)
                .disabled(viewModel.isLoading)
            }

            Button(action: {
                Task { await viewModel.restorePurchases() }
            }) {
                Text("Restore Purchases")
                    .font(.subheadline)
                    .foregroundColor(.appBlue)
            }
            .disabled(viewModel.isLoading)

            if viewModel.isLoading {
                ProgressView()
            }

            Spacer()
        }
    }
}
