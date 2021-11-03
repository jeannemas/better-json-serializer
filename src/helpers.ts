export const shouldNotThrow = (func: () => void): boolean => {
  try {
    func.call(undefined);
  } catch (error) {
    return false;
  }

  return true;
};
