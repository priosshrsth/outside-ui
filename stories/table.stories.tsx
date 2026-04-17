import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { defaultPaginationStyles, defaultTableStyles, Pagination, Table } from "src/table";
import type { SortState } from "src/table/types/type";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const sampleData: User[] = [
  {
    id: "1",
    name: "Anit Shrestha",
    email: "anit@outside.studio",
    role: "Admin",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Editor",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john@example.com",
    role: "Viewer",
  },
];

const meta: Meta<typeof Table<User>> = {
  title: "Components/Table",
  component: Table<User>,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns: [
      { accessor: "id", header: "#" },
      { accessor: "name" },
      { accessor: "email" },
      { accessor: "role" },
    ],
    ...defaultTableStyles,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Anit Shrestha")).toBeInTheDocument();
    await expect(canvas.getByText("jane@example.com")).toBeInTheDocument();

    const rows = canvasElement.querySelectorAll('[data-slot="table-body"] [data-slot="table-row"]');
    await expect(rows).toHaveLength(sampleData.length);

    await expect(canvas.getByText("Name")).toBeInTheDocument();
    await expect(canvas.getByText("Email")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: [{ accessor: "id" }, { accessor: "name" }],
    isLoading: true,
    ...defaultTableStyles,
  },
  play: async ({ canvasElement }) => {
    const loading = canvasElement.querySelector('[data-slot="table-loading"]');
    await expect(loading).toBeInTheDocument();
    await expect(loading).toHaveTextContent("Loading");
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: [{ accessor: "id" }, { accessor: "name" }],
    emptyMessage: "No users found.",
    ...defaultTableStyles,
  },
  play: async ({ canvasElement }) => {
    const empty = canvasElement.querySelector('[data-slot="table-empty"]');
    await expect(empty).toBeInTheDocument();
    await expect(empty).toHaveTextContent("No users found.");
  },
};

export const Error: Story = {
  args: {
    data: [],
    columns: [{ accessor: "id" }, { accessor: "name" }],
    isError: true,
    errorMessage: "Failed to load users.",
    ...defaultTableStyles,
  },
  play: async ({ canvasElement }) => {
    const errorEl = canvasElement.querySelector('[data-slot="table-error"]');
    await expect(errorEl).toBeInTheDocument();
    await expect(errorEl).toHaveTextContent("Failed to load users.");
  },
};

export const WithSorting: Story = {
  args: {
    data: sampleData,
    columns: [
      { accessor: "id", header: "#" },
      { accessor: "name", sortable: true },
      { accessor: "email", sortable: true },
      { accessor: "role" },
    ],
    sort: { field: "name", direction: "asc" },
    onSortChange: fn(),
    ...defaultTableStyles,
  },
  play: async ({ args, canvasElement }) => {
    const nameHeader = canvasElement.querySelector('th[data-sortable][data-sort-direction="asc"]');
    await expect(nameHeader).not.toBeNull();
    await expect(nameHeader).toHaveTextContent("Name");

    if (nameHeader instanceof HTMLElement) {
      await userEvent.click(nameHeader);
    }

    await expect(args.onSortChange).toHaveBeenCalledWith({
      field: "name",
      direction: "desc",
    });
  },
};

export const SortingToggle: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const [sort, setSort] = useState<SortState>({
      field: "name",
      direction: "asc",
    });

    return (
      <Table
        columns={[
          { accessor: "id", header: "#" },
          { accessor: "name", sortable: true },
          { accessor: "email", sortable: true },
          { accessor: "role" },
        ]}
        data={sampleData}
        onSortChange={setSort}
        sort={sort}
        {...defaultTableStyles}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const getNameHeader = () =>
      canvasElement.querySelector("th[data-sortable]:nth-child(2)") as HTMLElement | null;

    let header = getNameHeader();
    await expect(header).not.toBeNull();
    await expect(header).toHaveAttribute("data-sort-direction", "asc");

    if (header) {
      await userEvent.click(header);
    }
    header = getNameHeader();
    await expect(header).toHaveAttribute("data-sort-direction", "desc");

    if (header) {
      await userEvent.click(header);
    }
    header = getNameHeader();
    await expect(header).toHaveAttribute("data-sort-direction", "asc");
  },
};

export const WithPagination: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 2;
    const paged = sampleData.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div>
        <Table
          columns={[{ accessor: "id", header: "#" }, { accessor: "name" }, { accessor: "email" }]}
          data={paged}
          page={page}
          pageSize={pageSize}
          {...defaultTableStyles}
        />
        <Pagination
          onPageChange={setPage}
          page={page}
          pageSize={pageSize}
          total={sampleData.length}
          {...defaultPaginationStyles}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Anit Shrestha")).toBeInTheDocument();
    await expect(canvas.queryByText("John Smith")).toBeNull();

    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;
    await expect(next).not.toBeNull();
    if (next) {
      await userEvent.click(next);
    }

    await expect(canvas.getByText("John Smith")).toBeInTheDocument();
    await expect(canvas.queryByText("Anit Shrestha")).toBeNull();
  },
};

export const CustomCellRenderer: Story = {
  args: {
    data: sampleData,
    columns: [
      { accessor: "id", header: "#" },
      { accessor: "name" },
      {
        accessor: "role",
        cell: (row) => <span data-testid={`role-badge-${row.id}`}>{row.role}</span>,
      },
    ],
    ...defaultTableStyles,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const adminBadge = canvas.getByTestId("role-badge-1");
    await expect(adminBadge).toHaveTextContent("Admin");

    const editorBadge = canvas.getByTestId("role-badge-2");
    await expect(editorBadge).toHaveTextContent("Editor");
  },
};
