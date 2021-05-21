import * as actions from "./threadActions";

describe("thread actions", () => {

    it("should create an action to update available threads", () => {

        const payload = [
            {
                threadID: "0"
            },
            {
                threadID: "1"
            }
        ];
        const expectedAction = {
            type: actions.UPDATE_AVAILABLE_THREADS,
            payload
        };

        expect(actions.updateAvailableThreads(payload)).toEqual(expectedAction);
    });

    it("should create an action to update current thread", () => {

        const payload = {
            threadID: "0",
            comments: [{ commentID: "1", words: "test" }]
        };
        const expectedAction = {
            type: actions.UPDATE_CURRENT_THREAD,
            payload
        };

        expect(actions.updateCurrentThread(payload)).toEqual(expectedAction);
    });
});
