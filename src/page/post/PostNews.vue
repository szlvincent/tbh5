<template>
  <div class="m-box-model p-post-news">
    <header class="m-pos-f m-box m-aln-center m-justify-bet m-head-top m-main m-bb1">
      <div class="m-flex-grow1 m-flex-base0">
        <a v-if="step === 1" @click.prevent="cancel">取消</a>
        <svg v-else class="m-style-svg m-svg-def" @click="preStep">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-flex-grow1 m-flex-base0 m-text-c m-head-top-title">
        <span>{{ title }}</span>
      </div>
      <div class="m-flex-grow1 m-flex-base0 m-text-r">
        <a
        v-if="step != 3"
        class="m-send-btn"
        @click.prevent="nextStep"
        :class="{ disabled }">下一步</a>
      </div>
    </header>
    <transition-group
      tag="main"
      class="m-box-model m-flex-grow1 m-flex-shrink1 p-post-news-main" style="padding-top: 0.9rem;"
      :enter-active-class="animated.enterClass"
      :leave-active-class="animated.leaveClass">
      <template v-if="step === 1">
        <div
          key="step1"
          class="m-pos-f m-box-model m-flex-grow1 m-flex-shrink1 m-justify-center m-aln-center m-main" style="padding-left: 0.3rem; padding-right: 0.3rem">
          <div class="m-box m-flex-grow0 m-shrink0 m-bb1 m-lim-width m-post-news-title">
            <input class="m-lim-width" maxlength="20" v-model="news.title" type="text" placeholder="输入标题，20字以内">
          </div>
          <div class="m-box-model m-flex-grow1 m-flex-shrink1 m-lim-width m-post-news-content">
            <textarea
              v-model='contentText'
              placeholder="编辑文章正文"
              ref='textarea'></textarea>
          </div>
        </div>
      </template>
      <template v-if="step === 2">
        <div key="step2" class="m-pos-f m-box-model m-flex-grow1 m-flex-shrink1">
          <div class="m-box m-aln-center m-lim-width m-post-news-row m-main m-bb1" @click="switchCate">
            <span class="m-post-news-row-label">选择栏目</span>
            <div 
              class="m-box m-flex-grow1 m-flex-shrink1 m-aln-center m-justify-end"
              :class="{placeholder: !(category.id > 0)}">
              <span>{{ category.name || "选择栏目" }}</span>
              <svg class="m-style-svg m-svg-def m-entry-append">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
              </svg>
            </div>
          </div>
          <div class="m-box m-aln-center m-lim-width m-post-news-row m-main m-bb1" @click="switchTags">
            <span class="m-post-news-row-label">选择标签</span>
            <div class="m-flex-grow1 m-flex-shrink1 m-text-r">
              <div class="m-tags" v-if="tags.length > 0">
                <span class="m-tag" :key="tag.id" v-for="tag in tags">{{ tag.name }}</span>
              </div>
              <div class="m-box m-justify-end placeholder" v-else>
                <span>最多选择5个标签</span>
              </div>
            </div>
            <svg class="m-flex-grow0 m-flex-shrink0 m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg>
          </div>
          <div class="m-box m-aln-center m-lim-width m-post-news-row m-main m-bb1">
            <span class="m-post-news-row-label">文章来源</span>
            <div class="m-box m-flex-grow1 m-flex-shrink1 m-aln-center m-justify-end">
              <input type="text" dir="rtl" placeholder="不填写则默认为原创">
            </div>
          </div>
          <div class="m-box m-aln-center m-lim-width m-post-news-row m-main m-bb1">
            <span class="m-post-news-row-label">作者</span>
            <div class="m-box m-flex-grow1 m-flex-shrink1 m-aln-center m-justify-end">
              <input type="text" dir="rtl" placeholder="不填写则默认为本站用户名">
            </div>
          </div>
          <div class="m-box m-aln-center m-lim-width m-post-news-row m-main">
            <span class="m-post-news-row-label">摘要</span>
            <div class="m-box m-flex-grow1 m-flex-shrink1 m-aln-center m-justify-end">
              <input type="text" dir="rtl" placeholder="请输入摘要信息">
            </div>
          </div>
        </div>
      </template>
      <template v-if="step === 3">
        <div key="step3" class="m-box-model m-flex-grow1 m-flex-shrink1 m-aln-center step3 m-main">
          <div 
            @click="addPoster"
            class="m-box m-aln-center m-justify-center m-poster-box"
            :class="{ loading: poster.loading, error: poster.error }">
            <img 
              v-if="poster.src"
              @load.stop='loadedPoster(poster)'
              @error='posterError'
              :src="poster.src" 
              class="m-poster">
            <div v-else class="m-box-model m-aln-center m-justify-center m-lim-width m-poster-placeholder">
              <svg viewBox="0 0 24 24" class="m-style-svg m-svg-big">
                <path d="M21.8,20.8H2.1c-0.5,0-1.1-0.4-1.1-1V6.3c0-0.5,0.4-1.1,1.1-1.1h4.3L8,3.6c0.1-0.3,0.5-0.4,0.8-0.4H15 c0.3,0,0.5,0.1,0.7,0.3l1.9,1.8h4.3c0.5,0,1.1,0.4,1.1,1.1V20C22.9,20.4,22.5,20.8,21.8,20.8L21.8,20.8z M12,6.6 c-3.4,0-6.1,2.7-6.1,6.1s2.7,6.1,6.1,6.1s6.1-2.7,6.1-6.1S15.4,6.6,12,6.6L12,6.6z M12,16.8c-2.3,0-4.1-1.8-4.1-4.1S9.7,8.6,12,8.6 s4.1,1.8,4.1,4.1S14.3,16.8,12,16.8L12,16.8z"></path>
              </svg>
              <span>点击上传封面</span>
            </div>
            <div class="fixed-loading" v-if="!poster.error && poster.loading">
              <div class="u-loading" style="height: 58px;width: 58px">
                <svg class="loading" width="100%" height="100%" viewBox="0 0 29 29">
                  <circle class="c1" cx="14.5" cy="14.5" r="12.5" fill="none" stroke-width="4"
                  stroke="#b1b1b1" />
                  <circle class="c2" cx="14.5" cy="14.5" r="12.5" fill="none" stroke-width="4"
                  stroke="#c7c7c7" />
                </svg>
              </div>
            </div>

            <input
              type="file" 
              ref="imagefile"
              class="m-rfile"
              id="selectimage"
              @change="selectPhoto">
          </div>
          <p>不上传封面则默认为文章内第一张图</p>
          <button class="m-long-btn m-signin-btn" @click="handleOk">支付并发布文章</button>
        </div>
      </template>
    </transition-group>
    <choose-cate />
  </div>
