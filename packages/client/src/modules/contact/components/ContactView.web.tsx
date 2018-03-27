import React from 'react';
import Helmet from 'react-helmet';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import ContactForm from './ContactForm.web';
import settings from '../../../../../../settings';
import { ContactProps, Contact, ContactState, ContactOperation } from '../types';
import { Error } from '../../../../../common/types';

export default class ContactView extends React.Component<ContactProps, ContactState> {
  constructor(props: ContactProps) {
    super(props);
    this.state = {
      sent: false
    };
  }

  public onSubmit = ({ contact }: ContactOperation) => async (values: Contact) => {
    const result: any = await contact(values);

    if (result.errors) {
      const submitError: any = {
        _error: 'Contact request failed!'
      };
      result.errors.map((error: Error) => (submitError[error.field] = error.message));
      throw submitError;
    }

    this.setState({ sent: result });
  };

  public render() {
    const { contact } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Contact Us`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Contact us example page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Contact Us</h1>
          <ContactForm onSubmit={this.onSubmit({ contact })} sent={this.state.sent} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}
