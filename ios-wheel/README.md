# Golden Lap Wheel (iPhone)

The game's phone-wheel page inside a thin iPhone app. The app adds two things Safari will not give a web page: a clean full screen, and the phone's haptics (gear changes, kerbs, barriers).

Status: written but **never built**. It was made on a Mac without Xcode, so only the Swift syntax has been checked.

## Put it on your own iPhone

1. Install Xcode from the Mac App Store (free, a large download) and open it once so it finishes setting up.
2. Open `GoldenLapWheel.xcodeproj`.
3. In Xcode: click the blue project icon, then the GoldenLapWheel target, then **Signing & Capabilities**, and pick your Apple account under **Team**. A free account works.
4. Plug in the iPhone, choose it at the top of the window, and press the Run button.
5. First time only, on the phone: Settings, General, VPN & Device Management, trust your developer account. The phone may also ask you to turn on Developer Mode.

With a free Apple account the app stops opening after 7 days; press Run again to renew it.

## Use it

On the game, choose **Phone wheel**. Type the code shown after `?w=` into the app and press Connect.

## Change the project

Edit `project.yml`, then run `xcodegen generate`.
