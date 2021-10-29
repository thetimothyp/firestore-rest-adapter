export function generateNormalData(dateResult: string): any {
  return {
    fields: {
      testArray: [
        {
          testBoolean: true,
          testTimestamp: dateResult,
          testString: 'my awesome string',
          testReference: 'ref',
          testInteger: 5,
          testDouble: 2.2,
          testGeoPoint: {
            latitude: 12,
            longitude: -5,
          },
          testNull: null,
        },
      ],
    },
  };
}
