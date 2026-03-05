## MapLibre Native MarkerView Widget
Renders map [markers](https://maplibre.org/maplibre-react-native/docs/components/general/marker-view) on OpenStreetMap style vector maps inside your native app with [MapLibre Native](https://maplibre.org/).

![Demo screenshot 01](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_001.png)![Demo screenshot 02](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_002.png) ![Demo screenshot 03| 619x1283](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_003.png) 

## Features
1. Render a [JSON data set](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/sample-MapData.json) as interactive react native markers to a map directly from your Native mobile app
2. Inclues open-source Git repository which lets you customize the widget to your custom `MarkeyView` data set and `MapView` requirements
3. Get a demo up an running quickly using open-source Map styles maintained by the [MapLibre](https://github.com/maplibre/demotiles) community
4. Ability to configure commercially available Map styles/tiles from providers like [MapTiler](https://www.maptiler.com/) for production deployments

## Usage
1. Download widget from the Mendix Marketplace
2. Configure the `Map Data` widget property with a JSON string containing the [sample JSON data set](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/sample-MapData.json)
3. Configure the `Map Style` widget property with a string referencing the demo Map style `https://demotiles.maplibre.org/style.json`

## Demo project
Navigate to the `./test/MapLibreTestApp` directory to access the sample implementation

## Issues, suggestions and feature requests
Submit issues [here](https://github.com/Entidad/mendix-react-native-maplibre/issues)

## Development and contribution
1. Switch to Node 20 by using: `nvm use 20`
2. Install NPM package dependencies by using: `npm install`.
3. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

If you are interested in contributing improvements or additional mapping capabilities, submit a pull request (PR)    

## Depedencies
1. Mendix Studio Pro `10.25.15` or newer
2. Mendix Native Template `v14.1.14`
3. [MapLibre](https://maplibre.org/) open-source mapping libraries
4. [MapLibre React Native library](https://github.com/maplibre/maplibre-react-native)
5. [MapLibre React Native docs](https://maplibre.org/maplibre-react-native/)
6. [MapLibre Demo Tiles](https://github.com/maplibre/demotiles)
7. Swift Package Spec for iOS: `https://github.com/maplibre/maplibre-gl-native-distribution`

## Native build setup
1. Install [MapLibre ReactNative](https://maplibre.org/maplibre-react-native/docs/setup/react-native) npm package `@maplibre/maplibre-react-native`

### iOS build instructions
For iOS, follow the instructions documented [here](https://maplibre.org/maplibre-react-native/docs/setup/react-native)

#### MapLibre Native iOS Post Install Hooks
On iOS it's necessary to add `$MLRN.post_install(installer)` to the `post_install` block in the `ios/Podfile` is necessary:
```
post_install do |installer|
  # Other post install hooks...
+ $MLRN.post_install(installer)
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
