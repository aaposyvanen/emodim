import React from 'react';
import { render } from "../../test-utils";
import ResponseAnalysis from "./responseAnalysis";

test("ResponseAnalysis renders correctly", () => {
    const { container } = render(<ResponseAnalysis />);
    expect(container).toMatchSnapshot();
});
