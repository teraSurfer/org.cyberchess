
const CyberChessPlugin = {
    install: (Vue) => {
        Vue.__cfUrls = {
            dev: "https://d15qyykdkts3kc.cloudfront.net",
            jhrenv: "https://d217hs3emk80ln.cloudfront.net"
        }
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
        }
    },
};

export default CyberChessPlugin;