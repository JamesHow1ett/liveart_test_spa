/**
 * Deep clone of the object
 * Needed to properly map class instances to DTO objects
 * @function
 * @param {any} input - object to clone
 */

export function mapValueToInterface<T>(input: any): T {
  let res: any;

  if (Array.isArray(input)) res = [];
  else res = {};

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const dtoValue = input[key];

      if (Array.isArray(dtoValue)) {
        res[key] = mapValueToInterface(dtoValue);
      } else if (dtoValue === null || typeof dtoValue !== 'object') {
        res[key] = dtoValue;
      } else {
        res[key] = mapValueToInterface(dtoValue);
      }
    }
  }

  return res;
}

export function mapToFormData(source: object, fields: string[]): FormData {
  const formData = new FormData();

  fields.forEach(key => {
    const value = source[key];
    const normalizedValue = value != null ? value : String(value);

    formData.append(key, normalizedValue);
  });

  return formData;
}
