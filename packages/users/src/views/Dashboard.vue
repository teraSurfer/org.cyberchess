<template>
    <v-container fluid class="fill-height padding-0">
            <sidebar :sidebar="expand" v-on:check="setExpand($event)" />
            <v-col class="pt-0 dashboard padding-0">
            <v-toolbar flat class="pl-2">
                <v-btn @click="expand =!expand" icon text>
                <v-icon>fa-bars</v-icon>
                </v-btn>
                <v-spacer />
                <h4 class="mb-0">User Dashboard - {{getTitle}}</h4>
                <v-spacer />
            </v-toolbar>
            <router-view />
            </v-col>
            <bottom-nav />
    </v-container>
</template>


<script>
import Sidebar from '@/components/dashboard/Sidebar.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'
export default {
    components: {
        Sidebar,
        BottomNav
    },
    created() {
        if(this.$route.name === 'Dashboard')        //maybe acha bug
            this.$router.push('/dashboard/home')
        // if(this.$route.name !== 'Home')
        //     this.$router.push('./home')      //maybe acha bug
    },
    computed: {
        getTitle(){
            return this.$route.name
        }
    },
    data: () => ({
        expand: true
    }),
    methods: {
        setExpand(e) {
            this.expand = e;
        }
    }
}
</script>

<style lang="scss">
    .dashboard {
        height: calc(100% - 56px);
    }
    .padding-0 {
        padding: 0;
    }
</style>