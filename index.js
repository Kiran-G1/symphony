import { registerRootComponent } from 'expo';
import App from './App';

// Catch uncaught JS errors to avoid native crashes
if (global.ErrorUtils && global.ErrorUtils.setGlobalHandler) {
  const defaultHandler =
    global.ErrorUtils.getGlobalHandler && global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Uncaught JS error:', error);
    if (defaultHandler) {
      defaultHandler(error, isFatal);
    }
  });
}

registerRootComponent(App);

