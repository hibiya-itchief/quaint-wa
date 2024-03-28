<template>
  <v-app>
    <div v-if="!nowloading">
      <v-container class="px-1 py-0">
        <client-only>
          <v-row justify="center" class="ma-0 pa-0">
            <v-col cols="12" sm="6" lg="6">
              <!--作品情報-->
              <!--タイトル，団体，お気に入り，映像で鑑賞ボタン-->
              <ToolsBackButton />
              <v-card v-if="group">
                <v-img
                  v-if="group.public_thumbnail_image_url != null"
                  max-height="500px"
                  contain
                  :src="group.public_thumbnail_image_url"
                ></v-img>
                <v-img
                  v-else
                  :class="hashColor(group.id ?? 'hashcolor')"
                  height="180px"
                ></v-img>
                <v-card-title>{{ group.title }}</v-card-title>
                <v-card-subtitle>{{ group.groupname }}</v-card-subtitle>
                <v-card-text>
                  {{ group?.description }}
                </v-card-text>
                <v-card-actions v-if="group.tags.length != 0" class="py-1">
                  <v-chip-group column>
                    <v-chip v-for="tag in group.tags" :key="tag.id" disabled>
                      {{ tag.tagname }}
                    </v-chip>
                  </v-chip-group>
                </v-card-actions>
                <v-card-actions style="width: 100%; display: block">
                  <div
                    v-for="link in links"
                    :key="link.id"
                    class="my-1"
                    style="width: 100%"
                  >
                    <v-btn
                      color="theme_color"
                      dark
                      outlined
                      rounded
                      width="100%"
                      :href="link.linktext"
                    >
                      <v-icon>mdi-link</v-icon>
                      {{ link.name }}
                    </v-btn>
                  </div>
                  <span
                    v-if="links.length !== 0"
                    class="text-caption grey--text"
                    >※Microsoft
                    Streamで配信されている映像は「~~@metro.ed.jp」で終わる本校生徒のアカウントでログインしないと見ることができません。保護者の方はお子様の端末で一緒にご視聴ください。</span
                  >
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-actions v-if="editable == true" class="py-1">
                  <v-btn
                    color="blue-grey"
                    dark
                    outlined
                    rounded
                    width="100%"
                    :to="'/groups/' + group?.id + '/edit'"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    団体情報を編集
                  </v-btn>
                </v-card-actions>
                <v-card-actions
                  v-if="editable == true && !isNotClassroom(group)"
                  class="py-1"
                >
                  <v-btn
                    color="blue-grey"
                    dark
                    outlined
                    rounded
                    width="100%"
                    :to="'/groups/' + group?.id + '/data'"
                  >
                    <v-icon>mdi-ticket-confirmation</v-icon>
                    残席情報を確認
                  </v-btn>
                </v-card-actions>
                <v-card-actions class="py-1">
                  <v-btn
                    v-if="group.twitter_url != null"
                    icon
                    :href="group.twitter_url"
                    target="_blank"
                    ><v-icon>mdi-twitter</v-icon></v-btn
                  >
                  <v-btn
                    v-if="group.instagram_url != null"
                    icon
                    :href="group.instagram_url"
                    target="_blank"
                    ><v-icon>mdi-instagram</v-icon></v-btn
                  >
                  <v-spacer></v-spacer>
                  <div class="mx-2">
                    <span
                      class="grey--text text--darken-2 text-caption"
                      style="display: block"
                      >過去7日間の閲覧数</span
                    >
                    <div style="text-align: right">
                      <v-icon>mdi-eye</v-icon>
                      <span class="text--darken-2 text-subtitle-1">{{
                        view_count
                      }}</span>
                    </div>
                  </div>
                  <v-btn
                    v-if="is_bookmarked"
                    icon
                    color="theme_color"
                    @click="removeBookmark(group.id)"
                    ><v-icon>mdi-bookmark</v-icon></v-btn
                  >
                  <v-btn v-else icon @click="addBookmark(group.id)"
                    ><v-icon>mdi-bookmark-outline</v-icon></v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <!--公演時間の選択-->
              <v-card v-if="!isNotClassroom(group)" class="pa-2">
                <v-card-title>
                  <v-icon>mdi-ticket</v-icon>
                  観劇予約
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-subtitle
                  >現地で見たい公演の整理券を取得できます。詳しい時間帯は<NuxtLink
                    to="/schedule"
                    >配布スケジュール</NuxtLink
                  >
                  やパンフレットをご覧ください。</v-card-subtitle
                >
                <v-card-subtitle v-if="!$auth.loggedIn"
                  ><v-btn
                    depressed
                    color="primary"
                    class="mr-1"
                    :href="'/login'"
                    >ログイン</v-btn
                  >すると整理券を取得できます。</v-card-subtitle
                >
                <v-divider class="mb-3"></v-divider>

                <v-btn
                  class="ma-2"
                  color="primary"
                  dark
                  @click="getAllEventsData()"
                  ><v-icon class="mr-1">mdi-reload</v-icon>再読み込み</v-btn
                >
                <div v-for="(event, index) in suitableEvents()" :key="event.id">
                  <!-- 配布中のチケットを表示 -->
                  <div v-if="isAvailable(event)">
                    <EventsEventCard
                      :group="group"
                      :event="event"
                      :taken_tickets="list_taken_tickets[index]"
                      :ticket_stock="list_stock[index]"
                    />
                  </div>
                </div>

                <v-col cols="12">
                  <!--表示する公演が無い時，以下のメッセージを表示-->
                  <v-col
                    v-if="suitableEvents().length === out_time_events.length"
                    cols="12"
                  >
                    <v-card class="pa-2">
                      <span class="grey--text text-h5"
                        >現在選択できる公演はありません。</span
                      >
                    </v-card>
                  </v-col>

                  <!--配布時間外のチケットがある場合はいくつあるかをインフォーム-->
                  <div v-if="out_time_events.length !== 0">
                    <EventsTimeOutEventInform
                      :number="out_time_events.length"
                    />
                  </div>

                  <v-row justify="center">
                    <div v-if="suitableEvents().length > 0">
                      <EventsShowAllEventsButton
                        :group="group"
                        :events="suitableEvents()"
                        :list_stock="list_stock"
                        :list_taken_tickets="list_taken_tickets"
                      />
                    </div>
                  </v-row>
                </v-col>
              </v-card>
              <v-card v-else class="pa-2">
                <v-card-title>
                  <v-icon>mdi-ticket-confirmation</v-icon>
                  観劇について
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-subtitle
                  >この団体では整理券が取得できません。<br />
                  詳しい時間帯は<NuxtLink to="/schedule"
                    >部活動のタイムテーブル</NuxtLink
                  >やパンフレットをご覧ください。</v-card-subtitle
                >
              </v-card>
            </v-col>
          </v-row>
        </client-only>
      </v-container>
    </div>
    <div v-else>
      <LoadingPage />
    </div>
  </v-app>
