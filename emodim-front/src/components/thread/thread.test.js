import React from "react";
import { render } from "../../test-utils";
import {
    MemoryRouter as Router
} from "react-router-dom";

import { Thread } from "./thread";
import threadData from "../../testData/threadData_s24_03.json";


let mockupdateAvailableRawThreads,
    mockupdateCurrentRawThread;

function mockDispatch() {
    mockupdateAvailableRawThreads = jest.fn();
    mockupdateCurrentRawThread = jest.fn();
}

test("Thread renders correctly", () => {

    mockDispatch();
    const mockAvailableRawThreads = [
        { threadId: "1" }, { threadId: "2" }
    ];

    const { container } = render(
        <Router initialEntries={["/1"]}>
            <Thread
                updateCurrentRawThread={mockupdateCurrentRawThread}
                updateAvailableRawThreads={mockupdateAvailableRawThreads}
                currentThread={threadData[0]}
                availableRawThreads={mockAvailableRawThreads}
                currentRawThreadIndex={0}
            />
        </Router>
    );

    expect(container).toMatchSnapshot();
});
