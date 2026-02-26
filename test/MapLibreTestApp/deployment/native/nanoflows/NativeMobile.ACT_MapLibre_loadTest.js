import { addEnumerations, t } from "mendix/native";

export const ACT_MapLibre_loadTest = {
  "name": "NativeMobile.ACT_MapLibre_loadTest",
  "instructions": [
    {
      "type": "setVariable",
      "label": "84d2224d-6772-4809-807e-603445934e20",
      "value": {
        "type": "literal",
        "value": "{\n    \"mapMarkers\": [\n        {\n            \"name\": \"Camarillo\",\n            \"lat\": 34.2163,\n            \"lng\": -119.0374\n        },\n        {\n            \"name\": \"Oxnard\",\n            \"lat\": 34.1974,\n            \"lng\": -119.1770\n        }\n    ]\n}"
      },
      "outputVar": "str_json_test",
      "outputKind": "primitive"
    },
    {
      "type": "createObject",
      "label": "88fcf3f8-ef7d-4686-8e2f-39628b6e3182",
      "objectType": "NativeMobile.MapLibre",
      "outputVar": "NewMapLibre"
    },
    {
      "type": "changeObject",
      "inputVar": "NewMapLibre",
      "member": "Value",
      "value": {
        "type": "variable",
        "variable": "str_json_test"
      }
    },
    {
      "type": "openForm",
      "label": "7929b9d8-0e92-43c8-aa21-ab0421e71f31",
      "path": "NativeMobile.MapLibre_Test",
      "params": {
        "name": "NativeMobile.MapLibre_Test",
        "location": "content"
      },
      "inputArgs": {
        "$MapLibre": {
          "type": "variable",
          "variable": "NewMapLibre"
        }
      }
    },
    {
      "type": "return",
      "label": "2b7d680d-b9f0-436c-9850-7803afa72ed8",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    }
  ]
};
