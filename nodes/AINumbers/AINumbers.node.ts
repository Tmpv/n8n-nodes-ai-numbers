import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class AINumbers implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AI Numbers',
    name: 'AINumbers',
    icon: 'file:AINumbers.svg',
    description: 'Sending What\'s app messages',
    group: [],
    version: 1,
    subtitle: '={{ $parameter["operation"] + ": " $parameter["resource"] }}',
    defaults: {
      name: 'AI Numbers'
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'AINumbersApi',
        required: true
      }
    ],
    requestDefaults: {
      baseURL: 'https://api-v2.sendbee.io/',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Contact',
            value: 'contact'
          },
        ],
        default: 'contact'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'contact',
            ]
          }
        },
        options: [
          {
            name: 'List',
            value: 'list',
            action: 'List contacts',
            description: 'Return contacts information',
            routing: {
              request: {
                method: 'GET',
                url: 'contacts',
              }
            }
          },
        ],
        default: 'list'
      }
    ]
  };
}