</template>
<script>
import bus from "@/bus.js";
import sendImage from "@/util/SendImage.js";
import chooseCate from "@/page/chooseCate.vue";
export default {
  name: "post-news",
  components: {
    chooseCate
  },
  data() {
    return {
      scrollHeight: 0,
      step: 1,
      news: {
        title: "",
        subject: "",
        content: "",
        image: "",
        from: "",
        author: "",
        text_content: ""
      },
      tags: [],
      category: {},
      poster: {},
      animated: {
        enterClass: "animated slideInRight",
        leaveClass: "animated slideOutLeft"
      }
    };
  },
  computed: {
    contentText: {
      get() {
        return this.news.content;
      },
      set(val) {
        val !== this.news.content && (this.news.content = val);
      }
    },
    shadowText() {
      return "blank" + this.contentText;
    },
    title() {
      switch (this.step) {
        case 1:
          return "编辑文章";
        case 2:
          return "完善文章信息";
        case 3:
          return "上传封面";
        default:
          return "编辑文章";
      }
    },
    disabled() {
      switch (this.step) {
        case 1:
          return !(this.news.title && this.news.content);
        case 2:
          return !(this.category.id > 0 && this.tags.length > 0);
        case 3:
          return !(this.news.image > 0);
      }
    }
  },
  methods: {
    focusArea() {},
    moveCurPos() {},
    deleteHandler() {},
    switchCate() {
      bus.$emit("choose-cate", cate => {
        this.category = cate;
      });
    },
    switchTags() {
      const chooseTags = this.tags.map(t => t.id);
      /**
       * 打开选择标签页面 (钩子 -> "choose-tags")
       * @author jsonleex <jsonlseex@163.com>
       * @param  {Object} { nextStep, chooseTags }
       *
       *                   nextStep     {Function}     点击下一步的回调, 注入已选择的 tags
       *
       *                   chooseTags   {Object}       初始选择值, 只需传 [tag.id], eg: [1, 2, 3,...]
       */
      bus.$emit("choose-tags", {
        nextStep: tags => {
          this.tags = tags;
        },
        chooseTags
      });
    },
    addPoster() {
      if (this.poster.loading) return;
      this.$refs.imagefile.click();
    },
    selectPhoto() {
      const files = this.$refs.imagefile.files;
      if (files && files.length > 0) {
        const posterObj = {
          loading: true,
          file: files[0],
          type: files[0].mimeType,
          src: window.URL.createObjectURL(files[0])
        };
        this.poster = Object.assign(
          {
            id: "",
            src: "",
            type: "",
            file: null,
            error: false,
            loading: false
          },
          posterObj
        );
      }
    },
    loadedPoster(poster) {
      const file = poster.file;
      file &&
        sendImage(file)
          .then(id => {
            Object.assign(poster, {
              id,
              file: null,
              loading: !1,
              error: !1
            });
          })
          .catch(() => {
            poster.error = !0;
            poster.loading = false;
          });
    },
    posterError() {
      this.$Message.error("封面图上传失败, 请重试");
    },
    handleOk() {
      const { title, content } = this.news;
      if (!(title && content))
        return this.$Message.error("请输入标题和正文"), (this.step = 1);
      if (!this.category.id)
        return this.$Message.error("请选择投稿栏目"), (this.step = 2);
      if (this.tags.length === 0) {
        return this.$Message.error("请选择标签"), (this.step = 2);
      }

      bus.$emit("payfor", {
        title: "投稿支付",
        amount: 20,
        content: "本次投稿您需要支付20.00金币是否继续投稿？",
        confirmText: "确认投稿",
        cancelText: "暂不考虑",
        onOk: () => {
          const param = {
            title,
            content,
            tags: this.tags.map(t => t.id).join(",")
          };

          this.news.form && (param.form = this.news.form);
          this.poster.id > 0 && (param.image = this.poster.id);
          this.news.author && (param.author = this.news.author);
          this.news.subject && (param.subject = this.news.subject);

          // POST /news/categories/:category/news
          this.$http
            .post(`/news/categories/${this.category.id}/news`, param)
            .then(({ data }) => {
              this.$Message.success(data);
              this.goBack();
            })
            .catch(err => {
              console.log(err);
              this.$Message.error("发生了一些错误");
            });
        }
      });
    },
    preStep() {
      this.step > 1 &&
        ((this.animated = {
          enterClass: "animated slideInLeft",
          leaveClass: "animated slideOutRight"
        }),
        (this.step -= 1));
    },
    nextStep() {
      if (this.disabled) return;
      this.step < 3 &&
        ((this.animated = {
          enterClass: "animated slideInRight",
          leaveClass: "animated slideOutLeft"
        }),
        (this.step += 1));
    },
    cancel() {
      bus.$emit(
        "actionSheet",
        [{ text: "确定", method: this.goBack }],
        "取消",
        "您还有未发布的内容，是否放弃发布？"
      );
    }
  }
};
</script>
<style lang="less">
.p-post-news {
  min-height: 100vh;
  .m-poster-box {
    position: relative;
    background: #f4f5f5;
    width: 190 * 2px;
    height: 135 * 2px;
    border: 1px solid @border-color; /* no */
    margin-bottom: 50px;
    &.loading,
    &.error {
      img {
        opacity: 0.3;
      }
    }
    &.error:after {
      content: "上传失败, 请重试";
      color: @error;
      z-index: 9;
    }
  }
  .m-poster {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    -o-object-fit: cover;
    object-fit: cover;
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
  }
  .m-poster-placeholder {
    line-height: 1.5;
  }
  .step3 {
    padding: 0.8rem 0.3rem 0;
    color: #b3b3b3;
    p {
      margin-bottom: 80px;
    }
  }
  .p-post-news-main {
    > div {
      animation-duration: 0.3s;
    }
    .m-pos-f {
      top: 90px;
    }
  }
  .m-post-news-title {
    padding: 30px 20px;
    input {
      font-size: 30px;
      height: 100%;
      line-height: 36px;
    }
  }
  .m-post-news-content {
    padding: 30px 20px;
    overflow-y: auto;
    overflow-x: hidden;
    textarea {
      font-family: inherit;
      line-height: 36px;
      font-size: 30px;
      resize: none;
    }
  }
  .m-post-news-row {
    font-size: 30px;
    padding: 40px 30px;
    .m-entry-append {
      margin-left: 10px;
    }
    &-label {
      flex: 0 0 auto;
      width: 150px;
    }
    input {
      height: 100%;
      width: 100%;
      line-height: 30px;
      font-size: 28px;
    }
  }

  .placeholder {
    color: #ccc;
  }
}
</style>
