import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// import { AppRegistry } from "react-native";
// import App from "./src/App";
// import { iCare } from "./app.json";

// import appConfig from "./app.json";

// const appName = appConfig.expo.name;

// AppRegistry.registerComponent(appName, () => App);
