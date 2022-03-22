// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isUndefined } from 'lodash';

import { useLoading } from 'containers/loadingContext';
import {
  getQueryMetadata,
  ProjectDetails,
  useIndexingStatus,
  useProjectDetails,
} from 'hooks/projectHook';
import { useRouter } from 'hooks/routerHook';
import { calculateProgress, serviceStatus } from 'utils/project';

import ProgressInfoView from './components/progressInfoView';
import ProjectDetailsHeader from './components/projectDetailHeader';
import ProjectServiceCard from './components/projectServiceCard';
import ProjectStatusView from './components/projectStatusView';
import ProjectTabbarView from './components/projectTabBarView';
import { createServiceItem } from './config';
import { Container, ContentContainer } from './styles';
import { TQueryMetadata, TService } from './types';

const ProjectDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: projectDetails } = useLocation().state as { data: ProjectDetails };

  const status = useIndexingStatus(id);
  const projectInfo = useProjectDetails(id);
  const { setPageLoading } = useLoading();
  useRouter(!projectDetails);

  const [indexerSerive, setIndexerService] = useState<TService>();
  const [querySerive, setQueryService] = useState<TService>();
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<TQueryMetadata>();

  const fetchQueryMetadata = async () => {
    const data = await getQueryMetadata(id);
    if (data) {
      setMetadata(data);
      setProgress(calculateProgress(data.targetHeight, data.lastProcessedHeight));
      setQueryService(
        createServiceItem('query', data.queryNodeVersion, serviceStatus(data.indexerHealthy))
      );
      setIndexerService(
        createServiceItem('node', data.indexerNodeVersion, serviceStatus(data.indexerHealthy))
      );
    }
  };

  useEffect(() => {
    setPageLoading(isUndefined(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    fetchQueryMetadata();
  }, [fetchQueryMetadata, status]);

  return (
    <Container>
      {projectInfo && (
        <ContentContainer>
          <ProjectDetailsHeader
            id={id}
            status={status}
            project={projectInfo}
            metadata={metadata}
            stateChanged={fetchQueryMetadata}
          />
          <ProjectStatusView status={status} metadata={metadata} />
          <ProgressInfoView percent={progress} />
          <ProjectServiceCard id={id} indexerService={indexerSerive} queryService={querySerive} />
          <ProjectTabbarView id={id} project={projectInfo} />
        </ContentContainer>
      )}
    </Container>
  );
};

export default ProjectDetailsPage;
