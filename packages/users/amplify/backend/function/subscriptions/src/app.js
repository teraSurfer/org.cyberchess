/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageCoursesName = process.env.STORAGE_COURSES_NAME
var storageCoursesArn = process.env.STORAGE_COURSES_ARN

Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const uuidV4 = require('uuid/v4')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "subscriptions";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

let table2Name = "Courses";
if(process.env.ENV && process.env.ENV !== "NONE") {
  table2Name = table2Name + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "subscription_id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/subscriptions";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}


/**************************************
 * test APIGateway access  Test       *
 *************************************/
app.get(path, function(req, res) {
  res.statusCode = 200;
  res.json({msg: 'res from custom function'});
})


/******************************************************
 * HTTP Get method for list objects by scan profileId  *
 ******************************************************/
app.get(path + '/profile_id/:id'  , function(req, res) {
  console.log("here-1-->profileid")
  console.log(req.params.id)
  let queryParams = {
      TableName: tableName,
      ProjectionExpression: "#I", // "#CID, #P, #I, #L",  
      FilterExpression: "#P = :profile_id AND  #L = :is_deleted",
      ExpressionAttributeNames: {
        //  "#CID": "subscription_id",
        "#P": "profile_id",
        "#I": "course_id",
        "#L": "is_deleted",
      },
      ExpressionAttributeValues: {
        ":profile_id": req.params.id,
        ":is_deleted": false
      },
  }
  dynamodb.scan(queryParams, (err, data) => {
     if (err) {
          res.statusCode = 500;
          res.json({error: 'Could not load items: ' + err});
     } 
     else {
          let ExpressionAttributeValues ={}; 
          let FilterExpression = "(";
          data.Items.forEach(function(element, x) {
            ExpressionAttributeValues[':course_id' +  x]=  element.course_id;
            if (x === data.Items.length-1){
                ExpressionAttributeValues[':is_listed']=  true; }
            FilterExpression = FilterExpression + "#SS = :course_id" + x + (x < data.Items.length-1 ? " Or " : ") AND  #L = :is_listed"); 
          });
          console.log(ExpressionAttributeValues);
          console.log(FilterExpression)
          let query2Params = {
            TableName: table2Name,
              ProjectionExpression:   "#U, #E, #N, #T, #L, #SS, #II, #I",  
              FilterExpression: FilterExpression,
              ExpressionAttributeNames: {
                "#I": "instructor", 
                "#II": "instructor_id",
                "#SS": "course_id",
                "#L": "is_listed",
                "#T": "thumbnail",
                "#N": "course_name",
                "#E": "excerpt",
                "#U": "updated_at"
              },
              ExpressionAttributeValues: ExpressionAttributeValues,
          } 
          // console.log(query2Params);
          dynamodb.scan(query2Params, (err, data2) => {
            if(err) {
                res.statusCode = 500;
                res.json({error: 'Could not load items: ' + err});
            } else {
                // console.log('here-6--->data2.Items')
                console.log(data2.Items)
                // res.json({subscriptions:data.Items, courses:data2.Items});
                res.json({courses:data2.Items});
            }
          })
     }    
  });
   
});
        

/******************************************************
 * HTTP Get method for suscription by scan user Id  *
 ******************************************************/
app.get(path + '/user_id/:id/course_id/:id2'  , function(req, res) {
  console.log("here-1-->profileid")
  console.log(req.params.id)
  let queryParams = {
      TableName: tableName,
      ProjectionExpression: "#CID, #P, #I, #L",  
      FilterExpression: "#P = :profile_id AND #I = :course_id",
      ExpressionAttributeNames: {
        "#CID": "subscription_id",
        "#P": "profile_id",
        "#I": "course_id",
        "#L": "is_deleted",
      },
      ExpressionAttributeValues: {
        ":profile_id": req.params.id,
        ":course_id": req.params.id2
      },
  }
  dynamodb.scan(queryParams, (err, data) => {
     if (err) {
          res.statusCode = 500;
          res.json({error: 'Could not load items: ' + err});
     } 
     else {
     res.json(data.Items); 
    }
  });
  
});



/******************************************************
 * HTTP Get method for list objects by scan courseId  *
 ******************************************************/
app.get(path + '/course_id/:id'  , function(req, res) {
  console.log(req.params.id)
  let queryParams = {
    TableName: tableName,
    ProjectionExpression: "#CID, #P, #I, #L",  
    FilterExpression: "#I = :course_id",
    ExpressionAttributeNames: {
        "#CID": "subscription_id",
        "#P": "profile_id",
        "#I": "course_id",
        "#L": "is_deleted",
    },
    ExpressionAttributeValues: {
      ":course_id": req.params.id
    }
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items); 
    }
  });
  
});



/**********************************************
 * HTTP Get method for list objects by query *
 *********************************************/
app.get(path + hashKeyPath, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  console.log("--condition1 -->")
  console.log(condition)

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  console.log("--condition2 -->")
  console.log(condition)

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  console.log("--queryParams -->")
  console.log(queryParams)

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});



/**************************************************
 * HTTP Get method for get single object by Query *
 *************************************************/
app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let i = {
    subscription_id: uuidV4(),
    ...req.body
  }
  let putItemParams = {
    TableName: tableName,
    Item: i
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let deleteParams = {
    TableName: tableName,
    ExpressionAttributeNames: {
      "#AT": "is_deleted",
     }, 
     ExpressionAttributeValues: {
      ":t": true
     },
    UpdateExpression: "SET #AT = :t",
    Key: params
  }

  dynamodb.update(deleteParams, function(err, data) {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: '(update) delete call succeed!', url: req.url, data: data})
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
