import { Api } from "@serverless-stack/resources";
const BASELIME_OTEL_KEY = process.env.BASELIME_OTEL_KEY || 'your-key-here'

/**
 * 
 * @param {import("@serverless-stack/resources").StackContext} param0 
 */
export function MyStack({ stack }) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /": "functions/lambda.handler",
    },
    defaults: {
      function: {
        bundle: {
          copyFiles: [{ from: '../node_modules/@baselime/lambda-node-opentelemetry', to: './'}]
        },
        environment: {
          BASELIME_OTEL_KEY,
          BASELIME_NAMESPACE: stack.stackName,
          NODE_OPTIONS: '--require ./lambda-wrapper.js'
        }
      }
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
