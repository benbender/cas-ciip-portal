import React from 'react';
import {Pagination} from 'react-bootstrap';

interface Props {
  setOffset: (offset: number) => void;
  setActivePage: (page: number) => void;
  offsetValue: number;
  activePage: number;
  maxResultsPerPage: number;
  totalCount: number;
}
export const PaginationBarComponent: React.FunctionComponent<Props> = (
  props
) => {
  const {
    setOffset,
    setActivePage,
    offsetValue,
    activePage,
    maxResultsPerPage,
    totalCount
  } = props;

  const maxPages = Math.ceil(totalCount / maxResultsPerPage);

  const previousTenPagination = () => {
    if (offsetValue > 0) {
      setOffset(offsetValue - maxResultsPerPage);
      setActivePage(activePage - 1);
    }
  };

  const nextTenPagination = () => {
    if (activePage !== maxPages) {
      setOffset(offsetValue + maxResultsPerPage);
      setActivePage(activePage + 1);
    }
  };

  const items = [];
  const handlePaginationByPageNumber = (pageNumber: number) => {
    setOffset((pageNumber - 1) * maxResultsPerPage);
    setActivePage(pageNumber);
  };

  let startPage;
  let endPage;
  if (maxPages <= 9) {
    startPage = 1;
    endPage = maxPages;
  } else if (maxPages - activePage <= 4) {
    startPage = maxPages - 8;
    endPage = maxPages;
  } else if (activePage <= 5) {
    startPage = 1;
    endPage = 9;
  } else {
    startPage = activePage - 4;
    endPage = activePage + 4;
  }

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    items.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === activePage}
        onClick={() => handlePaginationByPageNumber(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }

  if (maxPages > 1)
    return (
      <Pagination>
        <Pagination.First onClick={() => handlePaginationByPageNumber(1)} />
        <Pagination.Prev onClick={previousTenPagination} />
        {startPage !== 1 && <Pagination.Ellipsis />}
        {items}
        {endPage !== maxPages && <Pagination.Ellipsis />}
        <Pagination.Next onClick={nextTenPagination} />
        <Pagination.Last
          onClick={() => handlePaginationByPageNumber(maxPages)}
        />
      </Pagination>
    );
  return null;
};

export default PaginationBarComponent;
