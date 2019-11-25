/* eslint-disable-line */ const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();
let tableName = "Profiles";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

exports.handler = async (event, context, callback) => {
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  try {
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    callback(null, event);
    console.log('entering dynamo db section')
    console.log(event)
   let userParams = {
     TableName: tableName,
     Item: {
         "user_id": event.request.userAttributes.sub ,
         "phone_number": event.request.userAttributes.phone_number ,
         "email_id": event.request.userAttributes.email
     }
   }
   console.log('dynamodb put;')
   dynamodb.put(userParams, function(err, data) {
     if (err) {
       console.log("Error", err);
     } else {
       console.log("Exit", data);
     }
   });  
  } catch (e) {
    callback(e);
  }


};
