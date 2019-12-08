
const CyberChessPlugin = {
    install: (Vue) => {
        Vue.__cfUrls = {
            dev: "https://d15qyykdkts3kc.cloudfront.net",
            achalaesh: "https://dd0fq9p45tg50.cloudfront.net"
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