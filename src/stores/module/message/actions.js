import http from "@/http";
import getMessageUnameTxt from "@/util/getMessageUnameTxt";
export default {
  /**
   * 获取未读信息数量
   * @Author   Wayne
   * @DateTime 2018-01-27
   * @Email    qiaobin@zhiyicx.com
   * @param    {[type]}            options.commit [description]
   */
  GET_UNREAD_COUNT({ rootState, commit }) {
    // console.log(rootState);
    if (!rootState.CURRENTUSER || !rootState.CURRENTUSER.token) return;
    let options = {};
    let cPlaceholder = "还没有人评论过你";
    let dPlaceholder = "还没有人赞过你";
    let aPlaceholder = "暂无未审核的申请";
    let cTime = "";
    let dTime = "";
    http
      .get("/user/unread-count", {
        validataStatus: status => status === 200
      })
      .then(({ data }) => {
        // 点赞和评论未读数
        let {
          unread_comments_count: unReadCommentsCount = 0,
          unread_likes_count: unReadLikesCount = 0,
          unread_group_join_count: unReadGroupJoinCount = 0
        } =
          data.counts || {};

        // 审核信息未处理数
        let {
          news: { count: newsCount = 0 } = {},
          feeds: { count: feedsCount = 0 } = {},
          "group-comments": { count: groupComments = 0 } = {},
          "group-posts": { count: groupPosts = 0 } = {}
        } =
          data.pinneds || {};

        if (data.comments.length > 0) {
          let plsh = getMessageUnameTxt(data.comments);
          cPlaceholder = plsh.placeholder + "评论了我";
          cTime = plsh.time;
        }

        if (data.likes.length > 0) {
          let plsh = getMessageUnameTxt(data.likes);
          dPlaceholder = plsh.placeholder + "赞了我";
          dTime = plsh.time;
        }

        if (
          newsCount +
            feedsCount +
            groupComments +
            unReadGroupJoinCount +
            groupPosts >
          0
        ) {
          aPlaceholder = "你有未处理的审核申请";
        }

        options = {
          ...options,
          ...{
            msg: {
              comments: {
                count: unReadCommentsCount,
                lastUsers: data.comments,
                placeholder: cPlaceholder,
                time: cTime
              },
              diggs: {
                count: unReadLikesCount,
                lastUsers: data.likes,
                placeholder: dPlaceholder,
                time: dTime
              },
              audits: {
                placeholder: aPlaceholder,
                newsCommentCount: newsCount,
                feedCommentCount: feedsCount,
                groupPostCommentCount: groupComments,
                groupJoinCount: unReadGroupJoinCount,
                groupPostCount: groupPosts
              }
            }
          }
        };
        commit("SAVE_MESSAGE_UNREAD_COUNT", options);
      });
  },

  /**
   * 首次获取评论我的列表
   * @Author   Wayne
   * @DateTime 2018-01-29
   * @Email    qiaobin@zhiyicx.com
   * @param    {[type]}            options.commit [description]
   */
  GET_MY_COMMENTED_ALL({ commit }) {
    http("/user/comments", {
      validateStatus: s => s === 200
    }).then(({ data }) => {
      commit("SAVE_MY_COMMENTED", {
        type: "all",
        data
      });
    });
  },

  /**
   * 第一次获取我收到的赞
   * @Author   Wayne
   * @DateTime 2018-02-02
   * @Email    qiaobin@zhiyicx.com
   * @param    {[type]}            options.state  [description]
   * @param    {[type]}            options.commit [description]
   */
  GET_MY_LIKED_ALL({ commit }) {
    http("/user/likes", {
      validateStatus: s => s === 200
    }).then(({ data }) => {
      commit("SAVE_MY_LIKED", {
        type: "new",
        data
      });
    });
  }
};
