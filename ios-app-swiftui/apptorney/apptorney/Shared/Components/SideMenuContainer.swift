import SwiftUI

struct SideMenuContainer<Menu: View, Content: View>: View {
    @Binding var isOpen: Bool
    let menu: Menu
    let content: Content
    private let menuWidth: CGFloat = 270

    init(isOpen: Binding<Bool>, @ViewBuilder menu: () -> Menu, @ViewBuilder content: () -> Content) {
        self._isOpen = isOpen
        self.menu = menu()
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .leading) {
            content
                .offset(x: isOpen ? menuWidth : 0)
                .disabled(isOpen)

            if isOpen {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .offset(x: menuWidth)
                    .onTapGesture { withAnimation(.easeInOut(duration: 0.25)) { isOpen = false } }
            }

            menu
                .frame(width: menuWidth)
                .offset(x: isOpen ? 0 : -menuWidth)
        }
        .animation(.easeInOut(duration: 0.25), value: isOpen)
        .gesture(
            DragGesture()
                .onEnded { value in
                    if value.translation.width > 80 { withAnimation { isOpen = true } }
                    else if value.translation.width < -80 { withAnimation { isOpen = false } }
                }
        )
    }
}
