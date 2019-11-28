<template>
 <v-form @submit.stop.prevent="getFile" class="text-center mb-2">   
    <v-row class="fill-width">
      <v-col cols="12">
        <v-card flat>
          <v-card-text class="pb-0">
            <v-row class="pr-2 pl-2">
              <span>Query Get partition & Sort Key</span>
              <v-spacer />
              <v-btn @click="getFile()" value=testingAPIQuery >
                 <v-icon color="error">fa-check</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-row class="pr-2 pl-2">
              <span>Scan Get using Course Id</span>
              <v-spacer />
              <v-btn @click="getFile2()" value=testingAPIScan >
                 <v-icon color="error">fa-check</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
          <v-card-text class="pb-0">
            <v-row class="pr-2 pl-2">
              <span>Scan Get using Profile (User) Id</span>
              <v-spacer />
              <v-btn @click="getFile3()" value=testingAPIScan >
                 <v-icon color="error">fa-check</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>          
          <v-card-text class="pb-0">
            <v-row class="pr-2 pl-2">
              <span>Only Get object(s) using Profile (User) Id</span>
              <v-spacer />
              <v-btn @click="getFile4()" value=testingAPIScan >
                 <v-icon color="error">fa-check</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>          
 
        </v-card>
      </v-col>
    </v-row>
  </v-form>
 </template>

<script>
export default {
    props: {
        suscription: Object,
    },
    data: () => ({
        files: []
    }),
    methods: {
        /***Get one file by suscription Dynamo scan***/
        async getFile() {
            try{
                let mySuscriptioID= "d56bf1f8-8a7d-4cc3-ad5c-000002";
                let apiName= "CyberChessApi";
                let dynamoKey= `/subscriptions/object/${mySuscriptioID}`;
                console.log("dynamoKey: " + dynamoKey);
                const response= await this.$Amplify.API.get(apiName, dynamoKey, {response:true});
                console.log(response.data);
                // this.suscription = response
              //  console.log(response.data);
            }catch(err){
                console.log(err);
            }
        },
        /***Get one file by course Dynamo scan***/
       async getFile2() {
            try{
                let apiName= "CyberChessApi";
                let myCouseID= "fe3cd40f-3e5e-4738-b1e4-2641c2928f4d";
                let dynamoKey = `/subscriptions/course_id/${myCouseID}`;
                console.log("dynamoKey: " + dynamoKey);
                const response= await this.$Amplify.API.get(apiName, dynamoKey);
                console.log(response);
                //  this.suscription = response
            }catch(err){
                console.log(err);
            }
        },
        /***Get one file by profile Dynamo scan***/
       async getFile3() {
            try{
                let apiName= "CyberChessApi";
                let myProfileID= "3a5da7b2-578a-461b-a3f5-21e671590e8b";
                let dynamoKey= `/subscriptions/profile_id/${myProfileID}`; 
                console.log("dynamoKey: " + dynamoKey);
                const response= await this.$Amplify.API.get(apiName, dynamoKey); //, {response: true});
                console.log(response); //[0].courseId);
                //this.suscription = await this.splitUserFromKey(response);
     //==TETS
                // console.log("----Goal----->")  
                //   let ExpressionAttributeVals = {
                //     ":course_id0": '43a1749a-539c-4afc-85c3-87c39db605bf',
                //     ":course_id1": 'fe3cd40f-3e5e-4738-b1e4-2641c2928f4d',
                //     ":course_id2": '31accbe6-0a7f-4fe1-8930-2393eb67acbe',}
                //   console.log(ExpressionAttributeVals);
                // console.log("----input----->") 
                //  let data= [  
                //    { course_id: '43a1749a-539c-4afc-85c3-87c39db605bf' },
                //    { course_id: 'fe3cd40f-3e5e-4738-b1e4-2641c2928f4d' },
                //    { course_id: '31accbe6-0a7f-4fe1-8930-2393eb67acbe' } ];
                //   console.log(data);

                // let ExpressionAttributeValues ={} 
                // data.forEach(function(element, x) {
                //     ExpressionAttributeValues[':Course_id' +  x]=  element.course_id 
                //     console.log(element.course_id);
                // });
                // console.log(ExpressionAttributeValues);
                // let dataQuery={} 
                // dataQuery = {ExpressionAttributeValues};
                // console.log(dataQuery);
          //===TES

            }catch(err){
                console.log(err);
            }
        },
        async getFile4() {
            try{
               // let mySuscriptioID= "'d56bf1f8-8a7d-4cc3-ad5c-000002', 'd56bf1f8-8a7d-4cc3-ad5c-000003'";
               let mySuscriptioID= "d56bf1f8-8a7d-4cc3-ad5c-000003";
                let apiName= "CyberChessApi";
                let dynamoKey= `/subscriptions/${mySuscriptioID}`;
                console.log("dynamoKey: " + dynamoKey);
                const response= await this.$Amplify.API.get(apiName, dynamoKey, {response:true});
                console.log(response.data);
                // this.suscription = response
              //  console.log(response.data);
            }catch(err){
                console.log(err);
            }
        },

        
    }
}
</script>