</template>

<script lang="ts">
import { Event, Group, GroupLink } from 'types/quaint'
import Vue from 'vue'
type Data = {
  user_groups: {
    admin: string
    entry: string
    owner: string
    parents: string
    students: string
    teachers: string
    chief: string
  }
  group: Group | undefined
  events: Event[]
  out_time_events: Event[] // ユーザー属性に適したイベントのうち配布時間外のイベントを格納する
  links: GroupLink[]
  selected_event: Event | null
  editable: boolean
  dialog: boolean

  ticket_person: number
  person_labels: any[]
  person_icons: any[]
  nowloading: boolean
  is_bookmarked: boolean
  list_stock: number[]
  list_taken_tickets: number[]
  view_count: number | string
}
export default Vue.extend({
  name: 'IndivisualGroupPage',
  auth: false,

  async asyncData({ params, $axios, payload }): Promise<Partial<Data>> {
    const group = payload ?? (await $axios.$get('/groups/' + params.groupId))
    return { group }
  },

  data(): Data {
    return {
      user_groups: {
        admin: process.env.AZURE_AD_GROUPS_QUAINT_ADMIN as string,
        entry: process.env.AZURE_AD_GROUPS_QUAINT_ENTRY as string,
        owner: process.env.AZURE_AD_GROUPS_QUAINT_OWNER as string,
        parents: process.env.AZURE_AD_GROUPS_QUAINT_PARENTS as string,
        students: process.env.AZURE_AD_GROUPS_QUAINT_STUDENTS as string,
        teachers: process.env.AZURE_AD_GROUPS_QUAINT_TEACHERS as string,
        chief: process.env.AZURE_AD_GROUPS_QUAINT_CHIEF as string,
      },
      group: undefined,
      events: [],
      out_time_events: [],
      links: [],
      selected_event: null,
      editable: false, // 権限を持つユーザーがアクセスするとtrueになりページを編集できる

      ticket_person: 1,
      person_labels: ['1人', '2人', '3人'],
      person_icons: [
        'mdi-account',
        'mdi-account-multiple',
        'mdi-account-group',
      ],
      dialog: false,
      nowloading: true,
      is_bookmarked: false,
      list_stock: [],
      list_taken_tickets: [],
      view_count: '...',
    }
  },

  head() {
    return {
      title: this.group?.groupname + ' 「' + this.group?.title + '」',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            this.group?.groupname +
            ' 「' +
            this.group?.title +
            '」' +
            ' - 日比谷高校星陵祭公式サイト',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.group?.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.group?.public_thumbnail_image_url,
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.group?.public_thumbnail_image_url,
        },
      ],
    }
  },

  async created() {
    // まず、チケット情報関連を総取得する
    await this.getAllEventsData()

    // admin権限を持つ もしくは この団体にowner権限を持つユーザーがアクセスするとtrueになりページを編集できる
    // 実際に編集できるかどうかはAPIがJWTで認証するのでここはあくまでフロント側の制御
    if (this.$auth.user?.groups && Array.isArray(this.$auth.user?.groups)) {
      if (this.$auth.user?.groups.includes(this.user_groups.admin)) {
        this.editable = true
      } else if (this.$auth.user?.groups.includes(this.user_groups.owner)) {
        this.$axios.$get('/users/me/owner_of').then((res: string[]) => {
          if (res.includes(this.group?.id as string)) {
            this.editable = true
          }
        })
      }
    }

    // 「閲覧数」にまつわる処理
    this.$axios
      .$get(
        '/ga/screenpageview?start_date=7daysAgo&end_date=today&page_path=' +
          this.$route.path
      )
      .then((res) => {
        this.view_count = res.view
      })
      .catch(() => {
        this.view_count = 'エラー'
      })

    // 配布時間外のチケットをout_time_eventsに格納
    for (const event of this.suitableEvents()) {
      if (!this.isAvailable(event)) {
        this.out_time_events.push(event)
      }
    }

    // ロードの終了
    this.nowloading = false
  },

  mounted() {
    // ブックマークされているかチェック
    // localStorageはmountedじゃないとアクセスできない
    for (let i = 0; i < localStorage.length; i++) {
      if (
        'seiryofes.groups.favorite.' + this.group?.id ===
        localStorage.key(i)
      ) {
        // お気に入りならtrue
        this.is_bookmarked = true
        break
      }
    }
  },

  methods: {
    // addBookmark: localStorageにブックマークを追加するmethod
    addBookmark(id: string) {
      localStorage.setItem('seiryofes.groups.favorite.' + id, id)
      this.is_bookmarked = true
    },

    // removeBookmark: localStorageから指定したブックマークを削除するmethod
    removeBookmark(id: string) {
      localStorage.removeItem('seiryofes.groups.favorite.' + id)
      this.is_bookmarked = false
    },

    // isNotClassroom: クラス劇かどうかを判定し、オンライン整理券があるかどうか判定するmethod
    isNotClassroom(group: Group) {
      for (let i = 0; i < group.tags.length; i++) {
        if (
          group.tags[i].tagname === 'Hebe' ||
          group.tags[i].tagname === '外部団体' ||
          group.tags[i].tagname === '部活動'
        ) {
          return true
        }
      }
      return false
    },

    // suitableEvents: 未ログイン状態では全ての公演，ログインしている状態ではユーザ属性に合った公演のみが表示されるようにするmethod
    suitableEvents() {
      //  全ての公演（events）から，ログイン中のユーザ属性（e.g. students,parents）に合致する公演のみがfiltered_eventsに格納される
      const filtered_events: Event[] = this.events.filter((val: Event) => {
        return this.$quaintUserRole(val.target, this.$auth.user)
      })
      if (!this.$auth.loggedIn) {
        return this.events
      } else {
        return filtered_events
      }
    },

    // isAvailable: 整理券が配布時間内であればtrue，それ以外はfalseを返すmethod
    isAvailable(event: Event) {
      if (
        new Date() > new Date(event.sell_starts) &&
        new Date(event.sell_ends) > new Date()
      ) {
        return true
      } else {
        return false
      }
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

    // getAllEventsData: チケット情報の取得を統括したmethod
    async getAllEventsData() {
      // イベント情報の取得
      this.events = await this.getEvents()
      // 各チケットの取得
      const res = this.getTickets(this.events)
      this.list_stock = res.list_stock
      this.list_taken_tickets = res.list_taken_tickets
    },

    // getEvents: event(公演)を取得するmethod
    async getEvents(): Promise<Event[]> {
      const res = await this.$axios
        .$get('/groups/' + this.$route.params.groupId + '/events')
        .then(
          (result) => {
            result.sort((x: Event, y: Event) => {
              return new Date(x.starts_at) > new Date(y.starts_at) ? 1 : -1
            })
            return result
          },
          () => {
            this.$store.commit('ShowInternetErrorSnackbar', {
              message: '情報の取得に失敗しました。再読み込みしてください。',
            })
            return undefined
          }
        )

      return res
    },

    // getTickets: 各公演の整理券配布状況を取得するmethod
    // list_stock…席数
    // list_taken_tickets…既に取られた整理券の数
    getTickets(events: Event[]) {
      if (events.length !== 0) {
        const get_tickets_info = []
        for (let i = 0; i < events.length; i++) {
          get_tickets_info.push(
            this.$axios.$get(
              `/groups/${this.$route.params.groupId}/events/${events[i].id}/tickets`
            )
          )
        }
        const list_stock: number[] = []
        const list_taken_tickets: number[] = []
        Promise.all(get_tickets_info)
          .then((tickets_info) => {
            for (let i = 0; i < tickets_info.length; i++) {
              list_stock.push(tickets_info[i].stock)
              list_taken_tickets.push(tickets_info[i].taken_tickets)
            }
          })
          .catch(() => {
            this.$store.commit('ShowInternetErrorSnackbar', {
              message: '情報の取得に失敗しました。再読み込みしてください。',
            })
          })
        return { list_stock, list_taken_tickets }
      } else {
        return { list_stock: [], list_taken_tickets: [] }
      }
    },
  },
})
</script>
