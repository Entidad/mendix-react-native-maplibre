import { addEnumerations, t } from "mendix";
import { Get_And_Set_Feedback_NPE } from "./FeedbackModule.Get_And_Set_Feedback_NPE.js";

export const SUB_Feedback_GetOrCreate = {
  "name": "FeedbackModule.SUB_Feedback_GetOrCreate",
  "instructions": [
    {
      "type": "javaScriptActionCall",
      "label": "a3e03a6a-fd93-4d0f-ae18-c9c160538e41",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_isStrictMode").JS_isStrictMode,
      "outputVar": "isStrictMode",
      "parameters": []
    },
    {
      "type": "switch",
      "label": "8a71b3a5-76c2-4a29-8dc5-eda238eb551b",
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
        "false": "bb0df562-dae1-4581-94b1-5e9f89a0c0d2",
        "true": "d99a3a77-929a-4ef8-b28e-4655553c90a4"
      }
    },
    {
      "type": "tryCatch",
      "label": "d99a3a77-929a-4ef8-b28e-4655553c90a4",
      "catchTarget": "b53621ec-125c-41b7-abdd-2c910636869c",
      "body": [
        {
          "type": "javaScriptActionCall",
          "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_GetFeedbackStorageObject").JS_GetFeedbackStorageObject,
          "outputVar": "LocalFeedback",
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
                "type": "literal",
                "value": "FeedbackModule.Feedback"
              }
            }
          ]
        },
        {
          "type": "return",
          "result": {
            "type": "literal",
            "value": true
          },
          "resultKind": "primitive"
        }
      ]
    },
    {
      "type": "switch",
      "label": "f920487d-efb1-415f-8160-0f614fb8cbe0",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "LocalFeedback"
          },
          {
            "type": "literal",
            "value": null
          }
        ]
      },
      "targets": {
        "false": "396c03de-b9f6-4bfb-95ea-cfc2ff17ff21",
        "true": "1baa7bb1-6be7-47fe-8467-f1b5be4de7c5"
      }
    },
    {
      "type": "return",
      "label": "1baa7bb1-6be7-47fe-8467-f1b5be4de7c5",
      "result": {
        "type": "variable",
        "variable": "LocalFeedback"
      },
      "resultKind": "object"
    },
    {
      "type": "jump",
      "label": "396c03de-b9f6-4bfb-95ea-cfc2ff17ff21",
      "target": "46d62157-31b4-4707-b6a2-a5bab74aecff"
    },
    {
      "type": "createObject",
      "label": "46d62157-31b4-4707-b6a2-a5bab74aecff",
      "objectType": "FeedbackModule.Feedback",
      "outputVar": "NewFeedback"
    },
    {
      "type": "return",
      "label": "b49ba771-a18f-41b4-a5c8-1cc21c481baa",
      "result": {
        "type": "variable",
        "variable": "NewFeedback"
      },
      "resultKind": "object"
    },
    {
      "type": "jump",
      "label": "b53621ec-125c-41b7-abdd-2c910636869c",
      "target": "396c03de-b9f6-4bfb-95ea-cfc2ff17ff21"
    },
    {
      "type": "jump",
      "label": "396c03de-b9f6-4bfb-95ea-cfc2ff17ff21",
      "target": "46d62157-31b4-4707-b6a2-a5bab74aecff"
    },
    {
      "type": "jump",
      "label": "bb0df562-dae1-4581-94b1-5e9f89a0c0d2",
      "target": "f2b54d8d-5ed5-4934-aeed-573cb1733178"
    },
    {
      "type": "nanoflowCall",
      "label": "f2b54d8d-5ed5-4934-aeed-573cb1733178",
      "flow": () => Get_And_Set_Feedback_NPE,
      "parameters": [],
      "outputVar": "StrictModeFeedback"
    },
    {
      "type": "return",
      "label": "d7afae10-ec7a-43e3-995f-f677368c69ad",
      "result": {
        "type": "variable",
        "variable": "StrictModeFeedback"
      },
      "resultKind": "object"
    }
  ]
};
