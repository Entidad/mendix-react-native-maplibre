import { addEnumerations, t } from "mendix";
import { SUB_Feedback_GetOrCreate } from "./FeedbackModule.SUB_Feedback_GetOrCreate.js";

export const DS_Feedback_Populate = {
  "name": "FeedbackModule.DS_Feedback_Populate",
  "instructions": [
    {
      "type": "nanoflowCall",
      "label": "707c98ba-4225-4872-b594-3ceaec150cfe",
      "flow": () => SUB_Feedback_GetOrCreate,
      "parameters": [],
      "outputVar": "Feedback"
    },
    {
      "type": "microflowCall",
      "label": "d36f2f06-1a4b-4adb-9abc-8613e658052a",
      "operationId": "2pbDc9IE/VWh/UShA0W/vQ",
      "parameters": [
        {
          "name": "Feedback",
          "value": {
            "type": "variable",
            "variable": "Feedback"
          },
          "kind": "object"
        }
      ]
    },
    {
      "type": "changeObject",
      "label": "1728dae7-fc7e-4582-aefb-7c23f3f91080",
      "inputVar": "Feedback",
      "member": "_showEmail",
      "value": {
        "type": "conditional",
        "condition": {
          "type": "variable",
          "variable": "Feedback",
          "path": "_showEmail"
        },
        "then": {
          "type": "literal",
          "value": true
        },
        "else": {
          "type": "conditional",
          "condition": {
            "type": "conditional",
            "condition": {
              "type": "function",
              "name": "!=",
              "parameters": [
                {
                  "type": "variable",
                  "variable": "Feedback",
                  "path": "SubmitterEmail"
                },
                {
                  "type": "literal",
                  "value": null
                }
              ]
            },
            "then": {
              "type": "function",
              "name": "!=",
              "parameters": [
                {
                  "type": "variable",
                  "variable": "Feedback",
                  "path": "SubmitterEmail"
                },
                {
                  "type": "literal",
                  "value": ""
                }
              ]
            },
            "else": {
              "type": "literal",
              "value": false
            }
          },
          "then": {
            "type": "literal",
            "value": false
          },
          "else": {
            "type": "literal",
            "value": true
          }
        }
      }
    },
    {
      "type": "javaScriptActionCall",
      "label": "511cc7e3-1825-4bd9-8cdc-779e289b949d",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_PopulateFeedbackMetadata").JS_PopulateFeedbackMetadata,
      "parameters": [
        {
          "kind": "object",
          "value": {
            "type": "variable",
            "variable": "Feedback"
          }
        }
      ]
    },
    {
      "type": "javaScriptActionCall",
      "label": "9176988a-30a8-40a4-8511-32b79a357abf",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_SetFeedbackStorageObject").JS_SetFeedbackStorageObject,
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "constant",
            "name": "FeedbackModule.LocalStorageKey"
          }
        },
        {
          "kind": "object",
          "value": {
            "type": "variable",
            "variable": "Feedback"
          }
        }
      ]
    },
    {
      "type": "javaScriptActionCall",
      "label": "b27b12ab-ab6d-491c-a647-3f42e8672302",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_Recalculate_MendixModal_Error_PopUp_Zindex").JS_Recalculate_MendixModal_Error_PopUp_Zindex,
      "parameters": []
    },
    {
      "type": "return",
      "label": "27ab500b-2d14-4637-99f9-ee46003d3ed3",
      "result": {
        "type": "variable",
        "variable": "Feedback"
      },
      "resultKind": "object"
    }
  ]
};
