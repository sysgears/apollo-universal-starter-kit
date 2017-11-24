{
  "builders": {
    "server": {
      "stack": ["react-native-web", "server"],
      "enabled": true
    },
    "web": {
      "stack": ["react-native-web", "web"],
      "openBrowser": true,
      "enabled": true
    },
    "android": {
      "stack": ["react-native", "android"],
      "enabled": false
    },
    "ios": {
      "stack": ["react-native", "ios"],
      "enabled": false
    },
    "test": {
      "stack": ["react-native-web", "server"],
      "roles": ["test"]
    }
  },
  "options": {
    "backendBuildDir": "build/server",
    "frontendBuildDir": "build/client",
    "dllBuildDir": "build/dll",
    "overridesConfig": "tools/webpackAppConfig.js",
    "stack": ["apollo", "react", "styled-components", "css", "sass", "less", "es6", "webpack"],
    "backendUrl": "http://localhost:8080/graphql",
    "ssr": true,
    "webpackDll": true,
    "devProxy": true,
    "reactHotLoader": false,
    "persistGraphQL": false,
    "frontendRefreshOnBackendChange": true
  }
}
