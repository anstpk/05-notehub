import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

const Pagination = ({ pageCount, onPageChange, currentPage }: PaginationProps) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      forcePage={currentPage - 1}
      pageCount={pageCount}
      previousLabel="< previous"
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.prevItem}
      nextClassName={css.nextItem}
    />
  );
};

export default Pagination;