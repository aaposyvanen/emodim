import React from "react";
import { render } from "../../test-utils";
import { Layout } from "./layout";

test("Layout renders correctly", () => {

    const { container } = render(<Layout />);

    expect(container).toMatchSnapshot();
});
