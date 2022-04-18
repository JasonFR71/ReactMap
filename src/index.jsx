import React from 'react'
import { createRoot } from 'react-dom/client'

import ReactGA from 'react-ga'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import App from './components/App'
import './services/i18n'

if (inject) {
  const {
    GOOGLE_ANALYTICS_ID, ANALYTICS_DEBUG_MODE, TITLE, VERSION,
    SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE, DEVELOPMENT, CUSTOM,
  } = inject
  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, { debug: ANALYTICS_DEBUG_MODE })
  }
  if (TITLE) {
    document.title = TITLE
  }
  Sentry.init({
    dsn: SENTRY_DSN || 'https://c40dad799323428f83aee04391639345@o1096501.ingest.sentry.io/6117162',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE ? +SENTRY_TRACES_SAMPLE_RATE : 0.1,
    release: VERSION,
    environment: DEVELOPMENT ? 'development' : 'production',
    debug: DEVELOPMENT,
    beforeSend(event) {
      return CUSTOM ? null : event
    },
  })
  // eslint-disable-next-line no-console
  console.log('ReactMap Version:', VERSION)
}

const container = document.getElementById('root')
createRoot(container).render(<App />)
