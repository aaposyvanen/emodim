import React from "react";
import { render } from "../../test-utils";
import { ForumView } from "./forumView";

jest.mock("../thread/thread", () => () => "Thread");

test("ForumView renders correctly", () => {

    const { container } = render(<ForumView />);

    expect(container).toMatchSnapshot();
});
