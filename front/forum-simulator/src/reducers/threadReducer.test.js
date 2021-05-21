import threadReducer from "./threadReducer";
import * as actions from "../actions/threadActions";

describe("thread reducer", () => {

    const initialState = {
        availableThreads: [],
        currentThread: {
            threadID: "",
            startMessage: {},
            comments: [],
            metadata: {}
        }
    };

    it("should return the initial state", () => {
        expect(threadReducer(undefined, {})).toEqual(initialState);
    });

    it("should update available threads", () => {
        const expectedAvailableThreads = [
            {
                threadID: "1"
            },
            {
                threadID: "2"
            }
        ];

        const action = {
            type: actions.UPDATE_AVAILABLE_THREADS,
            payload: expectedAvailableThreads
        }

        const expectedState = {
            ...initialState,
            availableThreads: expectedAvailableThreads
        }

        const returnedState = threadReducer(initialState, action);
        expect(returnedState).toEqual(expectedState);
    });

    it("should update current thread", () => {

        const action = {
            type: actions.UPDATE_CURRENT_THREAD,
            payload: {
                threadID: "1",
                comments: [
                    { commentID: "1", words: ["test1"] }, { commentID: "2", words: ["test2"] }
                ],
                threadMetadata: {
                    title: "title",
                    datetime: "2000-01-02 00:00:00"
                }
            }
        }

        const expectedCurrentThread = {
            threadID: "1",
            startMessage: { commentID: "1", words: ["test1"] },
            comments: [
                { commentID: "2", words: ["test2"] }
            ],
            metadata: {
                title: "title",
                datetime: "2000-01-02 00:00:00"
            }
        };

        const expectedState = {
            ...initialState,
            currentThread: expectedCurrentThread
        }

        const returnedState = threadReducer(initialState, action);
        expect(returnedState).toEqual(expectedState);
    });
});
