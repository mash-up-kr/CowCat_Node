export const Success = (data) => {
  return {
    code: 1,
    data,
  };
};

export const Failure = (error, code = 0) => {
  return {
    code,
    error,
  };
};
