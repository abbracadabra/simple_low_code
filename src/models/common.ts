
export type CommonResponse<T> = {
    success: boolean,
    code: number | string,
    result: T
  }