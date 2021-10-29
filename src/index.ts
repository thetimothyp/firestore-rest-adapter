/**
 * Normalizes Firebase data object, excluding the top-level
 * `fields` key that is present on Firestore document fetch results
 */
export function normalizeDocument(obj: any) {
  return normalizeField(obj.fields);
}

/**
 * Normalizes Firebase response object into a more workable form.
 * Transforms a Firebase response obj of form:
 * {
 *   fields: {
 *     links: {
 *       arrayValue: {
 *         values: [
 *           {
 *             mapValue: {
 *               fields: {
 *                 name: {
 *                   stringValue: 'str'
 *                 }
 *               }
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 *
 * Into:
 * {
 *   fields: {
 *     links: [
 *       {
 *         name: 'str'
 *       }
 *     ]
 *   }
 * }
 * @param {Object} obj
 * @returns normalized obj
 */
export function normalizeField(obj: any) {
  // Update as needed if more data types are added to User in Firebase
  if (obj.hasOwnProperty('mapValue')) {
    return _normalizeMapValues(obj['mapValue']);
  }
  if (obj.hasOwnProperty('arrayValue')) {
    return _normalizeArrayValues(obj['arrayValue']);
  }
  if (obj.hasOwnProperty('stringValue')) {
    return obj['stringValue'];
  }
  if (obj.hasOwnProperty('booleanValue')) {
    return obj['booleanValue'];
  }
  if (obj.hasOwnProperty('timestampValue')) {
    return new Date(obj['timestampValue']);
  }
  if (obj.hasOwnProperty('integerValue')) {
    return parseInt(obj['integerValue']);
  }
  if (obj.hasOwnProperty('doubleValue')) {
    return obj['doubleValue'];
  }
  if (
    obj.hasOwnProperty('referenceValue') ||
    obj.hasOwnProperty('geoPointValue')
  ) {
    // These value types use primitives, so we need to maintain their
    // structure to identify them on serialization.
    return obj;
  }
  if (obj.hasOwnProperty('nullValue')) {
    return null;
  }

  return Object.keys(obj).reduce((res: any, key: string) => {
    res[key] = normalizeField(obj[key]);
    return res;
  }, {});
}

function _normalizeMapValues(mapValue: any) {
  return Object.keys(mapValue.fields).reduce((res: any, key: string) => {
    res[key] = normalizeField(mapValue.fields[key]);
    return res;
  }, {});
}

function _normalizeArrayValues(arrValue: any) {
  if (arrValue.values) {
    return arrValue.values.map(normalizeField);
  }
  return [];
}

/**
 * Serializes a normalized object into a Firebase object, inserting the top-level
 * `fields` key that is present on Firestore documents
 */
export function serializeDocument(obj: any): any {
  const fields = Object.keys(obj).reduce((res: any, key: any) => {
    res[key] = serializeField(obj[key]);
    return res;
  }, {});

  return { fields };
}

/**
 * Serializes an object into Firebase-structured data.
 * Transforms an object of form:
 * {
 *   links: [
 *     {
 *       name: 'yolink1'
 *     }
 *   ]
 * }
 *
 * Into:
 * {
 *   links: {
 *     arrayValue: {
 *       values: [
 *         {
 *           mapValue: {
 *             fields: {
 *               name: {
 *                 stringValue: 'yolink1'
 *               }
 *             }
 *           }
 *         }
 *       ]
 *     }
 *   }
 * }
 * @param {Object} obj
 * @returns normalized obj
 */
export function serializeField(obj: any): any {
  if (obj === null) {
    return { nullValue: null };
  }

  // No serialization transformations for these types
  if (
    obj.hasOwnProperty('referenceValue') ||
    obj.hasOwnProperty('geoPointValue')
  ) {
    return obj;
  }

  // If `obj` is a POJO
  if (Object.getPrototypeOf(obj) === Object.prototype) {
    const fields = Object.keys(obj).reduce((res: any, key: string) => {
      res[key] = serializeField(obj[key]);
      return res;
    }, {});

    return {
      mapValue: {
        fields,
      },
    };
  }
  if (obj instanceof Array) {
    return {
      arrayValue: {
        values: obj.map(serializeField),
      },
    };
  }
  if (typeof obj === 'string') {
    return { stringValue: obj };
  }
  if (typeof obj === 'boolean') {
    return { booleanValue: obj };
  }
  if (typeof obj === 'number') {
    // If int
    if (obj % 1 === 0) {
      return { integerValue: obj.toString() };
    } else {
      return { doubleValue: obj };
    }
  }
  if (obj instanceof Date) {
    return { timestampValue: obj.toISOString() };
  }
}

export default {
  normalizeDocument,
  normalizeField,
  serializeDocument,
  serializeField,
};
