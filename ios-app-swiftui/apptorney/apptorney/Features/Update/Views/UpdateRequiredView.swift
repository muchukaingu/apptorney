import SwiftUI

struct UpdateRequiredView: View {
    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "arrow.down.app")
                .font(.system(size: 80))
                .foregroundColor(.appBlue)

            Text("Update Required")
                .font(.title.bold())

            Text("A new version of Apptorney is available. Please update to continue using the app.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            Spacer()

            Button(action: {
                if let url = URL(string: "https://apps.apple.com/app/apptorney/id1234567890") {
                    UIApplication.shared.open(url)
                }
            }) {
                Text("Update Now")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.appBlue)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
        }
    }
}
