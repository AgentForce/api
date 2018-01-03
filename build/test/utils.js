"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createCampaignDummy(userId, name, description) {
    var user = {
        name: name || "dummy campaign",
        description: description || "I'm a dummy campaign!"
    };
    if (userId) {
        user["userId"] = userId;
    }
    return user;
}
exports.createCampaignDummy = createCampaignDummy;
function createUserDummy(email) {
    var user = {
        email: email || "dummy@mail.com",
        name: "Dummy Jones",
        password: "123123"
    };
    return user;
}
exports.createUserDummy = createUserDummy;
function clearDatabase(database, done) {
    var promiseUser = database.userModel.remove({});
    // var promiseCampaign = database.campaignModel.remove({});
    Promise.all([promiseUser]).then(() => {
        done();
    }).catch((error) => {
        console.log(error);
    });
}
exports.clearDatabase = clearDatabase;
function createSeedCampaignData(database, done) {
    return database.userModel.create(createUserDummy())
        .then((user) => {
        return Promise.all([]);
    }).then((campaign) => {
        done();
    }).catch((error) => {
        console.log(error);
    });
}
exports.createSeedCampaignData = createSeedCampaignData;
function createSeedUserData(database, done) {
    database.userModel.create(createUserDummy())
        .then((user) => {
        done();
    })
        .catch((error) => {
        console.log(error);
    });
}
exports.createSeedUserData = createSeedUserData;
//# sourceMappingURL=utils.js.map