export const getSingle = (jsonObj: any, name: string) => {
  const elements = jsonObj.elements.filter((el: any) => el.name === name);
  console.assert(elements.length === 1, "Invalid!");
  return elements[0];
};

export const getAll = (jsonObj: any, name: string) => {
  return jsonObj.elements.filter((el: any) => el.name === name);
};
