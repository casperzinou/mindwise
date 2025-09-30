import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Define log levels
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Define log entry structure
interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  meta?: any;
  service?: string;
}

// Get log level from environment or default to 'info'
const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
const serviceName: string = process.env.SERVICE_NAME || 'mindwise-backend';

// Define log level priorities
const logLevelPriorities: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Check if we should log based on the current log level
function shouldLog(level: LogLevel): boolean {
  return logLevelPriorities[level] <= logLevelPriorities[currentLogLevel];
}

// Format log entry with better structure
function formatLogEntry(level: LogLevel, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const logEntry: LogEntry = {
    level,
    timestamp,
    message,
    meta,
    service: serviceName
  };
  
  // For development, use human-readable format
  if (process.env.NODE_ENV === 'development') {
    return `[${timestamp}] [${serviceName}] ${level.toUpperCase()}: ${message} ${meta ? JSON.stringify(meta) : ''}`;
  }
  
  // For production, use JSON format
  return JSON.stringify(logEntry);
}

// Write log to file
function writeToFile(logEntry: string): void {
  // Ensure logs directory exists
  const logsDir = path.join(__dirname, '..', '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Write to log file
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logEntry + '\n');
}

// Log to console
function logToConsole(level: LogLevel, message: string, meta?: any): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${serviceName}] ${level.toUpperCase()}: ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage, meta || '');
      break;
    case 'warn':
      console.warn(logMessage, meta || '');
      break;
    case 'info':
      console.info(logMessage, meta || '');
      break;
    case 'debug':
      console.debug(logMessage, meta || '');
      break;
    default:
      console.log(logMessage, meta || '');
  }
}

// Main logging function
function log(level: LogLevel, message: string, meta?: any): void {
  if (!shouldLog(level)) {
    return;
  }
  
  const formattedLog = formatLogEntry(level, message, meta);
  
  // Write to file
  try {
    writeToFile(formattedLog);
  } catch (error) {
    // If we can't write to file, log to console
    console.error('Failed to write to log file:', error);
  }
  
  // Log to console
  logToConsole(level, message, meta);
}

// Export individual log functions
export default {
  error: (message: string, meta?: any) => log('error', message, meta),
  warn: (message: string, meta?: any) => log('warn', message, meta),
  info: (message: string, meta?: any) => log('info', message, meta),
  debug: (message: string, meta?: any) => log('debug', message, meta),
};