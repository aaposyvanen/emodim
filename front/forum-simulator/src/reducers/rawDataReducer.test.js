import rawDataReducer from "./rawDataReducer";
import * as actions from "../actions/rawDataActions";

describe("raw data reducer", () => {

    const initialState = {
        availableThreads: [],
        currentIndex: 0,
        currentThread: {
            threadID: "",
            startMessage: {},
            comments: [],
            metadata: {}
        }
    };

    it("should return the initial state", () => {
        expect(rawDataReducer(undefined, {})).toEqual(initialState);
    });

    it("should update available raw threads", () => {
        const expectedAvailableThreads = [
            {
                threadID: "1"
            },
            {
                threadID: "2"
            }
        ];

        const action = {
            type: actions.UPDATE_RAW_THREAD_DATA,
            payload: expectedAvailableThreads
        }

        const expectedState = {
            ...initialState,
            availableThreads: expectedAvailableThreads
        }

        const returnedState = rawDataReducer(initialState, action);
        expect(returnedState).toEqual(expectedState);
    });

    it("should update current raw thread", () => {

        const action = {
            type: actions.UPDATE_CURRENT_RAW_THREAD,
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

        const returnedState = rawDataReducer(initialState, action);
        expect(returnedState).toEqual(expectedState);
    });
});
