import * as actions from "./rawDataActions";

describe("raw data actions", () => {
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
            type: actions.UPDATE_RAW_THREAD_DATA,
            payload
        };
        expect(actions.updateAvailableRawThreads(payload)).toEqual(expectedAction);
    });

    it("should create an action to update current thread", () => {
        const payload = {
            threadID: "0",
            comments: [{ commentID: "1", words: "test" }]
        };
        const expectedAction = {
            type: actions.UPDATE_CURRENT_RAW_THREAD,
            payload
        };
        expect(actions.updateCurrentRawThread(payload)).toEqual(expectedAction);
    });
});
