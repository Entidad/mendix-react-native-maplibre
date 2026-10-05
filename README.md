## MapLibre Native MarkerView Widget
Renders MapLibre Native [map](https://maplibre.org/maplibre-react-native/docs/components/map) and [marker](https://maplibre.org/maplibre-react-native/docs/components/annotations/marker) views on OpenStreetMap style vector maps inside your native app with [MapLibre Native](https://maplibre.org/).

![Demo screenshot 01](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_001.png)![Demo screenshot 02](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_002.png) ![Demo screenshot 03| 619x1283](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_003.png) 

## Features
1. Render any Mendix entity as interactive markers, retrieved from the Database, over an Association, or by a Nanoflow
2. Multiple marker layers, each with its own data source, bundled image icon (no network fetch) and popup
3. Design the marker popup in Studio Pro with any widgets, and trigger an action with the tapped object
4. Inclues open-source Git repository which lets you customize the widget to your custom `MarkeyView` data set and `MapView` requirements
5. Get a demo up an running quickly using open-source Map styles maintained by the [MapLibre](https://github.com/maplibre/demotiles) community
6. Ability to configure commercially available Map styles/tiles from providers like [MapTiler](https://www.maptiler.com/) for production deployments

## Usage
1. Download widget from the Mendix Marketplace
2. Configure the `Map Style` widget property with a string referencing the demo Map style `https://demotiles.maplibre.org/style.json`
3. Add one or more `Marker layers`. For each layer:
    - **Data source**: Database (with optional XPath), Association, or Nanoflow returning a list of marker objects
    - **Latitude / Longitude**: Decimal, Integer, Long or String attributes; objects without a valid coordinate are skipped
    - **Icon**: a static image from an image collection (PNG recommended), bundled into the app. Use a separate layer per icon to show different marker types
    - **Popup content**: drop any widgets here; they render in a popup with the tapped object as context
    - **On marker click**: optional action that receives the tapped object

4. Optional **Popup visible**: a Boolean attribute on the page's context object, set to `true` when a marker is tapped; set it to `false` (e.g. from a close button in the popup content) to close the popup. The popup scrolls when its content is taller than the screen
5. Optional **Attribution**: show/hide and position the (i) attribution button, add an always-visible credit line (e.g. `© MapTiler © OpenStreetMap contributors`), and set a tint color for the map's buttons

> **Upgrading from 2.x:** the JSON `Map Data` attribute was removed in `3.0.0`. Point a marker layer at the entity your JSON was exported from and rebuild the popup with widgets in `Popup content`.

## Demo project
Navigate to the `./test/MapLibreTestApp` directory to access the sample implementation

## Issues, suggestions and feature requests
Submit issues [here](https://github.com/Entidad/mendix-react-native-maplibre/issues)

## Development and contribution
1. Switch to Node 24 (bundled with Studio Pro 11.12; minimum supported is 20.19.4) by using: `nvm use 24`
2. Install NPM package dependencies by using: `npm install`.
3. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

If you are interested in contributing improvements or additional mapping capabilities, submit a pull request (PR)    

## Depedencies
1. Mendix Studio Pro `11.12.1` or newer (bundles Node `24`, React Native `0.84.1` / React `19`)
2. Mendix Native Template `v19.1.2`
3. [MapLibre React Native library](https://github.com/maplibre/maplibre-react-native) `v11.3.6`
4. [MapLibre](https://maplibre.org/) open-source mapping libraries
5. [MapLibre React Native docs](https://maplibre.org/maplibre-react-native/)
6. [MapLibre Demo Tiles](https://github.com/maplibre/demotiles)
7. Swift Package Spec for iOS: `https://github.com/maplibre/maplibre-gl-native-distribution`

> **Note:** Widget `3.x` and `2.x` target Mendix `11.x` and MapLibre React Native `v11`. For Mendix Studio Pro `10.x` (Native Template `v14.x`, MapLibre React Native `v10`), use widget `1.0.0`.

## Native build setup
1. Use demo Native template embedded in `./test/MapLibreTestApp/resources/nativeTemplate`
2. Install [MapLibre ReactNative](https://maplibre.org/maplibre-react-native/docs/setup/react-native) npm package `npm install @maplibre/maplibre-react-native`
3. `nvm use 24`
4. `npm install --legacy-peer-deps`
5. `npm run configure`
6. `cd ios`
7. `pod install --repo-update`

### iOS build instructions
For iOS, follow the instructions documented [here](https://maplibre.org/maplibre-react-native/docs/setup/react-native)

#### MapLibre Native iOS Post Install Hooks
On iOS it's necessary to add `$MLRN.post_install(installer)` to the `post_install` block in the `ios/Podfile` is necessary:
```
post_install do |installer|
  # Other post install hooks...
  $MLRN.post_install(installer)
  ...
end
```
#### For `Release` builds, add a Build Phase `Run Script`
Add the following shell script to your `Xcode` project’s Build Phases (`only for Install builds`):
```
if [ "$XCODE_VERSION_MAJOR" = "2600" ]; then  
    echo "Remove maplibre signature file (xcode 26 workaround)"
    rm -rf "$BUILD_DIR/ReleaseDevApp-iphoneos/maplibre-react-native/MapLibre.xcframework-ios.signature"
    rm -rf "$BUILD_DIR/Release-iphoneos/maplibre-react-native/MapLibre.xcframework-ios.signature"
fi
```
