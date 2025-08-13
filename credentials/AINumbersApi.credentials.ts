import type {
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestHelper,
  INodeProperties,
} from 'n8n-workflow';

import crypto from 'crypto';

export class AINumbersApi implements ICredentialType {
  name = 'AINumbersApi';

  displayName = 'Ai Numbers Credentials API';
  documentationUrl = 'https://developer.ainumber.com/?shell#authentication';

  httpRequestNode = {
    name: 'AI Numbers credentials',
    docsUrl: 'https://developer.ainumber.com/?shell#introduction',
    apiBaseUrl: 'https://api-v2.sendbee.io',
  };

  properties: INodeProperties[] = [
    {
      displayName: 'Auth Token',
      name: 'authToken',
      type: 'hidden',

      typeOptions: {
        expirable: true,
      },
      default: '',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      required: true,
      default: '',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: { password: true },
      required: true,
      default: '',
    },
  ];

  async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
    // 1. Get the current timestamp in seconds
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // 2. Create HMAC SHA-256 signature (hex lowercase)
    const apiSecretString = credentials.apiSecret as string;

    const signature = crypto
      .createHmac('sha256', apiSecretString)
      .update(timestamp)
      .digest('hex');

    // 3. Concatenate timestamp and signature with a dot
    const combined = `${timestamp}.${signature}`;

    // 4. Convert the concatenated string into Base64
    const base64 = Buffer.from(combined).toString('base64');

    return { authToken: base64 };
  }

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Auth-Token': '={{$credentials.authToken}}',
        'X-Api-Key': '={{$credentials.apiKey}}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api-v2.sendbee.io',
      url: '/contacts',
    },
  };
}
