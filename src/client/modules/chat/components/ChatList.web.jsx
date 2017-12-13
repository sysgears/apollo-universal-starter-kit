import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../settings';

class ChatList extends React.PureComponent {
  handleDeleteChat = id => {
    const { deleteChat } = this.props;
    deleteChat(id);
  };

  renderLoadMore = (chats, loadMoreRows) => {
    if (chats.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Chats list`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - List of all chats example page`
        }
      ]}
    />
  );

  render() {
    const { loading, chats, loadMoreRows } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => (
            <Link className="chat-link" to={`/chat/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.handleDeleteChat(record.id)}
            >
              Delete
            </Button>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Chats</h2>
          <Link to="/chat/0">
            <Button color="primary">Add</Button>
          </Link>
          <h1 />
          <Table dataSource={chats.edges.map(({ node }) => node)} columns={columns} />
          <div>
            <small>
              ({chats.edges.length} / {chats.totalCount})
            </small>
          </div>
          {this.renderLoadMore(chats, loadMoreRows)}
        </PageLayout>
      );
    }
  }
}

ChatList.propTypes = {
  loading: PropTypes.bool.isRequired,
  chats: PropTypes.object,
  deleteChat: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired
};

export default ChatList;
