import {
  normalizeDocument,
  normalizeField,
  serializeDocument,
  serializeField,
} from '../src/index';
import * as FIRESTORE_DATA from './fixtures/firestore-data.json';
import {
  generateNormalData,
  generateFirestoreData,
} from './helpers/generate-fixtures';

afterEach(() => {
  jest.clearAllMocks();
});

describe('normalizeDocument', () => {
  it('normalizes Firestore document format to expected object format', () => {
    const dateSpy = jest.spyOn(global, 'Date');
    const result = normalizeDocument(FIRESTORE_DATA);
    const dateResult = dateSpy.mock.instances[0];
    const expectedResult: any = {
      testArray: [
        {
          testBoolean: true,
          testTimestamp: dateResult,
          testString: 'my awesome string',
          testReference: { referenceValue: 'ref' },
          testInteger: 5,
          testDouble: 2.2,
          testGeoPoint: {
            geoPointValue: {
              latitude: 12,
              longitude: -5,
            },
          },
          testNull: null,
        },
      ],
    };

    expect(result).toEqual(expectedResult);
    dateSpy.mockRestore();
  });
});

describe('normalizeField', () => {
  it('normalizes stringValues correctly', () => {
    const input = { stringValue: 'my string' };
    const result = normalizeField(input);
    const expectedResult = 'my string';
    expect(result).toEqual(expectedResult);
  });

  it('normalizes booleanValues correctly', () => {
    const input = { booleanValue: true };
    const result = normalizeField(input);
    const expectedResult = true;
    expect(result).toEqual(expectedResult);
  });

  it('normalizes doubleValues correctly', () => {
    const input = { doubleValue: 2.2 };
    const result = normalizeField(input);
    const expectedResult = 2.2;
    expect(result).toEqual(expectedResult);
  });

  it('normalizes integerValues correctly', () => {
    const input = { integerValue: '5' };
    const result = normalizeField(input);
    const expectedResult = 5;
    expect(result).toEqual(expectedResult);
  });

  it('normalizes nullValues correctly', () => {
    const input: any = { nullValue: null };
    const result = normalizeField(input);
    const expectedResult: null = null;
    expect(result).toEqual(expectedResult);
  });

  it('normalizes timestampValues correctly', () => {
    const timestamp = new Date().toISOString();
    const input = { timestampValue: timestamp };
    const result: Date = normalizeField(input);
    expect(result.getTime()).toEqual(new Date(timestamp).getTime());
  });

  it('normalizes arrayValues correctly', () => {
    const input = {
      arrayValue: {
        values: [{ stringValue: 'my string' }, { integerValue: 5 }],
      },
    };

    const result = normalizeField(input);
    const expectedResult = ['my string', 5];
    expect(result).toEqual(expectedResult);
  });

  it('normalizes an empty array correctly', () => {
    const input = {
      arrayValue: {},
    };
    const result = normalizeField(input);
    const expectedResult: any = [];
    expect(result).toEqual(expectedResult);
  });

  it('normalizes mapValues correctly', () => {
    const input = {
      mapValue: {
        fields: {
          testString: {
            stringValue: 'my string',
          },
          testInteger: {
            integerValue: 5,
          },
        },
      },
    };

    const result = normalizeField(input);
    const expectedResult = {
      testString: 'my string',
      testInteger: 5,
    };
    expect(result).toEqual(expectedResult);
  });

  it('does not normalize referenceValues', () => {
    const input = { referenceValue: 'ref' };
    const result = normalizeField(input);
    expect(result).toEqual(input);
  });

  it('does not normalize geoPointValues', () => {
    const input = {
      geoPointValue: {
        latitude: 5,
        longitude: -12,
      },
    };
    const result = normalizeField(input);
    expect(result).toEqual(input);
  });
});

describe('serializeDocument', () => {
  it('serializes JSON into Firestore object format', () => {
    const date = new Date();
    const result = serializeDocument(generateNormalData(date));

    const expectedResult = generateFirestoreData(date.toISOString());
    expect(result).toEqual(expectedResult);
  });
});

describe('serializeField', () => {
  it('serializes stringValues correctly', () => {
    const input = 'my string';
    const result = serializeField(input);
    const expectedResult = { stringValue: 'my string' };
    expect(result).toEqual(expectedResult);
  });

  it('serializes booleanValues correctly', () => {
    const input = true;
    const result = serializeField(input);
    const expectedResult = { booleanValue: true };
    expect(result).toEqual(expectedResult);
  });

  it('serializes doubleValues correctly', () => {
    const input = 2.2;
    const result = serializeField(input);
    const expectedResult = { doubleValue: 2.2 };
    expect(result).toEqual(expectedResult);
  });

  it('serializes integerValues correctly', () => {
    const input = 5;
    const result = serializeField(input);
    const expectedResult = { integerValue: '5' };
    expect(result).toEqual(expectedResult);
  });

  it('serializes timestampValues correctly', () => {
    const date = new Date();
    const result = serializeField(date);
    const expectedResult = { timestampValue: date.toISOString() };
    expect(result).toEqual(expectedResult);
  });

  it('serializes arrayValues correctly', () => {
    const input = ['my string', 5];
    const result = serializeField(input);
    const expectedResult = {
      arrayValue: {
        values: [{ stringValue: 'my string' }, { integerValue: '5' }],
      },
    };
    expect(result).toEqual(expectedResult);
  });

  it('serializes mapValues correctly', () => {
    const input = {
      testField: {
        testString: 'my string',
        testInteger: 5,
      },
    };
    const result = serializeField(input);
    const expectedResult = {
      mapValue: {
        fields: {
          testField: {
            mapValue: {
              fields: {
                testString: {
                  stringValue: 'my string',
                },
                testInteger: {
                  integerValue: '5',
                },
              },
            },
          },
        },
      },
    };
    expect(result).toEqual(expectedResult);
  });

  it('does not serialize referenceValues', () => {
    const input = { referenceValue: 'ref' };
    const result = serializeField(input);
    expect(result).toEqual(input);
  });

  it('does not serialize geoPointValues', () => {
    const input = {
      geoPointValue: {
        latitude: 5,
        longitude: -12,
      },
    };
    const result = serializeField(input);
    expect(result).toEqual(input);
  });
});
