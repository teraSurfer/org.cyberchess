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
                // let splitted = await this.splitUserFromKey(response);
                // console.log("after splitted: ");
                // console.log(splitted);
            }catch(err){
                console.log(err);
            }
        },
        // splitUserFromKey(keys) {
        //   let userFileList = [];
        //   // alert(typeof keys);
        //   // console.log(keys);
          
        //   console.log("jsonStr:11 ")

        //   var jsonStr = Object.entries(keys).map(function(key) {
        //     return [Number(key), keys[key]];
        //   });

        //   //let jsonStr =  keys.keys() //JSON.parse(keys);  //.toString().split(',')
        //   console.log(typeof jsonStr)
        //   console.log(jsonStr);

        //    console.log("jsonStrVal[0]: ")
        //    let jsonStrVal0 = JSON.stringify(keys[0]);
        //    console.log(typeof jsonStrVal0)
        //    console.log(jsonStrVal0);

        //   console.log("jsonStrVal[1]: ")
        //   let jsonStrVal1 = keys[1].courseId;
        //   console.log(typeof jsonStrVal1)
        //   console.log(jsonStrVal1);



        //     // let val00 = keys.toString().split(',');
        //     // userFileList.push({...keys, subscriptionId: val00, profileId: val01}); //,  isDeleted: val02, courseId: val03});

        //   // keys.forEach(value => {
        //   //   // let val03 = value.key.split(',')[3];
        //   //   // let val02 = value.key.split(',')[2];
        //   //   let val01 = value.split(',')[1];
        //   //   let val00 = value.split(',')[0];
        //   //   userFileList.push({...value, subscriptionId: val00, profileId: val01}); //,  isDeleted: val02, courseId: val03});
        //   // });
        //   console.log(userFileList);
        //   return userFileList;
        // },



    }
}
</script>