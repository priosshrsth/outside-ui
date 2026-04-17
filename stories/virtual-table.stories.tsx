import { useCallback, useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { VirtualTable } from "src/table";
import type { ColumnDef } from "src/table/types/type";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function makeUsers(count: number, offset = 0): User[] {
  const roles = ["Admin", "Editor", "Viewer", "Owner"];
  return Array.from({ length: count }, (_, i) => ({
    id: String(offset + i + 1),
    name: `User ${offset + i + 1}`,
    email: `user${offset + i + 1}@example.com`,
    role: roles[(offset + i) % roles.length] ?? "Viewer",
  }));
}

const columns: ColumnDef<User>[] = [
  { accessor: "id", header: "#", width: 80 },
  { accessor: "name", sortable: true, width: "minmax(160px, 2fr)" },
  { accessor: "email", sortable: true, width: "minmax(200px, 3fr)" },
  { accessor: "role", width: 120 },
];

const meta = preview.meta({
  title: "Components/VirtualTable",
  component: VirtualTable<User>,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
});

export default meta;

export const Basic = meta.story({
  args: {
    data: makeUsers(500),
    columns,
    maxHeight: 400,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Only a subset is in the DOM (virtualization)
    const rows = canvasElement.querySelectorAll('[data-slot="table-body"] [data-slot="table-row"]');
    await expect(rows.length).toBeGreaterThan(0);
    await expect(rows.length).toBeLessThan(100);

    // First row is rendered
    await expect(canvas.getByText("User 1")).toBeInTheDocument();

    // Last row is NOT initially rendered — virtualization is working
    await expect(canvas.queryByText("User 500")).toBeNull();
  },
});

export const Empty = meta.story({
  args: {
    data: [],
    columns,
    maxHeight: 400,
    emptyMessage: "No users to show.",
  },
  play: async ({ canvasElement }) => {
    const empty = canvasElement.querySelector('[data-slot="table-empty"]');
    await expect(empty).toBeInTheDocument();
    await expect(empty).toHaveTextContent("No users to show.");
  },
});

export const Loading = meta.story({
  args: {
    data: [],
    columns,
    maxHeight: 400,
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const loading = canvasElement.querySelector('[data-slot="table-loading"]');
    await expect(loading).toBeInTheDocument();
    await expect(loading).toHaveTextContent("Loading");
  },
});

export const Sorting = meta.story({
  args: {
    data: makeUsers(100),
    columns,
    maxHeight: 400,
    sort: { field: "name", direction: "asc" },
    onSortChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const header = canvasElement.querySelector(
      '[data-slot="table-head-cell"][data-sortable][data-sort-direction="asc"]',
    );
    await expect(header).not.toBeNull();
    if (header instanceof HTMLElement) {
      await userEvent.click(header);
    }
    await expect(args.onSortChange).toHaveBeenCalledWith({
      field: "name",
      direction: "desc",
    });
  },
});

export const WithLoadMore = meta.story({
  args: { data: [], columns: [], maxHeight: 400 },
  render: () => {
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [rows, setRows] = useState<User[]>(() => makeUsers(50));
    const hasMore = page < 5;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadMore = useCallback(() => {
      if (!hasMore || isFetching) return;
      setIsFetching(true);
      timerRef.current = setTimeout(() => {
        setRows((prev) => [...prev, ...makeUsers(50, prev.length)]);
        setPage((p) => p + 1);
        setIsFetching(false);
      }, 150);
    }, [hasMore, isFetching]);

    return (
      <VirtualTable
        columns={columns}
        data={rows}
        hasMore={hasMore}
        isFetchingMore={isFetching}
        loadMoreRootMargin="100px"
        maxHeight={400}
        onLoadMore={loadMore}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("User 1")).toBeInTheDocument();

    const scroll = canvasElement.querySelector('[data-slot="table-scroll"]') as HTMLElement;
    await expect(scroll).not.toBeNull();

    // Scroll to the bottom to trigger the sentinel
    scroll.scrollTop = scroll.scrollHeight;

    // After a short delay, more rows should be fetched and appended
    await waitFor(
      () => {
        const allRows = canvasElement.querySelectorAll(
          '[data-slot="table-body"] [data-slot="table-row"]',
        );
        // Rendered window should include later user numbers
        const text = canvasElement.textContent ?? "";
        void expect(text).toMatch(/User 5\d/);
        void expect(allRows.length).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );
  },
});
