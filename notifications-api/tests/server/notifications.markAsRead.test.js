import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { NotificationsRepository } from "/imports/api/notifications/repository.js";
import { resetDatabase } from "./utils.mock.js";

if (Meteor.isServer) {
    describe("NotificationsRepository.markAsRead", function () {
        it("deve marcar como lida", async function () {
            await resetDatabase();

            const created = await NotificationsRepository.create({
                userId: "u1",
                title: "Teste",
                message: "msg",
            });

            const updated = await NotificationsRepository.markAsRead(created._id);

            assert.strictEqual(updated.read, true);
        });
    });
}