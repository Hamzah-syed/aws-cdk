import * as cdk from "@aws-cdk/core" 
import * as dynamodb from "@aws-cdk/aws-dynamodb"
import * as lambda  from "@aws-cdk/aws-lambda";



export interface hitCounterProps {
    downstream:lambda.IFunction
}

export class hitCounter extends cdk.Construct {
    // allows accessing counter function
    public readonly handler:lambda.Function   
    constructor(scope:cdk.Construct, id:string, props:hitCounterProps){
        super(scope, id)

        const table = new dynamodb.Table(this, 'table', {
            partitionKey:{name:'path',type:dynamodb.AttributeType.STRING}
        })

        this.handler = new lambda.Function(this, "HitCounter", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: "hitcounter.handler",
            environment:{
                DOWNSTREAM_FUNCTION_NAME:props.downstream.functionName,
                DYNAMODB_TABLE_NAME: table.tableName
            }
        })
         // grant the lambda role read/write permissions to our table
        table.grantReadWriteData(this.handler) 

        // grant the lambda role invoke permissions to the downstream function
        props.downstream.grantInvoke(this.handler);
    }
}