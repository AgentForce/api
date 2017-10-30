import * as chai from "chai";
import CampaignController from "../../src/controller/campaigns/campaign-controller";
import { ICampaign } from "../../src/controller/campaigns/campaign";
import { IUser } from "../../src/controller/users/user";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();

describe("TastController Tests", () => {

    let server;

    before((done) => {
        Server.init(serverConfig, database).then((s) => {
            server = s;
            done();
        });
    });

    beforeEach((done) => {
        Utils.createSeedCampaignData(database, done);
    });

    afterEach((done) => {
        Utils.clearDatabase(database, done);
    });


    it("Get single campaign", (done) => {
        var user = Utils.createUserDummy();

        server.inject({
            method: 'POST', url: serverConfig.routePrefix + '/users/login', payload: {
                email: user.email,
                password: user.password
            }
        }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            database.campaignModel.findOne({}).then((campaign) => {
                server.inject({
                    method: 'Get',
                    url: serverConfig.routePrefix + '/campaigns/' + campaign._id,
                    headers: { "authorization": login.token }
                }, (res) => {
                    assert.equal(200, res.statusCode);
                    var responseBody: ICampaign = JSON.parse(res.payload);
                    assert.equal(campaign.name, responseBody.name);
                    done();
                });
            });
        });
    });

    it("Create campaign", (done) => {
        var user = Utils.createUserDummy();

        server.inject({
            method: 'POST',
            url: serverConfig.routePrefix + '/users/login',
            payload: { email: user.email, password: user.password }
        }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            database.userModel.findOne({ email: user.email }).then((user: IUser) => {
                var campaign = Utils.createCampaignDummy();

                server.inject({
                    method: 'POST',
                    url: serverConfig.routePrefix + '/campaigns',
                    payload: campaign,
                    headers: { "authorization": login.token }
                }, (res) => {
                    assert.equal(201, res.statusCode);
                    var responseBody: ICampaign = <ICampaign>JSON.parse(res.payload);
                    assert.equal(campaign.name, responseBody.name);
                    assert.equal(campaign.description, responseBody.description);
                    done();
                });
            });
        });
    });

    it("Update campaign", (done) => {
        var user = Utils.createUserDummy();

        server.inject({
            method: 'POST',
            url: serverConfig.routePrefix + '/users/login',
            payload: { email: user.email, password: user.password }
        }, (res) => {
            assert.equal(200, res.statusCode);
            var login: any = JSON.parse(res.payload);

            database.campaignModel.findOne({}).then((campaign) => {

                var updateCampaign = {
                    completed: true,
                    name: campaign.name,
                    description: campaign.description
                };

                server.inject({
                    method: 'PUT',
                    url: serverConfig.routePrefix + '/campaigns/' + campaign._id,
                    payload: updateCampaign,
                    headers: { "authorization": login.token }
                },
                    (res) => {
                        assert.equal(200, res.statusCode);
                        console.log(res.payload);
                        var responseBody: ICampaign = JSON.parse(res.payload);
                        assert.isTrue(responseBody.completed);
                        done();
                    });
            });
        });
    });

    
});
