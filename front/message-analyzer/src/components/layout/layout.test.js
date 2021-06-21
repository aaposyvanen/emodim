import React from "react";
import { render } from "../../test-utils";
import { Layout } from "./layout";

jest.mock("../thread/thread", () => () => "Thread");

test("Layout renders correctly", () => {

    const { container } = render(<Layout />);

    expect(container).toMatchSnapshot();
});
