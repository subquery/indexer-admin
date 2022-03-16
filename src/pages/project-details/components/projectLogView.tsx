// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Banner } from '@patternfly/react-core';
import { LogViewer } from '@patternfly/react-log-viewer';

import { GET_LOG } from 'utils/queries';

const ProjectLogView: FC<{ container: string }> = ({ container }) => {
  const [getProjectList, { loading, data, error }] = useLazyQuery(GET_LOG, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getProjectList({ variables: { container } });
  }, []);

  const log = useMemo(() => {
    if (loading || error) return '';
    return data?.getLog.log;
  }, [data, loading]);

  return (
    <>
      <LogViewer
        hasLineNumbers
        height={300}
        data={log}
        theme="dark"
        header={<Banner>Coordinatror Service Log</Banner>}
      />
    </>
  );
};

export default ProjectLogView;
