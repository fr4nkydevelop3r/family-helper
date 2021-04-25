import React from 'react';
import { ItemGroup } from 'semantic-ui-react';
import List from './List';

function Lists({ lists }) {
  return (
    <div>
      <ItemGroup>
        {lists.map((item) => (
          <List key={item.id} {...item} />
        ))}
      </ItemGroup>
    </div>
  );
}

export default Lists;
