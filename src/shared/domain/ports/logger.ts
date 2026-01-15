export type LogContext = Record<string, unknown>;

export type Logger = {
  info: (ctx: LogContext, msg: string) => void;
  error: (ctx: LogContext, msg: string) => void;
  warn: (ctx: LogContext, msg: string) => void;
  debug: (ctx: LogContext, msg: string) => void;
  child: (ctx: LogContext) => Logger;
};
