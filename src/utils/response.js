export const Success = (data) => {
  return {
    code: 1,
    data,
  };
};

export const Failure = (error) => {
  return {
    code: 0,
    error,
  };
};
