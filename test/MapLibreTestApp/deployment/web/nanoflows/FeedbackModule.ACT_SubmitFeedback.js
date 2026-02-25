import { addEnumerations, t } from "mendix";
import { SUB_Feedback_ResetLocalStorage } from "./FeedbackModule.SUB_Feedback_ResetLocalStorage.js";

export const ACT_SubmitFeedback = {
  "name": "FeedbackModule.ACT_SubmitFeedback",
  "instructions": [
    {
      "type": "microflowCall",
      "label": "060bc949-9469-4b26-8c61-6a4a437f6942",
      "operationId": "Q8iu7+gyVFqV93BFmo/mdA",
      "parameters": [
        {
          "name": "Feedback",
          "value": {
            "type": "variable",
            "variable": "Feedback"
          },
          "kind": "object"
        }
      ],
      "outputVar": "isValid"
    },
    {
      "type": "switch",
      "label": "84625e0a-ef39-4d39-9cfe-df88a65118d3",
      "condition": {
        "type": "variable",
        "variable": "isValid"
      },
      "targets": {
        "true": "e28cf4dc-66e8-4070-a765-07ee24774d11",
        "false": "38fc16c4-0463-4f02-9a8e-4b2b361a9963"
      }
    },
    {
      "type": "return",
      "label": "38fc16c4-0463-4f02-9a8e-4b2b361a9963",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "microflowCall",
      "label": "e28cf4dc-66e8-4070-a765-07ee24774d11",
      "operationId": "/eq9YsZaDl6VMFcMgz5ysQ",
      "parameters": [
        {
          "name": "Feedback",
          "value": {
            "type": "variable",
            "variable": "Feedback"
          },
          "kind": "object"
        }
      ],
      "outputVar": "ResponseHelper"
    },
    {
      "type": "closeForm",
      "label": "bb847199-bbe5-46b5-a246-4566ec596b42",
      "numberOfPagesToClose": {
        "type": "literalNumeric",
        "value": "1"
      }
    },
    {
      "type": "switch",
      "label": "4b094cb1-1f44-4e11-bf4f-a49b1f69037c",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "ResponseHelper"
          },
          {
            "type": "literal",
            "value": null
          }
        ]
      },
      "targets": {
        "true": "99a7ca80-abf5-4214-9ba3-9643a8751ceb",
        "false": "7dca8a61-946c-4bc8-97f3-6e6e8a7e16cf"
      }
    },
    {
      "type": "jump",
      "label": "7dca8a61-946c-4bc8-97f3-6e6e8a7e16cf",
      "target": "09783d1a-df1e-4cb5-9cb5-74174dd05044"
    },
    {
      "type": "openForm",
      "label": "09783d1a-df1e-4cb5-9cb5-74174dd05044",
      "path": "FeedbackModule/PopupFailure.page.xml",
      "params": {
        "name": "FeedbackModule/PopupFailure.page.xml",
        "location": "modal",
        "resizable": false
      }
    },
    {
      "type": "return",
      "label": "07ba7939-1801-47fa-90a3-d8e36fcc26d8",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "openForm",
      "label": "99a7ca80-abf5-4214-9ba3-9643a8751ceb",
      "path": "FeedbackModule/PopupSuccess.page.xml",
      "params": {
        "name": "FeedbackModule/PopupSuccess.page.xml",
        "location": "modal",
        "resizable": false
      },
      "inputArgs": {
        "$Response": {
          "type": "variable",
          "variable": "ResponseHelper"
        }
      }
    },
    {
      "type": "nanoflowCall",
      "label": "67226182-a9aa-447f-9c30-731fe6a7b162",
      "flow": () => SUB_Feedback_ResetLocalStorage,
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
      "type": "return",
      "label": "919d14a2-637a-41ca-b668-4b88409d73bd",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    }
  ]
};
