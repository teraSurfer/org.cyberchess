<template>
    <v-navigation-drawer permanent mini-variant class="height-auto">
        <v-list-item>
            <v-list-item-icon>
                    <v-img src="../../assets/logo.svg" width="50"></v-img>
            </v-list-item-icon>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-icon>
                  <profile />  
            </v-list-item-icon>
        </v-list-item>
        
        <v-list-item>
            <v-list-item-icon>
                  <settings />  
            </v-list-item-icon>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script>
import Settings from './Settings'
import Profile from './Profile'
export default {
    components:{
        Settings,
        Profile
    }
}
</script>

<style lang="scss">
</style>

