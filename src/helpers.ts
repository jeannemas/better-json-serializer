export const shouldNotThrow = (func: () => void): boolean => {
  try {
    func();
  } catch (error) {
    return false;
  }

  return true;
};
