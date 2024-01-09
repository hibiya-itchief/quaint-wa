<template>
  <v-card
    height="100%"
    class="d-flex flex-column ma-0 pa-2"
    :to="'/groups/' + group.id"
  >
    <div class="d-flex flex-nowrap">
      <div v-if="$vuetify.breakpoint.xs">
        <!--<v-avatar v-if="$vuetify.breakpoint.xs" size="100" rounded="0">-->
        <v-img
          v-if="group.public_thumbnail_image_url != null"
          height="120px"
          width="90px"
          contain
          :src="group.public_thumbnail_image_url"
        ></v-img>
        <v-img
          v-else
          :class="HashColor(group.id)"
          height="120px"
          width="90px"
        ></v-img>
        <!--</v-avatar>-->
      </div>
      <div v-if="!$vuetify.breakpoint.xs">
        <!--<v-avatar v-if="$vuetify.breakpoint.xs" size="100" rounded="0">-->
        <v-img
          v-if="group.public_thumbnail_image_url != null"
          height="160px"
          width="120px"
          contain
          :src="group.public_thumbnail_image_url"
        ></v-img>
        <v-img
          v-else
          :class="HashColor(group.id)"
          height="160px"
          width="120px"
        ></v-img>
        <!--</v-avatar>-->
      </div>
      <div
        class="px-1"
        :class="
          $vuetify.breakpoint.xs
            ? 'text-truncate-clamp-1'
            : 'text-truncate-clamp-3'
        "
        style="width: 100%"
      >
        <v-card-title
          class="pb-2 text-truncate-clamp-1"
          :style="
            $vuetify.breakpoint.xs ? 'font-size: 20px' : 'font-size: 24px'
          "
        >
          {{ group.title }}
        </v-card-title>
        <v-card-subtitle
          class="pb-0 pt-1 text-truncate-clamp-1"
          :class="$vuetify.breakpoint.xs ? '' : 'pt-2'"
          :style="
            $vuetify.breakpoint.xs ? 'font-size: 14px' : 'font-size: 18px'
          "
        >
          {{ group.groupname }}
        </v-card-subtitle>
        <div v-if="$vuetify.breakpoint.xs">
          <v-card-text
            id="group-description"
            class="my-0 py-0 grey--text text-truncate-clamp-1"
            style="font-size: 12px"
          >
            {{ group.description }}
          </v-card-text>
          <v-card-actions class="py-0">
            <v-chip-group column>
              <v-chip v-for="tag in group.tags" :key="tag.id" disabled small>
                {{ tag.tagname }}
              </v-chip>
            </v-chip-group>
            <v-spacer />
            <v-icon v-if="FilterBookmarks(group.id)" color="theme_color"
              >mdi-bookmark</v-icon
            >
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text
            id="group-description"
            class="my-0 py-0 grey--text text-truncate-clamp-3"
            style="font-size: 16px"
          >
            {{ group.description }}
          </v-card-text>
          <v-card-actions class="py-0">
            <v-chip-group column>
              <v-chip v-for="tag in group.tags" :key="tag.id" disabled small>
                {{ tag.tagname }}
              </v-chip>
            </v-chip-group>
            <v-spacer />
            <v-icon v-if="FilterBookmarks(group.id)" color="theme_color"
              >mdi-bookmark</v-icon
            >
          </v-card-actions>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    group: {
      type: Object,
      required: true,
    },
    storageBookmarks: {
      type: Array,
      required: true,
    },
  },

  methods: {
    // tag全体（{id:hogehoge, tagname:honyohonyo}の形）を用いると，tagが一致している判定がうまく行えなかったので，idを用いてtagの一致を判定している
    FilterBookmarks(id: string) {
      // お気に入りならtrue
      return this.storageBookmarks.includes('seiryofes.groups.favorite.' + id)
    },

    HashColor(text: string) {
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
