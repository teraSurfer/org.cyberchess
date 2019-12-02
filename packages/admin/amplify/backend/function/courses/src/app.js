/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const uuidV4 = require('uuid/v4')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "Courses";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "course_id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/courses";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}


/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function (req, res) {
  const lastKey = (req.query.last_key !== '') ? req.query.last_key : false;
  const limit = (req.query.limit !== '') ? req.query.limit : 10;
  let scanParams = {
    TableName: tableName,
    Limit: limit,
    Count: true,
    ProjectionExpression: "#N, #T, #L, #CID, #I, #E, #C, #U, #II",
    FilterExpression: "#D <> :D",
    ExpressionAttributeNames: {
      "#I": "instructor",
      "#II": "instructor_id",
      "#CID": "course_id",
      "#L": "is_listed",
      "#T": "thumbnail",
      "#N": "course_name",
      "#E": "excerpt",
      "#D": "is_deleted",
      "#C": "created_at",
      "#U": "updated_at"
    },
    ExpressionAttributeValues: {
      ":D": true,
    }
  }
  if(lastKey) { 
    scanParams.ExclusiveStartKey = { "course_id": lastKey };
  }
  console.log(scanParams)
  dynamodb.scan(scanParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data);
    }
  })

});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});

/*****************************************
 * HTTP Get method for getting user course with course id *
 *****************************************/
app.get(path + '/user/:id', function (req, res) {
  console.log(req.params.id)
  
  let queryParams = {
    TableName: tableName,
    ProjectionExpression: "#N, #T, #V, #L, #CID, #I, #II, #E, #C, #U",
    FilterExpression: "#CID = :course_id AND #D <> :is_deleted AND #L = :is_listed",
    ExpressionAttributeNames: {
      "#I": "instructor",
      "#II": "instructor_id",
      "#CID": "course_id",
      "#L": "is_listed",
      "#T": "thumbnail",
      "#V": "lectures",
      "#N": "course_name",
      "#E": "excerpt",
      "#D": "is_deleted",
      "#C": "created_at",
      "#U": "updated_at"
    },
    ExpressionAttributeValues: {
      ":course_id": req.params.id,
      ":is_deleted": true,
      ":is_listed": true
    }
  }
  console.log("-->");
  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      console.log(data.Items)
      res.json(data.Items)
    }
  })
})


/*****************************************
 * HTTP Get method for getting courses with instructor id *
 *****************************************/
app.get(path + '/instructor/:id', function (req, res) {
  console.log(req.params.id)
  let queryParams = {
    TableName: tableName,
    ProjectionExpression: "#N, #T, #L, #CID, #I, #E, #C, #U",
    FilterExpression: "#I = :instructor and #D <> :D",
    ExpressionAttributeNames: {
      "#I": "instructor",
      "#CID": "course_id",
      "#L": "is_listed",
      "#T": "thumbnail",
      "#N": "course_name",
      "#E": "excerpt",
      "#D": "is_deleted",
      "#C": "created_at",
      "#U": "updated_at"
    },
    ExpressionAttributeValues: {
      ":instructor": req.params.id,
      ":D": true
    }
  }
  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data);
    }
  })
})


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  });
});

/************************************
* HTTP patch method for updating object *
*************************************/

app.patch(path + '/object' + hashKeyPath + sortKeyPath, (req, res) => {
  let updateItemParams = {
    TableName: tableName,
    Key: {
      course_id: req.params[partitionKeyName]
    },
    UpdateExpression: "SET #CN = :CN, #E = :E, #L = :L, #IL = :IL, #T = :T, #U = :U",
    ExpressionAttributeNames: {
      "#CN": "course_name",
      "#L": "lectures",
      "#IL": "is_listed",
      "#T": "thumbnail",
      "#E": "excerpt",
      "#U": "updated_at"
    },
    ExpressionAttributeValues: {
      ":CN": req.body.course_name,
      ":L": req.body.lectures,
      ":IL": req.body.is_listed,
      ":T": req.body.thumbnail,
      ":E": req.body.excerpt,
      ":U": new Date().toUTCString()
    }
  };
  dynamodb.update(updateItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({ error: err})
    } else {
      res.statusCode = 201;
      res.json({message: 'Updated successfully.'});
    }
  })
})

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: {
      course_id: uuidV4(),
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
      is_deleted: false,
      deleted_at: null,
      ...req.body
    }
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params,
    UpdateExpression: "SET #D = :D, #DAT = :DAT",
    ExpressionAttributeNames: {
      "#D": "is_deleted",
      "#DAT": "deleted_at" 
    },
    ExpressionAttributeValues: {
      ":D": true,
      ":DAT": new Date().toUTCString()
    }
  }
  dynamodb.update(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
