import { isApiUnavailableError } from "../api/apiError";
import { env } from "../config/env";

export const runWithDataSource = async <T,>(
  apiOperation: () => Promise<T>,
  localOperation?: () => Promise<T>,
): Promise<T> => {
  if (env.dataSourceMode === "local" && localOperation) return localOperation();
  if (env.dataSourceMode === "api") return apiOperation();

  try {
    return await apiOperation();
  } catch (error) {
    if (localOperation && env.enableLocalFallback && isApiUnavailableError(error)) {
      return localOperation();
    }
    throw error;
  }
};
