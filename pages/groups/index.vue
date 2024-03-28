<template>
  <v-app>
    <div v-if="!nowloading">
      <v-container>
        <v-row justify="center">
          <v-col class="mt-2 mb-0 py-0" cols="12" sm="8" md="8">
            <v-text-field
              v-model="search_query"
              solo
              label="検索"
              hide-details="auto"
              color="theme_color"
              prepend-inner-icon="mdi-magnify"
              @input="searchGroups()"
              @blur="
                const search_query_q =
                  search_query === '' ? undefined : search_query
                pushQuery(search_query_q, null, null, null, null)
              "
            >
            </v-text-field>
          </v-col>
          <v-col class="mt-2 mb-5 py-0" cols="12" sm="8" md="8">
            <p v-if="search_query !== ''" class="ma-0 pa-0 text-caption">
              "{{ search_query }}"の検索結果({{ search_result_number }}件)
            </p>
            <p v-else class="ma-0 pa-0 text-caption">
              <br />
            </p>

            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="search_query !== ''"
                  depressed
                  max-width="135"
                  class="text-subtitle-2 text-capitalize"
                  v-bind="attrs"
                  v-on="on"
                  >{{ selectedTag?.tagname ?? 'すべて' }}<v-spacer /><v-icon
                    >mdi-chevron-down</v-icon
                  ></v-btn
                >
              </template>
              <v-list>
                <v-list-item
                  @click="
                    pushQuery(null, undefined, null, null, null)
                    selectedTag = undefined
                  "
                  >すべて</v-list-item
                >
                <v-list-item
                  v-for="tag in tags"
                  :key="tag.id"
                  :value="tag.tagname"
                  @click="
                    pushQuery(null, tag.tagname, null, null, null)
                    selectedTag = tag
                  "
                  >{{ tag.tagname }}</v-list-item
                >
              </v-list>
            </v-menu>
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  depressed
                  max-width="150"
                  class="text-subtitle-2 text-capitalize"
                  v-bind="attrs"
                  v-on="on"
                  >{{ sort_displayname }} <v-spacer /><v-icon
                    >mdi-chevron-down</v-icon
                  ></v-btn
                >
              </template>
              <v-list>
                <v-list-item @click="sortGroups('id')"
                  >デフォルト順</v-list-item
                >
                <v-list-item @click="sortGroups('groupname')"
                  >団体名順</v-list-item
                >
                <v-list-item @click="sortGroups('title')">演目名順</v-list-item>
              </v-list>
            </v-menu>
            <div style="display: inline">
              <v-icon
                v-show="display_bookmarks"
                color="theme_color"
                @click="
                  display_bookmarks = false
                  pushQuery(null, null, undefined, null, null)
                "
                >mdi-bookmark-multiple</v-icon
              >
              <v-icon
                v-show="!display_bookmarks"
                @click="
                  display_bookmarks = true
                  pushQuery(null, null, true, null, null)
                "
                >mdi-bookmark-multiple-outline</v-icon
              >
              <v-icon
                v-show="$route.query.r == 'true'"
                class="arrow-rotate"
                @click="reverseGroups()"
                >mdi-arrow-up</v-icon
              >
              <v-icon
                v-show="$route.query.r != 'true'"
                class="arrow-rotate"
                @click="reverseGroups()"
                >mdi-arrow-down</v-icon
              >
            </div>
          </v-col>

          <v-col class="my-0 py-0" cols="12">
            <v-divider class="my-0 py-0"></v-divider>
            <!--
            現状ほぼnowloading文を見ることがないこと、
            開発環境ではレンダリング中にlocalStorageが使えないことから
            一旦無効にする
          <div v-show="nowloading">
            <p class="my-0 py-1 text-body-1 grey--text">読み込み中...</p>
            <p class="my-0 py-1 text-caption grey--text">
              時間がかかることがあります(学校のWi-Fi使用中など)
            </p>
          </div>
          -->
          </v-col>

          <v-col
            v-for="group in groups"
            v-show="filterGroups(group)"
            :key="group.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
            class="my-0 py-2"
          >
            <!-- <class="d-flex flex-column">で，「もっと見る」が常に最下部に -->
            <GroupCard :group="group" :storage_bookmarks="storage_bookmarks" />
          </v-col>
        </v-row>
        <p v-show="display_bookmarks" class="mt-10" style="text-align: center">
          団体の詳細ページでブックマークを追加することができます。
        </p>
      </v-container>
    </div>
    <div v-else>
      <LoadingPage />
    </div>
  </v-app>
