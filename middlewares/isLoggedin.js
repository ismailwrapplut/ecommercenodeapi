import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedin = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  //verify
  const decoddedUser = verifyToken(token);

  if (!decoddedUser) {
    throw new Error("Token invalid/expired please login again");
  } else {
    //save the user in req object
    req.userAuthId = decoddedUser?.id;
    next();
  }
};
