// Web only component

/*eslint-disable no-unused-vars*/
// React
import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import PageLayout from "../../../app/PageLayout";

const $Module$View = () => {
  const renderMetaData = () => (
    <Helmet
      title="$Module$"
      meta={[
        {
          name: "description",
          content: "$Module$ page"
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello $Module$!</p>
      </div>
    </PageLayout>
  );
};

$Module$View.propTypes = {};

export default $Module$View;
