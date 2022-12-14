import daoset from '../models';
const { cmtDao, userDao } = daoset;

const addCommentOnPost = async (userId: number, postId: number, comment: string, isSecret: number) => {
  // 유저가 존재하는지 확인
  const existUser = await userDao.findUser({userId});
  if (!existUser) {
    throw {status: 400, message: '해당 유저가 존재하지 않습니다'}
  }

  // 댓글 길이 확인
  if(comment.length > 1000) {
    throw {status: 400, message: '댓글은 1000자 이상 작성 할 수 없습니다'}
  }

  // 댓글 갯수 확인
  const CommentCount = await cmtDao.getCommentCountByPostId(postId);
  if(CommentCount.count > 1000) {
    throw {status: 400, message: "댓글은 1000개 이상 작성 할 수 없습니다"}
  }

  // 댓글 추가
  await cmtDao.addCommentOnPost(userId, postId, comment, isSecret);
}

const addCommentOnComment = async (userId: number, postId: number, commentId: number, comment: string, isSecret: number) => {
  // 유저가 존재하는지 확인
  const existUser = await userDao.findUser({userId});
  if (!existUser) {
    throw {status: 400, message: '해당 유저가 존재하지 않습니다'}
  }

  // 댓글 길이 확인
  if(comment.length > 1000) {
    throw {status: 400, message: '댓글은 1000자 이상 작성 할 수 없습니다'}
  }

  // 댓글 갯수 확인
  const CommentCount = await cmtDao.getCommentCountByPostId(postId);
  if(CommentCount.count > 1000) {
    throw {status: 400, message: "댓글은 1000개 이상 작성 할 수 없습니다"}
  }

  const SEQ = await cmtDao.findSEQByCommentId(commentId);

  // 댓글 추가
  await cmtDao.addCommentOnComment(userId, postId, commentId, comment, SEQ.SEQ , isSecret);
}

const getCommentOnPost = async (userId: string, postId: number, page: number) => {
  // 페이지네이션을 위한 연산
  const pagination: number = ((Number(page) - 1) * 20);

  const result = await cmtDao.getCommentOnPost(postId, pagination);
  const postWriter = await cmtDao.getPostWriter(postId);

  result.forEach((item: any) => {
    // 비밀 댓글에 대한 열람 권한이 없을 시
    if(item.isSecret === 1 && item.users_id !== userId && postWriter.users_id !== Number(userId)) {
      console.log(1);
      item.comment_content = "이 댓글은 작성자만 볼 수 있습니다."
    }
    item.auth = item.users_id === userId ? 1 : 0;
  })
  return result;
}

const updateComment = async (userId: number, commentId: number, comment: string, isSecret: number) => {
  // 유저가 존재하는지 확인
  const existUser = await userDao.findUser({userId});
  if (!existUser) {
    throw {status: 400, message: '해당 유저가 존재하지 않습니다'}
  }

  // 댓글 길이 확인
  if(comment.length > 1000) {
    throw {status: 400, message: '댓글은 1000자 이상 작성 할 수 없습니다'}
  }

  // 유저 권한 확인
  const commentWriter = await cmtDao.findUserByCommentId(commentId);
  if (Number(commentWriter.users_id) !== userId) {
    throw {status: 400, message: '수정 권한이 없습니다'}
  }

  await cmtDao.updateComment(commentId, comment, isSecret);
}

const deleteComment = async (userId: number, commentId: number) => {
  const existUser = await userDao.findUser({userId});
  if(!existUser) {
    throw {status: 400, message: '해당 유저가 존재하지 않습니다'}
  }

  // 유저 권한 확인
  const commentWriter = await cmtDao.findUserByCommentId(commentId);
  if (Number(commentWriter.users_id) !== userId) {
    throw {status: 403, message: '삭제 권한이 없습니다'}
  }
  const discription = await cmtDao.findSEQByCommentId(commentId);
  discription.SEQ === 1 ? await cmtDao.deleteComment(commentId) : await cmtDao.changeCommentToDelete(commentId);
}

const getLengthOnPost = async (postId: number) => {
  const result = await cmtDao.getLengthOnPost(postId);
  return result.len
}

export default {
  addCommentOnPost,
  addCommentOnComment,
  getCommentOnPost,
  updateComment,
  deleteComment,
  getLengthOnPost,
}