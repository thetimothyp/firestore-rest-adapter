# Functionality

The Firestore v1 REST API responds to requests for document fields with a typed data format outlined [here](https://cloud.google.com/firestore/docs/reference/rest/v1/Value). This data is structured like the following:

```js
{
  fields: {
    myObj: {
      mapValue: {
        fields: {
          myString: {
            stringValue: 'my string'
          }
        }
      }
    },
    myArray: {
      arrayValue: {
        values: [
          {
            myInt: {
              integerValue: '5'
            }
          }
        ]
      }
    }
  }
}
```

This package converts the data into a more workable object format:

```js
{
  myObj: {
    myString: 'my string'
  },
  myArray: [5]
}
```

You can mutate the resulting object however you desire. When you need to write the object back to Firestore, call `serializeDocument` on the object and include it as the body of your request.

# Installation

```bash
yarn add firestore-rest-adapter
# OR
npm i --save firestore-rest-adapter
```

# Usage

```ts
import { normalizeDocument, serializeDocument } from 'firestore-rest-adapter';

const getDoc = async () => {
  const res = await fetch(
    // `?fields=fields` query parameter to fetch document fields
    'https://firestore.googleapis.com/v1/path/to/document?fields=fields',
    {
      method: 'GET',
      headers: {
        authorization: // access token
      },
    }
  );
  const docData = await res.json();

  // Normalize Firestore Value into workable object
  return normalizeDocument(docData);
};

const writeDoc = async (obj) => {
  // Serialize obj into Firestore Value
  const doc = serializeDocument(obj);

  return fetch(
    'https://firestore.googleapis.com/v1/path/to/document?fields=fields',
    {
      method: 'PATCH',
      headers: {
        authorization: // access token
      },
      body: JSON.stringify(doc),
    }
  );
};
```

# API

| Method name                      | Description                                                                                                                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normalizeDocument(doc: Object)` | Converts an entire Firestore document's fields into a normalized object, removing the top-level `fields` key.                                                                                                                       |
| `normalizeField(field: Object)`  | Converts a [Firestore Value](https://cloud.google.com/firestore/docs/reference/rest/v1/Value) into the corresponding primitive. (e.g `{stringValue: 'foo'} => 'foo'`). <br/><br/>This method works recursively for iterable Values. |
| `serializeDocument(obj: Object)` | Serializes an Object and its fields into a [Firestore Value](https://cloud.google.com/firestore/docs/reference/rest/v1/Value), inserting a top level `fields` key. (e.g `{foo: 'bar'} => {fields: {foo: {stringValue: 'bar'}}}`)    |
| `serializeField(field: Object)`  | Serializes an Object into a [Firestore Value](https://cloud.google.com/firestore/docs/reference/rest/v1/Value). (e.g `'foo' => {stringValue: 'foo'}`). <br/><br/>This method works recursively for iterable Values.                 |
