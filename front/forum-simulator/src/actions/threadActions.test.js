import * as actions from "./threadActions";

describe("thread actions", () => {
    it("should create an action to update thread data", () => {
        const payload = [
            {
                threadID: "0"
            },
            {
                threadID: "1"
            }
        ];
        const expectedAction = {
            type: actions.UPDATE_THREAD_DATA,
            payload
        };

        expect(actions.updateCurrentThread(payload)).toEqual(expectedAction);
    });
});
