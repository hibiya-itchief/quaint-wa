<template>
  <v-app>
    <v-row v-if="is_admin" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-btn icon fab small @click="$router.go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="検索"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="owner_of"
            :items-per-page="-1"
            :search="search"
            class="elevation-1"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Owner権限の割り当て一覧</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        edited_item = {
                          group_id: '',
                          user_id: '',
                          note: '',
                        }
                      "
                    >
                      新規割り当て
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Owner権限の新規割り当て</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="edited_item.group_id"
                              label="group_id"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="edited_item.user_id"
                              label="user_id"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="edited_item.note"
                              label="メモ 「(期)_(4桁番号)(名前)」の形式"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false">
                        キャンセル
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="createOwnerOf()"
                      >
                        割り当て
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialog_delete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >本当にこのOwner権限の割り当てを削除していいですか?</v-card-title
                    >
                    <v-card-text>
                      {{ edited_item.group_id }} - {{ edited_item.note }}
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialog_delete = false"
                        >キャンセル</v-btn
                      >
                      <v-btn color="primary" @click="deleteItem()">削除</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon
                small
                @click="
                  edited_item = item
                  dialog_delete = true
                "
              >
                mdi-delete
              </v-icon>
            </template></v-data-table
          >
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import { OwnerOf } from '~/types/quaint'
type Data = {
  user_groups: { admin: string }
  owner_of: OwnerOf[]
  headers: { text: string; value: string }[]
  is_admin: boolean
  search: ''
  edited_item: OwnerOf
  dialog: boolean
  dialog_delete: boolean
}
export default Vue.extend({
  data(): Data {
    return {
      user_groups: {
        admin: process.env.AZURE_AD_GROUPS_QUAINT_ADMIN as string,
      },
      headers: [
        { text: 'group_id', value: 'group_id' },
        { text: 'user_id', value: 'user_id' },
        { text: 'メモ', value: 'note' },
        { text: '操作', value: 'actions' },
      ],
      owner_of: [],
      is_admin: false,
      search: '',
      edited_item: {
        group_id: '',
        user_id: '',
        note: '',
      },
      dialog: false,
      dialog_delete: false,
    }
  },
  async created() {
    if (
      (this.$auth.user?.groups as string[]).includes(this.user_groups.admin)
    ) {
      this.is_admin = true
    } else {
      this.$nuxt.error({ statusCode: 403, message: 'Forbidden' })
    }
    this.owner_of = (await this.$axios.$get('/users/owner_of')) as OwnerOf[]
  },
  methods: {
    createOwnerOf() {
      this.$axios
        .$put(
          `/users/${this.edited_item.user_id}/owner_of/?group_id=${this.edited_item.group_id}&note=${this.edited_item.note}`
        )
        .then(() => {
          this.$nuxt.refresh()
        })
        .catch((e) => {
          window.alert('割り当てに失敗しました e=> ' + e)
        })
      this.dialog = false
    },
    deleteItem() {
      this.$axios
        .$delete(
          `/users/${this.edited_item.user_id}/owner_of/?group_id=${this.edited_item.group_id}`
        )
        .then(() => {
          this.$nuxt.refresh()
          window.alert('削除しました')
        })
        .catch((e) => {
          window.alert('削除に失敗しました e=> ' + e)
        })
      this.dialog_delete = false
    },
  },
})
</script>
