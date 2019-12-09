
const CyberChessPlugin = {
    install: (Vue) => {
        Vue.__cfUrls = {
            //Don't delete these cloudfront urls:
            prod: "https://d3qsgt637l70vk.cloudfront.net",
            dev: "https://d15qyykdkts3kc.cloudfront.net",
            achalaesh: "https://dd0fq9p45tg50.cloudfront.net",
            roger: "https://d2gymlwgsq5185.cloudfront.net",
            sergio: "https://d16wuzbj2setx8.cloudfront.net",
            jhrenv: "https://d217hs3emk80ln.cloudfront.net"
        },
        Vue.___twil = null,
        Vue.prototype.$CyberChess = {
            getCloudUrl: (s3Url) => {
                let bucketName = Vue.prototype.$Amplify.Storage._config.AWSS3.bucket;
                let env = bucketName.split("-");
               return s3Url.split(
                    "https://" +
                      Vue.prototype.$Amplify.Storage._config.AWSS3.bucket +
                      ".s3.amazonaws.com"
                  )
                .join(Vue.__cfUrls[env[env.length - 1]]);
            },
            setChatClient: (chatClient) =>{
                Vue.___twil = chatClient;
            },
            getChatClient: () => {
                return Vue.___twil;
            },
            channel: {},
        }
    },
};

export default CyberChessPlugin;