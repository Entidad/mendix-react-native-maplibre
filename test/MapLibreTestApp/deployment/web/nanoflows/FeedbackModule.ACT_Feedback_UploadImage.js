import { addEnumerations, t } from "mendix";

export const ACT_Feedback_UploadImage = {
  "name": "FeedbackModule.ACT_Feedback_UploadImage",
  "instructions": [
    {
      "type": "setVariable",
      "label": "b4d0690d-bfc6-4464-bfc1-1916f6d03b47",
      "value": {
        "type": "literal",
        "value": ".gif,.png,.jpg,.jpeg"
      },
      "outputVar": "mimeTypes",
      "outputKind": "primitive"
    },
    {
      "type": "setVariable",
      "label": "66673930-8ea8-4a74-88e1-0391d6af8285",
      "value": {
        "type": "literalNumeric",
        "value": "5"
      },
      "outputVar": "fileUploadSize",
      "outputKind": "primitive"
    },
    {
      "type": "javaScriptActionCall",
      "label": "2defb127-6b2e-4871-8e7c-3136b461f9ba",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_UploadAndConvertToFileBlobURL").JS_UploadAndConvertToFileBlobURL,
      "outputVar": "fileBlobURL",
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "mimeTypes"
          }
        },
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "fileUploadSize"
          }
        }
      ]
    },
    {
      "type": "switch",
      "label": "322c040f-e3eb-4057-9e60-ad808e119d13",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "fileBlobURL"
          },
          {
            "type": "literal",
            "value": "uploadCancelled"
          }
        ]
      },
      "targets": {
        "true": "eab66b42-0316-4eba-878c-2f4912d67069",
        "false": "702f830f-b5ca-4de0-81c8-fc73bcd28ade"
      }
    },
    {
      "type": "return",
      "label": "702f830f-b5ca-4de0-81c8-fc73bcd28ade",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "switch",
      "label": "eab66b42-0316-4eba-878c-2f4912d67069",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "fileBlobURL"
          },
          {
            "type": "literal",
            "value": null
          }
        ]
      },
      "targets": {
        "false": "c58ec3ea-a80d-488e-b137-f3b052615e01",
        "true": "a1602462-3474-407e-8e22-f772d24b1ab5"
      }
    },
    {
      "type": "switch",
      "label": "a1602462-3474-407e-8e22-f772d24b1ab5",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "fileBlobURL"
          },
          {
            "type": "literal",
            "value": "fileSizeNotAccepted"
          }
        ]
      },
      "targets": {
        "true": "69e6a53f-1fb7-455b-b011-aa656136fb93",
        "false": "5a3f4270-6f16-40d9-bc1a-db048afa9915"
      }
    },
    {
      "type": "showMessage",
      "label": "5a3f4270-6f16-40d9-bc1a-db048afa9915",
      "messageType": "error",
      "message": t([
        {
          "type": "literal",
          "value": "Maximum image size allowed is 5MB."
        }
      ]),
      "blocking": true
    },
    {
      "type": "return",
      "label": "3a5c56a4-091a-4b92-8de1-56f8693133d4",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "switch",
      "label": "69e6a53f-1fb7-455b-b011-aa656136fb93",
      "condition": {
        "type": "function",
        "name": "!=",
        "parameters": [
          {
            "type": "variable",
            "variable": "fileBlobURL"
          },
          {
            "type": "literal",
            "value": "fileTypeNotAccepted"
          }
        ]
      },
      "targets": {
        "false": "dea8cd5f-ac64-46b4-bddd-22ee576cf8a6",
        "true": "ebab8bf8-0dcf-4373-b3e8-2cb47b96c966"
      }
    },
    {
      "type": "closeForm",
      "label": "ebab8bf8-0dcf-4373-b3e8-2cb47b96c966"
    },
    {
      "type": "javaScriptActionCall",
      "label": "c63dc36f-07b9-49fe-9b05-34a4f7a7bece",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_ToggleFeedbackAnnotateWidget").JS_ToggleFeedbackAnnotateWidget,
      "outputVar": "base64ImageFromWidget",
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "fileBlobURL"
          }
        }
      ]
    },
    {
      "type": "changeObject",
      "label": "a11459d8-f883-4af7-96fb-a63073c6691d",
      "inputVar": "Feedback",
      "member": "ImageB64",
      "value": {
        "type": "variable",
        "variable": "base64ImageFromWidget"
      }
    },
    {
      "type": "commitObjects",
      "operationId": "oKsI1yVVtV2fuyilk+opgw",
      "inputVar": "Feedback"
    },
    {
      "type": "openForm",
      "label": "04a0ae9e-db66-4bf3-883a-2d884179b8ff",
      "path": "FeedbackModule/ShareFeedback.page.xml",
      "params": {
        "name": "FeedbackModule/ShareFeedback.page.xml",
        "location": "modal",
        "resizable": true
      }
    },
    {
      "type": "javaScriptActionCall",
      "label": "a4b49665-e8f8-4de5-a56c-2df3e1590a00",
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
      "label": "6d093ec1-c9be-4026-9296-14e385d9c1f9",
      "action": () => require("C:/Users/jorge/Documents/Workspaces/Claude-ws/mapLibre/test/MapLibreTestApp/javascriptsource/feedbackmodule/actions/JS_RevokeUploadedFileFromMemory").JS_RevokeUploadedFileFromMemory,
      "parameters": [
        {
          "kind": "primitive",
          "value": {
            "type": "variable",
            "variable": "fileBlobURL"
          }
        }
      ]
    },
    {
      "type": "return",
      "label": "c3bcd77c-b317-4576-ab88-a7d2341e2b63",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "showMessage",
      "label": "dea8cd5f-ac64-46b4-bddd-22ee576cf8a6",
      "messageType": "error",
      "message": t([
        {
          "type": "literal",
          "value": "Only images with format of .gif .jpg .jpeg .png are allowed"
        }
      ]),
      "blocking": true
    },
    {
      "type": "return",
      "label": "d624af84-703f-4ae9-ab96-662eea8cae8a",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    },
    {
      "type": "showMessage",
      "label": "c58ec3ea-a80d-488e-b137-f3b052615e01",
      "messageType": "error",
      "message": t([
        {
          "type": "literal",
          "value": "Upload failed, please try again."
        }
      ]),
      "blocking": true
    },
    {
      "type": "return",
      "label": "30c8349b-cb27-4d66-b7fd-703fab99bccf",
      "result": {
        "type": "literal",
        "value": null
      },
      "resultKind": "primitive"
    }
  ]
};
