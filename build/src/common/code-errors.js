"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author: tunguyene
 */
const ManulifeErrors = {
    EX_GENERAL: 'EX_GENERAL',
    EX_PAYLOAD: 'EX_PAYLOAD',
    EX_USERID_NOT_FOUND: 'EX_USERID_NOT_FOUND',
    EX_CAMPID_NOT_FOUND: 'EX_CAMPID_NOT_FOUND',
    EX_USERNAME_NOT_FOUND: 'EX_USERNAME_NOT_FOUND',
    EX_USERNAME_EXIST: 'EX_USERNAME_EXIST',
    EX_LEADID_NOT_FOUND: 'EX_LEADID_NOT_FOUND',
    EX_CAMP_FINISH: 'EX_CAMP_FINISH',
    EX_CAMP_NOT_FOUND: 'CAMP_NOT_FOUND',
    EX_PHONE_EXISTS: 'EX_PHONE_EXISTS',
    EX_ACTIVITYID_NOT_FOUND: 'EX_ACTIVITYID_NOT_FOUND',
    EX_LEAD_PROCESS_STEP: 'EX_LEAD_PROCESS_STEP',
    EX_OLDPASSWORD_DONT_CORRECT: 'EX_OLDPASSWORD_DONT_CORRECT',
    EX_DASHBOARD_CAMP_NOT_FOUND: 'EX_DASHBOARD_CAMP_NOT_FOUND',
    //Authorize
    EX_EMAIL_AUTHORIZE_EXIST: 'EX_EMAIL_AUTHORIZE_EXIST',
    EX_USER_EMAIL_NOT_EXIST: 'EX_USER_EMAIL_NOT_EXIST',
};
exports.ManulifeErrors = ManulifeErrors;
const MsgResponses = {
    // user
    USER_INACTIVE: 'user_inactive',
    USER_DONT_MATCH: 'user_dont_match',
    USER_DEACTIVED: 'user_deactived',
    USER_NOT_FOUND: 'user_not_found',
    USER_ACTIVED: 'user_actived',
    USER_OTP_SUCCESS: 'otp_success',
    USER_OTP_TOO_MUCH: 'otp_request_too_much',
    USER_OTP_VERIFY_SUCCESS: 'verify_success',
    USER_OTP_UNVALID: 'otp_unvalid'
};
exports.MsgResponses = MsgResponses;
const MsgCodeResponses = {
    //General
    INPUT_INVALID: 'input_invalid',
    // user
    USER_INACTIVE: 'user_inactive',
    USER_DONT_MATCH: 'user_dont_match',
    USER_DEACTIVED: 'user_deactived',
    USER_NOT_FOUND: 'user_not_found',
    USER_ACTIVED: 'user_actived',
    USER_OTP_SUCCESS: 'otp_success',
    USER_OTP_TOO_MUCH: 'otp_request_too_much',
    USER_OTP_VERIFY_SUCCESS: 'verify_success',
    USER_OTP_UNVALID: 'otp_unvalid',
    USER_SET_PASSWORD_SUCCESS: 'set_password_success',
    USER_CHANGE_PASS_SUCCESS: 'change_password_success',
    USER_CHANGE_PASS_DONT_MATCH: 'old_password_dont_match',
    // campaign
    CAMP_EXIST: 'campaign_exist',
    CAMP_NOT_EXIST: 'campaign_not_exist',
};
exports.MsgCodeResponses = MsgCodeResponses;
//# sourceMappingURL=code-errors.js.map