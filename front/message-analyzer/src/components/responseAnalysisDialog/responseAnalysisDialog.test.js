import React from 'react';
import { render } from "../../test-utils";
import ResponseAnalysisDialog from "./responseAnalysisDialog";

test("ResponseAnalysisDialog renders correctly", () => {
    const { container } = render(<ResponseAnalysisDialog />);
    expect(container).toMatchSnapshot();
});
