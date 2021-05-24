import React from 'react';
import { render } from "@testing-library/react"
import { MessageArea } from "./messageArea";

test("MessageArea renders correctly with props", () => {
    const comments = [
        {
            commentID: "2",
            commentMetadata: {
                author: "Author",
                datetime: "2000-01-01 00:00:00"
            },
            words: [
                {
                    word: "test1",
                    valence: 1,
                    arousal: -1
                }
            ]
        },
        {
            commentID: "3",
            commentMetadata: {
                author: "Author",
                datetime: "2000-01-01 00:00:00"
            },
            words: [
                {
                    word: "test2",
                    valence: -1,
                    arousal: 1
                }
            ]
        }
    ];
    const threadStartMessage = {
        commentID: "1",
        commentMetadata: {
            author: "Author",
            datetime: "2000-01-01 00:00:00"
        },
        words: [
            {
                word: "test",
                valence: 1,
                arousal: 0
            }
        ]
    }

    const { container } = render(
        <MessageArea
            startMessage={threadStartMessage}
            comments={comments}
        />);
    expect(container).toMatchSnapshot();
});

test("MessageArea renders correctly without props", () => {
    const { container } = render(<MessageArea />);
    expect(container).toMatchSnapshot();
});
