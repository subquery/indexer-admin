// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Input } from 'antd';
import * as React from 'react';
import { Title, StyledButton, FormItem, LoginForm, ButtonContainer } from '../login/styles';
import { ContentContainer, TextContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';

export type Metadata = {
  name: string;
  url: string;
  amount: string;
};

type Props = {
  loading: boolean;
  onClick: (metadata: Metadata) => void;
};

const RegisterForm: React.VFC<Props> = ({ loading, onClick }) => {
  const { title, buttonTitle } = prompts[RegisterStep.register];

  const handleFinish = (values: unknown) => onClick(values as Metadata);

  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
      </TextContainer>
      <LoginForm name="register" layout="vertical" onFinish={handleFinish}>
        <FormItem name="name" validateStatus="success" label="Name">
          <Input placeholder="Indexer Name" />
        </FormItem>
        <FormItem name="url" validateStatus="success" label="Proxy Endpoint">
          <Input placeholder="https://127.0.0.1:8000" />
        </FormItem>
        <FormItem name="amount" validateStatus="success" label="Amount">
          <Input placeholder="1000" />
        </FormItem>
        <FormItem>
          <ButtonContainer>
            <StyledButton
              loading={loading}
              width="70%"
              type="primary"
              htmlType="submit"
              shape="round"
              size="large"
            >
              {buttonTitle}
            </StyledButton>
          </ButtonContainer>
        </FormItem>
      </LoginForm>
    </ContentContainer>
  );
};

export default RegisterForm;
