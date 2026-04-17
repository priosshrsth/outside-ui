import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { defaultPaginationStyles, Pagination } from "src/table";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 30,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Showing 1–10 of 30 results/i)).toBeInTheDocument();
  },
};

export const HiddenWhenSinglePage: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 5,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-slot="pagination"]');
    await expect(nav).toBeNull();
  },
};

export const PrevDisabledOnFirstPage: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 50,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const prev = canvasElement.querySelector(
      '[data-slot="pagination-prev"]',
    ) as HTMLButtonElement | null;
    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;

    await expect(prev).toBeDisabled();
    await expect(next).not.toBeDisabled();
  },
};

export const NextDisabledOnLastPage: Story = {
  args: {
    page: 5,
    pageSize: 10,
    total: 50,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const prev = canvasElement.querySelector(
      '[data-slot="pagination-prev"]',
    ) as HTMLButtonElement | null;
    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;

    await expect(prev).not.toBeDisabled();
    await expect(next).toBeDisabled();
  },
};

export const ClickNextCallsOnPageChange: Story = {
  args: {
    page: 2,
    pageSize: 10,
    total: 100,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ args, canvasElement }) => {
    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;
    await expect(next).not.toBeNull();
    if (next) {
      await userEvent.click(next);
    }
    await expect(args.onPageChange).toHaveBeenCalledWith(3);
  },
};

export const ClickPageButton: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 30,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ args, canvasElement }) => {
    const pageButtons = canvasElement.querySelectorAll('[data-slot="pagination-page"]');
    await expect(pageButtons.length).toBe(3);

    const secondPage = pageButtons[1] as HTMLButtonElement | undefined;
    if (secondPage) {
      await userEvent.click(secondPage);
    }
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
  },
};

export const ActivePageMarked: Story = {
  args: {
    page: 2,
    pageSize: 10,
    total: 30,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelector('[data-slot="pagination-page"][data-active]');
    await expect(active).not.toBeNull();
    await expect(active).toHaveTextContent("2");
    await expect(active).toHaveAttribute("aria-current", "page");
  },
};

export const EllipsisForManyPages: Story = {
  args: {
    page: 10,
    pageSize: 10,
    total: 500,
    onPageChange: fn(),
    ...defaultPaginationStyles,
  },
  play: async ({ canvasElement }) => {
    const ellipses = canvasElement.querySelectorAll('[data-slot="pagination-ellipsis"]');
    await expect(ellipses.length).toBeGreaterThan(0);
  },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        onPageChange={setPage}
        page={page}
        pageSize={10}
        total={100}
        {...defaultPaginationStyles}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Showing 1–10 of 100 results/i)).toBeInTheDocument();

    const next = canvasElement.querySelector(
      '[data-slot="pagination-next"]',
    ) as HTMLButtonElement | null;
    if (next) {
      await userEvent.click(next);
    }

    await expect(canvas.getByText(/Showing 11–20 of 100 results/i)).toBeInTheDocument();
  },
};
