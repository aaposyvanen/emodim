import React from 'react';
import { render } from "@testing-library/react"
import { MessageArea } from "./messageArea";

test("MessageArea renders correctly", () => {
    const { container } = render(<MessageArea />);
    expect(container).toMatchSnapshot();
});
