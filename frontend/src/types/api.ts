export type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

export type ApiMessageResponse = {
  message: string;
};
