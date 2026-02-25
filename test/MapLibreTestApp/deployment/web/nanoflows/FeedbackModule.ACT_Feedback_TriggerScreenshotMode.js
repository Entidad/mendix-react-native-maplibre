import { addEnumerations, t } from "mendix";

export const ACT_Feedback_TriggerScreenshotMode = {
  "name": "FeedbackModule.ACT_Feedback_TriggerScreenshotMode",
  "instructions": [
    {
      "type": "closeForm",
      "label": "cff25fc3-721f-4233-89ec-e8a5ac5eba57"
    },
    {
      "type": "javaScriptActionCall",
      "label": "178a3b63-e5b0-4c7e-9df0-2d18d7784a13",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_ToggleFeedbackScreenshotWidget").JS_ToggleFeedbackScreenshotWidget,
      "outputVar": "base64FromWidget",
      "parameters": []
    },
    {
      "type": "switch",
      "label": "1860a5f1-d17f-4f90-aebe-d2372cc129bb",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "base64FromWidget"
          },
          {
            "type": "literal",
            "value": "uploadCancelled"
          }
        ]
      },
      "targets": {
        "true": "0e73ba31-8991-481f-9665-485f2c6586d0",
        "false": "1a747d90-04fb-4a9d-8185-44c0b7356ae5"
      }
    },
    {
      "type": "jump",
      "label": "1a747d90-04fb-4a9d-8185-44c0b7356ae5",
      "target": "3296f0c7-3e13-4081-8b92-59bf8eb271f4"
    },
    {
      "type": "jump",
      "label": "3296f0c7-3e13-4081-8b92-59bf8eb271f4",
      "target": "bb8725ef-d1d9-4244-ad29-9c5501dd26ab"
    },
    {
      "type": "jump",
      "label": "bb8725ef-d1d9-4244-ad29-9c5501dd26ab",
      "target": "1f107934-2909-4660-9364-dcd5e72b90f7"
    },
    {
      "type": "openForm",
      "label": "1f107934-2909-4660-9364-dcd5e72b90f7",
      "path": "FeedbackModule/ShareFeedback.page.xml",
      "params": {
        "name": "FeedbackModule/ShareFeedback.page.xml",
        "location": "modal",
        "resizable": true
      }
    },
    {
      "type": "return",
      "label": "c35a6041-d6de-4625-8106-9d8d3340a0ae",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "switch",
      "label": "0e73ba31-8991-481f-9665-485f2c6586d0",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "base64FromWidget"
          },
          {
            "type": "literal",
            "value": null
          }
        ]
      },
      "targets": {
        "true": "8ff88156-93c9-46e0-9298-aca0f0aa2ffe",
        "false": "a2e22fe4-57bd-4ee8-9f31-c499209fb8e0"
      }
    },
    {
      "type": "return",
      "label": "a2e22fe4-57bd-4ee8-9f31-c499209fb8e0",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "javaScriptActionCall",
      "label": "8ff88156-93c9-46e0-9298-aca0f0aa2ffe",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_isStrictMode").JS_isStrictMode,
      "outputVar": "isStrictMode",
      "parameters": []
    },
    {
      "type": "switch",
      "label": "07089317-30c4-437a-87f5-4a4f8c3edf10",
      "condition": {
        "type": "function",
        "name": "=",
        "parameters": [
          {
            "type": "variable",
            "variable": "isStrictMode"
          },
          {
            "type": "literal",
            "value": false
          }
        ]
      },
      "targets": {
        "true": "0052277d-af95-422c-a2b7-0efe08840cd9",
        "false": "85de6838-c1e0-4762-92cd-ddb0c3bce336"
      }
    },
    {
      "type": "jump",
      "label": "85de6838-c1e0-4762-92cd-ddb0c3bce336",
      "target": "54bd44af-b883-4b5d-a3f4-c8245491e45a"
    },
    {
      "type": "javaScriptActionCall",
      "label": "54bd44af-b883-4b5d-a3f4-c8245491e45a",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_SetSingleLocalStorageObjectItem").JS_SetSingleLocalStorageObjectItem,
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "constant",
            "name": "FeedbackModule.LocalStorageKey"
          }
        },
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "base64FromWidget"
          }
        }
      ]
    },
    {
      "type": "jump",
      "label": "775e27d3-8672-442a-83e5-52da011e52a4",
      "target": "bb8725ef-d1d9-4244-ad29-9c5501dd26ab"
    },
    {
      "type": "jump",
      "label": "bb8725ef-d1d9-4244-ad29-9c5501dd26ab",
      "target": "1f107934-2909-4660-9364-dcd5e72b90f7"
    },
    {
      "type": "changeObject",
      "label": "0052277d-af95-422c-a2b7-0efe08840cd9",
      "inputVar": "Feedback",
      "member": "ImageB64",
      "value": {
        "type": "variable",
        "variable": "base64FromWidget"
      }
    },
    {
      "type": "commitObjects",
      "operationId": "MMOuIsgR3VeZOeCJ9lp18g",
      "inputVar": "Feedback"
    },
    {
      "type": "jump",
      "label": "bb8725ef-d1d9-4244-ad29-9c5501dd26ab",
      "target": "1f107934-2909-4660-9364-dcd5e72b90f7"
    }
  ]
};
