<template>
  <v-app>
    <v-container>
      <ToolsBackButton />
      <h1 id="title">星陵祭とは</h1>
      <p>
        日比谷高校の文化祭は「星陵祭」と呼ばれており、全クラスが劇を行います。<br />
        今年の星陵祭は4年ぶりの一般開催で、テーマは「祭徠」です！星陵祭を表す「祭」の字に、未来を表す「徠」の字を組み合わせています。「再来」と掛けており、過去の星陵祭を復活させると共に、未来の形の星陵祭を作り上げるという思いが込められています。日比谷のお祭りをみんなで盛り上げましょう！
      </p>
      <p>各クラス劇の詳細はこちら&emsp;<a href="./../groups/">探す</a></p>
      <h2>星陵祭って何をやってる？</h2>
      <h3>クラス劇</h3>
      <p>
        星陵祭では、全てのクラスがそれぞれの教室(特別教室を使用するクラスもあります)で生徒がキャストとなって劇を行います。ミュージカルなどの有名な劇から、自作劇まで様々なジャンルの劇があります。<br />
        キャストだけでなく、音響や照明などの仕事も生徒がやっています。夏休み前から装飾の制作やキャストの練習に励んできた、日比谷生の本気の劇をぜひお楽しみください！
      </p>
      <h3>企画</h3>
      <p>
        【Hebe】<br />
        体育館棟4階のアリーナにて、有志の団体がバンド演奏や落語などのコンサートを行います。整理券を取る必要はなく、いつでも出入り可能です。ぜひお気軽のお越しください！<br />
        ハイヒールをお履きの方は、体育館棟内では貸出スリッパのご利用をお願いする場合があります。ご了承ください。<br />
        ＠体育館棟4Fアリーナ
      </p>
      <p>
        【クラTコンテスト】<br />
        各クラスが作ったクラスTシャツを展示しています。人気投票も実施しています。展示場所にあるQRコードを読み込んでFormsから投票をしてください！<br />
        ＠3F社会科ホール
      </p>
      <p>
        【屋台】<br />
        射的や千本引きの屋台を設置しています！「祭徠」のテーマのもと、お祭りの雰囲気を味わってみませんか？<br />
        高校名入りのボールペンや先生方のサイン、日比谷生が歴代使っていた参考書や古本など、普段なら絶対に手に入らないお宝を目指して！<br />
        ＠生徒ホール
      </p>
      <p>
        【謎解き企画】<br />
        日比谷高校や日比谷生にまつわる様々な謎を、校内をめぐって解いてもらいます。日比谷生はもちろん、日比谷愛に自信がある方はぜひ挑戦してみてください！成績優秀者には豪華なプレゼントがあるかも…!?<br />
        ＠校内、自動販売機前
      </p>
      <p>
        【寄せ書き】<br />
        テーマに合わせた背景に自由にメッセージを残してください。劇の感想、大喜利、普段は言えない思いなど何でもありです！(常識の範囲内でお願いします)<br />
        ＠自動販売機横
      </p>
      <h3>装飾物</h3>
      <p>
        【アーチ】<br />
        この門を潜ると広がる星陵祭！くぐった前と後では面構えが違う！<br />
        君も日比谷の夏を堪能しよう！<br />
        ＠入場門
      </p>
      <p>
        【カウントダウンパネル】<br />
        数字が減るのをじっと見つめていた狐。ついに待ち望んでいた日がやってきました。4年ぶりの星陵祭、ぜひお楽しみください!!
      </p>
      <p>
        【階段装飾】<br />
        祭と言えばやはりこれ！夜に浮かび上がる大きな櫓を、訪れてみてはいかがでしょうか？<br />
        ＠大階段(自動販売機横)
      </p>
      <p>
        【大垂れ幕】<br />
        大迫力の垂れ幕！入ってすぐにある垂れ幕を見て、祭気分に浸りましょう。<br />
        ＠校舎外壁
      </p>
      <p>
        【校内案内パネル】<br />
        最適化された案内と洗練されたデザインによる無駄のない動線。便利で快適な星陵祭を実現します。
      </p>
      <p>
        【ステンドグラス】<br />
        チーフ会みんなの血と涙の結晶といっても過言では無い？！光に透ける美麗な絵をぜひ見てください！<br />
        ＠体育館棟と本校舎の３F連絡路
      </p>
      <p>
        【写真撮影スポット】<br />
        「祭徠」に合わせた色とりどりの花火にヨーヨーを模した風船、ハートに包まれて青春の1ページを飾ろう！インスタ映えスポットです！<br />
        ＠生徒ホール
      </p>
      <h3>部活動・外部団体</h3>
      <p>
        部活動体験や出し物を行います。詳細や活動場所は<a href="./../groups/"
          >｢探す｣</a
        >ページの各団体の詳細を、活動時間は<a href="./../schedule"
          >スケジュール</a
        >をご覧下さい。
      </p>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AboutPage',
  auth: false,
  head: {
    title: '星陵祭とは',
  },
})
</script>

<style scoped>
h2 {
  text-align: center;
  font-weight: normal;
}

#title {
  display: inline-block;
  padding: 0.5rem 3rem 0.5rem 0;
  margin-bottom: 5rem;
  border-bottom: 3px solid var(--theme-color);
  font-family: serif;
  font-weight: bold;
}
</style>
