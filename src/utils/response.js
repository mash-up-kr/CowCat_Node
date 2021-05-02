export const Success = (data, resCode = '', message = '') => {
  return {
    code: 1,
    resCode,
    message,
    data,
  };
};

export const Failure = (error, resCode = '', code = 0) => {
  return {
    code,
    resCode,
    error,
  };
};

// 정의되지 않은 예외. 서버 리소스 접근이 불가능할 때 예외를 일으킬 것으로 예상
export const UnExpectedError = (error) => {
  return {
    code: -1,
    resCode: 'UNEXPECTED_ERROR',
    error,
  };
};
