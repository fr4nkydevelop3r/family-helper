import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

function MainHeader() {
  return (
    <div className="header">
      <Header as="h1" textAlign="center" icon>
        <Icon name="users" />
        <Header.Content>Family Helper</Header.Content>
      </Header>
    </div>
  );
}

export default MainHeader;
