/* eslint-disable import/prefer-default-export */
export const shouldNotThrow = (func: () => void): boolean => {
  try {
    func();
  } catch (error) {
    return false;
  }

  return true;
};
