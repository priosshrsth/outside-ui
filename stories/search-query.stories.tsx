import { type ReactNode, useEffect } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { SearchQueryProvider, useSearchQuery } from "src/search-query";
import { Pagination, Table } from "src/table";

type User = { id: string; name: string; email: string };

const allUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

function UserList(): ReactNode {
  const { searchQuery, total, setTotal, handleSearch } = useSearchQuery();

  const filtered = allUsers.filter((u) =>
    searchQuery.search
      ? u.name.toLowerCase().includes(String(searchQuery.search).toLowerCase())
      : true,
  );

  useEffect(() => {
    setTotal(filtered.length);
  }, [filtered.length, setTotal]);

  const start = (searchQuery.page - 1) * searchQuery.limit;
  const paged = filtered.slice(start, start + searchQuery.limit);

  return (
    <div>
      <input
        aria-label="Search users"
        data-testid="search-input"
        onChange={handleSearch}
        placeholder="Search"
        type="search"
      />
      <div data-testid="total">{total}</div>
      <div data-testid="page">{searchQuery.page}</div>
      <Table
        columns={[{ accessor: "id", header: "#" }, { accessor: "name" }, { accessor: "email" }]}
        data={paged}
      />
      <Pagination />
    </div>
  );
}

const meta = preview.meta({
  title: "Hooks/SearchQueryProvider",
  component: SearchQueryProvider,
  tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
  args: { children: null },
  render: () => (
    <SearchQueryProvider defaultValues={{ page: 1, limit: 5 }}>
      <UserList />
    </SearchQueryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => expect(canvas.getByTestId("total")).toHaveTextContent("25"));
    await expect(canvas.getByTestId("page")).toHaveTextContent("1");

    const rows = canvasElement.querySelectorAll('[data-slot="table-body"] [data-slot="table-row"]');
    await expect(rows).toHaveLength(5);
  },
});

export const Paginates = meta.story({
  name: "Paginates via Pagination component",
  args: { children: null },
  render: () => (
    <SearchQueryProvider defaultValues={{ page: 1, limit: 5 }}>
      <UserList />
    </SearchQueryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("User 1")).toBeInTheDocument();

    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;
    if (next) {
      await userEvent.click(next);
    }

    await expect(canvas.getByTestId("page")).toHaveTextContent("2");
    await expect(canvas.getByText("User 6")).toBeInTheDocument();
    await expect(canvas.queryByText("User 1")).toBeNull();
  },
});

export const DebouncedSearchResetsPage = meta.story({
  name: "Search resets page and filters",
  args: { children: null },
  render: () => (
    <SearchQueryProvider defaultValues={{ page: 2, limit: 5 }}>
      <UserList />
    </SearchQueryProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("page")).toHaveTextContent("2");

    const input = canvas.getByTestId<HTMLInputElement>("search-input");
    await userEvent.type(input, "User 1");

    await waitFor(() => expect(canvas.getByTestId("page")).toHaveTextContent("1"), {
      timeout: 2000,
    });

    await waitFor(() => expect(canvas.getByText("User 1")).toBeInTheDocument(), { timeout: 2000 });
  },
});
