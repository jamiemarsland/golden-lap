import UIKit

/// What the car is feeling, turned into taps in your hands.
/// "g" a gear change, "k" a kerb or the grass (sent about ten times a second while it lasts), "b" a barrier.
final class Haptics {
    private let gear = UIImpactFeedbackGenerator(style: .rigid)
    private let kerb = UIImpactFeedbackGenerator(style: .heavy)
    private let wall = UIImpactFeedbackGenerator(style: .heavy)
    private let crash = UINotificationFeedbackGenerator()

    init() { [gear, kerb, wall].forEach { $0.prepare() }; crash.prepare() }

    func play(_ kind: String) {
        switch kind {
        case "g":
            gear.impactOccurred(intensity: 0.75); gear.prepare()
        case "k":
            kerb.impactOccurred(intensity: 0.9); kerb.prepare()
        case "b":
            wall.impactOccurred(intensity: 1.0)
            crash.notificationOccurred(.error)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.09) { [wall] in wall.impactOccurred(intensity: 1.0); wall.prepare() }
            crash.prepare()
        default:
            break
        }
    }
}
