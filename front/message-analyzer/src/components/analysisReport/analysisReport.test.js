import React from 'react';
import { render } from "../../test-utils";
import AnalysisReport from "./analysisReport";

test("AnalysisReport renders correctly", () => {
    const { container } = render(<AnalysisReport />);
    expect(container).toMatchSnapshot();
});
