import React from 'react';
import { render } from "../../test-utils";
import AnnotatedWord from "./annotatedWord";

test("AnnotatedWord renders correctly with regular word", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 0,
        dominance: 0,
        valence: 0
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with punctuation word", () => {
    const wordData = {
        type: "PUNCTUATION",
        word: ","
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with whitespace word", () => {
    const wordData = {
        type: "WHITESPACE",
        word: " "
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with line end word", () => {
    const wordData = {
        type: "UNKNOWN",
        word: "\\n\\n"
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with unknown word", () => {
    const wordData = {
        type: "UNKNOWN",
        word: "#"
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});
