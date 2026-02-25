import { addEnumerations, t } from "mendix/native";

export const DSS_CreateLoginContext = {
  "name": "NativeMobile.DSS_CreateLoginContext",
  "instructions": [
    {
      "type": "createObject",
      "label": "0a470ef9-d97c-44ff-989e-ecbb7f30bb80",
      "objectType": "NativeMobile.Login",
      "outputVar": "NewLogin"
    },
    {
      "type": "return",
      "label": "e438c3b7-c26e-4c43-8445-17afce4a6a1e",
      "result": {
        "type": "variable",
        "variable": "NewLogin"
      },
      "resultKind": "object"
    }
  ]
};
