import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import * as actions from "./responseActions";
import { parseAnalysisData } from "./helpers";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("axios");
jest.mock("./helpers");

const mockAnalysisResult = [
    {
        word: "test",
        type: "WORD",
        valence: 0,
        arousal: -0.5,
        dominance: -0.5
    },
    {
        word: " ",
        type: "WHITESPACE"
    },
    {
        word: "text",
        type: "WORD",
        valence: 1,
        arousal: 0.0,
        dominance: -1
    }
];

describe("response actions", () => {

    beforeEach(() => {
        jest.restoreAllMocks();
    })

    it("should create an action to update message text", () => {
        const payload = "test text"
        const expectedAction = {
            type: actions.UPDATE_MESSAGE_TEXT,
            payload
        };
        expect(actions.updateMessageText(payload)).toEqual(expectedAction);
    });

    it("should create an action to update analysis data", () => {
        const payload = mockAnalysisResult
        const expectedAction = {
            type: actions.UPDATE_ANALYSIS_DATA,
            payload
        };
        expect(actions.updateAnalysisData(payload)).toEqual(expectedAction);
    });

    it("should dispatch actions to send a message to be analyzed", async () => {


        axios.post.mockImplementation(() => { return { data: mockAnalysisResult } });
        parseAnalysisData.mockImplementation((data) => { return data });

        const expectedActions = [
            { type: actions.SET_WAITING_FOR_ANALYSIS, payload: true },
            { type: actions.UPDATE_ANALYSIS_DATA, payload: mockAnalysisResult },
            { type: actions.SET_WAITING_FOR_ANALYSIS, payload: false }
        ]

        const store = mockStore({
            responseReducer: {
                isWaitingForAnalysis: false,
                analysisData: {},
                responseText: "test text"
            }
        });


        await store.dispatch(actions.sendMessageForAnalysis());
        expect(store.getActions()).toEqual(expectedActions)
    });

    it("should create an action to update isWaitingForAnalysis", () => {
        const expectedAction = {
            type: actions.SET_WAITING_FOR_ANALYSIS,
            payload: true
        };
        expect(actions.setWaitingForAnalysis(true)).toEqual(expectedAction);
    });
});
