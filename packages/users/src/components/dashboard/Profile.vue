<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>
                        fa-user
                    </v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-toolbar>
                    <v-btn icon @click="dialog = false">
                        <v-icon>fa-times</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-list three-line subheader>
                    <v-subheader>Email: </v-subheader>
                    <v-list-item>    
                        <v-list-item-action>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>???</v-list-item-title>
                            <v-list-item-subtitle>Your email address</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>    
                </v-list>
            </v-card>

        </v-dialog>
    </v-row>
</template>

<script>
export default {
    data(){
        return{
            dialog: false,
        }
    }
}
</script>