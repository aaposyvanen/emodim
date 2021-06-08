import React from 'react';
import { render } from "@testing-library/react"
import { MessageArea } from "./messageArea";

test("MessageArea renders correctly with props", () => {
    const comments = [
        {
            commentMetadata: {
                author: "Author",
                datetime: "2000-01-01 00:00:00",
                id: "2"
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
            commentMetadata: {
                author: "Author",
                datetime: "2000-01-01 00:00:00",
                id: "3"
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
        commentMetadata: {
            author: "Author",
            datetime: "2000-01-01 00:00:00",
            id: "1"
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

test("MessageArea renders correctly with nested comments", () => {
    const comments = [
        {
            commentMetadata: {
                author: "Author2",
                datetime: "2000-01-01 00:02:00",
                id: "2"
            },
            words: [{ word: "test2", valence: 1, arousal: -1 }],
            children: [
                {
                    commentMetadata: {
                        author: "Author4",
                        datetime: "2000-01-01 00:04:00",
                        id: "4",
                        parent_comment_id: "2"
                    },
                    words: [
                        { word: "test4", valence: -1, arousal: 1 }]
                },
                {
                    commentMetadata: {
                        author: "Author5",
                        datetime: "2000-01-01 00:05:00",
                        id: "5",
                        parent_comment_id: "2"
                    },
                    words: [
                        { word: "test5", valence: 0, arousal: 1 }]
                }
            ]
        },
        {
            commentMetadata: {
                author: "Author3",
                datetime: "2000-01-01 00:03:00",
                id: "3"
            },
            words: [
                { word: "test3", valence: -1, arousal: 1 }]
        },

    ];
    const threadStartMessage = {
        commentMetadata: {
            author: "Author1",
            datetime: "2000-01-01 00:01:00",
            id: "1"
        },
        words: [
            { word: "test1", valence: 1, arousal: 0 }
        ]
    }

    const { container } = render(
        <MessageArea
            startMessage={threadStartMessage}
            comments={comments}
        />);
    expect(container).toMatchSnapshot();
})