</template>
<script lang="ts">
import { Group, Tag } from 'types/quaint'
import Vue from 'vue'

type Data = {
  nowloading: boolean
  tags: Tag[]
  groups: Group[]
  search_query: string
  sort_displayname: string
  query_cache: any
  search_result_number: number
  storage_bookmarks: (string | null)[]
  display_bookmarks: boolean
  selectedTag: Tag | undefined
}

export default Vue.extend({
  name: 'GroupsPage',
  auth: false,
  async asyncData({ $axios, payload }): Promise<Partial<Data>> {
    if (payload !== undefined) {
      // nuxt generate時の操作という意味
      return { groups: payload.groups, tags: payload.tags }
    }
    const task = [$axios.$get('/groups'), $axios.$get('/tags')]
    const res = await Promise.all(task)
    return { groups: res[0], tags: res[1] }
  },
  data(): Data {
    return {
      nowloading: true,
      tags: [],
      groups: [],
      selectedTag: undefined,
      search_result_number: 0,
      search_query: '',
      sort_displayname: 'デフォルト順',
      storage_bookmarks: [],
      display_bookmarks: false,
      query_cache: undefined,
    }
  },
  head() {
    return {
      title: '探す (団体一覧)',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: '参加団体一覧 - 日比谷高校星陵祭公式サイト',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            '参加団体一覧 - 日比谷高校星陵祭公式サイト 各クラスが長い時間をかけて準備した演劇や個性豊かな有志団体の発表など、次に見たい公演を探すことが出来ます。',
        },
      ],
    }
  },
  created() {
    // クエリパラメータを見て検索バー内の文字列を再現する
    if (typeof this.$route.query.q === 'string') {
      this.search_query = this.$route.query.q
      // 検索中はタグ選択ができない仕様のため、tを削除
      if (this.$route.query.t !== undefined) {
        this.pushQuery(null, undefined, null, null, null)
      }
      this.searchGroups()
    }
    if (
      this.$route.query.s === 'groupname' ||
      this.$route.query.s === 'title'
    ) {
      const query_s = this.$route.query.s
      if (query_s === 'groupname') {
        this.sort_displayname = '団体名順'
      } else if (query_s === 'title') {
        this.sort_displayname = '演目名順'
      }
      this.groups.sort((x, y) => {
        return (x[query_s] ?? '') > (y[query_s] ?? '') ? 1 : -1
      })
    }
    if (this.$route.query.r === 'true') {
      this.groups.reverse()
    }

    if (this.$route.query.b === 'true') this.display_bookmarks = true

    const query_t = this.$route.query.t // query_tは見やすくするためだけに定義

    // クエリパラメータを見てselectedTagを再現
    if (query_t === undefined) {
      this.selectedTag = undefined
    } else if (typeof query_t === 'string') {
      for (let i = 0; i < this.tags.length; i++) {
        if (query_t === this.tags[i].tagname) {
          this.selectedTag = this.tags[i]
          break
        }
      }
    }
  },
  mounted() {
    // localStorageの内容をstorage_bookmarks配列に移して扱いやすく
    // localStorageはmountedじゃないとアクセスできない
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.includes('seiryofes.groups.favorite')) {
        this.storage_bookmarks.push(localStorage.key(i))
      }
    }

    // ロードの終了
    this.nowloading = false
  },

  methods: {
    // pushQuery: クエリパラメータの制御を行うmethod
    // それぞれ、Qは検索バーの内容、Tはタグ、Bはブックマーク、Sはソート(並び替え)、Rは昇順/降順の切り替え(ReverseのR)
    pushQuery(
      param_q: any,
      param_t: any,
      param_b: any,
      param_s: any,
      param_r: any
    ) {
      param_q = param_q === null ? this.$route.query.q : param_q
      param_t = param_t === null ? this.$route.query.t : param_t
      param_b = param_b === null ? this.$route.query.b : param_b
      param_s = param_s === null ? this.$route.query.s : param_s
      param_r = param_r === null ? this.$route.query.r : param_r
      // nullは「現在のクエリを維持」と同義
      this.$router.push({
        query: { q: param_q, t: param_t, b: param_b, s: param_s, r: param_r },
      })
    },

    // sortGroups: 団体一覧の並び替えを行うmethod
    sortGroups(sort: 'id' | 'groupname' | 'title') {
      if (sort === 'groupname') {
        this.sort_displayname = '団体名順'
      } else if (sort === 'title') {
        this.sort_displayname = '演目名順'
      } else {
        this.sort_displayname = 'デフォルト順'
      }
      this.groups.sort((x, y) => {
        return (x[sort] ?? '') > (y[sort] ?? '') ? 1 : -1
      })
      if (this.$route.query.r === 'true') {
        this.groups.reverse()
      }
      const sort_query = sort === 'id' ? undefined : sort
      this.pushQuery(null, null, null, sort_query, null)
    },

    // reverseGroups: 昇順/降順を入れ替えるmethod
    reverseGroups() {
      this.sortGroups(
        this.$route.query.s === 'groupname' || this.$route.query.s === 'title'
          ? this.$route.query.s
          : 'id'
      )
      this.groups.reverse()
      if (this.$route.query.r === 'true') {
        this.pushQuery(null, null, null, null, undefined)
      } else {
        this.pushQuery(null, null, null, null, 'true')
      }
    },

    // searchGroups: 検索の際のクエリの処理と、検索結果件数の計算を行うmethod
    searchGroups() {
      if (this.search_query === '') {
        this.selectedTag = this.query_cache
        this.query_cache = undefined
        if (this.selectedTag === undefined) {
          this.pushQuery(undefined, undefined, null, null, null)
        } else if (this.selectedTag === null) {
          this.pushQuery(undefined, 'favorite', null, null, null)
        } else {
          this.pushQuery(undefined, this.selectedTag.tagname, null, null, null)
        }
      } else {
        if (this.selectedTag !== undefined) {
          this.query_cache = this.selectedTag
          this.selectedTag = undefined
          this.pushQuery(null, undefined, null, null, null)
        }
        this.search_result_number = 0
        for (let i = 0; i < this.groups.length; i++) {
          if (
            this.groups[i].id.includes(this.search_query.toLowerCase()) ||
            this.groups[i].groupname
              .toLowerCase()
              .includes(this.search_query.toLowerCase()) ||
            this.groups[i].title
              ?.toLowerCase()
              .includes(this.search_query.toLowerCase()) ||
            this.groups[i].description
              ?.toLowerCase()
              .includes(this.search_query.toLowerCase())
          ) {
            this.search_result_number += 1
          }
        }
      }
    },

    // filterGroups: 検索の際に該当する団体だけを表示させるmethod
    // return trueで表示
    filterGroups(group: Group) {
      if (
        this.display_bookmarks === true &&
        this.filterBookmarks(group.id) === false
      )
        return false
      if (this.selectedTag === undefined) {
        if (
          this.search_query === '' ||
          group.id.toLowerCase().includes(this.search_query.toLowerCase()) ||
          group.groupname
            .toLowerCase()
            .includes(this.search_query.toLowerCase()) ||
          group.title
            ?.toLowerCase()
            .includes(this.search_query.toLowerCase()) ||
          group.description
            ?.toLowerCase()
            .includes(this.search_query.toLowerCase())
        ) {
          return true
        }
      } else if (
        this.selectedTag === null &&
        localStorage.getItem('seiryofes.groups.favorite.' + group.id) !== null
      ) {
        return true
      } else if (group.tags.some((i) => i.id === this.selectedTag?.id)) {
        return true
      } else {
        return false
      }
    }, // tag全体（{id:hogehoge, tagname:honyohonyo}の形）を用いると，tagが一致している判定がうまく行えなかったので，idを用いてtagの一致を判定している

    // filterBookmarks: 「ブックマークだけ表示」のmethod
    filterBookmarks(id: string) {
      // お気に入りならtrue
      return this.storage_bookmarks.includes('seiryofes.groups.favorite.' + id)
    },

    // hashColor: 団体のサムネがない時に単色を表示させるmethod
    hashColor(text: string) {
      // group.idを色数で割った余りでデフォルトの色を決定
      const colors = [
        'blue-grey',
        'brown',
        'deep-orange',
        'amber',
        'lime',
        'light-green',
        'teal',
        'cyan',
        'light-blue',
        'indigo',
        'pink',
      ]
      let index = 0
      for (let i = 0; i < text.length; i++) {
        // 文字列をUnicodeの和に変換
        index += text.codePointAt(i) ?? 1
      }
      index = index % colors.length
      return colors[index]
    },
  },
})
</script>
