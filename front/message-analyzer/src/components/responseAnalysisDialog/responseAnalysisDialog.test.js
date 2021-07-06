import React from 'react';
import { render } from "../../test-utils";
import AnalysisReport from "./responseAnalysisDialog";

test("AnalysisReport renders correctly", () => {
    const { container } = render(<AnalysisReport />);
    expect(container).toMatchSnapshot();
});
