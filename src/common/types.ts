export type FirestoreArrayValue = {
  values?: FirestoreValue[];
};

export type FirestoreMapValue = {
  fields?: FirestoreFieldValue[];
};

export type FirestoreFieldValue = {
  [key: string]: FirestoreValue;
};

export type FirestoreGeoPointValue = {
  latitude: number;
  longitude: number;
};

export type FirestoreValue = {
  [key: string]: any;
  stringValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  referenceValue?: string;
  timestampValue?: string;
  nullValue?: null;
  geoPointValue?: FirestoreGeoPointValue;
  arrayValue?: FirestoreArrayValue;
  mapValue?: FirestoreMapValue;
};
