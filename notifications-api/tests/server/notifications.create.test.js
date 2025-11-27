import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { NotificationsRepository } from "/imports/api/notifications/repository.js";
import { resetDatabase } from "./utils.mock.js";

if (Meteor.isServer) {
    describe("NotificationsRepository.create", function () {
        it("deve criar notificação", async function () {
            await resetDatabase();

            const notification = await NotificationsRepository.create({
                userId: "u1",
                title: "Olá",
                message: "Mensagem de teste",
            });

            assert.isOk(notification._id);
            assert.strictEqual(notification.userId, "u1");
            assert.strictEqual(notification.title, "Olá");
            assert.strictEqual(notification.message, "Mensagem de teste");
            assert.strictEqual(notification.read, false);
            assert.strictEqual(notification.deleted, false);
            assert.isOk(notification.createdAt);
        });
    });
}
