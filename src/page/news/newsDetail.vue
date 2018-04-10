<template>
  <div class="m-flex-shrink1 m-flex-grow1 m-art m-main">
    <section class="m-art-head">
      <h1>{{ news.title }}</h1>
      <p>
        <span>{{ time | UTClocalTime }}</span>&nbsp;&nbsp;
        <span>{{ news.author }}</span>&nbsp;&nbsp;
        <span class="org">{{ org }}</span>
      </p>
    </section>
    <div class="m-art-body" v-html='body'></div>
    <div class="m-box m-aln-center m-justify-bet m-art-foot">
      <div class="m-flex-grow1 m-flex-shrink1 m-box m-aln-center m-art-like-list">
        <span>{{ news.hits || 0 | formatNum }}浏览</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span><a :href="'http://www.tokenbook.cloud/tbm/invite/' + share ">{{ news.digg_count || 0 | formatNum }}点赞</a></span>
      </div>
      <div class="m-box-model m-aln-end m-art-info">
        <span><a :href="'http://www.tokenbook.cloud/tbm/invite/' + share ">写留言</a></span>
      </div>
    </div>
    <div class="m-box-model m-art-comments">
      <ul class="m-box m-aln-center m-art-comments-tabs">
        <li>{{ commentCount | formatNum }}条评论</li>
      </ul>
      <comment-item
              v-for="(comment) in pinnedCom"
              :pinned="true"
              :key="comment.id"
              :comment="comment"/>
      <comment-item
              v-for="(comment) in comments"
              :key="comment.id"
              :comment="comment"/>

      <div class="m-box m-aln-center m-justify-center load-more-box">
        <span v-if="noMoreCom" class="load-more-ph">---没有更多---</span>
        <span v-else class="load-more-btn" @click.stop="fetchNewsComments(maxComId)">
            {{fetchComing ? "加载中..." : "点击加载更多"}}
          </span>
        <!-- <button v-else class="load-more-btn" @click.stop="fetchNewsComments(maxComId)"></button> -->
      </div>
    </div>
  </div>
</template>
<script>
    import md from "@/util/markdown.js";
    import CommentItem from "@/page/article/ArticleComment.vue";
    export default {
        name: "news-detail",
        components: {
            CommentItem
        },
        data() {
            return {
                oldID: 0,
                news: {},
                loading: true,
                fetching: false,
                org:'',
                share:0,
                comments: [],
                pinnedCom: [],

                fetchComing: false,
                noMoreCom: false,
                maxComId: 0
            };
        },
        computed: {
            newsID() {
                return this.$route.params.newsID;
            },
            uid() {
                return this.$store.state.CURRENTUSER.id;
            },
            isMine() {
                return this.news.user_id === this.uid;
            },
            liked: {
                get() {
                    return !!this.news.has_like;
                },
                set(val) {
                    this.news.has_like = val;
                }
            },
            likeCount: {
                get() {
                    return this.news.digg_count || 0;
                },
                set(val) {
                    val && (this.news.digg_count = val);
                }
            },
            commentCount: {
                get() {
                    return this.news.commentCount || 0;
                },
                set(val) {
                    val > 0, (this.news.commentCount = val);
                }
            },
            time() {
                return this.news.created_at || "";
            },
            cate() {
                const { category: { name = "未分类" } = {} } = this.news;
                return name;
            },
            body() {
                return md(this.news.content || "");
            }
        },
        methods: {
            fetchNews() {
                if (this.fetching) return;
                this.fetching = true;
                this.$http
                    .get(`/news/h5/${this.newsID}`)
                    .then(({ data = {} }) => {
                        this.news = data;
                        this.oldID = this.newsID;
                        this.getName();
                        setTimeout(() => {
                            this.loading = false;
                            this.fetching = false;
                        }, 300);
                    })
                    .catch(err => {
                        console.log(err);
                        this.$router.back();
                    });
            },
            getName(){
                this.$http.get(`/users/${this.news.user_id}`).then(({ data = [] }) => {
                    this.org = data.name ;
                });
            },

            fetchNewsComments(after = 0) {
                // GET /news/{news}/comments
                if (this.fetchComing) return;
                this.fetchComing = true;
                this.$http
                    .get(`/news/${this.newsID}/comments`, {
                        params: {
                            after
                        }
                    })
                    .then(({ data: { pinneds = [], comments = [] } }) => {
                        pinneds &&
                        pinneds.length &&
                        (this.pinnedCom = after ? [...this.pinneds, ...pinneds] : pinneds);
                        comments && comments.length
                            ? ((this.comments = after
                            ? [...this.comments, ...comments]
                            : comments),
                                (this.maxComId = comments[comments.length - 1].id))
                            : (this.noMoreCom = true);
                        this.fetchComing = false;
                    })
                    .catch(() => {
                        this.fetchComing = false;
                    });
            },
        },
        activated() {
            if (this.newsID) {
                this.newsID !== this.oldID
                    ? this.fetchNews()
                    : setTimeout(() => {
                        this.loading = false;
                    }, 200);
            }
        },
        deactivated() {
            this.loading = true;
        },
        created() {
            this.share = this.$route.query.user_id;
            this.fetchNewsComments();
        }
    };
</script>
