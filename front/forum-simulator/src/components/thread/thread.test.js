import React from "react";
import { render } from "../../test-utils";

import { Thread } from "./thread";
import threadData from "../../testData/threadData_s24_01.json";


let mockupdateAvailableRawThreads,
    mockupdateCurrentRawThread;

function mockDispatch() {
    mockupdateAvailableRawThreads = jest.fn();
    mockupdateCurrentRawThread = jest.fn();
}

test("Thread renders correctly", () => {

    mockDispatch();

    const { container } = render(
        <Thread
            updateCurrentRawThread={mockupdateCurrentRawThread}
            updateAvailableRawThreads={mockupdateAvailableRawThreads}
            currentThread={threadData[0]}
        />
    );

    expect(container).toMatchSnapshot();
});
