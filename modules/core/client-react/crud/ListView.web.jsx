/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import DomainValidator from '@domain-schema/validation';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Table, Button, Popconfirm, Row, Col, Form, FormItem, Alert, Spin } from '@gqlapp/look-client-react';
import { createColumnFields, createFormFields } from '@gqlapp/core-client-react';
import { mapFormPropsToValues, pickInputFields } from '@gqlapp/core-common';

const { hasRole } = require('@gqlapp/user-client-react');

function dragDirection(dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = props => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { cursor: 'move' };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

class ListView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object,
    sortEntries: PropTypes.func.isRequired,
    orderBy: PropTypes.object,
    updateEntry: PropTypes.func.isRequired,
    deleteEntry: PropTypes.func.isRequired,
    onOrderBy: PropTypes.func.isRequired,
    deleteManyEntries: PropTypes.func.isRequired,
    updateManyEntries: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    link: PropTypes.string.isRequired,
    customColumnFields: PropTypes.object,
    customColumnActions: PropTypes.object,
    customBatchActions: PropTypes.object,
    customBatchFields: PropTypes.object,
    customActions: PropTypes.object,
    tableScroll: PropTypes.object,
    rowClassName: PropTypes.func,
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool,
    parentWait: PropTypes.bool,
    parentError: PropTypes.string,
    parentSuccess: PropTypes.string,
    tableHeaderColumnHeight: PropTypes.string
  };

  static defaultProps = {
    tableHeaderColumnHeight: '38px'
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.lastParentWait !== nextProps.parentWait ||
      prevState.lastParentError !== nextProps.parentError ||
      prevState.lastParentSuccess !== nextProps.parentSuccess
    ) {
      return {
        wait: nextProps.parentWait,
        error: nextProps.parentError,
        success: nextProps.parentSuccess,
        lastParentWait: nextProps.parentWait,
        lastParentError: nextProps.parentError,
        lastParentSuccess: nextProps.parentSuccess
      };
    }

    return null;
  }

  state = {
    selectedRowKeys: [],
    loading: false,
    wait: false,
    error: null,
    success: null,
    lastParentWait: false,
    lastParentError: null,
    lastParentSuccess: null
  };

  components = {
    body: {
      row: BodyRow
    }
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data, sortEntries } = this.props;
    const dragRow = data.edges[dragIndex];
    const dragReplace = data.edges[hoverIndex];

    sortEntries([dragRow.id, dragReplace.id, dragReplace.rank, dragRow.rank]);
  };

  renderLoadMore = (data, loadMoreRows) => {
    const leftToLoad = data.edges ? data.pageInfo.totalCount - data.edges.length : data.pageInfo.totalCount;
    if (data.pageInfo.hasNextPage && leftToLoad > 0) {
      return (
        <span>
          {leftToLoad > 25 && (
            <Button id="load-more" color="primary" onClick={() => loadMoreRows(25)}>
              Load next 25
            </Button>
          )}
          {leftToLoad > 50 && (
            <Button id="load-more" color="primary" style={{ marginLeft: '5px' }} onClick={() => loadMoreRows(50)}>
              Load next 50
            </Button>
          )}
          {leftToLoad > 100 && (
            <Button id="load-more" color="primary" style={{ marginLeft: '5px' }} onClick={() => loadMoreRows(100)}>
              Load next 100
            </Button>
          )}
          <Button id="load-more" color="primary" style={{ marginLeft: '5px' }} onClick={() => loadMoreRows(leftToLoad)}>
            Load all ({leftToLoad})
          </Button>
        </span>
      );
    }
  };

  renderOrderByArrow = name => {
    const { orderBy } = this.props;

    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'desc') {
        return <span className="badge badge-primary">&#8595;</span>;
      } else {
        return <span className="badge badge-primary">&#8593;</span>;
      }
    } else {
      return <span className="badge badge-secondary">&#8645;</span>;
    }
  };

  handleUpdate = async (data, id) => {
    const { updateEntry } = this.props;
    this.setState({ wait: true, error: null, success: null });
    const result = await updateEntry({ data, where: { id } });
    if (result && result.error) {
      this.setState({ wait: false, error: result.error, success: null });
    } else {
      this.setState({ wait: false, error: null, success: 'Successfully updated entry.' });
    }
  };

  handleDelete = async id => {
    const { deleteEntry } = this.props;
    this.setState({ wait: true, error: null, success: null });
    const result = await deleteEntry({ where: { id } });
    if (result && result.error) {
      this.setState({ wait: false, error: result.error, success: null });
    } else {
      this.setState({ wait: false, error: null, success: 'Successfully deleted entry.' });
    }
  };

  onCellChange = (key, id, updateEntry) => {
    return value => {
      updateEntry({ [key]: value }, id);
    };
  };

  handleDeleteMany = () => {
    const { deleteManyEntries } = this.props;
    const { selectedRowKeys } = this.state;
    deleteManyEntries({ id_in: selectedRowKeys });
    this.setState({ selectedRowKeys: [] });
  };

  handleUpdateMany = values => {
    const { updateManyEntries } = this.props;
    const { selectedRowKeys } = this.state;
    updateManyEntries(values, { id_in: selectedRowKeys });
    this.setState({ selectedRowKeys: [] });
  };

  orderBy = (e, name) => {
    const { onOrderBy, orderBy } = this.props;

    e.preventDefault();

    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      } else if (orderBy.order === 'desc') {
        return onOrderBy({
          column: '',
          order: ''
        });
      }
    }

    return onOrderBy({ column: name, order });
  };

  render() {
    const {
      loading,
      data,
      loadMoreRows,
      schema,
      link,
      currentUser,
      customColumnFields = {},
      customColumnActions,
      customActions,
      customBatchActions,
      customBatchFields,
      updateManyEntries,
      tableScroll = null,
      rowClassName = null,
      tableHeaderColumnHeight
    } = this.props;
    const { selectedRowKeys, wait, error, success } = this.state;
    const hasSelected = selectedRowKeys.length > 0;

    const showBatchFields =
      customBatchFields === null
        ? false
        : customBatchActions && customBatchActions.role
        ? !!hasRole(customBatchActions.role, currentUser)
        : true;

    const showCustomActions =
      customActions === null
        ? false
        : customActions && customActions.role
        ? !!hasRole(customActions.role, currentUser)
        : true;

    const rowSelection = showBatchFields
      ? {
          selectedRowKeys,
          onChange: selectedRowKeys => {
            this.setState({ selectedRowKeys });
          }
        }
      : null;

    const title = () => {
      return showCustomActions && customActions && customActions.render ? (
        customActions.render
      ) : showCustomActions ? (
        <Link to={`/${link}/0`}>
          <Button color="primary">Add</Button>
        </Link>
      ) : null;
    };

    const footer = () => {
      return (
        <Row>
          <Col span={2}>
            {data && (
              <div>
                <div>
                  <small>
                    ({data.edges ? data.edges.length : 0} / {data.pageInfo.totalCount})
                  </small>
                </div>
                <div>
                  <small>{hasSelected ? `(${selectedRowKeys.length} selected)` : ''}</small>
                </div>
              </div>
            )}
          </Col>
          {showBatchFields && [
            <Col span={2} key="batchDelete" style={{ paddingTop: '3px' }}>
              <Popconfirm title="Sure to delete?" onConfirm={this.handleDeleteMany}>
                <Button color="primary" disabled={!hasSelected} loading={loading && !data}>
                  Delete
                </Button>
              </Popconfirm>
            </Col>,
            <Col span={20} key="batchUpdate">
              <Formik
                initialValues={mapFormPropsToValues({ schema, formType: 'batch' })}
                validate={values => {
                  DomainValidator.validate(schema, values);
                }}
                onSubmit={async (values, { resetForm }) => {
                  const insertValues = pickInputFields({ schema, values, formType: 'batch' });
                  if (selectedRowKeys && Object.keys(insertValues).length > 0) {
                    await updateManyEntries(insertValues, { id_in: selectedRowKeys });
                    this.setState({ selectedRowKeys: [] });
                    resetForm();
                  }
                }}
                render={({ values, handleChange, handleBlur, handleSubmit }) => (
                  <Form layout="inline" name="post" onSubmit={handleSubmit}>
                    {createFormFields({
                      handleChange,
                      handleBlur,
                      schema,
                      values,
                      formItemLayout: {},
                      prefix: '',
                      formType: 'batch',
                      customFields: customBatchFields
                    })}
                    <FormItem>
                      <Button color="primary" type="submit" disabled={!hasSelected} loading={loading && !data}>
                        Update
                      </Button>
                    </FormItem>
                  </Form>
                )}
              />
            </Col>
          ]}
        </Row>
      );
    };

    const columns = createColumnFields({
      schema,
      link,
      currentUser,
      orderBy: this.orderBy,
      renderOrderByArrow: this.renderOrderByArrow,
      handleUpdate: this.handleUpdate,
      handleDelete: this.handleDelete,
      onCellChange: this.onCellChange,
      customFields: customColumnFields,
      customActions: customColumnActions
    });

    let tableProps = {
      dataSource: data ? data.edges : null,
      columns: columns,
      pagination: false,
      size: 'small',
      rowSelection: rowSelection,
      loading: loading && !data,
      title: title,
      footer: footer
    };

    if (tableScroll) {
      tableProps = {
        ...tableProps,
        scroll: tableScroll
      };
    }

    if (rowClassName) {
      tableProps = {
        ...tableProps,
        rowClassName
      };
    }

    // only include this props if table includes rank, taht is used for sorting
    if (schema.keys().includes('rank')) {
      tableProps = {
        ...tableProps,
        components: this.components,
        onRow: (record, index) => ({
          index,
          moveRow: this.moveRow
        }),
        onHeaderRow: () => {
          return {
            style: {
              height: tableHeaderColumnHeight
            }
          };
        }
      };
    }

    return (
      <div>
        {wait && <Spin size="small" />}
        {error && <Alert color="error" message={error} />}
        {success && <Alert color="success" message={success} />}
        <Table {...tableProps} />
        {data && this.renderLoadMore(data, loadMoreRows)}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ListView);
