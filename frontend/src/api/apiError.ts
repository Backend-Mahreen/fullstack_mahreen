export type ApiErrorDetails = Record<string, string[] | string>;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: ApiErrorDetails;
  readonly isNetworkError: boolean;

  constructor(options: {
    message: string;
    status?: number;
    code?: string;
    details?: ApiErrorDetails;
    isNetworkError?: boolean;
  }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.code = options.code;
    this.details = options.details;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

export const isApiUnavailableError = (error: unknown) =>
  error instanceof ApiError && (error.isNetworkError || error.status >= 500);
