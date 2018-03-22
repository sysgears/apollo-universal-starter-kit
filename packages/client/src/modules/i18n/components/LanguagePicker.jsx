import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const LanguagePicker = ({ i18n }) => {
  const langs = Object.keys(i18n.store.data);
  return (
    <section className="lang-section">
      {langs.length > 1 &&
        langs.map(lang => (
          <Button
            key={lang}
            color="link"
            size="sm"
            active={i18n.language === lang}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {lang.toUpperCase()}
          </Button>
        ))}
    </section>
  );
};

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};

export default LanguagePicker;
