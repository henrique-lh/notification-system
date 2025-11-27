import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { NotificationsService } from "/imports/api/notifications/service.js";
import { NotificationsRepository } from "/imports/api/notifications/repository.js";
import { resetDatabase } from "./utils.mock.js";

if (Meteor.isServer) {
    describe("NotificationsService.listByUser - paginação", function () {
        it("funciona", async function () {
            await resetDatabase();

            for (let i = 0; i < 3; i++) {
                await NotificationsRepository.create({
                    userId: "u10",
                    title: `Title ${i}`,
                    message: `msg ${i}`,
                });
            }

            const result = await NotificationsService.listByUser("u10", 1, 2);

            assert.strictEqual(result.data.length, 2);
            assert.strictEqual(result.page, 1);
            assert.strictEqual(result.pageSize, 2);
            assert.strictEqual(result.total, 3);
        });
    });
}
