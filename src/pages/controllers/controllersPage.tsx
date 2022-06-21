// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { Button, Text } from 'components/primary';
import { ADD_CONTROLLER, GET_CONTROLLERS } from 'utils/queries';

import ControllerItem from './controllerItem';
import { Container, ContentContainer, HeaderContainer } from './styles';
import { Controller } from './types';

const controllersPage = () => {
  const [addController, { loading: addingController }] = useMutation(ADD_CONTROLLER);
  const [getControllers, { data: controllers }] = useLazyQuery<{ controllers: Controller[] }>(
    GET_CONTROLLERS,
    { fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    getControllers();
  }, []);

  const addControllerAction = async () => {
    await addController();
    await getControllers();
  };

  console.log('controllers:', controllers);

  return (
    <Container>
      <HeaderContainer>
        <ContentContainer>
          <Text size={30} fw="bold" mr={20}>
            Manage Controller Account
          </Text>
          <Text color="gray" mt={5}>
            Create and manange your controller accounts here
          </Text>
          <Text color="gray">
            You can Configure the account you wish to set as the controlleron the coordinator
            services
          </Text>
        </ContentContainer>
        <Button title="Add Controller" loading={addingController} onClick={addControllerAction} />
      </HeaderContainer>
      <ContentContainer mt={50}>
        {!!controllers &&
          controllers.controllers.map((item, index) => (
            <ControllerItem key={item.id} index={index} {...item} />
          ))}
      </ContentContainer>
    </Container>
  );
};

export default controllersPage;
