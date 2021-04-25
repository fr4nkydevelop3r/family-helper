import React, { useEffect, useState, useReducer } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsConfig from './aws-exports';
import {
  AmplifyAuthenticator,
  AmplifySignOut,
} from '@aws-amplify/ui-react';
import 'semantic-ui-css/semantic.min.css';

import MainHeader from './components/headers/MainHeader';
import { listLists } from './graphql/queries';
import { createList } from './graphql/mutations';
import Lists from './components/headers/Lists/Lists';
import {
  Button,
  Container,
  Form,
  Icon,
  Modal,
} from 'semantic-ui-react';

Amplify.configure(awsConfig);

const initialState = {
  title: '',
  description: '',
};

function App() {
  const listReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'DESCRIPTION_CHANGED':
        return { ...state, description: action.value };
      case 'TITLE_CHANGED':
        return { ...state, title: action.value };

      default:
        console.log('Default action for: ', action);
        return state;
    }
  };

  const [state, dispatch] = useReducer(listReducer, initialState);

  const [lists, setLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchList = async () => {
    const {
      data: {
        listLists: { items },
      },
    } = await API.graphql(graphqlOperation(listLists));
    console.log(items);
    setLists(items);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const toggleModal = (shouldOpen) => {
    setIsModalOpen(shouldOpen);
  };

  const saveList = async () => {
    const { title, description } = state;
    const result = await API.graphql(
      graphqlOperation(createList, { input: { title, description } }),
    );
    toggleModal(false);
    console.log(result);
  };

  return (
    <AmplifyAuthenticator>
      <Container className="container">
        <AmplifySignOut />

        <Button
          className="floatingButton"
          onClick={() => toggleModal(true)}
        >
          <Icon name="plus" id="floatingButton_icon" />
        </Button>
        <MainHeader />
        <Lists lists={lists} />

        <Modal open={isModalOpen} dimmer="blurring">
          <Modal.Header>Create your list</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                error={
                  true ? false : { content: 'Please add a name' }
                }
                label="Title"
                placeholder="My pretty list"
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: 'TITLE_CHANGED',
                    value: e.target.value,
                  })
                }
              ></Form.Input>
              <Form.TextArea
                label="Description"
                placeholder="Things that my pretty list is about"
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: 'DESCRIPTION_CHANGED',
                    value: e.target.value,
                  })
                }
              ></Form.TextArea>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => toggleModal(false)}>
              Cancel
            </Button>
            <Button positive onClick={saveList}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    </AmplifyAuthenticator>
  );
}

export default App;
