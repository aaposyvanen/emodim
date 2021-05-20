import React from "react";
import renderer from 'react-test-renderer';

import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import { Thread } from "./thread";
import threadData from "../../testData/threadData_s24_01.json";

const initialState = {
    threadReducer: {
        availableThreads: threadData,
        currentThread: threadData[0]
    }
};
const mockStore = configureMockStore([], initialState);
const store = mockStore({});

let mockUpdateAvailableThreads,
    mockUpdateCurrentThread;

function mockDispatch() {
    mockUpdateAvailableThreads = jest.fn();
    mockUpdateCurrentThread = jest.fn();
}

test("Thread renders correctly", () => {

    mockDispatch();

    const tree = renderer
        .create(
            <Provider store={store}            >
                <Thread
                    updateCurrentThread={mockUpdateCurrentThread}
                    updateAvailableThreads={mockUpdateAvailableThreads}
                    currentThread={threadData[0]}
                />
            </Provider>
        )
        .toJSON();

    expect(tree).toMatchSnapshot();
});
