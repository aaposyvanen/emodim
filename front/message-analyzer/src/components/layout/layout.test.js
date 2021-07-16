import React from "react";
import { render } from "../../test-utils";
import { Layout } from "./layout";

jest.mock("../thread/thread", () => () => "Thread");

test("Layout renders correctly with no username", () => {

    const { container } = render(<Layout />);

    expect(container).toMatchSnapshot();
});

test("Layout renders correctly with username", () => {

    const initialState = {
        userReducer: {
            username: "test"
        }
    }

    const { container } = render(<Layout />, { initialState: initialState });

    expect(container).toMatchSnapshot();
});
