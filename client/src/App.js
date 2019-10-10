import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import GlobalStyles from './global';
import { Chat, VideoStreaming, NotFound } from './pages';
import { Navigation } from './layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyles />
        <Navigation />
        <main>
          <Switch>
            <Route exact path="/" component={Chat} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="/videostreaming" component={VideoStreaming} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
