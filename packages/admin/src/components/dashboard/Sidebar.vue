<template>
    <v-navigation-drawer v-model="sidebarVal" absolute v-on:input="check($event)" hide-overlay temporary mini-variant class="height-auto">
        <v-list-item>
            <v-list-item-icon>
                <v-img src="../../assets/logo.svg" width="50"></v-img>
            </v-list-item-icon>
        </v-list-item>
        <v-divider />
        <v-list-item>
            <v-list-item-icon>
                <profile />
            </v-list-item-icon>
        </v-list-item>

        <v-list-item >
            <v-list-item-icon>
                <settings />
            </v-list-item-icon>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script>
import Settings from './Settings.vue'
import Profile from './Profile.vue'
export default {
    // name="sidebar",
    components: {
        Settings,
        Profile
    },
    props: {
        sidebar: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        sidebar(n) {
            this.sidebarVal = n;
        }
    },
    data: () => ({
        sidebarVal: true
    }),
    methods: {
        check(e) {
            this.$emit('check', e)
        }
    }
}
</script>

<style lang="scss">
</style>