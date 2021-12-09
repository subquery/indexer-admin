// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Title } from '../login/styles';
import { ContentContainer, TextContainer } from './styles';
import prompts from './prompts';
import { RegisterStep } from './types';
import FormItem from '../../components/formItem';
import { ButtonContainer, SButton } from '../../components/primary';
import {
  initialRegisterValues,
  RegisterFormKey,
  RegisterFormSchema,
  TRegisterValues,
} from '../../types/schemas';

type Props = {
  loading: boolean;
  onSubmit: (values: TRegisterValues, helper: FormikHelpers<TRegisterValues>) => void;
};

// FIXME: fix the forms
const IndexerRegistryView: FC<Props> = ({ onSubmit, loading }) => {
  const { title, buttonTitle } = prompts[RegisterStep.register];
  return (
    <ContentContainer>
      <TextContainer>
        <Title size={35} align="center" weight="500">
          {title}
        </Title>
      </TextContainer>
      <Formik
        initialValues={initialRegisterValues}
        validationSchema={RegisterFormSchema}
        onSubmit={onSubmit}
      >
        {({ errors, submitForm }) => (
          <Form>
            <FormItem title="Indexer Name" fieldKey={RegisterFormKey.name} errors={errors} />
            <FormItem
              title="Proxy Endpoint"
              fieldKey={RegisterFormKey.proxyEndpoint}
              errors={errors}
            />
            <FormItem title="Staking Amount" fieldKey={RegisterFormKey.amount} errors={errors} />
            <ButtonContainer>
              <SButton mt={20} title={buttonTitle} loading={loading} onClick={submitForm} />
            </ButtonContainer>
          </Form>
        )}
      </Formik>
    </ContentContainer>
  );
};

export default IndexerRegistryView;
