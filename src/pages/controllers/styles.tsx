// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

// controller management page
export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 600px;
  padding: 20px 100px;
  overflow-y: scroll;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ContentContainer = styled.div<{ mt?: number }>`
  display: flex;
  flex-direction: column;
  margin-top: ${({ mt }) => mt ?? 0}px;
`;

// controller items styles
export const ItemContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  min-width: 600px;
  min-height: 90px;
  margin: 10px 0px;
  padding: 10px 20px;
  border-color: gray;
  border-radius: 10px;
  background-color: white;
  align-items: center;
  :hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
  }
`;

export const AccountContainer = styled.div`
  display: flex;
  flex: 6;
  flex-direction: column;
`;

export const Balance = styled.div`
  display: flex;
  flex: 2;
`;

export const Status = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
`;

export const Buttons = styled.div`
  display: flex;
  flex: 3;
  justify-content: flex-end;
`;
