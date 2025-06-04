import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './src/AppNavigator';
import store from './src/store';
import ErrorBoundary from './src/ErrorBoundary';

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppNavigator />
      </ErrorBoundary>
    </Provider>
  );
}
