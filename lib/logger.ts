type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: Record<string, unknown>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data, error } = entry
    const levelEmoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🐛',
    }[level]

    let logMessage = `[${timestamp}] ${levelEmoji} ${level.toUpperCase()}: ${message}`

    if (data) {
      logMessage += `\nData: ${JSON.stringify(data, null, 2)}`
    }

    if (error) {
      logMessage += `\nError: ${error.message}\nStack: ${error.stack}`
    }

    return logMessage
  }

  private createEntry(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    }
  }

  info(message: string, data?: Record<string, unknown>) {
    const entry = this.createEntry('info', message, data)
    console.log(this.formatLog(entry))
    // Send to external logging service in production
  }

  warn(message: string, data?: Record<string, unknown>) {
    const entry = this.createEntry('warn', message, data)
    console.warn(this.formatLog(entry))
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    const entry = this.createEntry('error', message, data, error)
    console.error(this.formatLog(entry))
    // Send to error tracking service (Sentry, etc.)
  }

  debug(message: string, data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      const entry = this.createEntry('debug', message, data)
      console.debug(this.formatLog(entry))
    }
  }

  logRequest(method: string, path: string, statusCode: number, duration: number) {
    this.info('HTTP Request', {
      method,
      path,
      statusCode,
      durationMs: duration,
    })
  }

  logAuth(action: string, email: string, success: boolean, details?: Record<string, unknown>) {
    const level = success ? 'info' : 'warn'
    const entry = this.createEntry(level, `Auth: ${action}`, {
      email,
      success,
      ...details,
    })
    console[level](this.formatLog(entry))
  }

  logPayment(action: string, amount: number, currency: string, status: string, details?: Record<string, unknown>) {
    this.info('Payment', {
      action,
      amount,
      currency,
      status,
      ...details,
    })
  }
}

export const logger = new Logger()
