import SwiftUI
import WebKit

/// The game's own phone-wheel page, in a web view. Everything about steering and the link to the game is the web page's job;
/// the app adds the two things Safari will not give a web page: a clean full screen, and the phone's haptics.
struct WheelWeb: UIViewRepresentable {
    let code: String

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.userContentController.add(context.coordinator, name: "haptic")
        // tell the page it is inside the app before any of its own script runs
        cfg.userContentController.addUserScript(WKUserScript(source: "window.GL_NATIVE = true;", injectionTime: .atDocumentStart, forMainFrameOnly: true))
        let web = WKWebView(frame: .zero, configuration: cfg)
        web.uiDelegate = context.coordinator
        web.isOpaque = false
        web.backgroundColor = UIColor(red: 0.082, green: 0.09, blue: 0.102, alpha: 1)
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        var parts = URLComponents(string: "https://golden-lap.space.fast/")!
        parts.queryItems = [URLQueryItem(name: "w", value: code)]
        web.load(URLRequest(url: parts.url!, cachePolicy: .reloadIgnoringLocalCacheData))
        return web
    }

    func updateUIView(_ web: WKWebView, context: Context) {}

    static func dismantleUIView(_ web: WKWebView, coordinator: Coordinator) {
        web.configuration.userContentController.removeScriptMessageHandler(forName: "haptic")
    }

    final class Coordinator: NSObject, WKScriptMessageHandler, WKUIDelegate {
        private let haptics = Haptics()

        // the page calls window.webkit.messageHandlers.haptic.postMessage("g" | "k" | "b")
        func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
            if let kind = message.body as? String { haptics.play(kind) }
        }

        // the wheel is the whole point of the app, so the tilt sensor is allowed without a second question
        func webView(_ webView: WKWebView, requestDeviceOrientationAndMotionPermissionFor origin: WKSecurityOrigin,
                     initiatedByFrame frame: WKFrameInfo, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
            decisionHandler(origin.host == "golden-lap.space.fast" ? .grant : .deny)
        }
    }
}
