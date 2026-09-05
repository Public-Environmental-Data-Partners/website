import * as Sentry from '@sentry/nextjs'

import {sentryInitBase} from './sentry.shared'

Sentry.init(sentryInitBase)
