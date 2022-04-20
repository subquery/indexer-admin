// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { ProgressBar, Spinner, Tag } from '@subql/react-ui';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { Text } from 'components/primary';
import { TagItem } from 'components/tagItem';
import { statusText } from 'pages/projects/constant';
import { indexingStatusCode } from 'utils/project';

import { IndexingStatus, TQueryMetadata } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 32px;
  background-color: white;
`;

const TagsContainer = styled.div<{ mb?: number }>`
  display: flex;
  min-width: 230px;
  margin: 15px 0px;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;

type Props = {
  percent: number;
  status?: IndexingStatus;
  metadata?: TQueryMetadata;
};

const ProjectStatusView: FC<Props> = ({ percent, status, metadata }) => (
  <Container>
    <LabelContainer>
      <Text size={15} fw="500" mr={10}>
        Indexing Status
      </Text>
      {!isUndefined(status) ? (
        <Tag text={statusText[status]} state={indexingStatusCode(status)} />
      ) : (
        <Spinner />
      )}
    </LabelContainer>
    {!!metadata?.targetHeight && (
      <TagsContainer>
        <TagItem horizontal versionType="Latest Block" prefix="#" value={metadata.targetHeight} />
        <TagItem
          horizontal
          versionType="Indexing Block"
          prefix="#"
          value={metadata.lastProcessedHeight}
        />
      </TagsContainer>
    )}
    <ProgressBar progress={percent / 100} />
  </Container>
);

export default ProjectStatusView;
