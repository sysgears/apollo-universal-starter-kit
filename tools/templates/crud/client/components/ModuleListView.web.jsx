import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

class $Module$ListView extends React.PureComponent {
  renderMetaData = () => (
    <Helmet
      title="$Module$"
      meta={[
        {
          name: 'description',
          content: '$Module$ page'
        }
      ]}
    />
  );

  render() {
    const { loading, $module$s } = this.props;
    console.log($module$s);
    return (
      <PageLayout>
        {this.renderMetaData()}
        <div className="text-center">
          <p>Hello $Module$ list!</p>
        </div>
      </PageLayout>
    );
  }
};

export default $Module$ListView;
