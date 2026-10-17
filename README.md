## MapLibre Native Map Widget
Renders interactive markers from your Mendix data on OpenStreetMap-style vector maps inside your native app, using [MapLibre Native](https://maplibre.org/) and [MapLibre React Native](https://maplibre.org/maplibre-react-native/).

![Demo screenshot 01](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_001.png)![Demo screenshot 02](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_002.png) ![Demo screenshot 03| 619x1283](https://github.com/Entidad/mendix-react-native-maplibre/blob/main/test/MapLibreTestApp/resources/demo_003.png) 

## Features
1. Show any Mendix entity as map markers, retrieved from the **Database**, over an **Association**, or by a **Nanoflow**
2. Multiple **marker layers**, each with its own data source, icon, popup and click action, e.g. one layer per marker type
3. Marker icons from your **image collections**, bundled into the app: no network requests
4. Markers are drawn natively by MapLibre (GeoJSON symbol layers), so maps stay fast with thousands of markers
5. Optional **clustering**: nearby markers merge into count bubbles that split apart as you zoom in
6. **Popups designed in Studio Pro** with any widgets: a fixed header and a scrolling content area, with the tapped object as context
7. Close the popup from your own button through a **Popup visible** attribute
8. A **clustering toggle** button lets users switch between grouped and all markers while drilling down
9. Configurable **attribution**: (i) button position, an always-visible credit line, and a tint color
10. A **location button** that runs your own nanoflow (e.g. `GetCurrentLocationMinimumAccuracy`) and centers the map on the result, with a "you are here" dot
11. A **legend** listing each marker layer with its icon and marker count; tapping a layer hides or shows it
12. **Search** that filters markers as you type, with a result list that jumps to a marker and opens its popup
13. Works with open-source styles from the [MapLibre](https://github.com/maplibre/demotiles) community and commercial providers like [MapTiler](https://www.maptiler.com/)
14. Open-source Git repository, so you can customize the widget for your own requirements

## Usage
1. Download the widget from the Mendix Marketplace and place it on a page, inside a data view if you use the **Popup visible** or **Map style** attributes
2. Set **Map style** to an attribute holding a style URL or style JSON, e.g. the demo style `https://demotiles.maplibre.org/style.json`
3. Add one or more **Marker layers** (see below)
4. Optionally configure the popup, attribution and close button (see below)

### Marker layers
Each layer shows the objects of one data source. Use one layer per marker type, e.g. "domestic jobs" and "H-2A jobs", each with an XPath constraint and its own icon.

| Tab | Property | Description |
|---|---|---|
| Data | **Data source** | Database (with optional XPath), Association, or Nanoflow returning a list of marker objects |
| Data | **Latitude / Longitude** | Decimal, Integer, Long or String attributes. Objects without a valid coordinate are skipped |
| Data | **Visible** | Boolean expression on the page's context object deciding whether the layer is shown, e.g. `$currentObject/ShowLocalJobs` (default `true`). Hidden layers are left out of search results |
| Data | **Marker count** | Optional Integer/Long attribute of the page's context object that the widget keeps set to the layer's number of markers, after search filtering (hidden layers are still counted). Use it to show counts in **Legend content** |
| Data | **Search text** | Expression the search matches against and shows in the result list, e.g. `$currentObject/Name + ' ' + $currentObject/City`. When empty, the layer isn't searchable and stays visible while searching |
| Appearance | **Legend label** | Name of the layer in the generated legend and below its search results. When empty, the layer is left out of the generated legend |
| Appearance | **Icon** | Static image from an image collection, bundled into the app. PNG recommended. When empty, a teal dot is shown |
| Appearance | **Icon size** | Size of the icon's largest side, in points (default `32`) |
| Appearance | **Icon anchor** | `Bottom` puts the tip of a pin-shaped icon on the coordinate; use `Center` for round icons |
| Appearance | **Cluster markers** | Groups nearby markers into a bubble showing their count. Tapping a bubble zooms in until it splits (up to street level) |
| Appearance | **Cluster radius** | How close markers must be to merge, in points (default `50`) |
| Appearance | **Cluster color** | Bubble color, e.g. matching the layer's icon (default `#1C7D77`) |
| Appearance | **Spread markers at the same location** | Fans out markers with exactly the same coordinates (e.g. geocoded to the same town) in a small circle of about 100-200 m, so each can be seen and tapped. Without it, such markers stack into one pin and their cluster never splits (default on) |
| Popup | **Popup header** | Widgets pinned to the top of the popup, e.g. a title and a close button |
| Popup | **Popup content** | Widgets shown below the header; scrolls when taller than the screen |
| Events | **On marker click** | Action that receives the tapped marker object (`$currentObject` in the nanoflow arguments) |

A popup opens when a layer's **Popup header** or **Popup content** contains widgets. Each layer has its own drop zones; to reuse one design across layers, put it in a **snippet** and add a snippet call to each layer.

> **Tip:** the nanoflow parameter for **On marker click** must be of the layer's data source entity. Pass the page's context object (e.g. `$dataView1`) as an extra parameter if the nanoflow needs it.

### Widget properties
| Group | Property | Description |
|---|---|---|
| Map | **Map style** | String attribute with the style URL or style JSON |
| Map | **Default latitude / longitude / zoom** | Where the map opens when no location is set in **Location latitude / longitude** (default `34.3575`, `-119.126`, zoom `5`: California) |
| Map | **Cluster label font** | Font for cluster counts; must be served by the map style's glyphs (default `Noto Sans Bold`, used by MapTiler styles; use `Open Sans Semibold` for the MapLibre demo tiles) |
| Map | **Show clustering toggle** | Shows a button in the top right corner that switches between grouped (clustered) and all markers. Only shown when a layer has **Cluster markers** on (default on) |
| Popup | **Popup visible** | Optional Boolean attribute on the page's context object for closing the popup from your own button. The widget sets it to `true` when a marker is tapped; your close button's nanoflow sets it to `false` to close the popup |
| Attribution | **Show attribution button** | Shows the (i) button with credits from the map style (default on) |
| Attribution | **Attribution position** | Corner for the button and credit text (default bottom right). Avoid the top corners when the close button or clustering toggle is shown |
| Attribution | **Attribution text** | Optional always-visible credit line, e.g. `© MapTiler © OpenStreetMap contributors` |
| Attribution | **Tint color** | Optional color for the map's buttons, e.g. `#1C7D77` |
| Controls › Buttons | **Button color** | Color of the icons on the close, search, legend, clustering and location buttons (default `#1C7D77`). The (i) attribution button uses **Tint color** |
| Controls › Location | **On location click** | Action for the location button, typically a nanoflow that gets the device location and stores it in the attributes below. The button is hidden when no action is set |
| Controls › Location | **Location latitude / longitude** | Attributes of the context object holding the user's position. When they hold a value as the page opens, the map opens centered there; otherwise it opens on the **Default latitude / longitude / zoom**. When they change, or when the location action finishes, the map centers on them again. A location dot is shown at the location. Latitude and longitude both `0`, the starting value of numeric attributes, count as no location |
| Controls › Location | **Location zoom** | Zoom level used when opening on or centering on the location (default `14`) |
| Controls › Legend | **Show legend** | Shows a legend button (default off) |
| Controls › Legend | **Open legend on start** | Shows the legend when the map opens (default off) |
| Controls › Legend | **Legend header** | Widgets pinned to the top of a custom legend, e.g. a title and a close button |
| Controls › Legend | **Legend content** | Widgets for a custom legend, shown in a popup like the marker popup; scrolls when taller than the screen |
| Controls › Legend | **Legend visible** | Optional Boolean attribute on the page's context object for closing a custom legend from your own button. The widget sets it to `true` when the legend opens; your close button's nanoflow sets it to `false` to close the legend |
| Controls › Legend | **Legend title** | Heading of the generated legend (default `Legend`) |
| Controls › Legend | **Show marker counts** | Generated legend: shows how many markers each layer has on the map, after search filtering (default on) |
| Controls › Legend | **Toggle layers from legend** | Generated legend: tapping a layer hides or shows its markers (default on) |
| Controls › Search | **Show search** | Shows a search button when a layer has a **Search text** (default off) |
| Controls › Search | **Search placeholder / No results text** | Translatable texts for the search field |
| Events | **On close** | Action for the close button in the top left corner, typically "Close page". The button is hidden when no action is set |

### Map controls
The search, legend, clustering and location buttons stack down the top right corner, so keep **Attribution position** at the bottom when you use them.

**Location button.** The widget doesn't read device location itself; your nanoflow does, so permissions and accuracy stay in your model:
1. Add Decimal attributes, e.g. `UserLatitude` and `UserLongitude`, to the page's context entity and select them as **Location latitude / longitude**
2. Create a nanoflow with the context object as parameter that calls the **GetCurrentLocationMinimumAccuracy** JavaScript action (Nanoflow Commons), then changes the object: `UserLatitude = $Position/Latitude`, `UserLongitude = $Position/Longitude`
3. Select that nanoflow as **On location click**. A spinner shows on the button while it runs

The Native Template already requests the location permissions (`ACCESS_FINE_LOCATION` / `NSLocationWhenInUseUsageDescription`) that Nanoflow Commons needs.

**Legend.** There are two ways to show a legend:
- **Custom** (recommended for long or translated labels): design the legend with any widgets in **Legend header** and **Legend content**. The legend button opens it as a popup card over the dimmed map, just like the marker popup: the header stays in place and the content scrolls. Close it by tapping outside it, with the Android back button, or from your own button by setting **Legend visible** to `false`. The content has the page's context object; to reuse the marker icons, add the same images from your image collection

  To let users choose which markers to show from a custom legend:
  1. Add a Boolean attribute per layer to the page's context entity, e.g. `ShowLocalJobs` and `ShowH2AJobs`, defaulting to `true`
  2. Set each layer's **Visible** to its attribute, e.g. `$currentObject/ShowLocalJobs`
  3. In **Legend content**, add a check box or switch bound to each attribute. Markers appear and disappear as soon as it changes; no nanoflow or refresh is needed
  4. Optionally set each layer's **Marker count** to an Integer attribute and show it next to the switch
- **Generated**: when both drop zones are empty, a small panel beside the buttons lists each layer with a **Legend label**: its icon, label and marker count. Tapping a layer hides or shows its markers

**Search.** Typing filters the markers of searchable layers; matching ignores case and accents, and every word must appear. The result list jumps to a marker and opens its popup; the search key zooms the map to show all matches. Closing the search shows all markers again. While searching, the search bar sits between the close button and the button column, so the legend, clustering and location buttons stay available.

### Marker icons
- Images in an image collection are bundled with the app. Size them close to the size they are shown at: for **Icon size** `32`, a 48×64 PNG (about 1 KB) looks sharp
- During development (Make It Native or a dev build), bundled images are served by Studio Pro's development server, so they load slower than in a release build
- Image properties can't vary per object; use separate layers for different icons

### Using MapTiler styles
- MapTiler requires the credit `© MapTiler © OpenStreetMap contributors`; set it as **Attribution text**
- On load, MapLibre Native logs `source must have tiles` for MapTiler styles. It refers to MapTiler's `maptiler_attribution` source, which only carries credit text; nothing is missing from the map
- Some newer MapTiler styles (e.g. `topo-v4`) contain properties that MapLibre Native doesn't support, which log `layer doesn't support this property`. `landscape-v4` loads cleanly on Android

> **Upgrading from 2.x:** the JSON `Map Data` attribute was removed in `3.0.0`. Point a marker layer at the entity your JSON was exported from, and rebuild the popup with widgets in **Popup header** and **Popup content**. The **On click** action was removed; use **On marker click** on a layer.

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

## Dependencies
1. Mendix Studio Pro `11.12.6` or newer (bundles Node `24`, React Native `0.84.1` / React `19`)
2. Mendix Native Template `v19.1.7`
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
On iOS, add `$MLRN.post_install(installer)` to the `post_install` block in the `ios/Podfile`:
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
