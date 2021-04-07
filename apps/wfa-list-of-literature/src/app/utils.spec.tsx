import { EnhancedReference } from "./app";
import { MergedReference, mergeReferences } from "./utils";

test("merge references", () => {
  const references: EnhancedReference[] = [
    {
      episodeTitle: "episode 1",
      episodePubDate: "1970-01-01T00:00:00Z",
      episodeLink: "link to episode 1",
      author: "Author",
      title: "Title",
      publisher: "Publisher",
    },
    {
      episodeTitle: "episode 2",
      episodePubDate: "1970-01-02T00:00:00Z",
      episodeLink: "link to episode 2",
      author: "Author",
      title: "Title",
      publisher: "Publisher",
    },
  ];
  const expectedResult: MergedReference[] = [
    {
      episodes: [
        {
          title: "episode 1",
          pubDate: "1970-01-01T00:00:00Z",
          link: "link to episode 1",
        },
        {
          title: "episode 2",
          pubDate: "1970-01-02T00:00:00Z",
          link: "link to episode 2",
        },
      ],
      author: "Author",
      title: "Title",
      publisher: "Publisher",
    },
  ];
  const mergedReferences = mergeReferences(references);
  expect(mergedReferences).toEqual(expectedResult);
});
