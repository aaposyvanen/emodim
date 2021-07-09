import React from 'react';
import { render } from "../../test-utils";
import AnnotatedWord from "./annotatedWord";

test("AnnotatedWord renders correctly with neutral rating", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 0,
        dominance: 0,
        valence: 0
    }
    const { container } = render(<AnnotatedWord wordData={wordData} annotations />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with non-neutral rating without annotations", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 1,
        dominance: 0,
        valence: 1
    }
    const { container } = render(<AnnotatedWord wordData={wordData} />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with negative valence", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 0,
        dominance: 0,
        valence: -1
    }
    const { container } = render(<AnnotatedWord wordData={wordData} annotations />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with positive valence", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 0,
        dominance: 0,
        valence: 1
    }
    const { container } = render(<AnnotatedWord wordData={wordData} annotations />);
    expect(container).toMatchSnapshot();
});

test("AnnotatedWord renders correctly with high arousal", () => {
    const wordData = {
        type: "WORD",
        word: "test",
        arousal: 1,
        dominance: 0,
        valence: 0
    }
    const { container } = render(<AnnotatedWord wordData={wordData} annotations />);
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
