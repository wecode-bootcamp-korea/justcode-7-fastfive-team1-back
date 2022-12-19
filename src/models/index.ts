import userDao from "./user.dao";
import user_Dao from "./user_.dao";
import postFormDao from "./postForm.dao";
import cmtDao from "./comment.dao";
import categoryDao from "./category.dao";
import locationDao from "./location.dao";
import companyDao from "./company.dao";
import memberRequestDao from "./memberRequest.dao";
import companyRequestDao from "./companyRequest.dao";
import postDao from "./post.dao";

const dao_set = {
    userDao,
    user_Dao,
    postFormDao,
    cmtDao,
    categoryDao,
    locationDao,
    companyDao,
    memberRequestDao,
    companyRequestDao,
    postDao,
};

export default dao_set;
