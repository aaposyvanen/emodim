import React from "react";
import { render } from "../../test-utils";

import { Thread } from "./thread";
import threadData from "../../testData/threadData_s24_01.json";


let mockUpdateAvailableThreads,
    mockUpdateCurrentThread;

function mockDispatch() {
    mockUpdateAvailableThreads = jest.fn();
    mockUpdateCurrentThread = jest.fn();
}

test("Thread renders correctly", () => {

    mockDispatch();

    const { container } = render(
        <Thread
            updateCurrentThread={mockUpdateCurrentThread}
            updateAvailableThreads={mockUpdateAvailableThreads}
            currentThread={threadData[0]}
        />
    );

    expect(container).toMatchSnapshot();
});
