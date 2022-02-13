const getAttributes = (xml: Document) => {
  const attrs = (xml as any).attributes;
  if (attrs === undefined) {
    return {};
  }
  const res: any = {};
  for (let att of attrs) {
    res[att.name] = att.nodeValue;
  }
  return res;
};

/** Converts xml to Json.
 *
 * Xml node attributes are converted to an object and stored in a _ATTRS field.
 * Text value is stored in the _TEXT field.
 *
 * Not theat this might need to issues if there are nodes with name _ATTRS or _TEST
 * in the original XML!
 */
export const xml2json = (xml: Document) => {
  try {
    const obj: any = {};
    obj["_ATTRS"] = getAttributes(xml);

    if (xml.children.length > 0) {
      for (let i = 0; i < xml.children.length; i++) {
        const item: any = xml.children.item(i);
        const nodeName: any = item.nodeName;

        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = [xml2json(item)];
        } else {
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj["_TEXT"] = xml.textContent;
    }
    return obj;
  } catch (e) {
    console.log((e as any).message);
  }
};

export const getSingle = (jsonObj: any, name: string) => {
  const res = jsonObj[name];
  console.assert(res.length === 1, "Invalid!");
  return res[0];
};
