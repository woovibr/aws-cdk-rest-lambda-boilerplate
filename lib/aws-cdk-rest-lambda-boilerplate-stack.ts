import * as cdk from 'aws-cdk-lib';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as api from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import path from 'path';

const indexPath = path.join(process.cwd(), './src/handler.ts');

export class AwsCdkRestLambdaBoilerplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.NodejsFunction(
      this,
      "lambda-boilerplate-function",
      {
        entry: indexPath,
        handler: 'handler',
        description: 'A simple boilerplate lambda function on AWS',
        runtime: Runtime.NODEJS_16_X,
        architecture: Architecture.ARM_64,
        timeout: cdk.Duration.seconds(5),
        memorySize: 128,
      },
    );

    const rest = new api.LambdaRestApi(this, 'boilerplate-rest-api', {
      restApiName: 'Boilerplate REST API',
      handler,
      proxy: false,
    });

    rest.root.addMethod('GET', new api.LambdaIntegration(handler), {
      apiKeyRequired: true,
    });
  }
}
