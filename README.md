# lambda-node-opentelemetry-example-serverless-stack-v1# 🎸 Lambda Opentelemetry for Node.JS

The `@baselime/lambda-node-opentelemetry` package instruments your lambda functions and automatically ships OTEL compatible trace data to Baselime. This is the most powerful and flexible way to instrument your node service.

The downside of this node tracer is it adds a small performance hit to each lambda invocation. We are working as hard as possible to minimise this but for now if this matters to you use our [x-ray](https://docs.baselime.io/sending-data/xray/) integration instead.


## Manual Installation

Install the `@baselime/lambda-node-opentelemetry` package

```bash
npm install @baselime/lambda-node-opentelemetry
```

Add the following environment variables to your service

| Key                | Example                         | Description                                                                         |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------- |
| BASELIME_OTEL_KEY  | nora-is-the-cutest-baselime-dog | Get this key from the [cli](https://github.com/Baselime/cli) running `baselime iam` |
| BASELIME_NAMESPACE | prod-users                      | The name of the service the traces belong to                                        |
| NODE_OPTIONS       | --require @baselime/lambda-node-opentelemetry      | Preloads the tracing sdk at startup                                                 |

Get the baselime key using our [cli](https://github.com/Baselime/cli) 

```bash
baselime iam
```

You need to make sure the lambda-wrapper file is included in the .zip file that is used by aws-lambda. The exact steps depend on the packaging step of the framework you are using.

> If you use `export const` `export function` or `export default` for your handler you need to rename it to a cjs export like `module.exports = ` or `exports.handler =`. Even if you use esbuild. We are tracking issues in [esbuild](https://github.com/evanw/esbuild/issues/1079) and [open-telemetry](https://github.com/open-telemetry/opentelemetry-js/issues/1946) and are looking to see how we can help out.

### SST

> Fun fact Baselime is built using SST :)

Then add the default props to include the wrapper in your bundle and add your environment variables


```javascript
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
```

## Send data to another OpenTelemetry Backend

Add the environment variable `COLLECTOR_URL` to send the spans somewhere else.
