import { addEnumerations, t } from "mendix/native";

export const ACT_SignInUser = {
  "name": "NativeMobile.ACT_SignInUser",
  "instructions": [
    {
      "type": "javaScriptActionCall",
      "label": "f90ce0d7-eb35-40cb-bc29-041ebde0f704",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/nanoflowcommons/actions/SignIn").SignIn,
      "outputVar": "StatusCode",
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "Login",
            "path": "Username"
          }
        },
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "Login",
            "path": "Password"
          }
        },
        {
          "kind": "primitive",
          "value": {
            "type": "literal",
            "value": null
          }
        }
      ]
    },
    {
      "type": "switch",
      "label": "73ba8095-926d-4d57-a49f-5b094c3dd5ff",
      "condition": {
        "type": "function",
        "name": "=",
        "parameters": [
          {
            "type": "variable",
            "variable": "StatusCode"
          },
          {
            "type": "literalNumeric",
            "value": "200"
          }
        ]
      },
      "targets": {
        "true": "b14b7bdb-ee2b-443f-88bf-40b4b9d0f550",
        "false": "1dfbf21a-8314-452c-9f1f-5bae2ea1d8f4"
      }
    },
    {
      "type": "switch",
      "label": "1dfbf21a-8314-452c-9f1f-5bae2ea1d8f4",
      "condition": {
        "type": "function",
        "name": "=",
        "parameters": [
          {
            "type": "variable",
            "variable": "StatusCode"
          },
          {
            "type": "literalNumeric",
            "value": "0"
          }
        ]
      },
      "targets": {
        "true": "857636d6-6516-4fba-a61a-2b592a07e06f",
        "false": "0f210e45-b024-45ef-93cd-d30065d5c416"
      }
    },
    {
      "type": "switch",
      "label": "0f210e45-b024-45ef-93cd-d30065d5c416",
      "condition": {
        "type": "function",
        "name": "=",
        "parameters": [
          {
            "type": "variable",
            "variable": "StatusCode"
          },
          {
            "type": "literalNumeric",
            "value": "401"
          }
        ]
      },
      "targets": {
        "true": "3172f44d-2896-4674-8b67-f60f9e4b4929",
        "false": "555fddfb-f11f-477f-8373-6836694efd8f"
      }
    },
    {
      "type": "changeObject",
      "label": "555fddfb-f11f-477f-8373-6836694efd8f",
      "inputVar": "Login",
      "member": "ValidationMessage",
      "value": {
        "type": "literal",
        "value": "Unknown error occurred."
      }
    },
    {
      "type": "jump",
      "label": "b95e3cb9-2787-4d11-9d11-a810dd761ea0",
      "target": "72b656eb-0cda-48c2-9f3f-d6bf8a1871f6"
    },
    {
      "type": "showValidation",
      "label": "72b656eb-0cda-48c2-9f3f-d6bf8a1871f6",
      "inputVar": "Login",
      "member": "Username",
      "text": t([
        {
          "type": "literal",
          "value": ""
        }
      ])
    },
    {
      "type": "showValidation",
      "label": "ba727a51-7367-43d7-b01d-876add9f3f6a",
      "inputVar": "Login",
      "member": "Password",
      "text": t([
        {
          "type": "literal",
          "value": ""
        }
      ])
    },
    {
      "type": "return",
      "label": "e2210734-ea59-40b9-adff-20dc744d7ed4",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "changeObject",
      "label": "3172f44d-2896-4674-8b67-f60f9e4b4929",
      "inputVar": "Login",
      "member": "ValidationMessage",
      "value": {
        "type": "literal",
        "value": "The username or password you entered is incorrect."
      }
    },
    {
      "type": "jump",
      "label": "b95e3cb9-2787-4d11-9d11-a810dd761ea0",
      "target": "72b656eb-0cda-48c2-9f3f-d6bf8a1871f6"
    },
    {
      "type": "changeObject",
      "label": "857636d6-6516-4fba-a61a-2b592a07e06f",
      "inputVar": "Login",
      "member": "ValidationMessage",
      "value": {
        "type": "literal",
        "value": "No connection, please try again later."
      }
    },
    {
      "type": "jump",
      "label": "b95e3cb9-2787-4d11-9d11-a810dd761ea0",
      "target": "72b656eb-0cda-48c2-9f3f-d6bf8a1871f6"
    },
    {
      "type": "return",
      "label": "b14b7bdb-ee2b-443f-88bf-40b4b9d0f550",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    }
  ]
};
