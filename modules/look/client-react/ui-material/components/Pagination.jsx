import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Button } from '.';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

const TablePaginationActions = ({ classes, count, page, rowsPerPage, onChangePage }) => {
  const maxPage = Math.ceil(count / rowsPerPage);

  const handleFirstPageButtonClick = () => {
    onChangePage(1);
  };

  const handleBackButtonClick = () => {
    onChangePage(page - 1);
  };

  const handleNextButtonClick = () => {
    onChangePage(page + 1);
  };

  const handleLastPageButtonClick = () => {
    onChangePage(Math.max(0, maxPage));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 1} aria-label="First Page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 1} aria-label="Previous Page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= maxPage} aria-label="Next Page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= maxPage} aria-label="Last Page">
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

const Pagination = ({
  itemsPerPage,
  handlePageChange,
  hasNextPage,
  pagination,
  total,
  loadMoreText,
  defaultPageSize,
  currentPage
}) => {
  const handleChangePage = page => {
    if (!page) return;
    handlePageChange(pagination, page - 1);
  };

  return (
    <Fragment>
      {pagination === 'relay' ? (
        hasNextPage ? (
          <div>
            <div>
              <small>
                ({itemsPerPage} / {total})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => handlePageChange(pagination)}>
              {loadMoreText}
            </Button>
          </div>
        ) : null
      ) : (
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={total}
          rowsPerPage={defaultPageSize}
          page={currentPage}
          onChangePage={handleChangePage}
          ActionsComponent={TablePaginationActionsWrapped}
        />
      )}
    </Fragment>
  );
};

Pagination.propTypes = {
  itemsPerPage: PropTypes.number,
  handlePageChange: PropTypes.func,
  hasNextPage: PropTypes.bool,
  pagination: PropTypes.string,
  total: PropTypes.number,
  loadMoreText: PropTypes.string,
  defaultPageSize: PropTypes.number,
  currentPage: PropTypes.number
};

Pagination.defaultProps = {
  currentPage: 1
};

export default Pagination;
