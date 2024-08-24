export const saveToStorage = async ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromStorage = async ({ key }) => {
  localStorage.removeItem(key);
};
