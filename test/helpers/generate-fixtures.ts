export function generateNormalData(dateResult: any): any {
  return {
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
}

export function generateFirestoreData(timestamp: string): any {
  return {
    fields: {
      testArray: {
        arrayValue: {
          values: [
            {
              mapValue: {
                fields: {
                  testBoolean: {
                    booleanValue: true,
                  },
                  testTimestamp: {
                    timestampValue: timestamp,
                  },
                  testString: {
                    stringValue: 'my awesome string',
                  },
                  testReference: {
                    referenceValue: 'ref',
                  },
                  testInteger: {
                    integerValue: '5',
                  },
                  testDouble: {
                    doubleValue: 2.2,
                  },
                  testGeoPoint: {
                    geoPointValue: {
                      latitude: 12,
                      longitude: -5,
                    },
                  },
                  testNull: {
                    nullValue: null,
                  },
                },
              },
            },
          ],
        },
      },
    },
  };
}
