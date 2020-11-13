import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda"
import * as apigw from "@aws-cdk/aws-apigateway"

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this,"helloWorld", {
      //our function uses nodejs_10_X
      runtime:lambda.Runtime.NODEJS_10_X,
      // the handler code is loaded from lambda directory which is created in root
      code:lambda.Code.fromAsset('lambda'),
      // hello is the file name and handler is exported from that file 
      handler: 'hello.handler'
    })

    new apigw.LambdaRestApi(this,"endpoint",{
      handler:hello
    })
   
  }
}
