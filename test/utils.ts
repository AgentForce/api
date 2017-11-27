import * as Database from "../src/database";

export function createCampaignDummy(userId?: string, name?: string, description?: string) {
    var user = {
        name: name || "dummy campaign",
        description: description || "I'm a dummy campaign!"
    };

    if (userId) {
        user["userId"] = userId;
    }

    return user;
}

export function createUserDummy(email?: string) {
    var user = {
        email: email || "dummy@mail.com",
        name: "Dummy Jones",
        password: "123123"
    };

    return user;
}


export function clearDatabase(database: Database.IDatabase, done: MochaDone) {
    var promiseUser = database.userModel.remove({});
    // var promiseCampaign = database.campaignModel.remove({});

    Promise.all([promiseUser]).then(() => {
        done();
    }).catch((error) => {
        console.log(error);
    });
}

export function createSeedCampaignData(database: Database.IDatabase, done: MochaDone) {
    return database.userModel.create(createUserDummy())
        .then((user) => {
            return Promise.all([
                // database.campaignModel.create(createCampaignDummy(user._id, "Campaign 1", "Some dummy data 1")),
                // database.campaignModel.create(createCampaignDummy(user._id, "Campaign 2", "Some dummy data 2")),
                // database.campaignModel.create(createCampaignDummy(user._id, "Campaign 3", "Some dummy data 3")),
            ]);
        }).then((campaign) => {
            done();
        }).catch((error) => {
            console.log(error);
        });
}

export function createSeedUserData(database: Database.IDatabase, done: MochaDone) {
    database.userModel.create(createUserDummy())
        .then((user) => {
            done();
        })
        .catch((error) => {
            console.log(error);
        });
}

