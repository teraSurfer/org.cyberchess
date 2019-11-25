<template>
    <v-content class="dashboard">
        <v-row class="fill-height">
            <sidebar />
                <v-container class="fill-height">   
                    <v-col cols="12" class="fill-height"> 
                        <h3>User Dashboard - {{getBreadcrumb}} </h3>
                        <router-view />
                    </v-col>
                </v-container>
        </v-row>
        <bottom-nav />
    </v-content>
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
        if(this.$route.name !== 'Home')
            this.$router.push('./home')      //maybe acha bug
    },
    computed: {
        getBreadcrumb(){
            return this.$route.name
        }
    }   

}
</script>

<style lang="scss">
    .dashboard {
        height: calc(100% - 56px);
    }
</style>