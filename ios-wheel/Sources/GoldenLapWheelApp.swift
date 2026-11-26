import SwiftUI

@main
struct GoldenLapWheelApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .preferredColorScheme(.dark)
                .statusBarHidden(true)
                .persistentSystemOverlays(.hidden)
        }
    }
}

/// Type the five-letter code the game shows, then the wheel takes over the whole screen.
struct RootView: View {
    @State private var code = ""
    @State private var connected: String? = nil
    @FocusState private var typing: Bool

    private let yellow = Color(red: 0.95, green: 0.89, blue: 0.42)
    private let ink = Color(red: 0.082, green: 0.09, blue: 0.102)

    var body: some View {
        ZStack {
            ink.ignoresSafeArea()
            if let c = connected {
                WheelWeb(code: c).ignoresSafeArea()
                VStack {                                   // a way back, kept out of the way: touching the wheel page itself is the brake
                    HStack {
                        Button { connected = nil } label: {
                            Image(systemName: "xmark").font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white.opacity(0.45)).padding(12)
                        }
                        Spacer()
                    }
                    Spacer()
                }
            } else {
                VStack(spacing: 18) {
                    Text("GOLDEN LAP").font(.system(size: 22, weight: .bold, design: .monospaced)).kerning(5).foregroundColor(yellow)
                    Text("On the game, choose Phone wheel.\nType the code it shows after ?w=")
                        .font(.system(size: 14, design: .monospaced)).multilineTextAlignment(.center).foregroundColor(.white.opacity(0.75))
                    TextField("", text: $code, prompt: Text("CODE").foregroundColor(.white.opacity(0.25)))
                        .font(.system(size: 34, weight: .bold, design: .monospaced)).kerning(6)
                        .multilineTextAlignment(.center).foregroundColor(yellow)
                        .textInputAutocapitalization(.characters).autocorrectionDisabled(true)
                        .keyboardType(.asciiCapable).submitLabel(.go).focused($typing)
                        .frame(width: 230).padding(.vertical, 10)
                        .overlay(Rectangle().stroke(yellow.opacity(0.6), lineWidth: 1))
                        .onChange(of: code) { v in
                            let clean = String(v.uppercased().filter { $0.isLetter || $0.isNumber }.prefix(8))
                            if clean != v { code = clean }
                        }
                        .onSubmit(go)
                    Button(action: go) {
                        Text("CONNECT").font(.system(size: 18, weight: .bold, design: .monospaced)).kerning(3)
                            .foregroundColor(.black).padding(.horizontal, 26).padding(.vertical, 12).background(yellow)
                    }.disabled(code.count < 4).opacity(code.count < 4 ? 0.4 : 1)
                }.padding(24)
                .onAppear { typing = true }
            }
        }
        .onAppear { UIApplication.shared.isIdleTimerDisabled = true }      // the screen must not sleep mid-lap
    }

    private func go() { if code.count >= 4 { typing = false; connected = code } }
}
